import { connectToDB } from "@/app/lib/connectToDB";
import { JobHero } from "@/app/lib/JobHero/model";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDB();
  const jobHero = await JobHero.find();
  const response = NextResponse.json(jobHero);
  response.headers.set("Access-Control-Allow-Origin", "*");
  return response;
}

export async function POST(req) {
  try {
    const jobHeroData = await req.json();

    // Connect to the database
    await connectToDB();
    await JobHero.create(jobHeroData);
    return NextResponse.json(
      { message: "Job hero data created" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating job hero data:", error);
    return NextResponse.json(
      { message: "Failed to create job hero data" },
      { status: 500 }
    );
  }
}
