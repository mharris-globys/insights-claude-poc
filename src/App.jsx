import { useState, useMemo, useEffect } from 'react'
import { organizations, accounts, bills } from './mockData'
import MetricsCards from './components/MetricsCards'
import ServiceUtilization from './components/ServiceUtilization'
import SatisfactionChart from './components/SatisfactionChart'
import AutopayPaperlessChart from './components/AutopayPaperlessChart'
import ChurnRiskChart from './components/ChurnRiskChart'
import BillSurpriseChart from './components/BillSurpriseChart'
import DSOTrendChart from './components/DSOTrendChart'
import OrganizationTable from './components/OrganizationTable'
import Filters from './components/Filters'
import InsightBox from './components/InsightBox'
import './App.css'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const [filters, setFilters] = useState({
    orgSize: 'All',
    churnRisk: 'All',
    selectedOrgId: null,
    selectedAccountId: null
  });

  // Apply dark mode class to body
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  // Filter data based on selected criteria
  const filteredData = useMemo(() => {
    let filteredOrgs = organizations;
    let filteredAccounts = accounts;

    // Apply account filter first (if specific account is selected)
    if (filters.selectedAccountId) {
      filteredAccounts = accounts.filter(acc => acc.id === filters.selectedAccountId);
      const orgId = filteredAccounts[0]?.organizationId;
      if (orgId) {
        filteredOrgs = organizations.filter(org => org.id === orgId);
      }
    } else {
      // Apply organization size filter
      if (filters.orgSize !== 'All') {
        filteredOrgs = filteredOrgs.filter(org => org.size === filters.orgSize);
      }

      // Apply churn risk filter
      if (filters.churnRisk !== 'All') {
        filteredOrgs = filteredOrgs.filter(org => org.churnRiskCategory === filters.churnRisk);
      }

      // Apply selected organization filter
      if (filters.selectedOrgId) {
        filteredOrgs = filteredOrgs.filter(org => org.id === filters.selectedOrgId);
      }

      // Get filtered org IDs
      const filteredOrgIds = new Set(filteredOrgs.map(org => org.id));
      filteredAccounts = accounts.filter(acc => filteredOrgIds.has(acc.organizationId));
    }

    // Filter bills based on filtered accounts
    const filteredAccountIds = new Set(filteredAccounts.map(acc => acc.id));
    const filteredBills = bills.filter(bill => filteredAccountIds.has(bill.accountId));

    return {
      organizations: filteredOrgs,
      accounts: filteredAccounts,
      bills: filteredBills
    };
  }, [filters]);

  const handleOrgClick = (orgId) => {
    const isClearing = filters.selectedOrgId === orgId;

    if (isClearing) {
      // Clear selection
      setFilters(prev => ({
        ...prev,
        selectedOrgId: null,
        selectedAccountId: null
      }));
      setSearchTerm('');
    } else {
      // Select organization and update search box
      const org = organizations.find(o => o.id === orgId);
      setFilters(prev => ({
        ...prev,
        selectedOrgId: orgId,
        selectedAccountId: null
      }));
      if (org) {
        setSearchTerm(org.name);
      }
    }
  };

  const clearSelection = () => {
    setFilters(prev => ({ ...prev, selectedOrgId: null, selectedAccountId: null }));
    setSearchTerm('');
  };

  const handleLogin = (e) => {
    e.preventDefault();
    // Accept any credentials for POC
    if (loginForm.username && loginForm.password) {
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
    setFilters({
      orgSize: 'All',
      churnRisk: 'All',
      selectedOrgId: null,
      selectedAccountId: null
    });
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>Telecom Insights Portal</h1>
          <p className="login-subtitle">Sign in to continue</p>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                placeholder="Enter username"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
                required
              />
            </div>
            <button type="submit" className="login-btn">Sign In</button>
          </form>
        </div>
      </div>
    );
  }

  // Main Dashboard
  return (
    <div className="app">
      <header className="app-header">
        <div className="header-left">
          <h1>Telecom Insights Portal</h1>
          <p className="subtitle">Account Intelligence & Trend Analysis</p>
        </div>
        <div className="header-center">
          {(filters.selectedOrgId || filters.selectedAccountId) && (
            <div className="header-selection">
              <span className="selection-label">
                {filters.selectedAccountId ? (
                  <>
                    <strong>{filteredData.accounts[0]?.phoneNumber}</strong>
                    <span className="selection-org-name">({filteredData.organizations[0]?.name})</span>
                  </>
                ) : (
                  <strong>{filteredData.organizations[0]?.name}</strong>
                )}
              </span>
              <button onClick={clearSelection} className="header-clear-btn" title="Clear Selection">
                ✕
              </button>
            </div>
          )}
        </div>
        <div className="header-controls">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </header>

      <div className="app-container">
        <Filters
          filters={filters}
          setFilters={setFilters}
          organizations={organizations}
          accounts={accounts}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <InsightBox data={filteredData} />

        {(filters.selectedOrgId || filters.selectedAccountId) && (
          <div className="selection-banner">
            <span>
              {filters.selectedAccountId ? (
                <>Viewing Account: <strong>{filteredData.accounts[0]?.phoneNumber}</strong> ({filteredData.organizations[0]?.name})</>
              ) : (
                <>Viewing Organization: <strong>{filteredData.organizations[0]?.name}</strong></>
              )}
            </span>
            <button onClick={clearSelection} className="clear-btn">
              Clear Selection
            </button>
          </div>
        )}

        <MetricsCards data={filteredData} />

        <div className="charts-grid">
          <div className="chart-card full-width">
            <h3>DSO Trend & Prediction</h3>
            <DSOTrendChart
              data={filteredData}
              selectedOrgId={filters.selectedOrgId}
              selectedAccountId={filters.selectedAccountId}
            />
          </div>

          <div className="chart-card">
            <h3>Service Utilization</h3>
            <ServiceUtilization data={filteredData} />
          </div>

          <div className="chart-card">
            <h3>Satisfaction vs Churn Risk</h3>
            <SatisfactionChart
              data={filteredData}
              onOrgClick={handleOrgClick}
              selectedOrgId={filters.selectedOrgId}
            />
          </div>

          <div className="chart-card">
            <h3>Autopay & Paperless Adoption</h3>
            <AutopayPaperlessChart data={filteredData} />
          </div>

          <div className="chart-card full-width">
            <h3>Bill Surprise Factor {(filters.selectedOrgId || filters.selectedAccountId) && '(Monthly Trend)'}</h3>
            <BillSurpriseChart
              data={filteredData}
              selectedOrgId={filters.selectedOrgId || filters.selectedAccountId}
              onOrgClick={handleOrgClick}
            />
          </div>

          <div className="chart-card">
            <h3>Churn Risk Distribution</h3>
            <ChurnRiskChart data={filteredData} />
          </div>
        </div>

        <div className="table-section">
          <h3>Organization Details</h3>
          <OrganizationTable
            organizations={filteredData.organizations}
            onOrgClick={handleOrgClick}
            selectedOrgId={filters.selectedOrgId}
          />
        </div>
      </div>
    </div>
  )
}

export default App
