import { model, Schema } from "mongoose";
import { TTask } from "./task.interface";

const taskSchema = new Schema<TTask>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },
    status: {
      type: String,
      enum: ["completed", "in-complete"],
      default: "in-complete",
    },
    deadline: {
      type: Date,
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true, versionKey: false }
);

export const Task = model<TTask>("Task", taskSchema);
