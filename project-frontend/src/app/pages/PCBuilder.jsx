import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../api";
import { addToCart } from "../utils/cart";

const coreComponents = [
  { name: "CPU", required: true, icon: "cpu" },
  { name: "CPU Cooler", icon: "fan" },
  { name: "Motherboard", required: true, icon: "motherboard" },
  { name: "RAM", required: true, icon: "ram" },
  { name: "Storage", required: true, icon: "storage" },
  { name: "Graphics Card", icon: "gpu" },
  { name: "Power Supply", required: true, icon: "psu" },
  { name: "Casing", required: true, icon: "case" },
];

const peripheralComponents = [
  { name: "Monitor", icon: "monitor" },
  { name: "Casing Cooler", icon: "fan" },
  { name: "Keyboard", icon: "keyboard" },
  { name: "Mouse", icon: "mouse" },
  { name: "Speaker & Home Theater", icon: "speaker" },
  { name: "Headphone", icon: "headphone" },
  { name: "Wifi Adapter / LAN Card", icon: "chip" },
  { name: "Anti Virus", icon: "shield" },
];

const actionItems = [
  { label: "AI Suggest", icon: "ai", action: "suggest" },
  { label: "Add to Cart", icon: "cart", action: "cart" },
  { label: "Save PC", icon: "save", action: "save" },
  { label: "Print", icon: "print", action: "print" },
  { label: "Screenshot", icon: "camera", action: "screenshot" },
];

const sampleParts = {
  CPU: { name: "AMD Ryzen 5 7600", price: 23500, watt: 65 },
  "CPU Cooler": { name: "DeepCool AG400 ARGB", price: 3200, watt: 4 },
  Motherboard: { name: "MSI B650M Gaming WiFi", price: 21500, watt: 45 },
  RAM: { name: "Corsair Vengeance 16GB DDR5", price: 7200, watt: 6 },
  Storage: { name: "Samsung 980 1TB NVMe SSD", price: 9800, watt: 5 },
  "Graphics Card": { name: "GeForce RTX 4060 8GB", price: 43500, watt: 115 },
  "Power Supply": { name: "Corsair CX650 650W Bronze", price: 7800, watt: 0 },
  Casing: { name: "Montech Air 100 ARGB", price: 6500, watt: 8 },
  Monitor: { name: "24-inch 165Hz IPS Monitor", price: 22500, watt: 30 },
  "Casing Cooler": { name: "120mm ARGB Case Fan", price: 900, watt: 3 },
  Keyboard: { name: "Mechanical RGB Keyboard", price: 3500, watt: 2 },
  Mouse: { name: "Gaming Mouse 8000 DPI", price: 1800, watt: 1 },
  "Speaker & Home Theater": { name: "2.1 Channel Speaker Set", price: 5200, watt: 20 },
  Headphone: { name: "USB Gaming Headset", price: 4200, watt: 2 },
  "Wifi Adapter / LAN Card": { name: "WiFi 6 PCIe Adapter", price: 2800, watt: 4 },
  "Anti Virus": { name: "1 Year Security License", price: 1200, watt: 0 },
};

