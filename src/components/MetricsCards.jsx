import { useMemo } from 'react'
import { calculateDSO } from '../mockData'
import MockDataBadge from './MockDataBadge'
import './MetricsCards.css'

function MetricsCards({ data, isMockData }) {
  const metrics = useMemo(() => {
    const { organizations, accounts, bills } = data;

    // Total organizations and accounts
    const totalOrgs = organizations.length;
    const totalAccounts = accounts.length;

    // Average satisfaction
    const avgSatisfaction = totalOrgs > 0
      ? organizations.reduce((sum, org) => sum + org.satisfactionScore, 0) / totalOrgs
      : 0;

    // Autopay and paperless adoption
    const autopayCount = accounts.filter(acc => acc.autopay).length;
    const paperlessCount = accounts.filter(acc => acc.paperless).length;
    const autopayRate = totalAccounts > 0 ? (autopayCount / totalAccounts) * 100 : 0;
    const paperlessRate = totalAccounts > 0 ? (paperlessCount / totalAccounts) * 100 : 0;

    // Churn risk
    const highRiskOrgs = organizations.filter(org => org.churnRiskCategory === 'High').length;
    const churnRiskRate = totalOrgs > 0 ? (highRiskOrgs / totalOrgs) * 100 : 0;

    // Total revenue (sum of all bills)
    const totalRevenue = bills.reduce((sum, bill) => sum + bill.amount, 0);

    // Average bill surprise factor
    const avgSurprise = bills.length > 0
      ? bills.reduce((sum, bill) => sum + bill.surpriseFactor, 0) / bills.length
      : 0;

    // Service utilization average
    const avgUtilization = accounts.length > 0
      ? accounts.reduce((sum, acc) => {
          const avgForAccount = Object.values(acc.serviceUtilization).reduce((s, v) => s + v, 0) / 5;
          return sum + avgForAccount;
        }, 0) / accounts.length
      : 0;

    // Calculate current DSO
    const currentDSO = calculateDSO(bills);

    // Determine DSO color
    const getDSOColor = (dso) => {
      if (dso <= 2) return { bg: '#e8f5e9', color: '#2e7d32' }; // Green
      if (dso <= 10) return { bg: '#fff3e0', color: '#e65100' }; // Orange
      return { bg: '#ffebee', color: '#c62828' }; // Red
    };

    const dsoColors = getDSOColor(currentDSO);

    return {
      totalOrgs,
      totalAccounts,
      avgSatisfaction: avgSatisfaction.toFixed(1),
      autopayRate: autopayRate.toFixed(1),
      paperlessRate: paperlessRate.toFixed(1),
      churnRiskRate: churnRiskRate.toFixed(1),
      totalRevenue: totalRevenue.toFixed(0),
      avgSurprise: (avgSurprise * 100).toFixed(1),
      avgUtilization: avgUtilization.toFixed(1),
      currentDSO,
      dsoColors
    };
  }, [data]);

  return (
    <div className="metrics-cards">
      <MockDataBadge isMockData={isMockData} />
      <div className="metric-card">
        <div className="metric-icon" style={{ background: '#e3f2fd' }}>
          <span style={{ color: '#1976d2' }}>🏢</span>
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.totalOrgs}</div>
          <div className="metric-label">Organizations</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon" style={{ background: '#f3e5f5' }}>
          <span style={{ color: '#7b1fa2' }}>👥</span>
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.totalAccounts}</div>
          <div className="metric-label">Accounts</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon" style={{ background: '#e8f5e9' }}>
          <span style={{ color: '#388e3c' }}>😊</span>
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.avgSatisfaction}%</div>
          <div className="metric-label">Avg Satisfaction</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon" style={{ background: '#fff3e0' }}>
          <span style={{ color: '#f57c00' }}>💳</span>
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.autopayRate}%</div>
          <div className="metric-label">Autopay Adoption</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon" style={{ background: '#e0f2f1' }}>
          <span style={{ color: '#00796b' }}>📄</span>
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.paperlessRate}%</div>
          <div className="metric-label">Paperless Adoption</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon" style={{ background: '#ffebee' }}>
          <span style={{ color: '#c62828' }}>⚠️</span>
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.churnRiskRate}%</div>
          <div className="metric-label">High Churn Risk</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon" style={{ background: '#fce4ec' }}>
          <span style={{ color: '#c2185b' }}>📊</span>
        </div>
        <div className="metric-content">
          <div className="metric-value">{metrics.avgUtilization}%</div>
          <div className="metric-label">Avg Service Usage</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon" style={{ background: '#f1f8e9' }}>
          <span style={{ color: '#689f38' }}>💰</span>
        </div>
        <div className="metric-content">
          <div className="metric-value">${Number(metrics.totalRevenue).toLocaleString()}</div>
          <div className="metric-label">Total Revenue</div>
        </div>
      </div>

      <div className="metric-card">
        <div className="metric-icon" style={{ background: metrics.dsoColors.bg }}>
          <span style={{ color: metrics.dsoColors.color }}>⏱️</span>
        </div>
        <div className="metric-content">
          <div className="metric-value" style={{ color: metrics.dsoColors.color }}>
            {metrics.currentDSO} days
          </div>
          <div className="metric-label">Avg DSO</div>
        </div>
      </div>
    </div>
  );
}

export default MetricsCards;
