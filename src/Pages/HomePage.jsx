import { useState, useEffect } from "react";
import Header from "../Components/Header";
import SearchBar from "../Components/search";
import Hero from "../Components/hero";
import Carousel from "../Components/Carousel";
import OrgEmploySection from "../Components/OrgEmploySection";
import PhysiotherapySection from "../Components/PhysiotherapySection";
import Footer from "../Components/Footer";

export default function HomePage() {
  const [search, setSearch] = useState("");

  function handleSearch() {
    console.log("search for", search);
  }

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="site-wrapper">
      <div className="site-content">
        <div className="hero">
          <Hero title="Ready to find" subtitle="your next big step !" />
        </div>

        <section className="container_Programs" style={{ marginTop: 30 }}>
          <section className="carousel">
            <Carousel />
          </section>
        </section>

        <section className="container_employ" style={{ marginTop: 30 }}>
          <OrgEmploySection />
        </section>

        <section className="container_Phy" style={{ marginTop: 30 }}>
          <PhysiotherapySection />
        </section>
      </div>
    </div>
  );
}
