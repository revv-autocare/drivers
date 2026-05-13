"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { configureAmplify } from "@/lib/amplify";
import { getCurrentUser } from "aws-amplify/auth";

configureAmplify();

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    getCurrentUser()
      .then(() => router.replace("/dashboard"))
      .catch(() => router.replace("/login"));
  }, [router]);

  return (
    <div className="sh-auth-wrap">
      <div className="sh-spinner" style={{ borderColor: "rgba(55,119,255,.3)", borderTopColor: "var(--color-brand-500)", width: 32, height: 32, borderWidth: 3 }}/>
    </div>
  );
}
