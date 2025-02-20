import { connectToDB } from "@/app/lib/connectToDB";
import { User } from "@/app/lib/Login/modal";
import bcrypt from "bcryptjs";

export async function POST(req) {
  await connectToDB();
  const { email, password, role, img } = await req.json();

  // Check if the user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 400,
    });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create the user
  const user = new User({
    email,
    password: hashedPassword,
    role,
    img,
  });

  await user.save();

  return new Response(
    JSON.stringify({ message: "User created successfully" }),
    { status: 201 }
  );
}
