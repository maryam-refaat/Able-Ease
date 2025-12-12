import React, { useState, useEffect } from 'react';
import '../Org.css';
import Header from "../Components/Header";
import TherapyCenterCarousel from '../Components/TherapyCenterCarousel';
import ProgramCard from '../Components/ProgramCard';
// import ProgramList from '../Components/ProgramList';
import Footer from '../Components/Footer';

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
  // state: therapy centers and programs (now using DUMMY_Therapies)
  const [therapyCenters] = useState(DUMMY_Centers);
  const [programs] = useState(DUMMY_Therapies);

  // helper to extract center SSN from multiple possible field names
  const getCenterSSN = (item) => {
    if (!item) return null;
    return item.SSN ?? item.CenterSSN ?? item.centerSSN ?? item.center?.SSN ?? item.Organization?.SSN ?? null;
  };

  // selected center SSN (initialize to first center)
  const [selectedCenter, setSelectedCenter] = useState(() => getCenterSSN(DUMMY_Centers[0]) || null);

  // ensure selectedCenter gets set when therapyCenters change
  useEffect(() => {
    if (!selectedCenter && Array.isArray(therapyCenters) && therapyCenters.length) {
      setSelectedCenter(getCenterSSN(therapyCenters[0]) || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [therapyCenters]);

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

  const selectedCenterName = therapyCenters.find(c => getCenterSSN(c) === selectedCenter)?.name ?? '';

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
              if (typeof ssn === 'string' && ssn.length) setSelectedCenter(ssn);
            }}
            selectedSSN={selectedCenter}
          />
        </section>
 <div className="container" style={{ padding: 22 }}>
        <section style={{ marginTop: 30 }}>
          <h2 style={{ color: '#27865d' }}>Programs at {selectedCenterName || 'selected center'}</h2>

          <div style={{ marginTop: 12 }}>
            {filteredPrograms.length ? (
              // If you add a ProgramList later, uncomment its import and this branch will use it.
              typeof ProgramList === 'function' ? (
                <ProgramList programs={filteredPrograms} onBook={handleBook} centerName={selectedCenterName} />
              ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                  {filteredPrograms.map(p => (
                    <ProgramCard key={p.id ?? p.Id ?? JSON.stringify(p)} program={p} orgName={selectedCenterName} onBook={handleBook} />
                  ))}
                </div>
              )
            ) : (
              <div style={{ color: '#666' }}>No programs for this therapy center.</div>
            )}
          </div>
        </section>
      </div>

      
    </div>
  );
}
