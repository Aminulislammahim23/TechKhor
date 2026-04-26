import 'reflect-metadata';
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Category } from './categories/entities/category.entity';
import { Product } from './products/entities/product.entity';
import { User, Role } from './users/entities/user.entity';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item.entity';
import { Payment } from './payments/entities/payment.entity';
import { Cart } from './cart/entities/cart.entity';
import { CartItem } from './cart/entities/cart-item.entity';
import { SellerEarning } from './earnings/entities/seller-earning.entity';

loadEnv({ path: resolve(__dirname, '..', '.env') });

const categories = [
  'CPU',
  'CPU Cooler',
  'Motherboard',
  'RAM',
  'Storage',
  'Graphics Card',
  'Power Supply',
  'Casing',
  'Monitor',
  'Casing Cooler',
  'Keyboard',
  'Mouse',
  'Speaker & Home Theater',
  'Headphone',
  'Wifi Adapter / LAN Card',
  'Anti Virus',
];

const products = [
  ['CPU', 'Intel Core i3-12100', 12500, 18, 'Budget quad-core processor for office and study builds'],
  ['CPU', 'AMD Ryzen 5 7600', 23500, 14, 'Fast 6-core AM5 processor for gaming and multitasking'],
  ['CPU', 'AMD Ryzen 9 7900X', 52000, 6, 'High-end workstation processor for rendering and production'],
  ['CPU Cooler', 'DeepCool AG400 ARGB', 3200, 22, 'Air cooler with ARGB lighting and quiet operation'],
  ['CPU Cooler', '360mm Liquid CPU Cooler', 14500, 8, 'Liquid cooling solution for high-wattage processors'],
  ['Motherboard', 'H610M DDR4 Motherboard', 9200, 15, 'Entry motherboard for 12th and 13th gen Intel CPUs'],
  ['Motherboard', 'MSI B650M Gaming WiFi', 21500, 11, 'AM5 gaming motherboard with WiFi support'],
  ['Motherboard', 'X670 Creator Motherboard', 48500, 5, 'Creator-grade AM5 motherboard for workstation builds'],
  ['RAM', '8GB DDR4 3200MHz RAM', 2600, 30, 'Affordable memory for budget PCs'],
  ['RAM', 'Corsair Vengeance 16GB DDR5', 7200, 20, 'Fast DDR5 memory for modern builds'],
  ['RAM', '64GB DDR5 6000MHz RAM', 28500, 8, 'High-capacity memory for professional workloads'],
  ['Storage', '512GB NVMe SSD', 4200, 25, 'Fast boot drive for everyday systems'],
  ['Storage', 'Samsung 980 1TB NVMe SSD', 9800, 18, 'Reliable 1TB NVMe storage'],
  ['Storage', '2TB Gen4 NVMe SSD', 24500, 9, 'Large high-speed storage for creators'],
  ['Graphics Card', 'GeForce GTX 1650 4GB', 24500, 10, 'Entry graphics card for esports and display output'],
  ['Graphics Card', 'GeForce RTX 4060 8GB', 43500, 8, 'Efficient 1080p gaming graphics card'],
  ['Graphics Card', 'GeForce RTX 4070 Super 12GB', 89000, 4, 'High-performance graphics card for gaming and content work'],
  ['Power Supply', '450W 80+ Power Supply', 3600, 18, 'Reliable PSU for budget systems'],
  ['Power Supply', 'Corsair CX650 650W Bronze', 7800, 16, '650W PSU for gaming builds'],
  ['Power Supply', '850W 80+ Gold PSU', 16500, 7, 'Gold-rated PSU for high-end components'],
  ['Casing', 'Compact Airflow Casing', 3200, 20, 'Compact case with basic airflow'],
  ['Casing', 'Montech Air 100 ARGB', 6500, 12, 'ARGB case with strong airflow'],
  ['Casing', 'Premium E-ATX Airflow Case', 17500, 5, 'Large premium case for workstation builds'],
  ['Monitor', '22-inch IPS Monitor', 10500, 13, 'Sharp IPS display for office tasks'],
  ['Monitor', '24-inch 165Hz IPS Monitor', 22500, 9, 'Fast refresh-rate gaming monitor'],
  ['Monitor', '27-inch QHD Creator Monitor', 42000, 5, 'QHD color-focused monitor for creators'],
  ['Casing Cooler', '120mm ARGB Case Fan', 900, 40, 'ARGB airflow fan for case cooling'],
  ['Casing Cooler', '3-Pack PWM Case Fan Kit', 2600, 18, 'PWM fan kit for balanced airflow'],
  ['Keyboard', 'Basic Keyboard', 700, 35, 'Simple keyboard for daily typing'],
  ['Keyboard', 'Mechanical RGB Keyboard', 3500, 18, 'Mechanical keyboard for gaming and productivity'],
  ['Mouse', 'Basic Optical Mouse', 450, 45, 'Reliable wired mouse'],
  ['Mouse', 'Gaming Mouse 8000 DPI', 1800, 24, 'Precision mouse for gaming'],
  ['Speaker & Home Theater', '2.1 Channel Speaker Set', 5200, 12, 'Multimedia speaker system'],
  ['Speaker & Home Theater', 'Bluetooth Soundbar', 8900, 8, 'Compact soundbar for desk entertainment'],
  ['Headphone', 'USB Gaming Headset', 4200, 14, 'Comfortable gaming headset with mic'],
  ['Headphone', 'Wireless ANC Headphone', 9500, 7, 'Wireless headphone with active noise cancellation'],
  ['Wifi Adapter / LAN Card', 'WiFi 6 PCIe Adapter', 2800, 20, 'PCIe wireless adapter with Bluetooth'],
  ['Wifi Adapter / LAN Card', 'Gigabit LAN Card', 1200, 18, 'Wired network expansion card'],
  ['Anti Virus', '1 Year Security License', 1200, 50, 'One-year endpoint security license'],
  ['Anti Virus', '3 Device Internet Security Pack', 2600, 20, 'Security license for multiple devices'],
];

