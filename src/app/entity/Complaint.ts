import {ComplaintType} from "./enums/ComplaintType";
import {User} from "./User";

export class Complaint {
  id!: number | null;
  description!: string;
  createdAt!: Date | null;
  complainer!: User | null;
  targetUser!: User;
  complaintType!: ComplaintType;
  resolved!: boolean | null;
}
