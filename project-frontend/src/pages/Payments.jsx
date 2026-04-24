import Table, { StatusPill } from "../components/Table";
import { payments } from "../data/adminData";

export default function Payments() {
  const columns = [
    { key: "paymentId", label: "Payment ID" },
    { key: "orderId", label: "Order ID" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status", render: (row) => <StatusPill status={row.status} /> },
    { key: "method", label: "Method" },
  ];

  return <Table columns={columns} data={payments} rowKey="paymentId" />;
}
