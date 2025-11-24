import React from 'react';
import './MockDataBadge.css';

/**
 * MockDataBadge Component
 *
 * Displays a small badge indicating that a component is using mock data.
 * Only renders when isMockData prop is true.
 *
 * @param {boolean} isMockData - Whether the component is using mock data
 */
const MockDataBadge = ({ isMockData }) => {
  if (!isMockData) {
    return null;
  }

  return (
    <div className="mock-data-badge" title="This component is using simulated data">
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="mock-data-icon"
      >
        <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.5" fill="none" />
        <path d="M6 3v3.5M6 8.5v.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
      <span className="mock-data-text">Mock Data</span>
    </div>
  );
};

export default MockDataBadge;
