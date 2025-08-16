import mongoose, { Schema } from "mongoose";
import { IWeeklyReport } from "./weeklyReport.interface";

const WeeklyReportSchema = new Schema<IWeeklyReport>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    weekStart: { type: Date, required: true },
    weekEnd: { type: Date, required: true },
    report: [
      {
        name: { type: String, required: true },
        value: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const WeeklyReport = mongoose.model<IWeeklyReport>(
  "WeeklyReport",
  WeeklyReportSchema
);
