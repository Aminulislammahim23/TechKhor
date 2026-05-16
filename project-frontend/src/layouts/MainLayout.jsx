import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import NavCategoriesBtn from "../components/NavCategoriesBtn";

export default function MainLayout({
  children,
  role = "customer",
  hideNavbar = false,
}) {
  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {!hideNavbar && <Navbar role={role} />}
      <NavCategoriesBtn fillNavbarPosition={hideNavbar} />

      <main className="flex-1 bg-slate-950 px-6 py-6">{children}</main>

      <Footer />
      <Contact />
    </div>
  );
}
