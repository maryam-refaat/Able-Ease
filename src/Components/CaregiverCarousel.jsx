import React, { useState } from 'react';
import '../Org.css';
import CaregiverCard from './CareGiverCard';

/**
 * Props:
 * - caregivers: array of caregiver objects
 * - showCount: how many to show side-by-side on wide screens (optional)
 */
export default function CaregiverCarousel({ caregivers = [], showCount = 1 }) {
  const [index, setIndex] = useState(0);
  if (!Array.isArray(caregivers) || caregivers.length === 0) {
    return <div style={{ padding: 12 }}>No caregivers</div>;
  }

  // ensure index in range
  const clamp = (v) => Math.max(0, Math.min(v, caregivers.length - 1));
  const prev = () => setIndex(i => clamp(i - 1));
  const next = () => setIndex(i => clamp(i + 1));

  // For simplicity show a window of items; default showCount=1 (carousel)
  const windowItems = caregivers.slice(index, index + showCount);

  return (
    <div className="caregiver-carousel-root" aria-roledescription="carousel">
      <div className="caregiver-carousel-controls">
        <button className="carousel-btn" onClick={prev} aria-label="Previous caregiver">&lt;</button>
      </div>

      <div className="caregiver-carousel-track">
        {windowItems.map(care => (
          <div key={care.id ?? care.ID ?? care.name} className="caregiver-carousel-item">
            <CaregiverCard care={care} onContact={(c) => console.log('contact', c)} />
          </div>
        ))}
      </div>

      <div className="caregiver-carousel-controls">
        <button className="carousel-btn" onClick={next} aria-label="Next caregiver">&gt;</button>
      </div>
    </div>
  );
}
