import Table from "../components/Table";
import { users } from "../data/adminData";

export default function Users() {
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "createdAt", label: "CreatedAt" },
  ];

  return (
    <section className="space-y-6">
      <Table columns={columns} data={users} rowKey="id" />
    </section>
  );
}
