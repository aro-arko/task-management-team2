import { Types } from "mongoose";

export type TTask = {
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "completed" | "in-complete";
  deadline: Date;
  userId: Types.ObjectId;
};
