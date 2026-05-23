// app/api/cars/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "../../../lib/mongodb";
import Car from "../../../models/Car";
import { authOptions } from "../../../lib/auth";
import { uploadImage } from "../../../lib/cloudinary";

// ─── GET /api/cars ─────────────────────────────────────────────────────────────
// Public route — supports filtering, sorting, pagination via query params
export async function GET(request) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    // Filters
    const make = searchParams.get("make");
    const bodyType = searchParams.get("bodyType");
    const condition = searchParams.get("condition");
    const fuelType = searchParams.get("fuelType");
    const transmission = searchParams.get("transmission");
    const status = searchParams.get("status") || "available";
    const featured = searchParams.get("featured");
    const search = searchParams.get("search");

    // Price range
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    // Year range
    const minYear = searchParams.get("minYear");
    const maxYear = searchParams.get("maxYear");

    // Sorting & pagination
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;

    // Build query object
    const query = {};

    if (status !== "all") query.status = status;
    if (make) query.make = { $regex: make, $options: "i" };
    if (bodyType) query.bodyType = bodyType;
    if (condition) query.condition = condition;
    if (fuelType) query.fuelType = fuelType;
    if (transmission) query.transmission = transmission;
    if (featured === "true") query.isFeatured = true;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    if (minYear || maxYear) {
      query.year = {};
      if (minYear) query.year.$gte = parseInt(minYear);
      if (maxYear) query.year.$lte = parseInt(maxYear);
    }

    // Full-text search across title, make, model
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { make: { $regex: search, $options: "i" } },
        { model: { $regex: search, $options: "i" } },
      ];
    }

    const sortOrder = order === "asc" ? 1 : -1;
    const sortObj = { [sortBy]: sortOrder };

    const [cars, total] = await Promise.all([
      Car.find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .populate("addedBy", "name email")
        .lean(),
      Car.countDocuments(query),
    ]);

    return NextResponse.json({
      success: true,
      data: cars,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error("GET /api/cars error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}

// ─── POST /api/cars ────────────────────────────────────────────────────────────
// Protected — admin only
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "Authentication required" },
        { status: 401 },
      );
    }

    await connectDB();

    const body = await request.json();

    const {
      title,
      make,
      model,
      year,
      price,
      condition,
      status,
      isFeatured,
      mileage,
      transmission,
      fuelType,
      bodyType,
      engineSize,
      horsepower,
      doors,
      seats,
      color,
      driveType,
      description,
      features,
      vin,
      images,
    } = body;

    // Validate required fields
    if (!title || !make || !model || !year || !price) {
      return NextResponse.json(
        {
          success: false,
          message: "Title, make, model, year and price are required",
        },
        { status: 400 },
      );
    }

    // Upload images to Cloudinary if they are base64 strings
    let uploadedImages = [];
    if (images && images.length > 0) {
      const uploadPromises = images.map((img) => {
        // Only upload if it's a base64 data URI — skip if already a URL
        if (img.startsWith("data:")) {
          return uploadImage(img);
        }
        return Promise.resolve({ url: img, publicId: "" });
      });

      const results = await Promise.all(uploadPromises);
      uploadedImages = results.map((r) => r.url);
    }

    const car = await Car.create({
      title,
      make,
      model,
      year: parseInt(year),
      price: parseFloat(price),
      condition: condition || "used",
      status: status || "available",
      isFeatured: isFeatured || false,
      mileage: parseInt(mileage) || 0,
      transmission: transmission || "automatic",
      fuelType: fuelType || "petrol",
      bodyType: bodyType || "sedan",
      engineSize: engineSize || "",
      horsepower: parseInt(horsepower) || 0,
      doors: parseInt(doors) || 4,
      seats: parseInt(seats) || 5,
      color: color || "",
      driveType: driveType || "fwd",
      description: description || "",
      features: features || [],
      vin: vin || "",
      images: uploadedImages,
      thumbnail: uploadedImages[0] || "",
      addedBy: session.user.id,
    });

    return NextResponse.json(
      { success: true, message: "Car listed successfully", data: car },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/cars error:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
