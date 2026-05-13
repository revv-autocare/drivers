"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { configureAmplify } from "@/lib/amplify";
import { apiClient, type Schema } from "@/lib/client";
import { ShopNav } from "@/components/ShopNav";

configureAmplify();

type Claim = Schema["Claim"]["type"];
type Deal  = Schema["Deal"]["type"];

function statusLabel(s: Claim["status"]) {
  switch (s) {
    case "awaiting":   return "New";
    case "contacted":  return "Contacted";
    case "confirmed":  return "Confirmed";
    case "expired":    return "Expired";
    case "cancelled":  return "Cancelled";
    default: return s ?? "—";
  }
}

function timeAgo(iso: string | null | undefined) {
  if (!iso) return "";
  const diffMin = Math.floor((Date.now() - new Date(iso).getTime()) / 60_000);
  if (diffMin < 1) return "Just now";
  if (diffMin < 60) return `${diffMin}m ago`;
  const h = Math.floor(diffMin / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

export default function DashboardPage() {
  const router = useRouter();
  const [shopId, setShopId]   = useState<string | null>(null);
  const [shopName, setShopName] = useState<string>();
  const [claims, setClaims]   = useState<Claim[]>([]);
  const [deals, setDeals]     = useState<Record<string, Deal>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [updating, setUpdating] = useState<string | null>(null);
  const [filter, setFilter]   = useState<"active" | "all">("active");

  useEffect(() => {
    getCurrentUser().catch(() => router.replace("/login"));
  }, [router]);

  // Load shop membership → shopId
  useEffect(() => {
    async function loadShop() {
      try {
        const attrs = await fetchUserAttributes();
        const sub = attrs.sub;
        if (!sub) throw new Error("No user sub");

        // Find ShopMember by userSub
        const { data: members } = await apiClient.models.ShopMember.listShopMemberByUserSub({ userSub: sub });
        const member = members?.[0];
        if (!member?.shopId) throw new Error("No shop membership found");

        setShopId(member.shopId);

        // Fetch shop name
        const { data: shop } = await apiClient.models.Shop.get({ id: member.shopId });
        setShopName(shop?.name ?? undefined);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load shop");
        setLoading(false);
      }
    }
    loadShop();
  }, []);

  const loadClaims = useCallback(async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const { data } = await apiClient.models.Claim.listClaimByShopId({ shopId });
      setClaims((data ?? []).sort((a, b) =>
        new Date(b.claimedAt ?? 0).getTime() - new Date(a.claimedAt ?? 0).getTime()
      ));

      // Batch-load unique deals
      const dealIds = [...new Set((data ?? []).map(c => c.dealId).filter(Boolean))] as string[];
      const dealMap: Record<string, Deal> = {};
      await Promise.all(dealIds.map(async id => {
        const { data: d } = await apiClient.models.Deal.get({ id });
        if (d) dealMap[id] = d;
      }));
      setDeals(dealMap);
    } catch (e: any) {
      setError(e?.message ?? "Failed to load claims");
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => { loadClaims(); }, [loadClaims]);

  const advance = async (claimId: string, newStatus: "contacted" | "confirmed") => {
    setUpdating(claimId);
    try {
      const now = new Date().toISOString();
      await apiClient.models.Claim.update({
        id: claimId,
        status: newStatus,
        ...(newStatus === "contacted"  ? { contactedAt: now } : {}),
        ...(newStatus === "confirmed"  ? { confirmedAt: now } : {}),
      });
      setClaims(prev => prev.map(c => c.id !== claimId ? c : { ...c, status: newStatus }));
    } catch (e: any) {
      setError(e?.message ?? "Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const filtered = filter === "active"
    ? claims.filter(c => c.status === "awaiting" || c.status === "contacted" || c.status === "confirmed")
    : claims;

  const newCount = claims.filter(c => c.status === "awaiting").length;

  return (
    <div className="sh-shell">
      <ShopNav shopName={shopName}/>
      <main className="sh-main">
        <div className="sh-page-header">
          <h1>Claims inbox {newCount > 0 && <span style={{ fontSize: 16, fontWeight: 600, color: "var(--color-brand-600)" }}>· {newCount} new</span>}</h1>
          <p>Respond to driver claims within 24 hours to maintain your honor rate.</p>
        </div>

        {error && (
          <div style={{ padding: "12px 14px", background: "var(--color-error-50)", borderRadius: 10, color: "var(--color-error-700)", fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          {(["active", "all"] as const).map(f => (
            <button key={f} className={`sh-btn ${filter === f ? "sh-btn--primary" : "sh-btn--secondary"}`} style={{ fontSize: 13 }} onClick={() => setFilter(f)}>
              {f === "active" ? "Active" : "All"}
            </button>
          ))}
          <button className="sh-btn sh-btn--secondary" style={{ marginLeft: "auto", fontSize: 13 }} onClick={loadClaims}>
            Refresh
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div className="sh-spinner" style={{ margin: "0 auto", borderColor: "rgba(55,119,255,.3)", borderTopColor: "var(--color-brand-500)", width: 28, height: 28, borderWidth: 2.5 }}/>
          </div>
        ) : filtered.length === 0 ? (
          <div className="sh-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .4 }}>
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            <h3>No {filter === "active" ? "active " : ""}claims</h3>
            <p>{filter === "active" ? "All caught up! New claims will appear here." : "Claims from drivers will appear here."}</p>
          </div>
        ) : (
          filtered.map(claim => {
            const deal = claim.dealId ? deals[claim.dealId] : undefined;
            return (
              <div key={claim.id} className="sh-claim-card">
                <div className="cat-dot" style={{ background: claim.status === "awaiting" ? "var(--color-warning-500)" : claim.status === "confirmed" ? "var(--color-success-500)" : "var(--color-brand-500)" }}/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <p className="offer">{deal?.offer ?? "Deal"}</p>
                    <span className={`pill ${claim.status ?? "awaiting"}`}>{statusLabel(claim.status)}</span>
                  </div>
                  <div className="meta">
                    Claimed {timeAgo(claim.claimedAt)}
                    {claim.notes ? ` · "${claim.notes}"` : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                  {claim.status === "awaiting" && (
                    <button
                      className="sh-btn sh-btn--primary"
                      style={{ fontSize: 13 }}
                      disabled={updating === claim.id}
                      onClick={() => advance(claim.id, "contacted")}
                    >
                      {updating === claim.id ? <><span className="sh-spinner"/>…</> : "Mark contacted"}
                    </button>
                  )}
                  {claim.status === "contacted" && (
                    <button
                      className="sh-btn sh-btn--secondary"
                      style={{ fontSize: 13 }}
                      disabled={updating === claim.id}
                      onClick={() => advance(claim.id, "confirmed")}
                    >
                      {updating === claim.id ? <><span className="sh-spinner"/>…</> : "Confirm booking"}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
