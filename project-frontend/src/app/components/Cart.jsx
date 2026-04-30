function CartRow({ item, onIncrement, onDecrement, onRemove }) {
  const subtotal = Number(item.price) * Number(item.quantity);

  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-semibold text-white">{item.name}</p>
          <p className="mt-1 text-sm text-slate-400">
            BDT {Number(item.price).toLocaleString("en-BD")} x {item.quantity}
          </p>
          <p className="mt-1 text-sm text-cyan-300">
            Subtotal: BDT {subtotal.toLocaleString("en-BD")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item.id)}
          className="rounded-lg border border-rose-500/30 px-2 py-1 text-xs font-semibold text-rose-300 transition hover:bg-rose-500/10"
        >
          Remove
        </button>
      </div>

      <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-1">
        <button
          type="button"
          onClick={() => onDecrement(item.id)}
          className="rounded-lg px-2 py-1 text-sm text-white transition hover:bg-white/10"
        >
          -
        </button>
        <span className="min-w-8 text-center text-sm font-medium text-white">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onIncrement(item.id)}
          className="rounded-lg px-2 py-1 text-sm text-white transition hover:bg-white/10"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function Cart({ items, onIncrement, onDecrement, onRemove }) {
  return (
    <section className="rounded-3xl border border-white/10 bg-slate-900/70 p-5 shadow-xl shadow-slate-950/30">
      <h3 className="text-lg font-semibold text-white">Cart</h3>
      <div className="mt-4 max-h-80 space-y-3 overflow-y-auto pr-1">
        {items.length === 0 ? (
          <p className="text-sm text-slate-400">No items in cart.</p>
        ) : (
          items.map((item) => (
            <CartRow
              key={item.id}
              item={item}
              onIncrement={onIncrement}
              onDecrement={onDecrement}
              onRemove={onRemove}
            />
          ))
        )}
      </div>
    </section>
  );
}
