// app/api/seed/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../lib/mongodb";
import User from "../../../models/User";

export async function GET() {
  // Safety guard — only allow in development
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { message: "Seed not allowed in production" },
      { status: 403 },
    );
  }

  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;
    const existing = await User.findOne({ email });

    if (existing) {
      return NextResponse.json({
        message: "Admin already exists",
        email,
      });
    }

    const admin = await User.create({
      name: "AutoElite Admin",
      email,
      password,
      role: "superadmin",
    });

    return NextResponse.json({
      success: true,
      message: "Admin created successfully",
      user: admin.toPublicJSON(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
