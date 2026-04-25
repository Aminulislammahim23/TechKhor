function toReceiptText(receipt) {
  if (!receipt) return "";

  const lines = [
    "TechKhor Receipt",
    "------------------------------",
    `Date: ${new Date(receipt.createdAt).toLocaleString()}`,
    `Order ID: ${receipt.orderId}`,
    `Transaction ID: ${receipt.transactionId || "N/A"}`,
    `Payment Method: ${receipt.paymentMethod}`,
    "",
    "Items:",
    ...receipt.items.map(
      (item) =>
        `- ${item.name} x${item.quantity} @ BDT ${Number(item.price).toLocaleString("en-BD")} = BDT ${(
          Number(item.price) * Number(item.quantity)
        ).toLocaleString("en-BD")}`
    ),
    "",
    `Subtotal: BDT ${receipt.subtotal.toLocaleString("en-BD")}`,
    `Discount: BDT ${receipt.discount.toLocaleString("en-BD")}`,
    `Tax: BDT ${receipt.taxAmount.toLocaleString("en-BD")}`,
    `Total: BDT ${receipt.total.toLocaleString("en-BD")}`,
    "",
    "Thank you for shopping with TechKhor!",
  ];

  return lines.join("\n");
}

export default function Receipt({ receipt, onClose }) {
  if (!receipt) return null;

  const handlePrint = () => {
    const printWindow = window.open("", "_blank", "width=800,height=700");
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>TechKhor Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; }
            h1 { margin-bottom: 8px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            .totals { margin-top: 16px; }
          </style>
        </head>
        <body>
          <h1>TechKhor</h1>
          <p>Date: ${new Date(receipt.createdAt).toLocaleString()}</p>
          <p>Order ID: ${receipt.orderId}</p>
          <p>Transaction ID: ${receipt.transactionId || "N/A"}</p>
          <table>
            <thead>
              <tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr>
            </thead>
            <tbody>
              ${receipt.items
                .map(
                  (item) =>
                    `<tr><td>${item.name}</td><td>${item.quantity}</td><td>${Number(item.price).toLocaleString(
                      "en-BD"
                    )}</td><td>${(Number(item.price) * Number(item.quantity)).toLocaleString("en-BD")}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
          <div class="totals">
            <p>Subtotal: BDT ${receipt.subtotal.toLocaleString("en-BD")}</p>
            <p>Discount: BDT ${receipt.discount.toLocaleString("en-BD")}</p>
            <p>Tax: BDT ${receipt.taxAmount.toLocaleString("en-BD")}</p>
            <p><strong>Total: BDT ${receipt.total.toLocaleString("en-BD")}</strong></p>
          </div>
          <p>Thank you for shopping with TechKhor!</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  };

  const handleDownload = () => {
    const blob = new Blob([toReceiptText(receipt)], { type: "text/plain;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `techkhor-receipt-${receipt.orderId}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-xl shadow-slate-950/40">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-300">Receipt</p>
            <h3 className="mt-1 text-2xl font-semibold text-white">TechKhor</h3>
            <p className="mt-1 text-sm text-slate-400">{new Date(receipt.createdAt).toLocaleString()}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-3 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            Close
          </button>
        </div>

        <div className="mt-5 space-y-2 text-sm text-slate-300">
          <p>Order ID: #{receipt.orderId}</p>
          <p>Transaction ID: {receipt.transactionId || "N/A"}</p>
          <p>Payment Method: {receipt.paymentMethod}</p>
        </div>

        <div className="mt-5 space-y-2 rounded-2xl border border-white/10 bg-slate-950/70 p-4">
          {receipt.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between text-sm text-slate-200">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>
                BDT {(Number(item.price) * Number(item.quantity)).toLocaleString("en-BD")}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-5 space-y-2 text-sm text-slate-300">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span>BDT {receipt.subtotal.toLocaleString("en-BD")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Discount</span>
            <span>BDT {receipt.discount.toLocaleString("en-BD")}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Tax</span>
            <span>BDT {receipt.taxAmount.toLocaleString("en-BD")}</span>
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-2 text-base font-semibold text-white">
            <span>Total</span>
            <span>BDT {receipt.total.toLocaleString("en-BD")}</span>
          </div>
        </div>

        <p className="mt-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-200">
          Thank you for shopping with TechKhor!
        </p>

        <div className="mt-5 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="rounded-2xl bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Print Receipt
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
