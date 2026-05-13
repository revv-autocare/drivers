"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "aws-amplify/auth";

export function ShopNav({ shopName }: { shopName?: string }) {
  const path = usePathname();

  return (
    <nav className="sh-sidebar">
      <div className="sh-logo">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 16H9m10 0h1.5a1.5 1.5 0 0 0 1.5-1.5V13a8 8 0 0 0-8-8H10a8 8 0 0 0-8 8v1.5A1.5 1.5 0 0 0 3.5 16H5"/>
          <circle cx="7" cy="16" r="2"/><circle cx="17" cy="16" r="2"/>
        </svg>
        {shopName ?? "Revv Shop"}
      </div>

      <Link href="/dashboard" className={`sh-nav-link ${path === "/dashboard" ? "active" : ""}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
        </svg>
        Claims
      </Link>

      <Link href="/deals" className={`sh-nav-link ${path === "/deals" ? "active" : ""}`}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
        Deals
      </Link>

      <div style={{ marginTop: "auto", padding: "0 8px" }}>
        <button
          className="sh-nav-link"
          style={{ width: "100%", cursor: "pointer", background: "none", border: "none" }}
          onClick={() => signOut()}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
          </svg>
          Sign out
        </button>
      </div>
    </nav>
  );
}
