import { NextResponse } from "next/server";
import connectDB from "@/lib/connectDB";
import Car from "@/models/Car";

export async function PATCH(req, context) {
  try {
    await connectDB();

    const { id } = await context.params;

    const car = await Car.findById(id);

    if (!car) {
      return NextResponse.json(
        {
          success: false,
          message: "Car not found",
        },
        { status: 404 },
      );
    }

    car.isFeatured = !car.isFeatured;

    await car.save();

    return NextResponse.json({
      success: true,
      message: car.isFeatured ? "Added to featured" : "Removed from featured",
      data: car,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update featured status",
      },
      { status: 500 },
    );
  }
}
