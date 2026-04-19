"use client";

import Image from "next/image";

export default function Home() {
  return (
    <div className="bg-gray-950 text-white min-h-screen">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-gray-900 border-b border-gray-800 sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-cyan-400">TechKhor</h1>
        <div className="hidden md:flex space-x-6">
          <a href="#" className="hover:text-cyan-400 transition-colors">Home</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Products</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Deals</a>
          <a href="#" className="hover:text-cyan-400 transition-colors">Contact</a>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search gadgets..."
            className="px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-cyan-400"
          />
          <button className="bg-cyan-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
            Shop Now
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="grid md:grid-cols-2 gap-10 items-center px-8 py-16 bg-gradient-to-br from-gray-950 to-gray-900">
        <div>
          <h2 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
            Upgrade Your <span className="text-cyan-400">Tech Life</span> ⚡
          </h2>
          <p className="text-gray-400 mb-6 text-lg">
            Discover the latest gadgets, smart accessories, and premium electronics at unbeatable prices. From wireless earbuds to smart watches, find everything you need.
          </p>
          <div className="flex space-x-4">
            <button className="bg-cyan-500 text-black px-6 py-3 rounded-xl font-semibold hover:bg-cyan-400 transition-all transform hover:scale-105">
              Explore Now
            </button>
            <button className="border border-cyan-400 text-cyan-400 px-6 py-3 rounded-xl font-semibold hover:bg-cyan-400 hover:text-black transition-all">
              View Deals
            </button>
          </div>
        </div>

        <div>
          <Image
            src="https://images.unsplash.com/photo-1510557880182-3b3d9e0d54b8"
            alt="Modern gadgets collection"
            width={500}
            height={400}
            className="rounded-2xl shadow-2xl hover:shadow-cyan-400/20 transition-shadow"
          />
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-12 bg-gray-900">
        <h3 className="text-3xl font-semibold mb-12 text-center text-cyan-400">
          Why Choose TechKhor? 🌟
        </h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-400 transition-colors">
            <div className="text-4xl mb-4">🚚</div>
            <h4 className="font-semibold text-xl mb-2">Free Shipping</h4>
            <p className="text-gray-400">Free delivery on orders over $50</p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-400 transition-colors">
            <div className="text-4xl mb-4">🔒</div>
            <h4 className="font-semibold text-xl mb-2">Secure Payment</h4>
            <p className="text-gray-400">100% secure checkout process</p>
          </div>
          <div className="text-center p-6 bg-gray-800 rounded-xl border border-gray-700 hover:border-cyan-400 transition-colors">
            <div className="text-4xl mb-4">🔄</div>
            <h4 className="font-semibold text-xl mb-2">Easy Returns</h4>
            <p className="text-gray-400">30-day return policy</p>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-8 py-12">
        <h3 className="text-3xl font-semibold mb-8 text-center text-cyan-400">
          Shop Categories 🛍️
        </h3>

        <div className="grid md:grid-cols-4 gap-6">
          {[
            { name: "Headphones", emoji: "🎧" },
            { name: "Smart Watches", emoji: "⌚" },
            { name: "Mobile Accessories", emoji: "📱" },
            { name: "Gaming Gear", emoji: "🎮" }
          ].map((cat) => (
            <div key={cat.name} className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-cyan-400 text-center transition-all hover:scale-105 cursor-pointer">
              <div className="text-4xl mb-2">{cat.emoji}</div>
              <h4 className="font-semibold text-lg">{cat.name}</h4>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-8 py-12 bg-gray-900">
        <h3 className="text-3xl font-semibold mb-8 text-center text-cyan-400">
          Trending Products 🔥
        </h3>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { name: "Wireless Headphones", price: "$59", image: "https://images.unsplash.com/photo-1580910051074-3eb694886505" },
            { name: "Smart Watch Pro", price: "$199", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30" },
            { name: "Gaming Mouse", price: "$39", image: "https://images.unsplash.com/photo-1527814050087-3793815479db" }
          ].map((product, index) => (
            <div key={index} className="border border-gray-800 rounded-xl p-4 hover:border-cyan-400 transition-all hover:scale-105 bg-gray-800">
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="rounded-lg mb-4"
              />
              <h4 className="mt-4 font-semibold text-lg">{product.name}</h4>
              <p className="text-cyan-400 font-bold text-xl">{product.price}</p>
              <button className="mt-3 w-full bg-cyan-500 text-black py-2 rounded-lg font-semibold hover:bg-cyan-400 transition-colors">
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-8 py-12">
        <h3 className="text-3xl font-semibold mb-8 text-center text-cyan-400">
          What Our Customers Say 💬
        </h3>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 mb-4">&quot;Amazing quality gadgets at great prices. The wireless headphones are fantastic!&quot;</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold mr-3">A</div>
              <div>
                <p className="font-semibold">Alex Johnson</p>
                <p className="text-gray-500 text-sm">Verified Buyer</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
            <p className="text-gray-400 mb-4">&quot;Fast shipping and excellent customer service. Will definitely shop again.&quot;</p>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-black font-bold mr-3">S</div>
              <div>
                <p className="font-semibold">Sarah Chen</p>
                <p className="text-gray-500 text-sm">Verified Buyer</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Promo */}
      <section className="px-8 py-16 text-center bg-gradient-to-r from-cyan-500 to-blue-600 text-black">
        <h2 className="text-4xl font-bold mb-4">
          Mega Tech Sale 🚀
        </h2>
        <p className="mb-6 text-lg">
          Up to 50% OFF on selected gadgets. Limited time offer!
        </p>
        <button className="bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
          Shop Deals
        </button>
      </section>

      {/* Newsletter */}
      <section className="px-8 py-12 bg-gray-900">
        <div className="max-w-md mx-auto text-center">
          <h3 className="text-2xl font-semibold mb-4 text-cyan-400">Stay Updated 📧</h3>
          <p className="text-gray-400 mb-6">Subscribe to get the latest deals and new product launches.</p>
          <div className="flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-cyan-400"
            />
            <button className="bg-cyan-500 text-black px-6 py-2 rounded-r-lg font-semibold hover:bg-cyan-400 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black px-8 py-10 text-gray-400">
        <div className="grid md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xl font-bold text-cyan-400 mb-3">TechKhor</h3>
            <p>Your ultimate destination for electronic accessories and gadgets.</p>
          </div>

          <div>
            <h4 className="text-white mb-2">Quick Links</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Home</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Products</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Deals</a></li>
              <li><a href="#" className="hover:text-cyan-400 transition-colors">Contact</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-2">Categories</h4>
            <ul className="space-y-1">
              <li>Headphones</li>
              <li>Smart Watches</li>
              <li>Mobile Accessories</li>
              <li>Gaming Gear</li>
            </ul>
          </div>

          <div>
            <h4 className="text-white mb-2">Contact</h4>
            <p>Email: support@techkhor.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>
        </div>

        <p className="text-center mt-6 text-gray-600">
          © 2026 TechKhor. All rights reserved.
        </p>
      </footer>

    </div>
  );
}