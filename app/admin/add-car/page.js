// app/admin/add-car/page.js
"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  MdCloudUpload,
  MdClose,
  MdAdd,
  MdArrowBack,
  MdArrowForward,
  MdCheckCircle,
  MdDirectionsCar,
} from "react-icons/md";

const SUGGESTIONS = [
  "Sunroof",
  "Leather Seats",
  "Heated Seats",
  "Apple CarPlay",
  "Android Auto",
  "Backup Camera",
  "Blind Spot Monitor",
  "Lane Assist",
  "Adaptive Cruise Control",
  "Keyless Entry",
  "Push Start",
  "Navigation System",
  "Parking Sensors",
  "360 Camera",
  "Ventilated Seats",
  "Head-Up Display",
  "Premium Sound System",
  "Wireless Charging",
  "Power Tailgate",
  "Memory Seats",
];

// ── Reusable field label ───────────────────────────────────────────
function Label({ children, required }) {
  return (
    <label
      style={{
        display: "block",
        fontSize: "0.58rem",
        fontWeight: 600,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color: "rgba(255,255,255,0.3)",
        marginBottom: "0.5rem",
      }}
    >
      {children}
      {required && (
        <span style={{ color: "#C9A84C", marginLeft: "3px" }}>*</span>
      )}
    </label>
  );
}

// ── Input / select base style ──────────────────────────────────────
const fieldStyle = {
  width: "100%",
  background: "rgba(255,255,255,0.03)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: "3px",
  padding: "0.75rem 0.875rem",
  fontSize: "0.8125rem",
  color: "#fff",
  fontFamily: "inherit",
  outline: "none",
  transition: "border-color 0.18s, background 0.18s",
  caretColor: "#C9A84C",
  letterSpacing: "0.02em",
};

function Field({ label, required, children }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      {children}
    </div>
  );
}

function Input({ label, required, style, ...props }) {
  const [foc, setFoc] = useState(false);
  return (
    <Field label={label} required={required}>
      <input
        {...props}
        onFocus={(e) => {
          setFoc(true);
          props.onFocus?.(e);
        }}
        onBlur={(e) => {
          setFoc(false);
          props.onBlur?.(e);
        }}
        style={{
          ...fieldStyle,
          borderColor: foc ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
          background: foc ? "rgba(201,168,76,0.03)" : "rgba(255,255,255,0.03)",
          ...style,
        }}
      />
    </Field>
  );
}

function Select({ label, required, children, ...props }) {
  const [foc, setFoc] = useState(false);
  return (
    <Field label={label} required={required}>
      <select
        {...props}
        onFocus={() => setFoc(true)}
        onBlur={() => setFoc(false)}
        style={{
          ...fieldStyle,
          appearance: "none",
          WebkitAppearance: "none",
          borderColor: foc ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.08)",
          background: foc ? "rgba(201,168,76,0.03)" : "rgba(255,255,255,0.03)",
          cursor: "pointer",
        }}
      >
        {children}
      </select>
    </Field>
  );
}

