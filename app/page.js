// app/page.js
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import CarGrid from "../components/CarGrid";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";
import Footer from "../components/Footer";
import connectDB from "../lib/mongodb";
import Car from "../models/Car";

async function getStats() {
  try {
    await connectDB();
    const [total, makes] = await Promise.all([
      Car.countDocuments({ status: "available" }),
      Car.distinct("make"),
    ]);
    return { total, makes: makes.length };
  } catch {
    return { total: 0, makes: 0 };
  }
}

export default async function HomePage() {
  const stats = await getStats();

  return (
    <main style={{ background: "var(--color-canvas)" }}>
      <Navbar />
      <HeroSection stats={stats} />
      <CarGrid featured />
      <div style={{ maxWidth: "1360px", margin: "0 auto", padding: "0 2rem" }}>
        <div style={{ borderTop: "1px solid var(--color-border)" }} />
      </div>
      <CarGrid />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
