import React, { useState, useEffect } from "react";
import "../Org.css";
import OrgCarousel from "../Components/OrgCarousel";
import ProgramCard from "../Components/ProgramCard";
import PositionCard from "../Components/PositionsCard";
import CaregiverCarousel from "../Components/CaregiverCarousel";

import {
  getOrganizations,
  getOrg_Programs,
  getOrg_CareGivers,
} from "../assets/apis";

/* Dummy fallback data */
const DUMMY_ORGANIZATIONS = [
  { ssn: "ORG-001", name: "Physio Care Center", imageUrl: null },
  { ssn: "ORG-002", name: "Able Learning Hub", imageUrl: null },
];

const DUMMY_PROGRAMS = [
  {
    id: 11,
    name: "Rehab for Seniors",
    organizationSSN: "ORG-001",
  },
  {
    id: 12,
    name: "Child Motor Skills",
    organizationSSN: "ORG-002",
  },
];

const DUMMY_POSITIONS = [
  {
    positionId: 101,
    positionName: "Physiotherapist",
    organizationSSN: "ORG-001",
  },
  {
    positionId: 102,
    positionName: "Care Assistant",
    organizationSSN: "ORG-002",
  },
];

const DUMMY_CAREGIVERS = [
  {
    id: 201,
    name: "Ahmed Salah",
    organizationSSN: "ORG-001",
  },
  {
    id: 202,
    name: "Nour Ali",
    organizationSSN: "ORG-002",
  },
];

export default function OrganizationsPage() {
  const [organizations, setOrganizations] = useState(DUMMY_ORGANIZATIONS);
  const [programs, setPrograms] = useState([]);
  const [positions, setPositions] = useState([]);
  const [caregivers, setCaregivers] = useState([]);

  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const [selectedOrg, setSelectedOrg] = useState(null);

  /* helper to read SSN from various shapes */
  const readSSN = (o) =>
    o?.ssn ?? o?.OrganizationSSN ?? o?.organizationSSN ?? o?.id ?? null;

  /* =========================
     Load Organizations
     ========================= */
  useEffect(() => {
    let mounted = true;

    const loadOrganizations = async () => {
      setLoadingOrgs(true);

      try {
        const res = await getOrganizations();
        const orgs = res?.data;

        if (mounted && Array.isArray(orgs) && orgs.length) {
          setOrganizations(orgs);

          // Select first org
          const firstSSN = readSSN(orgs[0]);
          if (firstSSN) setSelectedOrg(firstSSN);
        } else {
          setOrganizations(DUMMY_ORGANIZATIONS);
          setSelectedOrg(readSSN(DUMMY_ORGANIZATIONS[0]));
        }
      } catch (err) {
        console.error("getOrganizations failed", err);
        setOrganizations(DUMMY_ORGANIZATIONS);
        setSelectedOrg(readSSN(DUMMY_ORGANIZATIONS[0]));
      } finally {
        if (mounted) setLoadingOrgs(false);
      }
    };

    loadOrganizations();
    return () => (mounted = false);
  }, []);

  /* =========================
     Load Programs / Caregivers / Positions
     ========================= */
  useEffect(() => {
    if (!selectedOrg) return;

    let mounted = true;
    setLoadingData(true);

    const loadData = async () => {
      try {
        const [progRes, carRes] = await Promise.allSettled([
          getOrg_Programs(selectedOrg),
          getOrg_CareGivers(selectedOrg),
        ]);

        // Programs - only show dummy on API failure, not on empty array
        if (progRes.status === "fulfilled" && Array.isArray(progRes.value?.data)) {
          setPrograms(progRes.value.data);
        } else {
          setPrograms(DUMMY_PROGRAMS);
        }

        // Positions (using dummy data for now)
        setPositions(DUMMY_POSITIONS);

        // Caregivers - only show dummy on API failure, not on empty array
        if (carRes.status === "fulfilled" && Array.isArray(carRes.value?.data)) {
          setCaregivers(carRes.value.data);
        } else {
          setCaregivers(DUMMY_CAREGIVERS);
        }
      } catch (err) {
        console.error("Error loading data", err);
        setPrograms(DUMMY_PROGRAMS);
        setPositions(DUMMY_POSITIONS);
        setCaregivers(DUMMY_CAREGIVERS);
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    loadData();
    return () => (mounted = false);
  }, [selectedOrg]);

  const selectedOrgName =
    organizations.find((o) => readSSN(o) === selectedOrg)?.name ?? "";
  

  /* =========================
     Handlers
     ========================= */
  const handleOrgSelect = (ssn) => {
    if (ssn && ssn !== selectedOrg) {
      setPrograms([]);
      setPositions([]);
      setCaregivers([]);
      setSelectedOrg(ssn);
    }
  };

  const handleBook = (program) => {
    alert(`Book: ${program.name}`);
  };

  const handleApply = (pos) => {
    alert(`Apply: ${pos.positionName}`);
  };

  /* =========================
     Render
     ========================= */
  return (
    <div className="page-root">
      <h1 style={{ color: "#27865d", paddingLeft: 22 }}>Organizations</h1>

      <section style={{ marginTop: 18 }}>
        <OrgCarousel
          organizations={organizations}
          onSelect={handleOrgSelect}
          selectedSSN={selectedOrg}
        />
      </section>

      <div className="container-oragnizations">
        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: "#27865d" }}>Programs for {selectedOrgName}</h2>

          {loadingData ? (
            <div>Loading programs...</div>
          ) : programs.length ? (
            programs.map((p) => (
              <ProgramCard
                key={p.id}
                program={p}
                orgName={selectedOrgName}
                onBook={handleBook}
              />
            ))
          ) : (
            <div>No programs for this organization.</div>
          )}
        </section>

        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: "#27865d" }}>Open Positions</h2>

          {loadingData ? (
            <div>Loading positions...</div>
          ) : positions.length ? (
            positions.map((pos) => (
              <PositionCard
                key={pos.positionId}
                pos={pos}
                onApply={handleApply}
              />
            ))
          ) : (
            <div>No open positions.</div>
          )}
        </section>

        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: "#27865d" }}>Care-Takers</h2>

          {loadingData ? (
            <div>Loading caregivers...</div>
          ) : caregivers.length ? (
            <CaregiverCarousel caregivers={caregivers} showCount={1} />
          ) : (
            <div>No caregivers for this organization.</div>
          )}
        </section>
      </div>
    </div>
  );
}