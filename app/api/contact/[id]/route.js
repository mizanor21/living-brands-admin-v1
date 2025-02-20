import { connectToDB } from "@/app/lib/connectToDB";
import { Contact } from "@/app/lib/Contact/model";
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
  const { id } = params;
  await connectToDB();
  const contact = await Contact.findOne({ _id: id });
  if (!contact) {
    return NextResponse.json(
      { message: "contact data not found" },
      { status: 404 }
    );
  }
  return NextResponse.json(contact, { status: 200 });
}
