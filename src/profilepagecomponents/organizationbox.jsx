import React, { useEffect, useState, useRef } from "react";
import { fetchAvailablePrograms, fetchFinancialAid } from "../assets/api";
import "../profilepagecomponents/organization.css";

export default function ProgramsFA() {

  const dummyPrograms = [
    { id: 1, name: "Rehabilitation Program", status: "done, booked, going",startDate: '2025-12-01', endDate: '2026-03-01', price: 150},
    { id: 2, name: "Strength Training Program", status: "booked",startDate: '2025-12-01', endDate: '2026-03-01', price: 150 },
    { id: 3, name: "Balance Recovery Program", status: "going" ,startDate: '2025-12-01', endDate: '2026-03-01', price: 150},
     { id: 4, name: "Rehabilitation Program", status: "done, booked, going",startDate: '2025-12-01', endDate: '2026-03-01', price: 150 },
    { id: 5, name: "Strength Training Program", status: "booked",startDate: '2025-12-01', endDate: '2026-03-01', price: 150 },
    { id: 6, name: "Balance Recovery Program", status: "going" ,startDate: '2025-12-01', endDate: '2026-03-01', price: 150},
     { id: 7, name: "Rehabilitation Program", status: "done, booked, going",startDate: '2025-12-01', endDate: '2026-03-01', price: 150 },
    { id: 8, name: "Strength Training Program", status: "booked" ,startDate: '2025-12-01', endDate: '2026-03-01', price: 150},
    { id: 9, name: "Balance Recovery Program", status: "going",startDate: '2025-12-01', endDate: '2026-03-01', price: 150 },
  ];

  const dummyFinancialAids = [
    { id: 1, sessionName: "Financial Aid Session A", location: "Online" },
    { id: 2, sessionName: "Financial Aid Session B", location: "New York Center" },
  ];

  
  const [programs, setPrograms] = useState(dummyPrograms);
  const [finAid, setFinAid] = useState(dummyFinancialAids);

  const [loadingPrograms, setLoadingPrograms] = useState(true);
  const [loadingFinAid, setLoadingFinAid] = useState(true);
  const [errorPrograms, setErrorPrograms] = useState(false);
  const [errorFinAid, setErrorFinAid] = useState(false);
  const progTrackRef = useRef(null);
  const faTrackRef = useRef(null);

  const fmtDate = (d) => {
    if (!d) return null;
    try {
      const date = new Date(d);
      return date.toLocaleDateString();
    } catch (e) {
      return d;
    }
  };

  // Keep tracks centered when their content does not overflow
  useEffect(() => {
    const track = progTrackRef.current;
    if (!track) return;

    const update = () => {
      // Measure after layout to avoid transient values
      requestAnimationFrame(() => {
        // increase tolerance to handle scrollbars, rounding and small paddings
        const tolerant = track.clientWidth + 20;
        const shouldCenter = Math.ceil(track.scrollWidth) <= Math.floor(tolerant);
        const wrapper = track.parentElement;
        if (shouldCenter) {
          wrapper?.classList.add("centered");
        } else {
          wrapper?.classList.remove("centered");
        }
      });
    };

    // initial check
    update();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(track);
    }
    window.addEventListener("resize", update);

    // also re-check after images/fonts load or when programs change
    const tick = setTimeout(update, 50);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", update);
      clearTimeout(tick);
    };
  }, [programs]);

  useEffect(() => {
    const track = faTrackRef.current;
    if (!track) return;

    const update = () => {
      requestAnimationFrame(() => {
        const tolerant = track.clientWidth + 20;
        const shouldCenter = Math.ceil(track.scrollWidth) <= Math.floor(tolerant);
        const wrapper = track.parentElement;
        if (shouldCenter) {
          wrapper?.classList.add("centered");
        } else {
          wrapper?.classList.remove("centered");
        }
      });
    };

    update();

    let ro;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(update);
      ro.observe(track);
    }
    window.addEventListener("resize", update);
    const tick = setTimeout(update, 50);

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("resize", update);
      clearTimeout(tick);
    };
  }, [finAid]);

  useEffect(() => {
    let mounted = true;

    const loadPrograms = async () => {
      try {
        setLoadingPrograms(true);
        const resProg = await fetchAvailablePrograms();
        if (mounted && resProg.data?.length) {
          setPrograms(resProg.data); 
        }
      } catch (err) {
        console.log("Programs API not ready — using dummy data");
        if (mounted) {
          setErrorPrograms(false);
        }
      } finally {
        if (mounted) {
          setLoadingPrograms(false);
        }
      }
    };

    const loadFinAid = async () => {
      try {
        setLoadingFinAid(true);
        const resFA = await fetchFinancialAid();
        if (mounted && resFA.data?.length) {
          setFinAid(resFA.data);
        }
      } catch (err) {
        console.log("Financial Aid API not ready — using dummy data");
        if (mounted) {
          setErrorFinAid(false);
        }
      } finally {
        if (mounted) {
          setLoadingFinAid(false);
        }
      }
    };

    loadPrograms();
    loadFinAid();
    return () => (mounted = false);
  }, []);

  return (
  <div className="programs-container">

    
    <section className="section-box">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>Available Programs</h3>
        <button style={{ background: "#d8ecfb", borderRadius: 20,border:"none", padding: "8px 12px", display: "flex", alignItems: "center", gap: "5px" }}>
          View More
          <i className="arrow fa-solid fa-arrow-right"></i>
        </button>
      </div>
      {loadingPrograms ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading programs...</p>
        </div>
      ) : errorPrograms ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
          <p>Error loading programs.</p>
        </div>
      ) : (
        <div className="slider-wrapper">
          <button
            aria-label="previous programs"
            className="slider-btn left"
            onClick={() => {
              if (progTrackRef.current) {
                const amount = progTrackRef.current.clientWidth * 0.8;
                progTrackRef.current.scrollBy({ left: -amount, behavior: "smooth" });
              }
            }}
          >
            ‹
          </button>
        <div class="cards-wrapper"> 
          <div ref={progTrackRef} className="cards-track" role="list">
            {programs.map((p) => (
              <div key={p.id} className="program-card" role="listitem">
                <h4>{p.name}</h4>
                <p>{p.status}</p>
                {(p.price || p.startDate || p.endDate) && (
                  <div className="program-meta">
                    {p.price != null && (
                      <div className="program-price">Price: ${p.price}</div>
                    )}
                    {(p.startDate || p.endDate) && (
                      <div className="program-dates">
                        {p.startDate && <span>Start: {fmtDate(p.startDate)}</span>}
                        {p.endDate && <span style={{ marginLeft: 8 }}>End: {fmtDate(p.endDate)}</span>}
                      </div>
                    )}
                  </div>
                )}
                <button className="view-btn">details</button>
              </div>
            ))}
          </div>
        </div>  
          <button
            aria-label="next programs"
            className="slider-btn right"
            onClick={() => {
              if (progTrackRef.current) {
                const amount = progTrackRef.current.clientWidth * 0.8;
                progTrackRef.current.scrollBy({ left: amount, behavior: "smooth" });
              }
            }}
          >
            ›
          </button>
        </div>
      )}
    </section>

 
    <section className="section-box">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3>FAS - if available</h3>
        <button style={{ background: "#d8ecfb", borderRadius: 20,border:"none", padding: "8px 12px", display: "flex", alignItems: "center", gap: "5px" }}>
          View More
          <i className="arrow fa-solid fa-arrow-right"></i>
        </button>
      </div>
      {loadingFinAid ? (
        <div style={{ padding: "20px", textAlign: "center" }}>
          <p>Loading financial aid...</p>
        </div>
      ) : errorFinAid ? (
        <div style={{ padding: "20px", textAlign: "center", color: "#d32f2f" }}>
          <p>Error loading financial aid.</p>
        </div>
      ) : (
        <div className="slider-wrapper">
          <button
            aria-label="previous financial aids"
            className="slider-btn left"
            onClick={() => {
              if (faTrackRef.current) {
                const amount = faTrackRef.current.clientWidth * 0.8;
                faTrackRef.current.scrollBy({ left: -amount, behavior: "smooth" });
              }
            }}
          >
            ‹
          </button>
        <div class="cards-wrapper">  
          <div ref={faTrackRef} className="cards-track" role="list">
            {finAid.map((fa) => (
              <div key={fa.id} className="program-card" role="listitem">
                <h4>{fa.sessionName}</h4>
                <p>{fa.location}</p>
                <button className="view-btn">details</button>
              </div>
            ))}
          </div>
          <button
            aria-label="next financial aids"
            className="slider-btn right"
            onClick={() => {
              if (faTrackRef.current) {
                const amount = faTrackRef.current.clientWidth * 0.8;
                faTrackRef.current.scrollBy({ left: amount, behavior: "smooth" });
              }
            }}
          >
            ›
          </button>
        </div>
      </div>
      )}
    </section>

  </div>
);

}