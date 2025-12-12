import React, { useState, useEffect } from 'react';
import '../Org.css';
import OrgCarousel from '../Components/OrgCarousel';
import Header from "../Components/Header";
import ProgramCard from '../Components/ProgramCard';
import PositionCard from '../Components/PositionsCard';
import CaregiverCarousel from '../Components/CaregiverCarousel';
import Footer from '../Components/Footer';

/* Safe dummy data */
const DUMMY_ORGANIZATIONS = [
  { SSN: 'ORG-001', name: 'Physio Care Center', img: null },
  { SSN: 'ORG-002', name: 'Able Learning Hub', img: null },
];

const DUMMY_PROGRAMS = [
  { id: 11, name: 'Rehab for Seniors', startDate: '2025-12-01', endDate: '2026-03-01', price: 150, organizationSSN: 'ORG-001', img: null },
  { id: 12, name: 'Child Motor Skills', startDate: '2025-11-15', endDate: '2026-01-15', price: 100, OrganizationSSN: 'ORG-002', img: null }
];

const DUMMY_POSITIONS = [
  { positionId: 101, positionName: 'Physiotherapist', requirements: 'BSc physiotherapy; 2+ years', OrganizationSSN: 'ORG-001' },
  { positionId: 102, positionName: 'Care Assistant', requirements: 'High school diploma', organizationSSN: 'ORG-002' }
];

const DUMMY_CAREGIVERS = [
  { id: 201, name: 'Ahmed Salah', experience: '3 years', age: 33, OrganizationSSN: 'ORG-001', img: null },
  { id: 202, name: 'Nour Ali', experience: '2 years', age: 28, organizationSSN: 'ORG-002', img: null }
];

export default function OrganizationsPage() {
  const [organizations] = useState(DUMMY_ORGANIZATIONS);
  const [programs] = useState(DUMMY_PROGRAMS);
  const [positions] = useState(DUMMY_POSITIONS);
  const [caregivers] = useState(DUMMY_CAREGIVERS);

  const getOrgSSN = (item) => {
    if (!item) return null;
    return item.SSN ?? item.OrganizationSSN ?? item.organizationSSN ?? item.orgSSN ?? null;
  };

  const [selectedOrg, setSelectedOrg] = useState(() => getOrgSSN(DUMMY_ORGANIZATIONS[0]) || null);

  useEffect(() => {
    if (!selectedOrg && organizations && organizations.length) {
      setSelectedOrg(getOrgSSN(organizations[0]) || null);
    }
  }, [organizations, selectedOrg]);

  const matchesOrg = (item) => {
    const ssn = getOrgSSN(item);
    return ssn && selectedOrg ? ssn === selectedOrg : false;
  };

  const filteredPrograms = Array.isArray(programs) ? programs.filter(matchesOrg) : [];
  const filteredPositions = Array.isArray(positions) ? positions.filter(matchesOrg) : [];
  const filteredCaregivers = Array.isArray(caregivers) ? caregivers.filter(matchesOrg) : [];

  const selectedOrgName = organizations.find(o => getOrgSSN(o) === selectedOrg)?.name ?? '';

  function handleBook(program) {
    console.log('Book', program);
    alert(`Book: ${program.name ?? program.Name ?? 'program'}`);
  }
  function handleApply(pos) {
    console.log('Apply', pos);
    alert(`Apply: ${pos.positionName ?? pos.role ?? 'position'}`);
  }

  return (
    <div className="page-root" >
      {/* render header only if component exists to avoid crash */}
      {typeof Header === 'function' && <Header />}

      <h1 style={{ color: '#168a48',paddingLeft:22 }}>Organizations</h1>

      <section style={{ marginTop: 18 }}>
        <OrgCarousel
          organizations={organizations}
          onSelect={(ssn) => {
            if (typeof ssn === 'string' && ssn.length) setSelectedOrg(ssn);
          }}
          selectedSSN={selectedOrg}
        />
      </section>
    <div className="container-oragnizations">
      <section style={{ marginTop: 30 }}>
        <h2 style={{ color: '#168a48' }}>Programs for {selectedOrgName}</h2>
        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          {filteredPrograms.length ? filteredPrograms.map(p => (
            <ProgramCard key={p.id ?? p.Id ?? JSON.stringify(p)} program={p} orgName={selectedOrgName} onBook={handleBook} />
          )) : <div style={{ color: '#666' }}>No programs for this organization.</div>}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ color: '#168a48' }}>Open Positions</h2>
        <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
          {filteredPositions.length ? filteredPositions.map(pos => (
            <PositionCard key={pos.positionId ?? pos.id ?? JSON.stringify(pos)} pos={pos} onApply={handleApply} />
          )) : <div style={{ color: '#666' }}>No open positions.</div>}
        </div>
      </section>

      <section style={{ marginTop: 28 }}>
        <h2 style={{ color: '#168a48' }}>Care-Takers</h2>
        <div style={{ marginTop: 12 }}>
          {filteredCaregivers.length ? (
            <CaregiverCarousel caregivers={filteredCaregivers} showCount={1} />
          ) : <div style={{ color: '#666' }}>No caregivers for this organization.</div>}
        </div>
      </section>
</div>
      {/* render footer only if component exists */}
      {typeof Footer === 'function' && <Footer />}
    </div>
  );
}
