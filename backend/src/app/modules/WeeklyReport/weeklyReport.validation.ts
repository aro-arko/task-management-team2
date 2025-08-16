import z from "zod";

export const WeeklyReportValidation = z.object({
  body: z.object({
    userId: z.string(),
    weekStart: z.string(),
    weekEnd: z.string(),
    report: z.array(
      z.object({
        name: z.string(),
        value: z.number(),
      })
    ),
  }),
});
