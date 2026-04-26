export const fallbackOrders = [
  {
    id: 1027,
    orderId: "ORD-1027",
    date: "Apr 24, 2026",
    totalPrice: "BDT 84,500",
    status: "Completed",
    items: [
      {
        id: "1027-1",
        name: "AMD Ryzen 7 7800X3D Processor",
        quantity: 1,
        price: "BDT 48,500",
        category: "Processor",
      },
      {
        id: "1027-2",
        name: "B650 Gaming WiFi Motherboard",
        quantity: 1,
        price: "BDT 36,000",
        category: "Motherboard",
      },
    ],
  },
  {
    id: 1026,
    orderId: "ORD-1026",
    date: "Apr 18, 2026",
    totalPrice: "BDT 12,200",
    status: "Pending",
    items: [
      {
        id: "1026-1",
        name: "16GB DDR5 Desktop RAM",
        quantity: 1,
        price: "BDT 12,200",
        category: "Memory",
      },
    ],
  },
  {
    id: 1025,
    orderId: "ORD-1025",
    date: "Apr 12, 2026",
    totalPrice: "BDT 38,900",
    status: "Shipped",
    items: [
      {
        id: "1025-1",
        name: "1TB NVMe Gen4 SSD",
        quantity: 1,
        price: "BDT 14,900",
        category: "Storage",
      },
      {
        id: "1025-2",
        name: "750W 80+ Gold Power Supply",
        quantity: 1,
        price: "BDT 24,000",
        category: "Power Supply",
      },
    ],
  },
];

export const fallbackPayments = [
  {
    id: 501,
    paymentId: "PAY-501",
    orderId: "ORD-1027",
    amount: "BDT 84,500",
    method: "Card",
    status: "Paid",
  },
  {
    id: 500,
    paymentId: "PAY-500",
    orderId: "ORD-1026",
    amount: "BDT 12,200",
    method: "bKash",
    status: "Pending",
  },
  {
    id: 499,
    paymentId: "PAY-499",
    orderId: "ORD-1025",
    amount: "BDT 38,900",
    method: "Cash on Delivery",
    status: "Success",
  },
];
