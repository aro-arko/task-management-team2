import z from "zod";

const CreateTaskValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).default("low"),
    deadline: z.string().refine((date) => new Date(date) > new Date(), {
      message: "Deadline must be a future date",
    }),
  }),
});

const UpdateTaskValidation = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    status: z.enum(["completed", "in-complete"]).optional(),
    deadline: z
      .string()
      .refine((date) => new Date(date) > new Date(), {
        message: "Deadline must be a future date",
      })
      .optional(),
  }),
});

export const TaskValidation = {
  CreateTaskValidation,
  UpdateTaskValidation,
};
