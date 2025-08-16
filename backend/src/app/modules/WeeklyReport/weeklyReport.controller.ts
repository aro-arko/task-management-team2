import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";

const getWeeklyReport = catchAsync(async (req, res) => {
  const userId = req.params.id;

  const report = await WeeklyReportService.getWeeklyReport(userId);

  sendResponse(res, {
    statusCode: 200,
    message: "Weekly report retrieved successfully",
    success: true,
    data: report,
  });
});
