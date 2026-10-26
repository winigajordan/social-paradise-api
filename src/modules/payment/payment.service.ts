import { BadRequestException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment } from './entities/payment.entity';
import { DataSource } from 'typeorm';
import { DemandService } from '../demand/demand.service';
import { DemandStatus } from '../demand/enum/demand-status.enum';
import { Demand } from '../demand/entities/demand.entity';

// Statuts depuis lesquels le client peut notifier un paiement (comme sur la page de paiement)
const PAYABLE_STATUSES = [DemandStatus.SOUMISE, DemandStatus.VALIDEE];

@Injectable()
export class PaymentService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly demandService: DemandService,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    await this.dataSource.transaction(async (manager) => {
      const demandRepo = manager.getRepository(Demand);
      const paymentRepo = manager.getRepository(Payment);

      // Verrou sur la demande : deux notifications simultanées ne peuvent pas créer deux paiements
      const demand = await demandRepo.findOne({
        where: { slug: createPaymentDto.demandSlug },
        lock: { mode: 'pessimistic_write' },
        loadEagerRelations: false,
      });

      if (!demand) {
        throw new HttpException(
          `Demande avec le slug ${createPaymentDto.demandSlug} introuvable.`,
          HttpStatus.NOT_FOUND,
        );
      }

      if (await paymentRepo.exists({ where: { demand: { id: demand.id } } })) {
        throw new BadRequestException('Un paiement a déjà été notifié pour cette demande.');
      }

      if (!PAYABLE_STATUSES.includes(demand.status)) {
        throw new BadRequestException('Cette demande ne peut plus recevoir de paiement.');
      }

      const price = await this.demandService.syncPriceForPayment(
        createPaymentDto.demandSlug,
        createPaymentDto.priceId,
        manager,
      );
      if (!price) {
        throw new BadRequestException("Aucun tarif n'est disponible aujourd'hui pour cette demande.");
      }

      // Le montant n'est jamais pris du client : il est recalculé ici
      const amount = await this.demandService.computeAmountDue(demand.id, price, manager);

      await paymentRepo.save(
        paymentRepo.create({
          amount,
          phoneNumber: createPaymentDto.phoneNumber,
          paymentCanal: createPaymentDto.paymentCanal,
          paymentPlace: createPaymentDto.paymentPlace,
          demand,
        }),
      );

      await demandRepo.update(demand.id, { status: DemandStatus.PAIEMENT_NOTIFIE });
    });
  }
}
