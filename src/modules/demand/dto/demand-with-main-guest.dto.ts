import { DemandStatus } from '../enum/demand-status.enum';
import { DemandType } from '../enum/demand-type.enum';

export class DemandWithMainGuestDto {

  id: number;
  slug: string;
  status: DemandStatus;
  type: DemandType;
  numberOfGuests?: number;
  createdAt: Date;
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
  }
}

