"use client";
import { Authenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter } from "next/navigation";
import { configureAmplify } from "@/lib/amplify";

configureAmplify();

export default function LoginPage() {
  const router = useRouter();

  return (
    <div className="sh-auth-wrap">
      <div style={{ width: "100%", maxWidth: 400, padding: "0 16px" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--color-brand-600)", margin: "0 0 6px" }}>Revv Shop</h1>
          <p style={{ fontSize: 14, color: "var(--fg-secondary)", margin: 0 }}>Sign in to your shop portal</p>
        </div>
        <Authenticator
          loginMechanisms={["email"]}
          hideSignUp
        >
          {() => {
            router.replace("/dashboard");
            return null;
          }}
        </Authenticator>
      </div>
    </div>
  );
}