const buildPresets = [
  {
    key: "budget",
    label: "Budget Build",
    tagline: "Best value for browsing, study, and light work.",
    components: {
      CPU: { name: "Intel Core i3-12100", price: 12500, watt: 60 },
      Motherboard: { name: "H610M DDR4 Motherboard", price: 9200, watt: 35 },
      RAM: { name: "8GB DDR4 3200MHz RAM", price: 2600, watt: 4 },
      Storage: { name: "512GB NVMe SSD", price: 4200, watt: 4 },
      "Power Supply": { name: "450W 80+ Power Supply", price: 3600, watt: 0 },
      Casing: { name: "Compact Airflow Casing", price: 3200, watt: 4 },
      Keyboard: { name: "Basic Keyboard", price: 700, watt: 1 },
      Mouse: { name: "Basic Optical Mouse", price: 450, watt: 1 },
    },
  },
  {
    key: "decent",
    label: "Decent Build",
    tagline: "Balanced everyday PC with smooth multitasking.",
    components: {
      CPU: { name: "AMD Ryzen 5 7600", price: 23500, watt: 65 },
      "CPU Cooler": { name: "DeepCool AG400 ARGB", price: 3200, watt: 4 },
      Motherboard: { name: "MSI B650M Gaming WiFi", price: 21500, watt: 45 },
      RAM: { name: "Corsair Vengeance 16GB DDR5", price: 7200, watt: 6 },
      Storage: { name: "Samsung 980 1TB NVMe SSD", price: 9800, watt: 5 },
      "Power Supply": { name: "Corsair CX650 650W Bronze", price: 7800, watt: 0 },
      Casing: { name: "Montech Air 100 ARGB", price: 6500, watt: 8 },
      Monitor: { name: "24-inch 100Hz IPS Monitor", price: 15500, watt: 24 },
    },
  },
  {
    key: "gaming",
    label: "Gaming Build",
    tagline: "High-FPS gaming with RTX graphics and 165Hz display.",
    components: {
      CPU: { name: "AMD Ryzen 5 7600", price: 23500, watt: 65 },
      "CPU Cooler": { name: "DeepCool AG400 ARGB", price: 3200, watt: 4 },
      Motherboard: { name: "MSI B650M Gaming WiFi", price: 21500, watt: 45 },
      RAM: { name: "32GB DDR5 RGB RAM", price: 13500, watt: 8 },
      Storage: { name: "1TB Gen4 NVMe SSD", price: 12500, watt: 6 },
      "Graphics Card": { name: "GeForce RTX 4060 8GB", price: 43500, watt: 115 },
      "Power Supply": { name: "650W 80+ Bronze PSU", price: 7800, watt: 0 },
      Casing: { name: "ARGB Airflow Gaming Case", price: 7200, watt: 10 },
      Monitor: { name: "24-inch 165Hz IPS Monitor", price: 22500, watt: 30 },
      Keyboard: { name: "Mechanical RGB Keyboard", price: 3500, watt: 2 },
      Mouse: { name: "Gaming Mouse 8000 DPI", price: 1800, watt: 1 },
    },
  },
  {
    key: "office",
    label: "Office Build",
    tagline: "Quiet, reliable setup for documents, meetings, and POS work.",
    components: {
      CPU: { name: "Intel Core i5-12400", price: 18500, watt: 65 },
      Motherboard: { name: "B660M Business Motherboard", price: 14500, watt: 38 },
      RAM: { name: "16GB DDR4 3200MHz RAM", price: 4800, watt: 5 },
      Storage: { name: "512GB NVMe SSD", price: 4200, watt: 4 },
      "Power Supply": { name: "500W 80+ Quiet PSU", price: 4700, watt: 0 },
      Casing: { name: "Minimal Office Casing", price: 4200, watt: 3 },
      Monitor: { name: "22-inch IPS Monitor", price: 10500, watt: 20 },
      Keyboard: { name: "Wireless Keyboard", price: 1600, watt: 1 },
      Mouse: { name: "Wireless Mouse", price: 900, watt: 1 },
      "Anti Virus": { name: "1 Year Security License", price: 1200, watt: 0 },
    },
  },
  {
    key: "workstation",
    label: "Workstation Build",
    tagline: "Heavy creative, coding, rendering, and professional workloads.",
    components: {
      CPU: { name: "AMD Ryzen 9 7900X", price: 52000, watt: 170 },
      "CPU Cooler": { name: "360mm Liquid CPU Cooler", price: 14500, watt: 8 },
      Motherboard: { name: "X670 Creator Motherboard", price: 48500, watt: 55 },
      RAM: { name: "64GB DDR5 6000MHz RAM", price: 28500, watt: 12 },
      Storage: { name: "2TB Gen4 NVMe SSD", price: 24500, watt: 7 },
      "Graphics Card": { name: "GeForce RTX 4070 Super 12GB", price: 89000, watt: 220 },
      "Power Supply": { name: "850W 80+ Gold PSU", price: 16500, watt: 0 },
      Casing: { name: "Premium E-ATX Airflow Case", price: 17500, watt: 12 },
      Monitor: { name: "27-inch QHD Creator Monitor", price: 42000, watt: 45 },
      Keyboard: { name: "Mechanical Productivity Keyboard", price: 6500, watt: 2 },
      Mouse: { name: "Ergonomic Wireless Mouse", price: 4200, watt: 1 },
    },
  },
];

