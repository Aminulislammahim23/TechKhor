export default function BillingSummary({
  subtotal,
  customerName,
  onCustomerNameChange,
  customerPhone,
  onCustomerPhoneChange,
  customerLookup,
  customerLookupLoading,
  customerDiscountRate,
  customerDiscountAmount,
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

      <div className="mt-4 space-y-4 text-sm">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="text-slate-300">
            Customer Name
            <input
              value={customerName}
              onChange={(event) => onCustomerNameChange(event.target.value)}
              placeholder="Enter customer name"
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>

          <label className="text-slate-300">
            Customer Phone
            <input
              type="tel"
              inputMode="tel"
              value={customerPhone}
              onChange={(event) => onCustomerPhoneChange(event.target.value)}
              placeholder="Enter phone number"
              className="mt-1 w-full rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-white outline-none placeholder:text-slate-500 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20"
            />
          </label>
        </div>

        <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-slate-300">
          {customerLookupLoading ? (
            <span>Searching customer...</span>
          ) : customerLookup?.found ? (
            <span>
              Customer #{customerLookup.customer?.id} matched.{" "}
              {Number(customerLookup.purchaseCount || 0) > 0
                ? "Returning customer discount applied."
                : "First purchase discount applied."}
            </span>
          ) : customerPhone.trim().length >= 4 ? (
            <span>New customer. First purchase discount applied.</span>
          ) : (
            <span>Enter phone number to apply customer discount.</span>
          )}
        </div>

        <div className="flex items-center justify-between text-slate-300">
          <span>Subtotal</span>
          <span>BDT {subtotal.toLocaleString("en-BD")}</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-white/10 bg-slate-950/80 px-3 py-2 text-slate-300">
            <span className="block">Customer Discount</span>
            <span className="mt-1 block font-semibold text-white">
              {Math.round(Number(customerDiscountRate || 0) * 100)}% - BDT{" "}
              {customerDiscountAmount.toLocaleString("en-BD")}
            </span>
          </div>

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
