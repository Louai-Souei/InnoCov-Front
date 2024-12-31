export class Route {
  id!: number;
  departure!: string;
  arrival!: string;
  departureDate!: string;
  numberOfPassengers!: number;
  remainingSeats?: number;
  driver!: {
    id: number;
    firstname: string;
    lastname: string;
  };
  passengers!: Array<{
    id: number;
    firstname: string;
    lastname: string;
  }>;
  status!: string;
}
