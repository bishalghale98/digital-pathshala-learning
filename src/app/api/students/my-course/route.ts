import { NextRequest } from "next/server";
import { getMyCourse } from "../student.controller";

export async function GET(req:NextRequest) {
    return getMyCourse(req)
}