const categoryImages: Record<string, string> = {
  CPU: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
  'CPU Cooler': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
  Motherboard: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  RAM: 'https://images.unsplash.com/photo-1562976540-1502c2145186?auto=format&fit=crop&w=600&q=80',
  Storage: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=600&q=80',
  'Graphics Card': 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&w=600&q=80',
  'Power Supply': 'https://images.unsplash.com/photo-1587202372616-b43abea06c2a?auto=format&fit=crop&w=600&q=80',
  Casing: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&w=600&q=80',
  Monitor: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80',
  'Casing Cooler': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=600&q=80',
  Keyboard: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=600&q=80',
  Mouse: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&w=600&q=80',
  'Speaker & Home Theater': 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=600&q=80',
  Headphone: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  'Wifi Adapter / LAN Card': 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=600&q=80',
  'Anti Virus': 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80',
};

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || '552299',
  database: process.env.DB_DATABASE || 'techkhor_db',
  entities: [Category, Product, User, Order, OrderItem, Payment, Cart, CartItem, SellerEarning],
  synchronize: true,
});

async function seed() {
  await dataSource.initialize();

  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);
  const userRepo = dataSource.getRepository(User);

  let seller = await userRepo.findOne({
    where: { email: 'pc-builder@techkhor.local' },
  });

  if (!seller) {
    seller = userRepo.create({
      fullName: 'TechKhor PC Builder',
      email: 'pc-builder@techkhor.local',
      phone: null,
      password: await bcrypt.hash(`pc-builder-${Date.now()}`, 10),
      role: Role.SELLER,
    });
    seller = await userRepo.save(seller);
  }

  const categoryMap = new Map<string, Category>();
  for (const name of categories) {
    let category = await categoryRepo.findOne({ where: { name } });
    if (!category) {
      category = await categoryRepo.save(categoryRepo.create({ name }));
    }
    categoryMap.set(name, category);
  }

  for (const [categoryName, name, price, stock, description] of products) {
    const category = categoryMap.get(String(categoryName));
    if (!category) continue;

    let product = await productRepo.findOne({
      where: { name: String(name) },
      relations: ['category', 'seller'],
    });

    if (!product) {
      product = productRepo.create({
        name: String(name),
        description: String(description),
        price: Number(price),
        stock: Number(stock),
        image: categoryImages[String(categoryName)] || null,
        rating: 4,
        tags: `${categoryName}, pc builder, component`,
        isApproved: true,
        seller,
        category,
      });
    } else {
      product.description = String(description);
      product.price = Number(price);
      product.stock = Number(stock);
      product.image = categoryImages[String(categoryName)] || product.image;
      product.tags = `${categoryName}, pc builder, component`;
      product.isApproved = true;
      product.seller = seller;
      product.category = category;
    }

    await productRepo.save(product);
  }

  await dataSource.destroy();
  console.log(`Seeded ${categories.length} PC Builder categories and ${products.length} products.`);
}

seed().catch(async (error) => {
  console.error(error);
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
  process.exit(1);
});
