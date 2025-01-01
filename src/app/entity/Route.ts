import {User} from "./User";

export class Route {
  id!: number;
  departure!: string;
  arrival!: string;
  departureDate!: string;
  numberOfPassengers!: number;
  remainingSeats?: number;
  driver!: User;
  passengers!: User[]
  status!: string;
  driverName!: string;
}
