// app/layout.js
import "./globals.css";
import SessionProvider from "../components/SessionProvider";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "AutoElite | Premium Car Sales",
  description: "Find your perfect drive",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Outfit:wght@300;400;500;600&family=Bebas+Neue&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <SessionProvider>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1C1C1E",
                color: "#fff",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "10px",
                fontSize: "13px",
                fontFamily: "'Outfit', sans-serif",
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  );
}
