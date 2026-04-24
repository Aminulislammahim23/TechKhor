import Table, { StatusPill } from "../components/Table";
import { orders } from "../data/adminData";

export default function Orders() {
  const columns = [
    { key: "id", label: "Order ID" },
    { key: "user", label: "User" },
    { key: "totalPrice", label: "Total Price" },
    {
      key: "status",
      label: "Status",
      render: (row) => <StatusPill status={row.status} />,
    },
  ];

  return <Table columns={columns} data={orders} rowKey="id" />;
}
