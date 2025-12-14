import React, { useState, useEffect } from 'react';
import '../Org.css';
import Header from "../Components/Header";
import TherapyCenterCarousel from '../Components/TherapyCenterCarousel';
import ProgramCard from '../Components/ProgramCard';
// import ProgramList from '../Components/ProgramList';
import Footer from '../Components/Footer';
import { getCenters, getcenter_Therapies } from '../assets/apis';

/* Safe dummy data */
const DUMMY_Centers = [
  { SSN: 'CEN-001', name: 'Physio Care Center', img: null },
  { SSN: 'CEN-002', name: 'Able Learning Hub', img: null },
  { SSN: 'CEN-003', name: 'Sunrise Rehab', img: null },
  { SSN: 'CEN-004', name: 'Hope Centre', img: null }
];

const DUMMY_Therapies = [
  { id: 11, name: 'Rehab for Seniors', Date: '2025-12-01', Time: '10 am', price: 150, centerSSN: 'CEN-001', img: null },
  { id: 12, name: 'Child Motor Skills', Date: '2025-11-15', Time: '10:30 am', price: 100, centerSSN: 'CEN-002', img: null },
  { id: 13, name: 'Balance & Gait', Date: '2025-10-01', Time: '8 am', price: 130, centerSSN: 'CEN-003', img: null },
  { id: 14, name: 'Rehab for Seniors (Evening)', Date: '2025-12-01', Time: '5 pm', price: 150, centerSSN: 'CEN-001', img: null },
  { id: 15, name: 'Child Motor Skills (Afternoon)', Date: '2025-11-15', Time: '2 pm', price: 100, centerSSN: 'CEN-001', img: null },
  { id: 16, name: 'Balance & Gait (Late)', Date: '2025-10-01', Time: '4 pm', price: 130, centerSSN: 'CEN-002', img: null }
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
    return item.SSN ?? item.CenterSSN ?? item.centerSSN ?? item.center?.SSN ?? item.Organization?.SSN ?? null;
  };

  // selected center SSN and name
  const [selectedCenter, setSelectedCenter] = useState(() => getCenterSSN(DUMMY_Centers[0]) || null);
  const [selectedCenterName, setSelectedCenterName] = useState(DUMMY_Centers[0]?.name ?? '');

  // load centers from API on mount (fall back to dummy centers on error)
  useEffect(() => {
    let mounted = true;
    const load = async () => {
      setLoadingCenters(true);
      setErrorCenters(false);
      try {
        const res = await getCenters();
        if (mounted && res?.data && Array.isArray(res.data) && res.data.length) {
          setTherapyCenters(res.data);
          const first = getCenterSSN(res.data[0]);
          const firstName = res.data[0]?.name ?? res.data[0]?.Name ?? '';
          if (first) {
            setSelectedCenter(first);
            setSelectedCenterName(firstName);
          }
        } else {
          // keep dummy centers
          setTherapyCenters(DUMMY_Centers);
          const firstSSN = getCenterSSN(DUMMY_Centers[0]);
          setSelectedCenter(firstSSN);
          setSelectedCenterName(DUMMY_Centers[0].name);
        }
      } catch (err) {
        console.error('getCenters failed, using dummy centers', err);
        setTherapyCenters(DUMMY_Centers);
        const firstSSN = getCenterSSN(DUMMY_Centers[0]);
        setSelectedCenter(firstSSN);
        setSelectedCenterName(DUMMY_Centers[0].name);
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
        if (mounted && res?.data && Array.isArray(res.data)) {
          setPrograms(res.data);
        } else {
          // fallback to dummy data filtered by selected center
          setPrograms(DUMMY_Therapies.filter(t => (t.centerSSN ?? t.CenterSSN) === selectedCenter));
        }
      } catch (err) {
        console.error('getcenter_Therapies failed, using dummy therapies', err);
        setPrograms(DUMMY_Therapies.filter(t => (t.centerSSN ?? t.CenterSSN) === selectedCenter));
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
    ? programs.map(p => {
        const centerSSN = p.centerSSN ?? p.CenterSSN ?? p.Center?.SSN ?? p.organization?.SSN ?? p.organizationSSN ?? p.SSN ?? null;
        const date = p.startDate ?? p.Date ?? null;
        const time = p.Time ?? p.time ?? null;
        const startDate = date ? (time ? `${date} • ${time}` : date) : null;
        const endDate = p.endDate ?? p.EndDate ?? null;
        return {
          ...p,
          centerSSN,
          startDate,
          endDate,
          price: p.price ?? p.Price ?? null,
          img: p.img ?? p.image ?? null
        };
      })
    : [];

  // filter programs by selected center
  const filteredPrograms = normalizedPrograms.filter(p => p.centerSSN === selectedCenter);

  // handler for booking (placeholder)
  function handleBook(program) {
    console.log('Book', program);
    alert(`Book: ${program.name ?? 'program'}`);
  }

  return (
    <div className="page-root">
     

     
        <h1 style={{ color: '#27865d',paddingLeft:22 }}>Therapy Centers</h1>

        <section style={{ marginTop: 18 }}>
          <TherapyCenterCarousel
            TherapyCenters={therapyCenters}
            onSelect={(ssn) => {
              console.log('onSelect called with SSN:', ssn, 'current selectedCenter:', selectedCenter);
              
              if (typeof ssn === 'string' && ssn.length && ssn !== selectedCenter) {
                const center = therapyCenters.find(c => getCenterSSN(c) === ssn);
                const name = center?.name ?? center?.Name ?? '';
                
                console.log('Therapy Center selected:', { ssn, name, center });
                
                // Clear data immediately and update selection
                setPrograms([]);
                setLoadingPrograms(true);
                
                // Update selection which will trigger useEffect to fetch new data
                setSelectedCenter(ssn);
                setSelectedCenterName(name);
              }
            }}
            selectedSSN={selectedCenter}
          />
        </section>
 <div className="container" style={{ padding: 22 }}>
        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: '#27865d' }}>Therapies at {selectedCenterName || 'selected center'}</h2>

          <div style={{ marginTop: 12 }}>
            {loadingPrograms ? (
              <div style={{ color: '#666' }}>Loading therapies...</div>
            ) : filteredPrograms.length ? (
              <div style={{ display: 'grid', gap: 12 }}>
                {filteredPrograms.map(p => (
                  <ProgramCard key={p.id ?? p.Id ?? JSON.stringify(p)} program={p} orgName={selectedCenterName} onBook={handleBook} />
                ))}
              </div>
            ) : (
              <div style={{ color: '#666' }}>No therapies for this center.</div>
            )}
          </div>
        </section>
      </div>

      
    </div>
  );
}