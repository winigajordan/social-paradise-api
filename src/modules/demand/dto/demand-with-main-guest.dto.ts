import { DemandStatus } from '../enum/demand-status.enum';
import { DemandType } from '../enum/demand-type.enum';

export class DemandWithMainGuestDto {

  id: number;
  slug: string;
  status: DemandStatus;
  type: DemandType;
  numberOfGuests?: number;
  createdAt: Date;
  guests ?: any[];
  payment?: {
    id?: number;
    amount?: number;
    date?: Date;
    phoneNumber?: string;
    paymentCanal?: string;
    paymentPlace?: string;
  };
  mainGuest: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    age: number;
  };

  constructor(demand: any) {
    const mainGuest = demand.guests?.find(g => g.isMainGuest);
    if (!mainGuest) {
      throw new Error(`La demande ${demand.id} ne contient pas d'invité principal.`);
    }

    this.id = demand.id;
    this.slug = demand.slug;
    this.type = demand.type;
    this.numberOfGuests = demand.guests.length;
    this.status = demand.status;
    this.createdAt = demand.createdAt;
    this.mainGuest = {
      firstName: mainGuest.firstName,
      lastName: mainGuest.lastName,
      email: mainGuest.email,
      phoneNumber: mainGuest.phoneNumber,
      age: mainGuest.age,
    };
    this.guests = demand.guests;
    this.payment = demand.payment
      ? {
          id: demand.payment.id,
          amount: demand.payment.amount,
          date: demand.payment.date,
          phoneNumber: demand.payment.phoneNumber,
          paymentCanal: demand.payment.paymentCanal,
          paymentPlace: demand.payment.paymentPlace,
        }
      : undefined;
  }
}

