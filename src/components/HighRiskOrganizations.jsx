import { useMemo } from 'react'
import './HighRiskOrganizations.css'

function HighRiskOrganizations({ allOrganizations, onOrgClick, selectedOrgId }) {
  const topRiskOrgs = useMemo(() => {
    // Sort by churn risk (highest first) and take top 5
    return [...allOrganizations]
      .sort((a, b) => b.churnRisk - a.churnRisk)
      .slice(0, 5);
  }, [allOrganizations]);

  if (topRiskOrgs.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  const getRiskColor = (category) => {
    switch (category) {
      case 'High':
        return '#f44336';
      case 'Medium':
        return '#ff9800';
      case 'Low':
        return '#4caf50';
      default:
        return '#999';
    }
  };

  const getRiskBadgeClass = (category) => {
    switch (category) {
      case 'High':
        return 'risk-badge-high';
      case 'Medium':
        return 'risk-badge-medium';
      case 'Low':
        return 'risk-badge-low';
      default:
        return '';
    }
  };

  return (
    <div className="high-risk-list">
      {topRiskOrgs.map((org, index) => (
        <div
          key={org.id}
          className={`risk-org-item ${selectedOrgId === org.id ? 'selected' : ''}`}
          onClick={() => onOrgClick(org.id)}
        >
          <div className="risk-org-rank">#{index + 1}</div>
          <div className="risk-org-content">
            <div className="risk-org-name">{org.name}</div>
            <div className="risk-org-details">
              <span className="risk-org-id">{org.id}</span>
              <span className="risk-org-accounts">{org.accountCount} accounts</span>
            </div>
          </div>
          <div className="risk-org-score">
            <div
              className={`risk-badge ${getRiskBadgeClass(org.churnRiskCategory)}`}
              style={{ borderColor: getRiskColor(org.churnRiskCategory) }}
            >
              {org.churnRiskCategory}
            </div>
            <div className="risk-percentage" style={{ color: getRiskColor(org.churnRiskCategory) }}>
              {(org.churnRisk * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HighRiskOrganizations;
