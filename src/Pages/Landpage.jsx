// Landpage.jsx
import React, { useState, useEffect, useRef } from "react";
import { getAuthState } from "../context/AuthState";
import "./Landpage.css";

// --- If you still have Swiper imports, you can remove or comment them out ---
// import { Swiper, SwiperSlide } from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';
// import { Navigation, Autoplay } from 'swiper';

import pic from "../assets/unsplash_Qbp4GeJib5A.png";

import Programfind from "../Components/program_find";
import Physicenterfind from "../Components/physiocenter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSitemap,
  faCoins,
  faHandsHoldingChild,
  faClipboardUser,
  faHandshakeAngle,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import AuthForm from "../Components/Login";
import { Link } from "react-router-dom";

/** SimpleCarousel: no external deps, autoplay + arrows + dots + basic swipe */
function SimpleCarousel({ images = [], autoDelay = 3000 }) {
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    startAuto();
    return () => stopAuto();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  const startAuto = () => {
    stopAuto();
    timeoutRef.current = setTimeout(() => {
      setIndex((i) => (i + 1) % images.length);
    }, autoDelay);
  };

  const stopAuto = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);
  const goTo = (i) => setIndex(i);

  // basic touch handling for swipe
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let startX = 0;
    let moved = false;

    const onTouchStart = (e) => {
      stopAuto();
      startX = e.touches[0].clientX;
      moved = false;
    };
    const onTouchMove = (e) => {
      const dx = e.touches[0].clientX - startX;
      if (Math.abs(dx) > 20) moved = true;
    };
    const onTouchEnd = (e) => {
      if (!moved) {
        startAuto();
        return;
      }
      const endX = (e.changedTouches && e.changedTouches[0].clientX) || 0;
      const dx = endX - startX;
      if (dx > 40) prev();
      else if (dx < -40) next();
      startAuto();
    };

    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: true });
    el.addEventListener("touchend", onTouchEnd);

    return () => {
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
      el.removeEventListener("touchend", onTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images]);

  if (!images || images.length === 0) return null;

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  return (
    <div
      className="simple-carousel"
      ref={containerRef}
      onMouseEnter={stopAuto}
      onMouseLeave={startAuto}
    >
      <div
        className="slides"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {images.map((src, i) => (
          <div className="slide" key={i}>
            <img src={src} alt={`slide-${i}`} />
          </div>
        ))}
      </div>

      <button
        className="carousel-arrow prev"
        onClick={prev}
        aria-label="Previous"
      >
        ‹
      </button>
      <button className="carousel-arrow next" onClick={next} aria-label="Next">
        ›
      </button>

      <div className="carousel-dots">
        {images.map((_, i) => (
          <button
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => goTo(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Landpage() {
  const [{ isLoggedIn }, setLocalAuth] = useState(getAuthState());
  useEffect(() => {
    const handler = () => setLocalAuth(getAuthState());
    window.addEventListener("auth-changed", handler);
    return () => window.removeEventListener("auth-changed", handler);
  }, []);
  return (
    <div className="landpage-container">
      <p className="paragraph">
        Schedule your next program or physiotherapy session.
        <br />
        Discover local organizations and physiotherapy centers near you.
      </p>

      <div className="block" style={{ marginBottom: "16px" }}>
        <p style={{ fontSize: "20px", marginTop: "8px" }}>Top Searches</p>

        <div className="search-grid">
          <Link to="/all-programs" className="search-item">
            <FontAwesomeIcon icon={faSitemap} className="pictures" />
            <p className="label">Programs</p>
          </Link>

          <Link to="/all-therapies" className="search-item">
            <FontAwesomeIcon icon={faHandsHoldingChild} className="pictures" />
            <p className="label">Therapies</p>
          </Link>

          <Link to="/all-employments" className="search-item">
            <FontAwesomeIcon icon={faClipboardUser} className="pictures" />
            <p className="label">Employment</p>
          </Link>

          <Link to="/organizations" className="search-item">
            <FontAwesomeIcon icon={faBuilding} className="pictures" />
            <p className="label">Organizations</p>
          </Link>
        </div>
      </div>

      <Programfind />
      <br />
      <br />
      <br />

      {/* SimpleCarousel usage */}
      <SimpleCarousel images={[pic, pic, pic]} autoDelay={3000} />

      <p className="paragraph2">
        {" "}
        Follow up by professional Care Takers whom are well trained to meet your
        standards{" "}
      </p>
      <Physicenterfind />
      {!isLoggedIn && (
        <div id="auth-form">
          <AuthForm />
        </div>
      )}
    </div>
  );
}
