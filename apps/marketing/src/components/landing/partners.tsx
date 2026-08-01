export function Partners() {
  const partners = [
    { name: "Wave", color: "#1DC9CE" },
    { name: "Orange Money", color: "#FF6600" },
    { name: "MTN MoMo", color: "#FFCC00" },
    { name: "CinetPay", color: "#0F172A" },
    { name: "Paystack", color: "#0BA4DB" },
  ];

  return (
    <section className="border-y border-slate-100 bg-white py-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400 mb-4">
          Paiements traités via
        </p>
        <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
            >
              <span
                className="h-3 w-3 rounded-full shrink-0"
                style={{ backgroundColor: partner.color }}
              />
              <span className="text-sm font-semibold text-payskool-navy">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
