import dbConnect from "@/database/dbConnection";
import Lesson from "@/database/models/lesson.schema";
import { successResponse } from "@/utils/response";
import { tryCatch } from "@/utils/tryCatch";
import { NextRequest } from "next/server";

export const getLessonByCourseId = tryCatch(
  async (req: NextRequest, courseId: string) => {
    await dbConnect();

    const lessonByCourse = await Lesson.find({ courseId })
      .populate("courseId")
      .lean();

    return successResponse("Successfully fetch lesson", lessonByCourse);
  }
);
