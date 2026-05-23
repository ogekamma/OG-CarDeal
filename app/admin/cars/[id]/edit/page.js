"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { MdSave, MdArrowBack } from "react-icons/md";

export default function EditCarPage({ params }) {
  const router = useRouter();

  const resolvedParams = React.use(params);

  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function fetchCar() {
      try {
        const res = await fetch(`/api/cars/${resolvedParams.id}`);
        const data = await res.json();

        if (data.success) {
          setCar(data.data);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }

    fetchCar();
  }, [resolvedParams.id]);

  async function handleSubmit(e) {
    e.preventDefault();

    setSaving(true);

    try {
      const res = await fetch(`/api/cars/${resolvedParams.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(car),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin/cars");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!car) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "#111",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#fff",
        }}
      >
        Car not found
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#111111",
        padding: "2rem",
        color: "#fff",
        marginLeft: "40px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "2rem",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div>
          <p
            style={{
              color: "#C9A84C",
              textTransform: "uppercase",
              fontSize: "0.7rem",
              letterSpacing: "0.2em",
              marginBottom: "0.4rem",
            }}
          >
            Admin Panel
          </p>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 600,
            }}
          >
            Update Car
          </h1>
        </div>

        <button
          onClick={() => router.push("/admin/cars")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.12)",
            color: "#fff",
            padding: "0.7rem 1rem",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          <MdArrowBack />
          Back
        </button>
      </div>

      {/* Card */}
      <div
        style={{
          background: "#1A1A1A",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px",
          padding: "2rem",
          maxWidth: "1200px",
        }}
      >
        {/* Thumbnail */}
        {car.thumbnail && (
          <img
            src={car.thumbnail}
            alt={car.title}
            style={{
              width: "100%",
              maxHeight: "360px",
              objectFit: "cover",
              borderRadius: "10px",
              marginBottom: "2rem",
            }}
          />
        )}

        <form onSubmit={handleSubmit}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
              gap: "1.25rem",
            }}
          >
            {/* Title */}
            <div>
              <label style={labelStyle}>Title</label>
              <input
                type="text"
                value={car.title || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    title: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Make */}
            <div>
              <label style={labelStyle}>Make</label>
              <input
                type="text"
                value={car.make || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    make: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Model */}
            <div>
              <label style={labelStyle}>Model</label>
              <input
                type="text"
                value={car.model || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    model: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Year */}
            <div>
              <label style={labelStyle}>Year</label>
              <input
                type="number"
                value={car.year || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    year: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Price */}
            <div>
              <label style={labelStyle}>Price</label>
              <input
                type="number"
                value={car.price || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    price: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Mileage */}
            <div>
              <label style={labelStyle}>Mileage</label>
              <input
                type="number"
                value={car.mileage || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    mileage: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Fuel Type */}
            <div>
              <label style={labelStyle}>Fuel Type</label>

              <select
                value={car.fuelType || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    fuelType: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">Select</option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="electric">Electric</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </div>

            {/* Transmission */}
            <div>
              <label style={labelStyle}>Transmission</label>

              <select
                value={car.transmission || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    transmission: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="">Select</option>
                <option value="automatic">Automatic</option>
                <option value="manual">Manual</option>
              </select>
            </div>

            {/* Body Type */}
            <div>
              <label style={labelStyle}>Body Type</label>

              <input
                type="text"
                value={car.bodyType || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    bodyType: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Color */}
            <div>
              <label style={labelStyle}>Color</label>

              <input
                type="text"
                value={car.color || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    color: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Status */}
            <div>
              <label style={labelStyle}>Status</label>

              <select
                value={car.status || "available"}
                onChange={(e) =>
                  setCar({
                    ...car,
                    status: e.target.value,
                  })
                }
                style={inputStyle}
              >
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="coming-soon">Coming Soon</option>
              </select>
            </div>

            {/* Thumbnail */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Thumbnail URL</label>

              <input
                type="text"
                value={car.thumbnail || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    thumbnail: e.target.value,
                  })
                }
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div style={{ gridColumn: "1 / -1" }}>
              <label style={labelStyle}>Description</label>

              <textarea
                rows={6}
                value={car.description || ""}
                onChange={(e) =>
                  setCar({
                    ...car,
                    description: e.target.value,
                  })
                }
                style={{
                  ...inputStyle,
                  resize: "vertical",
                }}
              />
            </div>
          </div>

          {/* Buttons */}
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginTop: "2rem",
              flexWrap: "wrap",
            }}
          >
            <button
              type="submit"
              disabled={saving}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "#C9A84C",
                color: "#fff",
                border: "none",
                padding: "0.9rem 1.4rem",
                borderRadius: "4px",
                cursor: "pointer",
                fontWeight: 600,
                letterSpacing: "0.06em",
              }}
            >
              <MdSave />
              {saving ? "Saving..." : "Update Car"}
            </button>

            <button
              type="button"
              onClick={() => router.push("/admin/cars")}
              style={{
                background: "transparent",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.12)",
                padding: "0.9rem 1.4rem",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  color: "rgba(255,255,255,0.7)",
  fontSize: "0.82rem",
  letterSpacing: "0.03em",
};

const inputStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  color: "#fff",
  padding: "0.9rem 1rem",
  borderRadius: "4px",
  outline: "none",
  fontSize: "0.95rem",
};
