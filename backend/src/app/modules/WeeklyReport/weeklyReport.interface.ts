import { Types } from "mongoose";

export interface IWeeklyReport {
  userId: Types.ObjectId;
  weekStart: Date;
  weekEnd: Date;
  report: Array<{
    name: string;
    value: number;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}
