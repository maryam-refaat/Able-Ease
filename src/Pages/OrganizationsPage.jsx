import React, { useState, useEffect } from 'react';
import '../Org.css';
import OrgCarousel from '../Components/OrgCarousel';
import Header from "../Components/Header";
import ProgramCard from '../Components/ProgramCard';
import PositionCard from '../Components/PositionsCard';
import CaregiverCarousel from '../Components/CaregiverCarousel';
import Footer from '../Components/Footer';


import { getOrganizations, getOrg_Programs, getOrg_CareGivers, getEmployments } from "../assets/apis";


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
  const [organizations, setOrganizations] = useState(DUMMY_ORGANIZATIONS);
  const [programs, setPrograms] = useState([]);
  const [positions, setPositions] = useState([]);
  const [caregivers, setCaregivers] = useState([]);

  const [loadingOrgs, setLoadingOrgs] = useState(false);
  const [loadingData, setLoadingData] = useState(false);
  const [errorOrgs, setErrorOrgs] = useState(false);
  const [errorData, setErrorData] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState(null);
  const [selectedOrgName, setSelectedOrgName] = useState('');



  

  // helper to read SSN from various shapes
  const readSSN = (o) => o?.SSN ?? o?.OrganizationSSN ?? o?.organizationSSN ?? o?.id ?? null;

  // Load organizations on mount
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingOrgs(true);
      setErrorOrgs(false);
      try {
        const res = await getOrganizations();
        if (mounted && res?.data && Array.isArray(res.data) && res.data.length) {
          setOrganizations(res.data);
          // pick first org as selected if none selected
          const firstSSN = readSSN(res.data[0]);
          const firstName = res.data[0]?.name ?? res.data[0]?.Name ?? '';
          if (firstSSN) {
            setSelectedOrg(firstSSN);
            setSelectedOrgName(firstName);
          }
        } else {
          // fallback to dummy and pick first dummy
          setOrganizations(DUMMY_ORGANIZATIONS);
          if (!selectedOrg) {
            setSelectedOrg(readSSN(DUMMY_ORGANIZATIONS[0]));
            setSelectedOrgName(DUMMY_ORGANIZATIONS[0].name);
          }
        }
      } catch (err) {
        console.log("getOrganizations failed, using placeholders", err);
        setOrganizations(DUMMY_ORGANIZATIONS);
        if (!selectedOrg) {
          setSelectedOrg(readSSN(DUMMY_ORGANIZATIONS[0]));
          setSelectedOrgName(DUMMY_ORGANIZATIONS[0].name);
        }
        setErrorOrgs(true);
      } finally {
        if (mounted) setLoadingOrgs(false);
      }
    };
    load();
    return () => (mounted = false);
  }, []);



     
  
     
  // When selectedOrg changes, load its programs, positions and caregivers
  useEffect(() => {
    if (!selectedOrg) return;
    let mounted = true;
    setLoadingData(true);
    setErrorData(false);

    const loadAll = async () => {
      try {
        const [progRes, carRes, empRes] = await Promise.allSettled([
          getOrg_Programs(selectedOrg),
          getOrg_CareGivers(selectedOrg),
          getEmployments(), // filter by organization below
        ]);

        // Programs
        if (mounted && progRes.status === 'fulfilled' && Array.isArray(progRes.value?.data) && progRes.value.data.length) {
          setPrograms(progRes.value.data);
        } else {
          setPrograms(DUMMY_PROGRAMS.filter(p => (p.OrganizationSSN ?? p.organizationSSN ?? p.orgSSN) === selectedOrg));
        }

        // Positions via getEmployments (best effort), then filtered fallback
        if (mounted && empRes.status === 'fulfilled' && Array.isArray(empRes.value?.data)) {
          const all = empRes.value.data;
          const filtered = all.filter((p) => {
            const org = p.OrganizationSSN ?? p.organizationSSN ?? p.orgSSN ?? p.OrgSSN;
            return selectedOrg ? org === selectedOrg : true;
          });
          setPositions(filtered.length ? filtered : DUMMY_POSITIONS.filter(p => (p.OrganizationSSN ?? p.organizationSSN ?? p.orgSSN) === selectedOrg));
        } else {
          setPositions(DUMMY_POSITIONS.filter(p => (p.OrganizationSSN ?? p.organizationSSN ?? p.orgSSN) === selectedOrg));
        }

        // Caregivers
        if (mounted && carRes.status === 'fulfilled' && Array.isArray(carRes.value?.data) && carRes.value.data.length) {
          setCaregivers(carRes.value.data);
        } else {
          setCaregivers(DUMMY_CAREGIVERS.filter(c => (c.OrganizationSSN ?? c.organizationSSN ?? c.orgSSN) === selectedOrg));
        }
      } catch (err) {
        console.error('Error loading organization data', err);
        setErrorData(true);
        // fallback filtered by selected org
        setPrograms(DUMMY_PROGRAMS.filter(p => (p.OrganizationSSN ?? p.organizationSSN ?? p.orgSSN) === selectedOrg));
        setPositions(DUMMY_POSITIONS.filter(p => (p.OrganizationSSN ?? p.organizationSSN ?? p.orgSSN) === selectedOrg));
        setCaregivers(DUMMY_CAREGIVERS.filter(c => (c.OrganizationSSN ?? c.organizationSSN ?? c.orgSSN) === selectedOrg));
      } finally {
        if (mounted) setLoadingData(false);
      }
    };

    loadAll();
    return () => (mounted = false);
  }, [selectedOrg]);
  

  function handleBook(program) {
    console.log('Book', program);
    alert(`Book: ${program.name ?? program.Name ?? 'program'}`);
  }
  
  function handleApply(pos) {
    console.log('Apply', pos);
    alert(`Apply: ${pos.positionName ?? pos.role ?? 'position'}`);
  }

  // Handle organization selection - update SSN and name, trigger data fetch via useEffect
  const handleOrgSelect = (ssn) => {
    if (ssn && ssn !== selectedOrg) {
      const org = organizations.find(o => readSSN(o) === ssn);
      const name = org?.name ?? org?.Name ?? '';
      
      console.log('Organization selected:', { ssn, name, org });
      
      // Smooth transition: set loading first, then update selection
      setLoadingData(true);
      
      // Small delay for smooth visual transition
      setTimeout(() => {
        setSelectedOrg(ssn);
        setSelectedOrgName(name);
        setPrograms([]);
        setPositions([]);
        setCaregivers([]);
      }, 150);
    }
  };

  return (
    <div className="page-root">
      <h1 style={{ color: '#27865d', paddingLeft: 22 }}>Organizations</h1>

      <section style={{ marginTop: 18 }}>
        <OrgCarousel
          organizations={organizations}
          onSelect={handleOrgSelect}
          selectedSSN={selectedOrg}
        />
      </section>

      <div className="container-oragnizations">
        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: '#27865d' }}>Programs for {selectedOrgName}</h2>
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {loadingData ? (
              <div style={{ color: '#666' }}>Loading programs...</div>
            ) : programs && programs.length ? (
              programs.map((p) => (
                <ProgramCard key={p.id ?? p.Id ?? JSON.stringify(p)} program={p} orgName={selectedOrgName} onBook={handleBook} />
              ))
            ) : (
              <div style={{ color: '#666' }}>No programs for this organization.</div>
            )}
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <h2 style={{ color: '#27865d' }}>Open Positions</h2>
          <div style={{ display: 'grid', gap: 12, marginTop: 12 }}>
            {loadingData ? (
              <div style={{ color: '#666' }}>Loading positions...</div>
            ) : positions && positions.length ? (
              positions.map((pos) => (
                <PositionCard key={pos.positionId ?? pos.id ?? JSON.stringify(pos)} pos={pos} onApply={handleApply} />
              ))
            ) : (
              <div style={{ color: '#666' }}>No open positions.</div>
            )}
          </div>
        </section>

        <section style={{ marginTop: 28 }}>
          <h2 style={{ color: '#27865d' }}>Care-Takers</h2>
          <div style={{ marginTop: 12 }}>
            {loadingData ? (
              <div style={{ color: '#666' }}>Loading caregivers...</div>
            ) : caregivers && caregivers.length ? (
              <CaregiverCarousel caregivers={caregivers} showCount={1} />
            ) : (
              <div style={{ color: '#666' }}>No caregivers for this organization.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
