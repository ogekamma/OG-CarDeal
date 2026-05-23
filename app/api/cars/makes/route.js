// app/api/cars/makes/route.js
import { NextResponse } from "next/server";
import connectDB from "../../../../lib/mongodb";
import Car from "../../../../models/Car";

export async function GET() {
  try {
    await connectDB();

    const makes = await Car.distinct("make");
    const stats = await Car.aggregate([
      { $match: { status: "available" } },
      {
        $group: {
          _id: null,
          totalCars: { $sum: 1 },
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      makes: makes.sort(),
      stats: stats[0] || {},
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
