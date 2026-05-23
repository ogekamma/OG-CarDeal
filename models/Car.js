// models/Car.js
import mongoose from "mongoose";

const CarSchema = new mongoose.Schema(
  {
    // Basic info
    title: {
      type: String,
      required: [true, "Car title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    make: {
      type: String,
      required: [true, "Car make is required"],
      trim: true,
      // e.g. Toyota, BMW, Mercedes
    },
    model: {
      type: String,
      required: [true, "Car model is required"],
      trim: true,
      // e.g. Camry, X5, C-Class
    },
    year: {
      type: Number,
      required: [true, "Year is required"],
      min: [1900, "Year must be 1900 or later"],
      max: [new Date().getFullYear() + 1, "Year cannot be in the future"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    // Condition & status
    condition: {
      type: String,
      enum: ["new", "used", "certified-pre-owned"],
      default: "used",
    },
    status: {
      type: String,
      enum: ["available", "sold", "reserved", "coming-soon"],
      default: "available",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },

    // Specs
    mileage: {
      type: Number,
      default: 0,
      min: [0, "Mileage cannot be negative"],
    },
    transmission: {
      type: String,
      enum: ["automatic", "manual", "cvt", "semi-automatic"],
      default: "automatic",
    },
    fuelType: {
      type: String,
      enum: ["petrol", "diesel", "electric", "hybrid", "plug-in-hybrid"],
      default: "petrol",
    },
    bodyType: {
      type: String,
      enum: [
        "sedan",
        "suv",
        "coupe",
        "hatchback",
        "truck",
        "van",
        "convertible",
        "wagon",
      ],
      default: "sedan",
    },
    engineSize: {
      type: String,
      trim: true,
      default: "",
      // e.g. "2.0L", "3.5L V6"
    },
    horsepower: {
      type: Number,
      default: 0,
    },
    doors: {
      type: Number,
      default: 4,
      min: 1,
      max: 6,
    },
    seats: {
      type: Number,
      default: 5,
      min: 1,
      max: 12,
    },
    color: {
      type: String,
      trim: true,
      default: "",
    },
    driveType: {
      type: String,
      enum: ["fwd", "rwd", "awd", "4wd"],
      default: "fwd",
    },

    // Media
    images: {
      type: [String], // array of Cloudinary URLs
      default: [],
      validate: {
        validator: function (arr) {
          return arr.length <= 10;
        },
        message: "Cannot upload more than 10 images per car",
      },
    },
    thumbnail: {
      type: String,
      default: "",
      // Main image shown on cards — usually images[0]
    },

    // Content
    description: {
      type: String,
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
      default: "",
    },
    features: {
      type: [String], // e.g. ["Sunroof", "Heated seats", "Apple CarPlay"]
      default: [],
    },
    vin: {
      type: String,
      trim: true,
      uppercase: true,
      default: "",
      // Vehicle Identification Number
    },

    // Relations
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // SEO-friendly slug
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },

    // Stats
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  },
);

// Auto-generate slug before saving
CarSchema.pre("save", function () {
  if (!this.slug || this.isModified("title") || this.isModified("year")) {
    const base = `${this.year}-${this.make}-${this.model}-${this.title}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const suffix = Math.random().toString(36).substring(2, 7);

    this.slug = `${base}-${suffix}`;
  }
});

// Auto-set thumbnail to first image if not set
CarSchema.pre("save", function () {
  if (!this.thumbnail && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }
});

// Index for fast querying
CarSchema.index({ make: 1, model: 1 });
CarSchema.index({ price: 1 });
CarSchema.index({ status: 1 });
CarSchema.index({ isFeatured: -1, createdAt: -1 });

const Car = mongoose.models.Car || mongoose.model("Car", CarSchema);

export default Car;
