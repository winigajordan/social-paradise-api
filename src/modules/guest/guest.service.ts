import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Demand } from '../demand/entities/demand.entity';
import { Repository } from 'typeorm';
import { Guest } from './entities/guest.entity';
import { DemandStatus } from '../demand/enum/demand-status.enum';

@Injectable()
export class GuestService {
  @InjectRepository(Demand)
  private readonly demandRepository: Repository<Demand>;

  @InjectRepository(Guest)
  private readonly guestRepository: Repository<Guest>;

  async validateGuestBySlug(slug: string) {
    // Find the guest by slug if the demand associated have the status PAID
    console.log(slug);
    const guest = await this.guestRepository.findOne({
      where: { slug },
      relations: ['demand'],
    });
    console.log(guest);
    if(!guest) {
      throw new HttpException(
        'Code QR invalide.',
        HttpStatus.NOT_FOUND
      );
    }
    console.log(guest);
    if (guest.demand.status === DemandStatus.PAYEE || guest.demand.status === DemandStatus.OFFERT) {
      if(guest.state) {
        return {
          guest: guest,
          status: 'ALREADY_USED', // A machine-readable status code for the frontend
          message: 'Ce code QR a déjà été utilisé.', // The French message for display
        };
      }
      guest.state = true;
      const validatedGuest = await this.guestRepository.save(guest);

      return {
        guest: validatedGuest,
        status: 'VALIDATED', // Status for successful validation
        message: 'Code QR validé avec succès.',
      };
    }

    return null;
  }
}