function formatCurrency(value) {
  return `BDT ${Number(value || 0).toLocaleString("en-BD")}`;
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function BuilderIcon({ type, className = "h-12 w-12" }) {
  const common = {
    className,
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.6",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
  };

  const icons = {
    cpu: (
      <svg {...common}>
        <rect x="14" y="14" width="20" height="20" rx="2" />
        <rect x="19" y="19" width="10" height="10" rx="2" />
        {[10, 18, 24, 30, 38].map((x) => (
          <path key={`cpu-top-${x}`} d={`M${x} 8v6M${x} 34v6`} />
        ))}
        {[10, 18, 24, 30, 38].map((y) => (
          <path key={`cpu-side-${y}`} d={`M8 ${y}h6M34 ${y}h6`} />
        ))}
      </svg>
    ),
    fan: (
      <svg {...common}>
        <rect x="9" y="9" width="30" height="30" rx="2" />
        <circle cx="24" cy="24" r="5" />
        <path d="M24 19c1-7 8-8 11-4-1 6-5 8-11 9" />
        <path d="M29 24c7 1 8 8 4 11-6-1-8-5-9-11" />
        <path d="M24 29c-1 7-8 8-11 4 1-6 5-8 11-9" />
        <path d="M19 24c-7-1-8-8-4-11 6 1 8 5 9 11" />
      </svg>
    ),
    motherboard: (
      <svg {...common}>
        <rect x="12" y="8" width="24" height="32" rx="1" />
        <rect x="17" y="14" width="9" height="9" />
        <path d="M29 14h3M29 19h3M17 28h15M17 33h10" />
        <path d="M8 16h4M8 24h4M8 32h4M36 16h4M36 24h4M36 32h4" />
      </svg>
    ),
    ram: (
      <svg {...common}>
        <path d="M10 29l24-18 4 5-24 18z" />
        <path d="M17 29l4 5M22 25l4 5M27 21l4 5M32 17l4 5" />
        <path d="M11 35l4 5M8 31l4 5" />
      </svg>
    ),
    storage: (
      <svg {...common}>
        <rect x="15" y="8" width="18" height="32" rx="1.5" />
        <circle cx="24" cy="22" r="6" />
        <circle cx="24" cy="22" r="1.5" />
        <path d="M24 28l4 6M19 35h10" />
      </svg>
    ),
    gpu: (
      <svg {...common}>
        <rect x="9" y="15" width="30" height="18" rx="1.5" />
        <circle cx="26" cy="24" r="6" />
        <path d="M8 20H5v8h4M14 33v5M19 33v5M31 33v5M36 33v5" />
      </svg>
    ),
    psu: (
      <svg {...common}>
        <rect x="9" y="13" width="30" height="22" rx="2" />
        <circle cx="20" cy="24" r="6" />
        <path d="M31 19h4M31 24h4M31 29h4" />
      </svg>
    ),
    case: (
      <svg {...common}>
        <rect x="15" y="7" width="18" height="34" rx="2" />
        <circle cx="24" cy="16" r="2" />
        <path d="M20 25h8M20 31h8" />
      </svg>
    ),
    monitor: (
      <svg {...common}>
        <rect x="10" y="10" width="28" height="20" rx="1.5" />
        <path d="M24 30v8M17 38h14" />
      </svg>
    ),
    keyboard: (
      <svg {...common}>
        <path d="M15 18c3-1 1-7 6-7" />
        <rect x="9" y="21" width="30" height="17" rx="2" />
        <path d="M15 27h1M21 27h1M27 27h1M33 27h1M15 32h1M21 32h10M34 32h1" />
      </svg>
    ),
    mouse: (
      <svg {...common}>
        <path d="M18 15l6-6M30 15l6-6" />
        <rect x="13" y="14" width="22" height="28" rx="11" transform="rotate(45 24 28)" />
        <path d="M24 17l7 7M24 18v8" />
      </svg>
    ),
    speaker: (
      <svg {...common}>
        <rect x="9" y="14" width="10" height="25" rx="1.5" />
        <rect x="29" y="14" width="10" height="25" rx="1.5" />
        <rect x="20" y="9" width="8" height="30" rx="1.5" />
        <circle cx="14" cy="31" r="3" />
        <circle cx="34" cy="31" r="3" />
        <path d="M22 15h4M22 21h4" />
      </svg>
    ),
    headphone: (
      <svg {...common}>
        <path d="M10 28v-4a14 14 0 0 1 28 0v4" />
        <path d="M10 28h7v11h-7zM31 28h7v11h-7z" />
      </svg>
    ),
    chip: (
      <svg {...common}>
        <rect x="14" y="14" width="20" height="20" rx="2" />
        <circle cx="24" cy="24" r="5" />
        {[10, 18, 24, 30, 38].map((x) => (
          <path key={`chip-${x}`} d={`M${x} 8v6M${x} 34v6`} />
        ))}
        {[10, 18, 24, 30, 38].map((y) => (
          <path key={`chip-side-${y}`} d={`M8 ${y}h6M34 ${y}h6`} />
        ))}
      </svg>
    ),
    shield: (
      <svg {...common}>
        <path d="M24 7l14 5v10c0 9-6 15-14 19-8-4-14-10-14-19V12z" />
        <circle cx="30" cy="31" r="7" />
        <path d="M27 31l2 2 5-6" />
      </svg>
    ),
    ai: (
      <svg {...common} className="h-8 w-8" strokeWidth="3">
        <path d="M24 7l2.8 8.2L35 18l-8.2 2.8L24 29l-2.8-8.2L13 18l8.2-2.8z" />
        <path d="M37 29l1.5 4.5L43 35l-4.5 1.5L37 41l-1.5-4.5L31 35l4.5-1.5z" />
        <path d="M11 30l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </svg>
    ),
    cart: (
      <svg {...common} className="h-8 w-8" strokeWidth="3">
        <path d="M12 13h5l3 17h17l3-11H20" />
        <circle cx="23" cy="37" r="2" />
        <circle cx="35" cy="37" r="2" />
      </svg>
    ),
    save: (
      <svg {...common} className="h-8 w-8" strokeWidth="3">
        <path d="M14 10h20l4 4v24H10V10z" />
        <path d="M17 10v12h14V10M17 38V27h14v11" />
      </svg>
    ),
    print: (
      <svg {...common} className="h-8 w-8" strokeWidth="3">
        <path d="M15 17V9h18v8M15 34h18v6H15z" />
        <rect x="10" y="18" width="28" height="17" rx="2" />
      </svg>
    ),
    camera: (
      <svg {...common} className="h-8 w-8" strokeWidth="3">
        <circle cx="24" cy="24" r="8" />
        <path d="M24 8v8M24 32v8M8 24h8M32 24h8M13 13l6 6M29 29l6 6M35 13l-6 6M19 29l-6 6" />
      </svg>
    ),
  };

  return icons[type] || icons.cpu;
}

function SectionTitle({ children }) {
  return (
    <div className="mb-5 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-5 py-4 shadow-lg shadow-slate-950/20 backdrop-blur">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">Build Step</p>
        <h2 className="mt-1 text-xl font-bold text-white">{children}</h2>
      </div>
      <span className="h-2 w-16 rounded-full bg-gradient-to-r from-cyan-300 to-blue-500" />
    </div>
  );
}

function ComponentRow({ component, hidden, selectedPart, onChoose }) {
  if (hidden && !component.required) return null;

  return (
    <div className="grid grid-cols-[72px_1fr] items-center gap-4 border-b border-white/10 bg-slate-950/40 px-4 py-5 transition hover:bg-white/[0.06] md:grid-cols-[80px_1fr_140px_150px] md:gap-6">
      <div className="flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300 shadow-lg shadow-cyan-500/10">
        {selectedPart?.image ? (
          <img src={selectedPart.image} alt={selectedPart.name} className="h-full w-full object-cover" />
        ) : (
          <BuilderIcon type={component.icon} className="h-10 w-10" />
        )}
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-base font-semibold text-white">{component.name}</h3>
          {component.required ? (
            <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs font-bold text-emerald-300 ring-1 ring-emerald-400/20">
              Required
            </span>
          ) : null}
        </div>
        {selectedPart ? (
          <p className="mt-2 text-sm text-slate-300">
            {selectedPart.name} - {formatCurrency(selectedPart.price)}
          </p>
        ) : (
          <p className="mt-2 text-sm text-slate-400">Choose a compatible {component.name.toLowerCase()} for your build.</p>
        )}
      </div>

      <div className="hidden text-sm font-semibold text-slate-400 md:block">
        {selectedPart ? `${selectedPart.watt}W` : "Not selected"}
      </div>

      <div className="col-span-2 flex justify-start md:col-span-1 md:justify-end">
        <button
          type="button"
          onClick={() => onChoose(component)}
          className="inline-flex h-11 min-w-[112px] items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300 hover:text-slate-950"
        >
          {selectedPart ? "Change" : "Choose"}
        </button>
      </div>
    </div>
  );
}

export default function PCBuilder() {
  const [hideUnconfigured, setHideUnconfigured] = useState(false);
  const [selectedParts, setSelectedParts] = useState({});
  const [message, setMessage] = useState("");
  const [suggestionNote, setSuggestionNote] = useState("");
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const [pickerComponent, setPickerComponent] = useState(null);
  const [pickerProducts, setPickerProducts] = useState([]);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState("");

  const visibleCount = useMemo(() => {
    const allItems = [...coreComponents, ...peripheralComponents];
    return hideUnconfigured ? allItems.filter((item) => item.required).length : allItems.length;
  }, [hideUnconfigured]);

  const selectedItems = useMemo(() => Object.values(selectedParts), [selectedParts]);
  const selectedCount = selectedItems.length;
  const totalPrice = selectedItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
  const totalWatt = selectedItems.reduce((sum, item) => sum + Number(item.watt || 0), 0);

  const showMessage = (text) => {
    setMessage(text);
    window.clearTimeout(window.pcBuilderMessageTimer);
    window.pcBuilderMessageTimer = window.setTimeout(() => setMessage(""), 3000);
  };

  const handleChoosePart = async (component) => {
    setPickerComponent(component);
    setPickerProducts([]);
    setPickerError("");
    setPickerLoading(true);

    try {
      const response = await getProducts({
        categoryName: component.name,
        approvedOnly: true,
        limit: 50,
      });
      const products = Array.isArray(response.data)
        ? response.data
        : Array.isArray(response.data?.data)
          ? response.data.data
          : [];
      setPickerProducts(products);
    } catch (error) {
      setPickerProducts([]);
      setPickerError(error?.message || "Could not load products for this category.");
    } finally {
      setPickerLoading(false);
    }
  };

  const selectProductForComponent = (product) => {
    if (!pickerComponent) return;

    setSelectedParts((current) => ({
      ...current,
      [pickerComponent.name]: {
        id: `${pickerComponent.name}-${product.id}`,
        productId: product.id,
        type: pickerComponent.name,
        name: product.name,
        price: Number(product.price),
        watt: Number(sampleParts[pickerComponent.name]?.watt || 0),
        stock: Number(product.stock || 0),
        image: product.image || "",
      },
    }));
    setPickerComponent(null);
    setPickerProducts([]);
    showMessage(`${product.name} selected for ${pickerComponent.name}.`);
  };

  const removeSelectedComponent = () => {
    if (!pickerComponent) return;

    setSelectedParts((current) => {
      const next = { ...current };
      delete next[pickerComponent.name];
      return next;
    });
    setPickerComponent(null);
    setPickerProducts([]);
    showMessage(`${pickerComponent.name} removed from build.`);
  };

  const applyBuildPreset = (preset) => {
    const suggestedParts = Object.entries(preset.components).reduce((build, [componentName, part]) => {
      build[componentName] = {
        id: componentName,
        type: componentName,
        ...part,
      };
      return build;
    }, {});

    setSelectedParts(suggestedParts);
    setSuggestionOpen(false);
    setSuggestionNote(`AI Suggest picked ${preset.label}: ${preset.tagline}`);
    showMessage(`${preset.label} selected.`);
  };

  const handleAiSuggest = () => {
    setSuggestionOpen(true);
  };

  const buildSnapshot = () => ({
    id: `pc-build-${Date.now()}`,
    name: "Custom TechKhor PC Build",
    price: totalPrice,
    wattage: totalWatt,
    components: selectedItems,
    savedAt: new Date().toISOString(),
  });

  const handleAddToCart = () => {
    if (selectedItems.length === 0) {
      showMessage("Please choose at least one component first.");
      return;
    }

    selectedItems.forEach((item) => {
      addToCart({
        id: item.productId || `pc-builder-${item.type}`,
        name: item.name,
        price: Number(item.price || 0),
        description: `${item.type} selected from PC Builder`,
        image: item.image || null,
        category: { name: item.type },
      });
    });
    showMessage(`${selectedItems.length} selected products added to cart.`);
  };

  const handleSavePc = () => {
    if (selectedItems.length === 0) {
      showMessage("Please choose at least one component before saving.");
      return;
    }

    localStorage.setItem("techkhor_saved_pc_build", JSON.stringify(buildSnapshot()));
    showMessage("PC build saved on this device.");
  };

  const handlePrint = () => {
    if (selectedItems.length === 0) {
      showMessage("Please choose at least one component before printing.");
      return;
    }

    const rows = selectedItems
      .map(
        (item, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>
              <strong>${escapeHtml(item.type)}</strong>
              <span>${escapeHtml(item.name)}</span>
            </td>
            <td>${item.watt}W</td>
            <td>${formatCurrency(item.price)}</td>
          </tr>
        `
      )
      .join("");
    const printedAt = new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date());
    const printWindow = window.open("", "_blank", "width=980,height=720");

    if (!printWindow) {
      showMessage("Please allow pop-ups to print the selected build.");
      return;
    }

    printWindow.document.write(`
      <!doctype html>
      <html>
        <head>
          <title>TechKhor PC Build</title>
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              background: #020617;
              color: #0f172a;
              font-family: Arial, Helvetica, sans-serif;
            }
            .page {
              min-height: 100vh;
              padding: 34px;
              background:
                radial-gradient(circle at top left, rgba(34, 211, 238, 0.20), transparent 32%),
                linear-gradient(135deg, #020617 0%, #0f172a 100%);
            }
            .sheet {
              overflow: hidden;
              max-width: 900px;
              margin: 0 auto;
              border: 1px solid #bae6fd;
              border-radius: 24px;
              background: #ffffff;
              box-shadow: 0 24px 80px rgba(15, 23, 42, 0.35);
            }
            .brand {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 20px;
              padding: 28px 32px;
              background: #020617;
              color: #ffffff;
            }
            .brand-left {
              display: flex;
              align-items: center;
              gap: 16px;
            }
            .brand img {
              width: 58px;
              height: 58px;
              border-radius: 16px;
              object-fit: cover;
            }
            .eyebrow {
              margin: 0 0 6px;
              color: #67e8f9;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.24em;
              text-transform: uppercase;
            }
            h1 {
              margin: 0;
              font-size: 30px;
              line-height: 1.1;
            }
            .meta {
              text-align: right;
              color: #cbd5e1;
              font-size: 13px;
              line-height: 1.6;
            }
            .summary {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 14px;
              padding: 24px 32px;
              background: #f8fafc;
              border-bottom: 1px solid #e2e8f0;
            }
            .summary div {
              border: 1px solid #e2e8f0;
              border-radius: 18px;
              padding: 16px;
              background: #ffffff;
            }
            .summary span {
              display: block;
              color: #64748b;
              font-size: 12px;
              font-weight: 800;
              letter-spacing: 0.16em;
              text-transform: uppercase;
            }
            .summary strong {
              display: block;
              margin-top: 8px;
              color: #020617;
              font-size: 22px;
            }
            .content {
              padding: 28px 32px 34px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              overflow: hidden;
              border: 1px solid #e2e8f0;
              border-radius: 18px;
            }
            th {
              background: #ecfeff;
              color: #0e7490;
              font-size: 12px;
              letter-spacing: 0.18em;
              text-align: left;
              text-transform: uppercase;
            }
            th, td {
              padding: 16px;
              border-bottom: 1px solid #e2e8f0;
              vertical-align: top;
            }
            tr:last-child td { border-bottom: 0; }
            td:first-child {
              width: 56px;
              color: #0891b2;
              font-weight: 800;
            }
            td strong {
              display: block;
              color: #020617;
              font-size: 14px;
            }
            td span {
              display: block;
              margin-top: 5px;
              color: #475569;
              font-size: 14px;
            }
            td:nth-child(3), td:nth-child(4), th:nth-child(3), th:nth-child(4) {
              text-align: right;
              white-space: nowrap;
            }
            .signature {
              display: flex;
              justify-content: space-between;
              gap: 24px;
              margin-top: 36px;
              color: #475569;
              font-size: 13px;
            }
            .line {
              min-width: 220px;
              padding-top: 14px;
              border-top: 2px solid #06b6d4;
              color: #020617;
              font-weight: 800;
              text-align: center;
            }
            @media print {
              body { background: #ffffff; }
              .page { padding: 0; background: #ffffff; }
              .sheet { border-radius: 0; border: 0; box-shadow: none; }
            }
          </style>
        </head>
        <body>
          <main class="page">
            <section class="sheet">
              <header class="brand">
                <div class="brand-left">
                  <img src="/main-logo.jpeg" alt="TechKhor logo" />
                  <div>
                    <p class="eyebrow">TechKhor PC Builder</p>
                    <h1>Selected Components</h1>
                  </div>
                </div>
                <div class="meta">
                  <div>Generated: ${escapeHtml(printedAt)}</div>
                  <div>Build ID: TK-${Date.now()}</div>
                </div>
              </header>
              <div class="summary">
                <div><span>Total Items</span><strong>${selectedCount}</strong></div>
                <div><span>Estimated Wattage</span><strong>${totalWatt}W</strong></div>
                <div><span>Total Price</span><strong>${formatCurrency(totalPrice)}</strong></div>
              </div>
              <div class="content">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Component</th>
                      <th>Wattage</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>${rows}</tbody>
                </table>
                <div class="signature">
                  <p>Prepared by TechKhor. Prices and availability may change before checkout.</p>
                  <div class="line">TechKhor Signature</div>
                </div>
              </div>
            </section>
          </main>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.setTimeout(() => {
      printWindow.print();
    }, 250);
  };

  const handleScreenshot = () => {
    const lines = selectedItems.length
      ? selectedItems.map((item) => `${item.type}: ${item.name} - ${formatCurrency(item.price)}`)
      : ["No components selected"];
    const escapedLines = lines.map((line) =>
      line.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    );
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="720">
        <rect width="1200" height="720" fill="#020617"/>
        <rect x="48" y="48" width="1104" height="624" rx="32" fill="#0f172a" stroke="#164e63"/>
        <text x="88" y="120" fill="#67e8f9" font-family="Arial" font-size="22" font-weight="700">TechKhor PC Builder</text>
        <text x="88" y="170" fill="#ffffff" font-family="Arial" font-size="44" font-weight="800">Custom PC Build</text>
        <text x="88" y="220" fill="#cbd5e1" font-family="Arial" font-size="24">Total: ${formatCurrency(totalPrice)} | Wattage: ${totalWatt}W | Items: ${selectedCount}</text>
        ${escapedLines
          .slice(0, 12)
          .map(
            (line, index) =>
              `<text x="88" y="${285 + index * 34}" fill="#e2e8f0" font-family="Arial" font-size="22">${line}</text>`
          )
          .join("")}
      </svg>
    `;
    const image = new Image();
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml;charset=utf-8" }));
    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 720;
      const context = canvas.getContext("2d");
      context.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = "techkhor-pc-build.png";
      link.click();
      showMessage("Screenshot downloaded.");
    };
    image.src = url;
  };

  const handleAction = (action) => {
    const handlers = {
      suggest: handleAiSuggest,
      cart: handleAddToCart,
      save: handleSavePc,
      print: handlePrint,
      screenshot: handleScreenshot,
    };

    handlers[action]?.();
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-slate-200">
      <div className="absolute inset-x-0 top-0 h-96 bg-[radial-gradient(circle_at_top_left,_rgba(34,211,238,0.16),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(59,130,246,0.14),_transparent_30%)]" />
      <section className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-glow backdrop-blur md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <img
                src="/main-logo.jpeg"
                alt="TechKhor logo"
                className="h-12 w-auto rounded-xl object-contain"
              />
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">TechKhor</p>
                <h1 className="mt-1 text-2xl font-black tracking-tight text-white sm:text-3xl">PC Builder</h1>
              </div>
            </div>
            <Link
              to="/"
              className="inline-flex w-fit items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 px-5 py-2.5 text-sm font-semibold text-cyan-100 transition hover:border-cyan-300/60 hover:bg-cyan-300 hover:text-slate-950"
            >
              Back to Home
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center sm:grid-cols-5">
            {actionItems.map((item) => (
              <button
                type="button"
                key={item.label}
                onClick={() => handleAction(item.action)}
                className="group flex min-w-[104px] flex-col items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-3 text-slate-300 transition hover:border-cyan-400/30 hover:bg-cyan-400/10 hover:text-white"
              >
                <span className="text-cyan-300 transition group-hover:scale-110">
                  <BuilderIcon type={item.icon} />
                </span>
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            ))}
          </div>
        </div>

        {message ? (
          <div className="mb-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-100">
            {message}
          </div>
        ) : null}

        {suggestionNote ? (
          <div className="mb-6 rounded-3xl border border-cyan-400/20 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/30">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">AI Recommendation</p>
            <p className="mt-2 text-sm leading-6 text-slate-300">{suggestionNote}</p>
          </div>
        ) : null}

        {suggestionOpen ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
            <div className="w-full max-w-4xl rounded-3xl border border-white/10 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/30">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">AI Suggest</p>
                  <h3 className="mt-2 text-2xl font-black text-white">What type of build do you want?</h3>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    Choose a target style and TechKhor will auto-pick compatible parts for that purpose.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSuggestionOpen(false)}
                  className="w-fit rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-rose-300/40 hover:bg-rose-400/10 hover:text-rose-200"
                >
                  Close
                </button>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {buildPresets.map((preset) => {
                  const presetItems = Object.values(preset.components);
                  const presetTotal = presetItems.reduce((sum, item) => sum + Number(item.price || 0), 0);
                  const presetWatt = presetItems.reduce((sum, item) => sum + Number(item.watt || 0), 0);

                  return (
                    <button
                      type="button"
                      key={preset.key}
                      onClick={() => applyBuildPreset(preset)}
                      className="rounded-3xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/10"
                    >
                      <span className="inline-flex rounded-full bg-cyan-400/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-cyan-300">
                        {presetItems.length} parts
                      </span>
                      <h4 className="mt-4 text-lg font-bold text-white">{preset.label}</h4>
                      <p className="mt-2 min-h-[44px] text-sm leading-6 text-slate-400">{preset.tagline}</p>
                      <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold">
                        <span className="rounded-full bg-white px-3 py-1 text-slate-950">{formatCurrency(presetTotal)}</span>
                        <span className="rounded-full border border-white/10 px-3 py-1 text-slate-300">{presetWatt}W</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        ) : null}

        {pickerComponent ? (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 px-4 py-6 backdrop-blur-sm">
            <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-slate-950 shadow-2xl shadow-cyan-950/30">
              <div className="flex flex-col gap-4 border-b border-white/10 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-cyan-300">
                    Select Product
                  </p>
                  <h3 className="mt-2 text-2xl font-black text-white">{pickerComponent.name}</h3>
                  <p className="mt-2 text-sm text-slate-400">
                    Products are loaded from the {pickerComponent.name} category in the database.
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedParts[pickerComponent.name] ? (
                    <button
                      type="button"
                      onClick={removeSelectedComponent}
                      className="rounded-full border border-rose-300/30 bg-rose-400/10 px-4 py-2 text-sm font-semibold text-rose-200 transition hover:bg-rose-400/20"
                    >
                      Remove Selected
                    </button>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => setPickerComponent(null)}
                    className="rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-slate-300 transition hover:border-cyan-300/40 hover:text-white"
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="max-h-[68vh] overflow-y-auto p-6">
                {pickerLoading ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-slate-300">
                    Loading {pickerComponent.name} products...
                  </div>
                ) : null}

                {pickerError ? (
                  <div className="rounded-2xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                    {pickerError}
                  </div>
                ) : null}

                {!pickerLoading && !pickerError && pickerProducts.length === 0 ? (
                  <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-8 text-center text-slate-300">
                    No approved products found in this category. Run the PC Builder seed first.
                  </div>
                ) : null}

                <div className="grid gap-4 md:grid-cols-2">
                  {pickerProducts.map((product) => (
                    <button
                      type="button"
                      key={product.id}
                      onClick={() => selectProductForComponent(product)}
                      className="grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 text-left transition hover:border-cyan-400/40 hover:bg-cyan-400/10 sm:grid-cols-[88px_1fr]"
                    >
                      <div className="flex h-[88px] w-[88px] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-900 text-cyan-300">
                        {product.image ? (
                          <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                          <BuilderIcon type={pickerComponent.icon} className="h-10 w-10" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-base font-bold text-white">{product.name}</h4>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          {product.description}
                        </p>
                        <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
                          <span className="rounded-full bg-white px-3 py-1 text-slate-950">
                            {formatCurrency(product.price)}
                          </span>
                          <span className="rounded-full border border-white/10 px-3 py-1 text-slate-300">
                            Stock {product.stock}
                          </span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : null}

        <div>
          <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300">
                Build Your Own Computer
              </span>
              <h2 className="mt-5 max-w-3xl text-4xl font-black tracking-tight text-white sm:text-5xl">
                Pick every part with a cleaner TechKhor builder.
              </h2>
              <p className="mt-4 max-w-2xl text-slate-400">
                Select core components, add peripherals, and keep your build organized before checkout.
              </p>
              <label className="mt-6 flex w-fit items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-slate-200">
                <input
                  type="checkbox"
                  checked={hideUnconfigured}
                  onChange={(event) => setHideUnconfigured(event.target.checked)}
                  className="h-5 w-5 rounded border-white/20 bg-slate-950 text-cyan-400 focus:ring-cyan-400"
                />
                Hide Unconfigured Components
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="relative flex min-h-[112px] min-w-[210px] flex-col justify-center rounded-3xl border border-dashed border-cyan-400/40 bg-cyan-400/10 px-6">
                <span className="absolute right-4 top-4 rounded-full bg-cyan-300 px-2 py-1 text-xs font-bold text-slate-950">BETA</span>
                <strong className="text-3xl font-black text-white">{totalWatt}W</strong>
                <span className="mt-1 text-sm font-semibold text-slate-300">Estimated Wattage</span>
              </div>
              <div className="flex min-h-[112px] min-w-[210px] flex-col justify-center rounded-3xl border border-white/10 bg-white px-6 text-slate-950">
                <strong className="text-3xl font-black">{formatCurrency(totalPrice)}</strong>
                <span className="mt-1 text-sm font-bold text-slate-600">{selectedCount} of {visibleCount} Items</span>
              </div>
            </div>
          </div>

          <SectionTitle>Core Components</SectionTitle>
          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-slate-950/30 backdrop-blur">
            {coreComponents.map((component) => (
              <ComponentRow
                key={component.name}
                component={component}
                hidden={hideUnconfigured}
                selectedPart={selectedParts[component.name]}
                onChoose={handleChoosePart}
              />
            ))}
          </div>

          <div className="mt-8">
            <SectionTitle>Peripherals & Others</SectionTitle>
            <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-xl shadow-slate-950/30 backdrop-blur">
              {peripheralComponents.map((component) => (
                <ComponentRow
                  key={component.name}
                  component={component}
                  hidden={hideUnconfigured}
                  selectedPart={selectedParts[component.name]}
                  onChoose={handleChoosePart}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
