"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, fetchUserAttributes } from "aws-amplify/auth";
import { configureAmplify } from "@/lib/amplify";
import { apiClient, type Schema } from "@/lib/client";
import { ShopNav } from "@/components/ShopNav";

configureAmplify();

type Deal = Schema["Deal"]["type"];

const CATEGORIES = ["oil", "brake", "tire", "ac", "insp", "detail", "other"] as const;
type Category = typeof CATEGORIES[number];

const CAT_LABELS: Record<Category, string> = {
  oil: "Oil change", brake: "Brakes", tire: "Tires",
  ac: "AC", insp: "Inspection", detail: "Detailing", other: "Other",
};

const EMPTY_FORM = { offer: "", category: "oil" as Category, priceNow: "", priceWas: "", pct: "", expiresInDays: "30" };

export default function DealsPage() {
  const router = useRouter();
  const [shopId, setShopId]     = useState<string | null>(null);
  const [shopName, setShopName] = useState<string>();
  const [deals, setDeals]       = useState<Deal[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [toggling, setToggling] = useState<string | null>(null);

  useEffect(() => {
    getCurrentUser().catch(() => router.replace("/login"));
  }, [router]);

  useEffect(() => {
    async function loadShop() {
      try {
        const attrs = await fetchUserAttributes();
        const sub = attrs.sub;
        if (!sub) throw new Error("No user sub");
        const { data: members } = await apiClient.models.ShopMember.listShopMemberByUserSub({ userSub: sub });
        const member = members?.[0];
        if (!member?.shopId) throw new Error("No shop membership");
        setShopId(member.shopId);
        const { data: shop } = await apiClient.models.Shop.get({ id: member.shopId });
        setShopName(shop?.name ?? undefined);
      } catch (e: any) {
        setError(e?.message ?? "Failed to load shop");
        setLoading(false);
      }
    }
    loadShop();
  }, []);

  const loadDeals = useCallback(async () => {
    if (!shopId) return;
    setLoading(true);
    try {
      const { data } = await apiClient.models.Deal.listDealByShopId({ shopId });
      setDeals((data ?? []).sort((a, b) => (a.active ? 0 : 1) - (b.active ? 0 : 1)));
    } catch (e: any) {
      setError(e?.message ?? "Failed to load deals");
    } finally {
      setLoading(false);
    }
  }, [shopId]);

  useEffect(() => { loadDeals(); }, [loadDeals]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!shopId || !form.offer.trim()) return;
    setSaving(true);
    setError("");
    try {
      const expiresAt = new Date(Date.now() + parseInt(form.expiresInDays) * 86_400_000).toISOString();
      const { data } = await apiClient.models.Deal.create({
        shopId,
        offer:    form.offer.trim(),
        category: form.category,
        priceNow: form.priceNow ? parseFloat(form.priceNow) : undefined,
        priceWas: form.priceWas ? parseFloat(form.priceWas) : undefined,
        pct:      form.pct      ? parseInt(form.pct)        : undefined,
        expiresAt,
        active: true,
      });
      if (data) setDeals(prev => [data, ...prev]);
      setForm(EMPTY_FORM);
      setShowForm(false);
    } catch (e: any) {
      setError(e?.message ?? "Failed to create deal");
    } finally {
      setSaving(false);
    }
  };

  const toggleActive = async (deal: Deal) => {
    setToggling(deal.id);
    try {
      await apiClient.models.Deal.update({ id: deal.id, active: !deal.active });
      setDeals(prev => prev.map(d => d.id === deal.id ? { ...d, active: !d.active } : d));
    } catch (e: any) {
      setError(e?.message ?? "Update failed");
    } finally {
      setToggling(null);
    }
  };

  const upd = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm(prev => ({ ...prev, [k]: e.target.value }));

  return (
    <div className="sh-shell">
      <ShopNav shopName={shopName}/>
      <main className="sh-main">
        <div className="sh-page-header" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <h1>Deals</h1>
            <p>Create and manage the offers visible to drivers in your area.</p>
          </div>
          <button className="sh-btn sh-btn--primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? "Cancel" : "+ New deal"}
          </button>
        </div>

        {error && (
          <div style={{ padding: "12px 14px", background: "var(--color-error-50)", borderRadius: 10, color: "var(--color-error-700)", fontSize: 14, marginBottom: 16 }}>
            {error}
          </div>
        )}

        {showForm && (
          <form onSubmit={handleCreate} style={{ background: "#fff", border: "1px solid var(--border-subtle)", borderRadius: 14, padding: 20, marginBottom: 20 }}>
            <h3 style={{ margin: "0 0 16px", fontSize: 16, fontWeight: 700 }}>New deal</h3>

            <div className="sh-field">
              <label>Offer headline *</label>
              <input value={form.offer} onChange={upd("offer")} placeholder="e.g. Full synthetic oil change + filter" required/>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="sh-field">
                <label>Category</label>
                <select value={form.category} onChange={upd("category")}>
                  {CATEGORIES.map(c => <option key={c} value={c}>{CAT_LABELS[c]}</option>)}
                </select>
              </div>
              <div className="sh-field">
                <label>Expires in (days)</label>
                <input type="number" min="1" max="365" value={form.expiresInDays} onChange={upd("expiresInDays")}/>
              </div>
              <div className="sh-field">
                <label>Deal price ($)</label>
                <input type="number" min="0" step="0.01" value={form.priceNow} onChange={upd("priceNow")} placeholder="e.g. 79.99"/>
              </div>
              <div className="sh-field">
                <label>Regular price ($)</label>
                <input type="number" min="0" step="0.01" value={form.priceWas} onChange={upd("priceWas")} placeholder="e.g. 109.99"/>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
              <button type="submit" className="sh-btn sh-btn--primary" disabled={saving || !form.offer.trim()}>
                {saving ? <><span className="sh-spinner"/>Saving…</> : "Create deal"}
              </button>
              <button type="button" className="sh-btn sh-btn--secondary" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <div className="sh-spinner" style={{ margin: "0 auto", borderColor: "rgba(55,119,255,.3)", borderTopColor: "var(--color-brand-500)", width: 28, height: 28, borderWidth: 2.5 }}/>
          </div>
        ) : deals.length === 0 ? (
          <div className="sh-empty">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: .4 }}>
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
            <h3>No deals yet</h3>
            <p>Create your first deal to start receiving claims from drivers.</p>
          </div>
        ) : (
          deals.map(deal => {
            const pct = deal.priceWas && deal.priceNow
              ? Math.round((1 - deal.priceNow / deal.priceWas) * 100)
              : deal.pct;
            return (
              <div key={deal.id} className="sh-deal-card" style={{ opacity: deal.active ? 1 : 0.55 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p className="offer">{deal.offer}</p>
                  <div style={{ fontSize: 13, color: "var(--fg-secondary)", marginTop: 2 }}>
                    {CAT_LABELS[deal.category as Category] ?? deal.category}
                    {pct ? ` · ${pct}% off` : ""}
                    {!deal.active ? " · Inactive" : " · Active"}
                  </div>
                </div>
                {deal.priceNow && <span className="price">${deal.priceNow}</span>}
                <button
                  className={`sh-btn ${deal.active ? "sh-btn--secondary" : "sh-btn--primary"}`}
                  style={{ fontSize: 13, flexShrink: 0 }}
                  disabled={toggling === deal.id}
                  onClick={() => toggleActive(deal)}
                >
                  {toggling === deal.id ? <><span className="sh-spinner"/>…</> : deal.active ? "Deactivate" : "Activate"}
                </button>
              </div>
            );
          })
        )}
      </main>
    </div>
  );
}
