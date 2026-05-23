import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectDB from "@/lib/connectDB";
import Car from "@/models/Car";

// GET SINGLE CAR
export async function GET(req, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;

    const id = resolvedParams.id;

    // validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid car ID",
        },
        { status: 400 },
      );
    }

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

    return NextResponse.json({
      success: true,
      data: car,
    });
  } catch (error) {
    console.log(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}

// UPDATE CAR
export async function PUT(req, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;

    const body = await req.json();

    const updatedCar = await Car.findByIdAndUpdate(resolvedParams.id, body, {
      new: true,
    });

    return NextResponse.json({
      success: true,
      data: updatedCar,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}

// DELETE CAR
export async function DELETE(req, { params }) {
  try {
    await connectDB();

    const resolvedParams = await params;

    await Car.findByIdAndDelete(resolvedParams.id);

    return NextResponse.json({
      success: true,
      message: "Car deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
