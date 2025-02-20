// app/api/login/route.js
import { connectToDB } from "@/app/lib/connectToDB";
import { User } from "@/app/lib/Login/modal";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await connectToDB();
  const { email, password } = await req.json();

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 400,
    });
  }

  // Check password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return new Response(JSON.stringify({ error: "Invalid credentials" }), {
      status: 400,
    });
  }

  // Create JWT token
  const token = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return new Response(
    JSON.stringify({
      token,
      user: { email: user.email, role: user.role, img: user.img },
    }),
    { status: 200 }
  );
}
