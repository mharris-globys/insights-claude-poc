import { useState, useEffect, useRef } from 'react'
import './Filters.css'

function Filters({ filters, setFilters, organizations, accounts, searchTerm, setSearchTerm }) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const searchRef = useRef(null);

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value,
      selectedOrgId: null,
      selectedAccountId: null
    }));
    setSearchTerm('');
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Search organizations and accounts
    const lowerValue = value.toLowerCase();
    const orgMatches = organizations
      .filter(org =>
        org.name.toLowerCase().includes(lowerValue) ||
        org.id.toLowerCase().includes(lowerValue)
      )
      .slice(0, 5)
      .map(org => ({ type: 'organization', ...org }));

    const accMatches = accounts
      .filter(acc =>
        acc.phoneNumber.includes(value) ||
        acc.id.toLowerCase().includes(lowerValue) ||
        acc.organizationName.toLowerCase().includes(lowerValue)
      )
      .slice(0, 5)
      .map(acc => ({ type: 'account', ...acc }));

    setSuggestions([...orgMatches, ...accMatches]);
    setShowSuggestions(true);
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'organization') {
      setSearchTerm(suggestion.name);
      setFilters(prev => ({
        ...prev,
        selectedOrgId: suggestion.id,
        selectedAccountId: null,
        orgSize: 'All',
        churnRisk: 'All'
      }));
    } else {
      setSearchTerm(`${suggestion.phoneNumber} (${suggestion.organizationName})`);
      setFilters(prev => ({
        ...prev,
        selectedOrgId: null,
        selectedAccountId: suggestion.id,
        orgSize: 'All',
        churnRisk: 'All'
      }));
    }
    setShowSuggestions(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    setFilters(prev => ({
      ...prev,
      selectedOrgId: null,
      selectedAccountId: null
    }));
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="filters">
      <div className="filter-group search-group" ref={searchRef}>
        <label htmlFor="search">Search Organization or Account:</label>
        <div className="search-input-wrapper">
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Type organization name or account number..."
            className="search-input"
          />
          {searchTerm && (
            <button onClick={clearSearch} className="clear-search-btn">×</button>
          )}
        </div>
        {showSuggestions && suggestions.length > 0 && (
          <div className="suggestions-dropdown">
            {suggestions.map((suggestion, index) => (
              <div
                key={`${suggestion.type}-${suggestion.id}-${index}`}
                className="suggestion-item"
                onClick={() => handleSuggestionClick(suggestion)}
              >
                {suggestion.type === 'organization' ? (
                  <div>
                    <div className="suggestion-main">{suggestion.name}</div>
                    <div className="suggestion-sub">
                      {suggestion.id} • {suggestion.accountCount} accounts
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="suggestion-main">{suggestion.phoneNumber}</div>
                    <div className="suggestion-sub">
                      {suggestion.id} • {suggestion.organizationName}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="filter-group">
        <label htmlFor="orgSize">Organization Size:</label>
        <select
          id="orgSize"
          value={filters.orgSize}
          onChange={(e) => handleFilterChange('orgSize', e.target.value)}
          disabled={filters.selectedOrgId || filters.selectedAccountId}
        >
          <option value="All">All Sizes</option>
          <option value="Small">Small (1-5 accounts)</option>
          <option value="Medium">Medium (6-20 accounts)</option>
          <option value="Large">Large (21-50 accounts)</option>
          <option value="Enterprise">Enterprise (50+ accounts)</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="churnRisk">Churn Risk:</label>
        <select
          id="churnRisk"
          value={filters.churnRisk}
          onChange={(e) => handleFilterChange('churnRisk', e.target.value)}
          disabled={filters.selectedOrgId || filters.selectedAccountId}
        >
          <option value="All">All Risk Levels</option>
          <option value="Low">Low Risk</option>
          <option value="Medium">Medium Risk</option>
          <option value="High">High Risk</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
