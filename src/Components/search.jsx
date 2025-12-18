
import React from 'react';
import '../index.css';



export default function SearchBar({ value, onChange, onSearch }) {
return (
    <div className="search-box">
      <input
        type="text"
        placeholder="Search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />

      <button onClick={onSearch}>Search</button>
    </div>
  );
}