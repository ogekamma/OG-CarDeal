// app/cars/[id]/layout.js
export async function generateMetadata({ params }) {
  const resolvedParams = await params;
  try {
    const res = await fetch(
      `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/cars/${resolvedParams.id}`,
      { cache: "no-store" },
    );
    const data = await res.json();
    if (!data.success) return { title: "Car Not Found — AutoElite" };
    const c = data.data;
    return {
      title: `${c.year} ${c.make} ${c.model} — AutoElite`,
      description:
        c.description || `${c.year} ${c.make} ${c.model} for sale at AutoElite`,
      openGraph: {
        title: `${c.year} ${c.make} ${c.model}`,
        images: [{ url: c.thumbnail || "" }],
      },
    };
  } catch {
    return { title: "AutoElite" };
  }
}

export default function CarLayout({ children }) {
  return children;
}
