import React, { useState, useEffect } from "react";
import "../Org.css";
import Header from "../Components/Header";
import TherapyCenterCarousel from "../Components/TherapyCenterCarousel";
import ProgramCard from "../Components/ProgramCard";
// import ProgramList from '../Components/ProgramList';
import Footer from "../Components/Footer";
import { getCenters, getcenter_Therapies } from "../assets/apis";

/* Safe dummy data */
const DUMMY_Centers = [
  { ssn: "CEN-001", name: "Physio Care Center", imageUrl: null },
  { ssn: "CEN-002", name: "Able Learning Hub", imageUrl: null },
  { ssn: "CEN-003", name: "Sunrise Rehab", imageUrl: null },
  { ssn: "CEN-004", name: "Hope Centre", imageUrl: null },
];

const DUMMY_Therapies = [
  {
    id: 11,
    name: "Rehab for Seniors",
    date: "2025-12-01",
    time: "10 am",
    pricePerHour: 150,
    centerID: "CEN-001",
    imageUrl: null,
  },
  {
    id: 12,
    name: "Child Motor Skills",
    date: "2025-11-15",
    time: "10:30 am",
    pricePerHour: 100,
    centerID: "CEN-002",
    imageUrl: null,
  },
  {
    id: 13,
    name: "Balance & Gait",
    date: "2025-10-01",
    time: "8 am",
    pricePerHour: 130,
    centerID: "CEN-003",
    imageUrl: null,
  },
  {
    id: 14,
    name: "Rehab for Seniors (Evening)",
    date: "2025-12-01",
    time: "5 pm",
    pricePerHour: 150,
    centerID: "CEN-001",
    imageUrl: null,
  },
  {
    id: 15,
    name: "Child Motor Skills (Afternoon)",
    date: "2025-11-15",
    time: "2 pm",
    pricePerHour: 100,
    centerID: "CEN-001",
    imageUrl: null,
  },
  {
    id: 16,
    name: "Balance & Gait (Late)",
    date: "2025-10-01",
    time: "4 pm",
    pricePerHour: 130,
    centerID: "CEN-002",
    imageUrl: null,
  },
];

