import Header from "../../components/Header";
import Hero from "../../components/Hero";
import Features from "../../components/Feature";
import Footer from "../../components/Footer";

export default function HomePage() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Features />
      </main>
      <Footer />
    </>
  );
}