// ── Section wrapper ────────────────────────────────────────────────
function Section({ num, title, desc, children }) {
  return (
    <div
      style={{
        background: "#1A1A1A",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "4px",
        overflow: "hidden",
        marginBottom: "1.25rem",
      }}
    >
      {/* header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "1.125rem 1.5rem",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        <div
          style={{
            width: "26px",
            height: "26px",
            borderRadius: "2px",
            flexShrink: 0,
            background: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-accent,sans-serif)",
              fontSize: "0.75rem",
              color: "#C9A84C",
              letterSpacing: "0.06em",
            }}
          >
            {num}
          </span>
        </div>
        <div>
          <h2
            style={{
              fontSize: "0.875rem",
              fontWeight: 600,
              color: "#fff",
              letterSpacing: "0.01em",
              lineHeight: 1,
            }}
          >
            {title}
          </h2>
          {desc && (
            <p
              style={{
                fontSize: "0.68rem",
                color: "rgba(255,255,255,0.25)",
                marginTop: "2px",
                letterSpacing: "0.04em",
              }}
            >
              {desc}
            </p>
          )}
        </div>
      </div>
      <div style={{ padding: "1.5rem" }}>{children}</div>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────
export default function AddCarPage() {
  const router = useRouter();
  const fileRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [feature, setFeature] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [mounted, setMounted] = useState(false);

  useState(() => {
    setTimeout(() => setMounted(true), 60);
  });

  const [form, setForm] = useState({
    title: "",
    make: "",
    model: "",
    year: new Date().getFullYear(),
    price: "",
    condition: "used",
    status: "available",
    isFeatured: false,
    mileage: "",
    transmission: "automatic",
    fuelType: "petrol",
    bodyType: "sedan",
    engineSize: "",
    horsepower: "",
    doors: 4,
    seats: 5,
    color: "",
    driveType: "fwd",
    description: "",
    features: [],
    vin: "",
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  // ── Image handling ─────────────────────────────────────────────
  const addFiles = (files) => {
    const arr = Array.from(files);
    if (images.length + arr.length > 10) {
      toast.error("Maximum 10 images allowed");
      return;
    }
    arr.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => setImages((prev) => [...prev, reader.result]);
      reader.readAsDataURL(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    addFiles(e.dataTransfer.files);
  };

  const removeImage = (i) =>
    setImages((prev) => prev.filter((_, idx) => idx !== i));

  // ── Feature handling ───────────────────────────────────────────
  const addFeature = (f) => {
    const val = (f || feature).trim();
    if (!val || form.features.includes(val)) return;
    set("features", [...form.features, val]);
    setFeature("");
  };

  // ── Submit ─────────────────────────────────────────────────────
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.make || !form.model || !form.price) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    setLoading(true);
    const tid = toast.loading("Uploading & saving listing…");
    try {
      const res = await fetch("/api/cars", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, images }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Vehicle listed successfully!", { id: tid });
        router.push("/admin/cars");
      } else {
        toast.error(data.message || "Something went wrong", { id: tid });
      }
    } catch {
      toast.error("Failed to save listing", { id: tid });
    } finally {
      setLoading(false);
    }
  };

  const ease = "cubic-bezier(0.22,1,0.36,1)";

  return (
    <>
      <style>{`
        @keyframes pageIn { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin   { to{transform:rotate(360deg)} }
        @keyframes imgIn  { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
        .feat-chip        { transition:all 0.16s; cursor:pointer; }
        .feat-chip:hover  { border-color:rgba(201,168,76,0.45)!important; color:#C9A84C!important; }
        .cancel-btn       { transition:all 0.18s; }
        .cancel-btn:hover { border-color:rgba(255,255,255,0.18)!important; color:rgba(255,255,255,0.7)!important; }
        .img-thumb        { transition:all 0.2s; }
        .img-thumb:hover  { border-color:rgba(201,168,76,0.4)!important; }
        .img-del-btn      { opacity:0; transition:opacity 0.18s; }
        .img-thumb:hover .img-del-btn { opacity:1!important; }
        select option     { background:#1A1A1A; color:#fff; }
        input::placeholder, textarea::placeholder { color:rgba(255,255,255,0.2); }
        input::-webkit-outer-spin-button,
        input::-webkit-inner-spin-button { -webkit-appearance:none; margin:0; }
      `}</style>

      <div
        style={{
          minHeight: "100vh",
          background: "#111111",
          padding: "2rem 1.25rem 4rem",
          opacity: mounted ? 1 : 0,
          animation: mounted ? `pageIn 0.55s ${ease} both` : "none",
        }}
      >
        <div style={{ maxWidth: "820px", margin: "0 auto" }}>
          {/* ── Page header ── */}
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "0.5rem",
                }}
              >
                <div
                  style={{
                    width: "20px",
                    height: "1px",
                    background: "#C9A84C",
                  }}
                />
                <span
                  style={{
                    fontSize: "0.6rem",
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    color: "#C9A84C",
                    fontWeight: 500,
                  }}
                >
                  New Listing
                </span>
              </div>
              <h1
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 600,
                  color: "#fff",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.2,
                }}
              >
                Add Vehicle
              </h1>
              <p
                style={{
                  fontSize: "0.78rem",
                  color: "rgba(255,255,255,0.3)",
                  marginTop: "0.375rem",
                  letterSpacing: "0.02em",
                }}
              >
                Fill in the details below to publish a new listing.
              </p>
            </div>

            <button
              onClick={() => router.back()}
              className="cancel-btn"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "0.625rem 1rem",
                borderRadius: "3px",
                border: "1px solid rgba(255,255,255,0.09)",
                background: "transparent",
                color: "rgba(255,255,255,0.35)",
                fontSize: "0.75rem",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              <MdArrowBack size={14} /> Back
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {/* ══ 01 — Photos ══ */}
            <Section
              num="01"
              title="Photos"
              desc="First image becomes the cover thumbnail"
            >
              {/* Drop zone */}
              <div
                onClick={() => fileRef.current.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                style={{
                  border: `1.5px dashed ${dragOver ? "rgba(201,168,76,0.55)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "3px",
                  padding: "2.5rem 1rem",
                  textAlign: "center",
                  cursor: "pointer",
                  background: dragOver
                    ? "rgba(201,168,76,0.04)"
                    : "rgba(255,255,255,0.015)",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "3px",
                    background: "rgba(201,168,76,0.1)",
                    border: "1px solid rgba(201,168,76,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1rem",
                  }}
                >
                  <MdCloudUpload size={22} color="#C9A84C" />
                </div>
                <p
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "rgba(255,255,255,0.6)",
                    marginBottom: "0.375rem",
                  }}
                >
                  {dragOver ? "Drop images here" : "Click or drag images here"}
                </p>
                <p
                  style={{
                    fontSize: "0.72rem",
                    color: "rgba(255,255,255,0.22)",
                    letterSpacing: "0.04em",
                  }}
                >
                  PNG, JPG up to 10 MB · Max 10 images · {images.length}/10
                  uploaded
                </p>
              </div>

              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => addFiles(e.target.files)}
              />

              {/* Preview grid */}
              {images.length > 0 && (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill,minmax(100px,1fr))",
                    gap: "0.625rem",
                    marginTop: "1rem",
                  }}
                >
                  {images.map((src, i) => (
                    <div
                      key={i}
                      className="img-thumb"
                      style={{
                        position: "relative",
                        aspectRatio: "4/3",
                        borderRadius: "3px",
                        overflow: "hidden",
                        border: `1.5px solid ${i === 0 ? "rgba(201,168,76,0.5)" : "rgba(255,255,255,0.07)"}`,
                        animation: `imgIn 0.35s ${ease} both`,
                      }}
                    >
                      <img
                        src={src}
                        alt=""
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />

                      {/* Cover badge */}
                      {i === 0 && (
                        <div
                          style={{
                            position: "absolute",
                            bottom: "4px",
                            left: "4px",
                            background: "#C9A84C",
                            borderRadius: "2px",
                            padding: "2px 5px",
                            fontSize: "0.52rem",
                            fontWeight: 600,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            color: "#fff",
                          }}
                        >
                          Cover
                        </div>
                      )}

                      {/* Delete btn */}
                      <button
                        type="button"
                        className="img-del-btn"
                        onClick={() => removeImage(i)}
                        style={{
                          position: "absolute",
                          top: "4px",
                          right: "4px",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          background: "rgba(0,0,0,0.75)",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "#fff",
                        }}
                      >
                        <MdClose size={11} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Section>

            {/* ══ 02 — Basic Info ══ */}
            <Section
              num="02"
              title="Basic Information"
              desc="Core listing details visible to buyers"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "1rem",
                }}
              >
                {/* Full-width title */}
                <Input
                  label="Listing Title"
                  required
                  placeholder="e.g. 2022 BMW X5 xDrive40i — Fully Loaded"
                  value={form.title}
                  onChange={(e) => set("title", e.target.value)}
                />

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem",
                  }}
                  className="grid-2"
                >
                  <style>{`@media(max-width:520px){.grid-2{grid-template-columns:1fr!important}}`}</style>

                  <Input
                    label="Make"
                    required
                    placeholder="e.g. BMW"
                    value={form.make}
                    onChange={(e) => set("make", e.target.value)}
                  />

                  <Input
                    label="Model"
                    required
                    placeholder="e.g. X5"
                    value={form.model}
                    onChange={(e) => set("model", e.target.value)}
                  />

                  <Input
                    label="Year"
                    required
                    type="number"
                    min={1990}
                    max={new Date().getFullYear() + 1}
                    value={form.year}
                    onChange={(e) => set("year", e.target.value)}
                  />

                  <Input
                    label="Price (USD)"
                    required
                    type="number"
                    placeholder="e.g. 45000"
                    value={form.price}
                    onChange={(e) => set("price", e.target.value)}
                  />

                  <Select
                    label="Condition"
                    value={form.condition}
                    onChange={(e) => set("condition", e.target.value)}
                  >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="certified-pre-owned">
                      Certified Pre-Owned
                    </option>
                  </Select>

                  <Select
                    label="Listing Status"
                    value={form.status}
                    onChange={(e) => set("status", e.target.value)}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="coming-soon">Coming Soon</option>
                    <option value="sold">Sold</option>
                  </Select>

                  <Input
                    label="Color"
                    placeholder="e.g. Midnight Black"
                    value={form.color}
                    onChange={(e) => set("color", e.target.value)}
                  />

                  <Input
                    label="VIN"
                    placeholder="Vehicle ID Number"
                    value={form.vin}
                    onChange={(e) => set("vin", e.target.value.toUpperCase())}
                    maxLength={17}
                    style={{ fontFamily: "monospace", letterSpacing: "0.1em" }}
                  />
                </div>

                {/* Featured toggle */}
                <div
                  onClick={() => set("isFeatured", !form.isFeatured)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "0.875rem 1rem",
                    borderRadius: "3px",
                    border: `1px solid ${form.isFeatured ? "rgba(201,168,76,0.3)" : "rgba(255,255,255,0.07)"}`,
                    background: form.isFeatured
                      ? "rgba(201,168,76,0.05)"
                      : "rgba(255,255,255,0.02)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {/* toggle pill */}
                  <div
                    style={{
                      width: "38px",
                      height: "22px",
                      borderRadius: "11px",
                      flexShrink: 0,
                      background: form.isFeatured
                        ? "#C9A84C"
                        : "rgba(255,255,255,0.1)",
                      position: "relative",
                      transition: "background 0.2s",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: "3px",
                        left: form.isFeatured ? "19px" : "3px",
                        width: "16px",
                        height: "16px",
                        borderRadius: "50%",
                        background: "#fff",
                        boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                        transition: "left 0.2s cubic-bezier(0.22,1,0.36,1)",
                      }}
                    />
                  </div>
                  <div>
                    <p
                      style={{
                        fontSize: "0.8125rem",
                        fontWeight: 500,
                        color: form.isFeatured
                          ? "#fff"
                          : "rgba(255,255,255,0.5)",
                        transition: "color 0.2s",
                      }}
                    >
                      Featured Listing
                    </p>
                    <p
                      style={{
                        fontSize: "0.68rem",
                        color: "rgba(255,255,255,0.25)",
                        marginTop: "1px",
                        letterSpacing: "0.04em",
                      }}
                    >
                      Appears in the homepage featured section
                    </p>
                  </div>
                  {form.isFeatured && (
                    <MdCheckCircle
                      size={16}
                      color="#C9A84C"
                      style={{ marginLeft: "auto", flexShrink: 0 }}
                    />
                  )}
                </div>
              </div>
            </Section>

            {/* ══ 03 — Specifications ══ */}
            <Section
              num="03"
              title="Specifications"
              desc="Technical details and vehicle attributes"
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))",
                  gap: "1rem",
                }}
              >
                <Input
                  label="Mileage (mi)"
                  type="number"
                  placeholder="e.g. 32000"
                  value={form.mileage}
                  onChange={(e) => set("mileage", e.target.value)}
                />

                <Select
                  label="Transmission"
                  value={form.transmission}
                  onChange={(e) => set("transmission", e.target.value)}
                >
                  <option value="automatic">Automatic</option>
                  <option value="manual">Manual</option>
                  <option value="cvt">CVT</option>
                  <option value="semi-automatic">Semi-Automatic</option>
                </Select>

                <Select
                  label="Fuel Type"
                  value={form.fuelType}
                  onChange={(e) => set("fuelType", e.target.value)}
                >
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="plug-in-hybrid">Plug-in Hybrid</option>
                </Select>

                <Select
                  label="Body Type"
                  value={form.bodyType}
                  onChange={(e) => set("bodyType", e.target.value)}
                >
                  {[
                    "sedan",
                    "suv",
                    "coupe",
                    "hatchback",
                    "truck",
                    "van",
                    "convertible",
                    "wagon",
                  ].map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </Select>

                <Select
                  label="Drive Type"
                  value={form.driveType}
                  onChange={(e) => set("driveType", e.target.value)}
                >
                  <option value="fwd">FWD</option>
                  <option value="rwd">RWD</option>
                  <option value="awd">AWD</option>
                  <option value="4wd">4WD</option>
                </Select>

                <Input
                  label="Engine Size"
                  placeholder="e.g. 3.0L V6"
                  value={form.engineSize}
                  onChange={(e) => set("engineSize", e.target.value)}
                />

                <Input
                  label="Horsepower"
                  type="number"
                  placeholder="e.g. 335"
                  value={form.horsepower}
                  onChange={(e) => set("horsepower", e.target.value)}
                />

                <Select
                  label="Doors"
                  value={form.doors}
                  onChange={(e) => set("doors", e.target.value)}
                >
                  {[2, 3, 4, 5].map((d) => (
                    <option key={d} value={d}>
                      {d} Doors
                    </option>
                  ))}
                </Select>

                <Select
                  label="Seats"
                  value={form.seats}
                  onChange={(e) => set("seats", e.target.value)}
                >
                  {[2, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      {s} Seats
                    </option>
                  ))}
                </Select>
              </div>
            </Section>

            {/* ══ 04 — Features ══ */}
            <Section
              num="04"
              title="Features & Extras"
              desc="Highlight key amenities and technology"
            >
              {/* Custom feature input */}
              <div
                style={{
                  display: "flex",
                  gap: "0.625rem",
                  marginBottom: "1.25rem",
                }}
              >
                <div style={{ flex: 1, position: "relative" }}>
                  <input
                    placeholder="Type a custom feature and press Add…"
                    value={feature}
                    onChange={(e) => setFeature(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                    style={{
                      ...fieldStyle,
                      width: "100%",
                      borderColor: feature
                        ? "rgba(201,168,76,0.4)"
                        : "rgba(255,255,255,0.08)",
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => addFeature()}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "5px",
                    padding: "0 1rem",
                    borderRadius: "3px",
                    background: "rgba(201,168,76,0.12)",
                    border: "1px solid rgba(201,168,76,0.25)",
                    color: "#C9A84C",
                    fontSize: "0.72rem",
                    fontWeight: 500,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.18s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(201,168,76,0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(201,168,76,0.12)";
                  }}
                >
                  <MdAdd size={14} /> Add
                </button>
              </div>

              {/* Suggestion chips */}
              <div style={{ marginBottom: "1.25rem" }}>
                <p
                  style={{
                    fontSize: "0.58rem",
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "rgba(255,255,255,0.2)",
                    marginBottom: "0.625rem",
                    fontWeight: 600,
                  }}
                >
                  Quick Add
                </p>
                <div
                  style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                >
                  {SUGGESTIONS.filter((s) => !form.features.includes(s)).map(
                    (s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => addFeature(s)}
                        className="feat-chip"
                        style={{
                          fontSize: "0.72rem",
                          color: "rgba(255,255,255,0.3)",
                          border: "1px solid rgba(255,255,255,0.08)",
                          borderRadius: "2px",
                          padding: "4px 9px",
                          background: "transparent",
                          cursor: "pointer",
                          fontFamily: "inherit",
                          letterSpacing: "0.04em",
                        }}
                      >
                        + {s}
                      </button>
                    ),
                  )}
                </div>
              </div>

              {/* Selected */}
              {form.features.length > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: "0.58rem",
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      color: "rgba(255,255,255,0.2)",
                      marginBottom: "0.625rem",
                      fontWeight: 600,
                    }}
                  >
                    Selected ({form.features.length})
                  </p>
                  <div
                    style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}
                  >
                    {form.features.map((f) => (
                      <span
                        key={f}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "0.75rem",
                          color: "#C9A84C",
                          background: "rgba(201,168,76,0.08)",
                          border: "1px solid rgba(201,168,76,0.22)",
                          borderRadius: "2px",
                          padding: "4px 9px",
                          letterSpacing: "0.04em",
                        }}
                      >
                        {f}
                        <button
                          type="button"
                          onClick={() =>
                            set(
                              "features",
                              form.features.filter((x) => x !== f),
                            )
                          }
                          style={{
                            background: "none",
                            border: "none",
                            color: "rgba(201,168,76,0.5)",
                            cursor: "pointer",
                            display: "flex",
                            padding: 0,
                            transition: "color 0.15s",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.color = "#F87171")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.color =
                              "rgba(201,168,76,0.5)")
                          }
                        >
                          <MdClose size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </Section>

            {/* ══ 05 — Description ══ */}
            <Section
              num="05"
              title="Description"
              desc="Compelling narrative shown on the listing page"
            >
              {(() => {
                const [foc, setFoc] = useState(false);
                return (
                  <div>
                    <textarea
                      placeholder="Write a compelling description — history, condition, unique selling points, recent service work…"
                      rows={6}
                      value={form.description}
                      onChange={(e) => set("description", e.target.value)}
                      onFocus={() => setFoc(true)}
                      onBlur={() => setFoc(false)}
                      maxLength={2000}
                      style={{
                        ...fieldStyle,
                        resize: "none",
                        lineHeight: 1.7,
                        borderColor: foc
                          ? "rgba(201,168,76,0.45)"
                          : "rgba(255,255,255,0.08)",
                        background: foc
                          ? "rgba(201,168,76,0.03)"
                          : "rgba(255,255,255,0.03)",
                      }}
                    />
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: "0.5rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.65rem",
                          color: "rgba(255,255,255,0.18)",
                          letterSpacing: "0.04em",
                        }}
                      >
                        Be specific — buyers appreciate detailed descriptions
                      </span>
                      <span
                        style={{
                          fontSize: "0.65rem",
                          letterSpacing: "0.06em",
                          color:
                            form.description.length > 1800
                              ? "#FBBF24"
                              : "rgba(255,255,255,0.22)",
                        }}
                      >
                        {form.description.length} / 2000
                      </span>
                    </div>
                  </div>
                );
              })()}
            </Section>

            {/* ══ Action bar ══ */}
            <div
              style={{
                display: "flex",
                gap: "0.875rem",
                padding: "1.25rem 1.5rem",
                background: "#1A1A1A",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: "4px",
                position: "sticky",
                bottom: "1rem",
                boxShadow: "0 -8px 32px rgba(0,0,0,0.4)",
              }}
            >
              {/* Progress indicator */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
                className="hidden md:flex"
              >
                {[
                  { label: "Photos", done: images.length > 0 },
                  {
                    label: "Details",
                    done: !!(
                      form.title &&
                      form.make &&
                      form.model &&
                      form.price
                    ),
                  },
                  { label: "Specs", done: true },
                ].map((step, i) => (
                  <div
                    key={step.label}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                    }}
                  >
                    {i > 0 && (
                      <div
                        style={{
                          width: "16px",
                          height: "1px",
                          background: "rgba(255,255,255,0.1)",
                        }}
                      />
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <div
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          background: step.done
                            ? "rgba(74,222,128,0.15)"
                            : "rgba(255,255,255,0.06)",
                          border: `1px solid ${step.done ? "rgba(74,222,128,0.4)" : "rgba(255,255,255,0.1)"}`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {step.done && (
                          <MdCheckCircle size={10} color="#4ADE80" />
                        )}
                      </div>
                      <span
                        style={{
                          fontSize: "0.68rem",
                          letterSpacing: "0.08em",
                          color: step.done
                            ? "rgba(255,255,255,0.5)"
                            : "rgba(255,255,255,0.22)",
                        }}
                      >
                        {step.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <button
                type="button"
                onClick={() => router.back()}
                className="cancel-btn"
                style={{
                  padding: "0.75rem 1.375rem",
                  borderRadius: "3px",
                  border: "1px solid rgba(255,255,255,0.09)",
                  background: "transparent",
                  color: "rgba(255,255,255,0.3)",
                  fontSize: "0.75rem",
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                }}
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "7px",
                  padding: "0.75rem 1.875rem",
                  borderRadius: "3px",
                  background: loading ? "rgba(201,168,76,0.5)" : "#C9A84C",
                  color: "#fff",
                  fontSize: "0.78rem",
                  fontWeight: 500,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  fontFamily: "inherit",
                  flexShrink: 0,
                  boxShadow: loading
                    ? "none"
                    : "0 4px 20px rgba(201,168,76,0.3)",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.currentTarget.style.background = "#b8963e";
                    e.currentTarget.style.transform = "translateY(-1px)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = loading
                    ? "rgba(201,168,76,0.5)"
                    : "#C9A84C";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <>
                    <div
                      style={{
                        width: "14px",
                        height: "14px",
                        border: "1.5px solid rgba(255,255,255,0.35)",
                        borderTopColor: "#fff",
                        borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }}
                    />
                    Saving…
                  </>
                ) : (
                  <>
                    Publish Listing
                    <MdArrowForward size={14} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
