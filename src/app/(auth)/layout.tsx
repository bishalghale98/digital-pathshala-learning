import FooterNavBar from "@/components/layouts/footer-nav-bar";
import NavBar from "@/components/layouts/nav-bar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>
    <NavBar />
    <main className="md:mb-0 mb-10">
      {children}
    </main>
    <FooterNavBar />
  </section>;
}
