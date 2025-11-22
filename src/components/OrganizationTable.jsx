import { useState, useMemo } from 'react'
import './OrganizationTable.css'

function OrganizationTable({ organizations, onOrgClick, selectedOrgId }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const sortedOrganizations = useMemo(() => {
    if (!sortConfig.key) return organizations;

    const sorted = [...organizations].sort((a, b) => {
      let aValue, bValue;

      switch (sortConfig.key) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'size':
          const sizeOrder = { 'Small': 1, 'Medium': 2, 'Large': 3, 'Enterprise': 4 };
          aValue = sizeOrder[a.size];
          bValue = sizeOrder[b.size];
          break;
        case 'accounts':
          aValue = a.accountCount;
          bValue = b.accountCount;
          break;
        case 'satisfaction':
          aValue = a.satisfactionScore;
          bValue = b.satisfactionScore;
          break;
        case 'churnRisk':
          aValue = a.churnRisk;
          bValue = b.churnRisk;
          break;
        case 'autopay':
          aValue = a.autopayAdoption;
          bValue = b.autopayAdoption;
          break;
        case 'paperless':
          aValue = a.paperlessAdoption;
          bValue = b.paperlessAdoption;
          break;
        case 'avgBill':
          aValue = a.averageBillAmount;
          bValue = b.averageBillAmount;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [organizations, sortConfig]);

  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) return ' ⇅';
    return sortConfig.direction === 'asc' ? ' ↑' : ' ↓';
  };

  if (organizations.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No organizations match the selected filters</div>;
  }

  const getRiskBadgeClass = (risk) => {
    if (risk === 'Low') return 'risk-badge low';
    if (risk === 'Medium') return 'risk-badge medium';
    return 'risk-badge high';
  };

  const getSizeBadgeClass = (size) => {
    return `size-badge ${size.toLowerCase()}`;
  };

  // Get solid color from rainbow gradient based on satisfaction score
  const getSatisfactionColor = (score) => {
    // Rainbow gradient: red (0%) -> orange (25%) -> yellow (50%) -> green (75%) -> green (100%)
    // We'll use a red-yellow-green gradient for better visibility
    const percentage = score / 100;

    if (percentage < 0.5) {
      // Red to yellow (0-50%)
      const localPercent = percentage * 2; // 0-1
      const r = 255;
      const g = Math.round(255 * localPercent);
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    } else {
      // Yellow to green (50-100%)
      const localPercent = (percentage - 0.5) * 2; // 0-1
      const r = Math.round(255 * (1 - localPercent));
      const g = 255;
      const b = 0;
      return `rgb(${r}, ${g}, ${b})`;
    }
  };

  return (
    <div className="table-container">
      <table className="org-table">
        <thead>
          <tr>
            <th onClick={() => handleSort('name')} className="sortable">
              Organization{getSortIcon('name')}
            </th>
            <th onClick={() => handleSort('size')} className="sortable">
              Size{getSortIcon('size')}
            </th>
            <th onClick={() => handleSort('accounts')} className="sortable">
              Accounts{getSortIcon('accounts')}
            </th>
            <th onClick={() => handleSort('satisfaction')} className="sortable">
              Satisfaction{getSortIcon('satisfaction')}
            </th>
            <th onClick={() => handleSort('churnRisk')} className="sortable">
              Churn Risk{getSortIcon('churnRisk')}
            </th>
            <th onClick={() => handleSort('autopay')} className="sortable">
              Autopay{getSortIcon('autopay')}
            </th>
            <th onClick={() => handleSort('paperless')} className="sortable">
              Paperless{getSortIcon('paperless')}
            </th>
            <th onClick={() => handleSort('avgBill')} className="sortable">
              Total Billing{getSortIcon('avgBill')}
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedOrganizations.map(org => (
            <tr
              key={org.id}
              onClick={() => onOrgClick(org.id)}
              className={selectedOrgId === org.id ? 'selected' : ''}
            >
              <td className="org-name">
                <div>{org.name}</div>
                <div className="org-id">{org.id}</div>
              </td>
              <td>
                <span className={getSizeBadgeClass(org.size)}>{org.size}</span>
              </td>
              <td>{org.accountCount}</td>
              <td>
                <div className="satisfaction-cell">
                  <div className="satisfaction-bar-bg">
                    <div
                      className="satisfaction-bar"
                      style={{
                        width: `${org.satisfactionScore}%`,
                        backgroundColor: getSatisfactionColor(org.satisfactionScore)
                      }}
                    />
                  </div>
                  <span>{org.satisfactionScore.toFixed(1)}%</span>
                </div>
              </td>
              <td>
                <span className={getRiskBadgeClass(org.churnRiskCategory)}>
                  {org.churnRiskCategory} ({(org.churnRisk * 100).toFixed(0)}%)
                </span>
              </td>
              <td>{org.autopayAdoption.toFixed(0)}%</td>
              <td>{org.paperlessAdoption.toFixed(0)}%</td>
              <td>${org.averageBillAmount.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default OrganizationTable;
