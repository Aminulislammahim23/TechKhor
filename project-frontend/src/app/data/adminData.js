export const dashboardStats = [
  {
    title: "Total Users",
    value: "12,480",
    change: "+18.2% this month",
    accent: "from-cyan-500/20 to-cyan-400/10 text-cyan-300",
  },
  {
    title: "Total Products",
    value: "3,240",
    change: "+9.4% this month",
    accent: "from-emerald-500/20 to-emerald-400/10 text-emerald-300",
  },
  {
    title: "Total Orders",
    value: "8,964",
    change: "+12.7% this month",
    accent: "from-blue-500/20 to-blue-400/10 text-blue-300",
  },
  {
    title: "Total Revenue",
    value: "BDT 148,920",
    change: "+21.8% this month",
    accent: "from-amber-500/20 to-amber-400/10 text-amber-300",
  },
];

export const users = [
  { id: 1, name: "Amina Rahman", email: "amina@techkhor.com", createdAt: "2026-04-01" },
  { id: 2, name: "Nabil Hossain", email: "nabil@techkhor.com", createdAt: "2026-04-04" },
  { id: 3, name: "Sadia Akter", email: "sadia@techkhor.com", createdAt: "2026-04-06" },
  { id: 4, name: "Tanvir Ahmed", email: "tanvir@techkhor.com", createdAt: "2026-04-09" },
  { id: 5, name: "Raisa Chowdhury", email: "raisa@techkhor.com", createdAt: "2026-04-12" },
];

export const products = [
  { id: 1, name: "TechKhor Pro Laptop", price: "BDT 129,900", seller: "Nova Traders", status: "Pending" },
  { id: 2, name: "Wireless Noise Headset", price: "BDT 19,900", seller: "SoundLoop", status: "Approved" },
  { id: 3, name: "Smart Watch X2", price: "BDT 24,900", seller: "PulseMart", status: "Pending" },
  { id: 4, name: "Mechanical Keyboard", price: "BDT 12,900", seller: "KeyForge", status: "Approved" },
  { id: 5, name: "4K Ultra Monitor", price: "BDT 49,900", seller: "PixelHub", status: "Pending" },
];

export const orders = [
  { id: "ORD-20451", user: "Amina Rahman", totalPrice: "BDT 149,800", status: "Delivered" },
  { id: "ORD-20452", user: "Tanvir Ahmed", totalPrice: "BDT 24,900", status: "Processing" },
  { id: "ORD-20453", user: "Raisa Chowdhury", totalPrice: "BDT 201,700", status: "Shipped" },
  { id: "ORD-20454", user: "Sadia Akter", totalPrice: "BDT 12,900", status: "Pending" },
];

export const payments = [
  {
    paymentId: "PAY-88412",
    orderId: "ORD-20451",
    amount: "BDT 149,800",
    status: "Paid",
    method: "Visa",
  },
  {
    paymentId: "PAY-88413",
    orderId: "ORD-20452",
    amount: "BDT 24,900",
    status: "Pending",
    method: "bKash",
  },
  {
    paymentId: "PAY-88414",
    orderId: "ORD-20453",
    amount: "BDT 201,700",
    status: "Paid",
    method: "Mastercard",
  },
  {
    paymentId: "PAY-88415",
    orderId: "ORD-20454",
    amount: "BDT 12,900",
    status: "Failed",
    method: "Nagad",
  },
];
