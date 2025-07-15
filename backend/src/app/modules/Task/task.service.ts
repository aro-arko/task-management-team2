import { JwtPayload } from "jsonwebtoken";
import { TTask } from "./task.interface";
import User from "../User/user.model";
import { Task } from "./task.model";
import mongoose from "mongoose";
import QueryBuilder from "../../builder/QueryBuilder";

const createTask = async (currentUser: JwtPayload, payLoad: TTask) => {
  const { email } = currentUser;

  // find user
  const user = await User.findOne({ email }).select("-password");
  if (!user) {
    throw new Error("User not found");
  }

  // start session
  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // create task inside transaction
    const task = await Task.create(
      [
        {
          ...payLoad,
          userId: user._id,
        },
      ],
      { session }
    );

    // push to user.tasks
    user.tasks.push(task[0]._id);
    await user.save({ session });

    await session.commitTransaction();

    return task[0];
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// update task
const updateTask = async (
  taskId: string,
  currentUser: JwtPayload,
  payload: Partial<TTask>
) => {
  const { email } = currentUser;

  // Find user
  const user = await User.findOne({ email }).select("_id");
  if (!user) throw new Error("User not found");

  // Find task & validate ownership
  const task = await Task.findOne({ _id: taskId, userId: user._id });
  if (!task) throw new Error("Task not found or you don't have permission");

  // Update task
  Object.assign(task, payload);

  const updatedTask = await task.save();

  return updatedTask;
};

// delete task
const deleteTask = async (taskId: string, currentUser: JwtPayload) => {
  const { email } = currentUser;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Fetch user and validate
    const user = await User.findOne({ email })
      .session(session)
      .select("_id tasks");
    if (!user) throw new Error("User not found");

    // Find and delete the task (if it belongs to user)
    const task = await Task.findOneAndDelete({
      _id: taskId,
      userId: user._id,
    }).session(session);
    if (!task) throw new Error("Task not found or you don't have permission");

    // Remove task reference from user.tasks
    user.tasks = user.tasks.filter(
      (id: mongoose.Types.ObjectId) => id.toString() !== taskId.toString()
    );
    await user.save({ session });

    await session.commitTransaction();
    return { message: "Task deleted successfully" };
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

// get all tasks

const getAllTasks = async (
  currentUser: JwtPayload,
  query: Record<string, unknown>
) => {
  const { email } = currentUser;

  // Find user
  const user = await User.findOne({ email }).select("_id");
  if (!user) throw new Error("User not found");

  // Build query
  const queryBuilder = new QueryBuilder(Task.find({ userId: user._id }), query);

  const tasks = await queryBuilder
    .search(["title", "description"])
    .filter()
    .sort()
    .paginate()
    .fields()
    .modelQuery.exec();

  return tasks;
};

export const TaskService = {
  createTask,
  updateTask,
  deleteTask,
  getAllTasks,
};
