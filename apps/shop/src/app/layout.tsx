import type { Metadata } from "next";
import "design-system/styles/tokens.css";
import "./shop.css";

export const metadata: Metadata = {
  title: "Revv Shop",
  description: "Claims inbox and deal management for Revv partner shops",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, fontFamily: "var(--font-sans)", background: "var(--bg-canvas)", color: "var(--fg-primary)" }}>
        {children}
      </body>
    </html>
  );
}
