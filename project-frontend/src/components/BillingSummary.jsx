export default function BillingSummary({
  subtotal,
  discount,
  onDiscountChange,
  taxRate,
  onTaxRateChange,
  taxAmount,
  total,
  paymentMethod,
  onPaymentMethodChange,
  onGenerateBill,
  onCompletePayment,
  generatingBill,
  processingPayment,
  orderId,
  canGenerate,
  canPay,
}) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
      <h3 className="text-lg font-semibold text-white">Billing Summary</h3>

      <div className="mt-4 space-y-3 text-sm">
        <div className="flex items-center justify-between text-slate-300">
          <span>Subtotal</span>
          <span>BDT {subtotal.toLocaleString("en-BD")}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="text-slate-300">
            Discount (BDT)
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(event) => onDiscountChange(event.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>

          <label className="text-slate-300">
            Tax (%)
            <input
              type="number"
              min="0"
              value={taxRate}
              onChange={(event) => onTaxRateChange(event.target.value)}
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span>Tax Amount</span>
          <span>BDT {taxAmount.toLocaleString("en-BD")}</span>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 pt-3 text-base font-semibold text-white">
          <span>Total</span>
          <span>BDT {total.toLocaleString("en-BD")}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={onGenerateBill}
        disabled={!canGenerate || generatingBill}
        className="mt-5 w-full rounded-2xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {generatingBill ? "Generating..." : "Generate Bill"}
      </button>

      <div className="mt-5 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
        <p className="text-xs uppercase tracking-[0.2em] text-cyan-300">Payment Step</p>
        <p className="mt-2 text-sm text-slate-400">
          {orderId ? `Order #${orderId} ready for payment.` : "Generate bill first to continue payment."}
        </p>

        <label className="mt-3 block text-sm text-slate-300">
          Payment Method
          <select
            value={paymentMethod}
            onChange={(event) => onPaymentMethodChange(event.target.value)}
            className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-white outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="mock">Mock</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onCompletePayment}
          disabled={!canPay || processingPayment}
          className="mt-4 w-full rounded-2xl border border-emerald-400/30 bg-emerald-400/20 px-4 py-3 font-semibold text-emerald-100 transition hover:bg-emerald-400/30 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {processingPayment ? "Processing..." : "Complete Sale"}
        </button>
      </div>
    </section>
  );
}