export default function TherapyCenters() {
  // state: therapy centers and programs (start with dummy data for immediate UI)
  const [therapyCenters, setTherapyCenters] = useState(DUMMY_Centers);
  const [programs, setPrograms] = useState(DUMMY_Therapies);
  const [loadingCenters, setLoadingCenters] = useState(false);
  const [loadingPrograms, setLoadingPrograms] = useState(false);
  const [errorCenters, setErrorCenters] = useState(false);
  const [errorPrograms, setErrorPrograms] = useState(false);

  // helper to extract center SSN from multiple possible field names
  const getCenterSSN = (item) => {
    if (!item) return null;
    return (
      item.ssn ??
      item.CenterSSN ??
      item.centerSSN ??
      item.center?.ssn ??
      item.organization?.ssn ??
      null
    );
  };

  // selected center SSN (initialize to first center)
  const [selectedCenter, setSelectedCenter] = useState(
    () => getCenterSSN(DUMMY_Centers[0]) || null
  );

  // ensure selectedCenter gets set when therapyCenters change
  useEffect(() => {
    if (
      !selectedCenter &&
      Array.isArray(therapyCenters) &&
      therapyCenters.length
    ) {
      setSelectedCenter(getCenterSSN(therapyCenters[0]) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [therapyCenters]);

  // load centers from API on mount (fall back to dummy centers on error)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingCenters(true);
      setErrorCenters(false);
      try {
        const res = await getCenters();
        if (
          mounted &&
          res?.data &&
          Array.isArray(res.data) &&
          res.data.length
        ) {
          setTherapyCenters(res.data);
          const first = getCenterSSN(res.data[0]);
          if (first) setSelectedCenter(first);
        } else {
          // keep dummy centers
          setTherapyCenters(DUMMY_Centers);
        }
      } catch (err) {
        console.error("getCenters failed, using dummy centers", err);
        setTherapyCenters(DUMMY_Centers);
        setErrorCenters(true);
      } finally {
        if (mounted) setLoadingCenters(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);

  // load therapies for selected center
  useEffect(() => {
    if (!selectedCenter) return;
    let mounted = true;
    const load = async () => {
      setLoadingPrograms(true);
      setErrorPrograms(false);
      try {
        const res = await getcenter_Therapies(selectedCenter);
        if (
          mounted &&
          res?.data &&
          Array.isArray(res.data) &&
          res.data.length
        ) {
          setPrograms(res.data);
        } else {
          // keep current programs (likely dummy)
          if (!programs || programs.length === 0) setPrograms(DUMMY_Therapies);
        }
      } catch (err) {
        console.error("getcenter_Therapies failed, using dummy therapies", err);
        if (!programs || programs.length === 0) setPrograms(DUMMY_Therapies);
        setErrorPrograms(true);
      } finally {
        if (mounted) setLoadingPrograms(false);
      }
    };
    load();
    return () => (mounted = false);
  }, [selectedCenter]);

  // normalize programs so ProgramCard receives expected fields:
  // - centerSSN (for filtering)
  // - startDate (from Date + Time if present)
  // - endDate (left null unless provided)
  const normalizedPrograms = Array.isArray(programs)
    ? programs.map((p) => {
        const centerSSN =
          p.centerID ??
          p.CenterSSN ??
          p.Center?.SSN ??
          p.organization?.SSN ??
          p.organizationSSN ??
          p.SSN ??
          null;
        const date = p.startDate ?? p.date ?? null;
        const time = p.duration ?? p.time ?? null;
        const startDate = date ? (time ? `${date} • ${time}` : date) : null;
        const endDate = p.endDate ?? p.EndDate ?? null;
        return {
          ...p,
          centerSSN,
          startDate,
          endDate,
          price: p.price ?? p.Price ?? null,
          img: p.imageUrl ?? p.image ?? null,
        };
      })
    : [];

  // filter programs by selected center
  const filteredPrograms = normalizedPrograms.filter(
    (p) => p.centerID === selectedCenter
  );

  const selectedCenterName =
    therapyCenters.find((c) => getCenterSSN(c) === selectedCenter)?.name ?? "";

  // handler for booking (placeholder)
  function handleBook(program) {
    console.log("Book", program);
    alert(`Book: ${program.name ?? "program"}`);
  }

  return (
    <div className="page-root">
      <h1 style={{ color: "#27865d", paddingLeft: 22 }}>Therapy Centers</h1>

      <section style={{ marginTop: 18 }}>
        <TherapyCenterCarousel
          TherapyCenters={therapyCenters}
          onSelect={(ssn) => {
            if (typeof ssn === "string" && ssn.length) setSelectedCenter(ssn);
          }}
          selectedSSN={selectedCenter}
        />
      </section>
      <div className="container" style={{ padding: 22 }}>
        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: "#27865d" }}>
            Programs at {selectedCenterName || "selected center"}
          </h2>

          <div style={{ marginTop: 12 }}>
            {filteredPrograms.length ? (
              // If you add a ProgramList later, uncomment its import and this branch will use it.
              typeof ProgramList === "function" ? (
                <ProgramList
                  programs={filteredPrograms}
                  onBook={handleBook}
                  centerName={selectedCenterName}
                />
              ) : (
                <div style={{ display: "grid", gap: 12 }}>
                  {filteredPrograms.map((p) => (
                    <ProgramCard
                      key={p.id ?? p.Id ?? JSON.stringify(p)}
                      program={p}
                      orgName={selectedCenterName}
                      onBook={handleBook}
                    />
                  ))}
                </div>
              )
            ) : (
              <div style={{ color: "#666" }}>
                No programs for this therapy center.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}