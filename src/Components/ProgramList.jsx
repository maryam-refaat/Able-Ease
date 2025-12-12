import React from 'react';
import PropTypes from 'prop-types';
import ProgramCard from './ProgramCard';
import "../Org.css";
export default function ProgramList({ programs }) {
if (!programs || programs.length === 0) return (
<div className="ae-container ae-section">
<h2 className="ae-section-title">Programs</h2>
<div>No programs available.</div>
</div>
);
return (
<div className="ae-container ae-section">
<h2 className="ae-section-title">Programs</h2>
<div className="ae-programs-list">
{programs.map(p => <ProgramCard key={p.Id} program={p} onBook={(prg) => alert(`Booked: ${prg.Name}`)} />)}
</div>
</div>
);
}
ProgramList.propTypes = { programs: PropTypes.array };

