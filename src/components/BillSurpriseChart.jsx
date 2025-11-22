import { useMemo } from 'react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function BillSurpriseChart({ data, selectedOrgId, onOrgClick }) {
  const chartData = useMemo(() => {
    const { bills, organizations } = data;

    if (bills.length === 0) return [];

    // If a specific organization is selected, show monthly trend
    if (selectedOrgId && organizations.length === 1) {
      // Group bills by month
      const monthlyData = {};

      bills.forEach(bill => {
        const date = new Date(bill.billDate);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        const monthLabel = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });

        if (!monthlyData[monthKey]) {
          monthlyData[monthKey] = {
            month: monthLabel,
            monthKey,
            total: 0,
            count: 0,
            date: date
          };
        }

        monthlyData[monthKey].total += bill.surpriseFactor;
        monthlyData[monthKey].count += 1;
      });

      // Calculate averages and sort by date
      return Object.values(monthlyData)
        .map(data => ({
          month: data.month,
          surpriseFactor: Math.round((data.total / data.count) * 100),
          date: data.date
        }))
        .sort((a, b) => a.date - b.date)
        .map(({ month, surpriseFactor }) => ({ month, surpriseFactor }));
    }

    // Otherwise show average per organization
    const orgSurprise = {};

    bills.forEach(bill => {
      if (!orgSurprise[bill.organizationId]) {
        orgSurprise[bill.organizationId] = {
          total: 0,
          count: 0,
          name: ''
        };
      }
      orgSurprise[bill.organizationId].total += bill.surpriseFactor;
      orgSurprise[bill.organizationId].count += 1;
    });

    // Add organization names
    organizations.forEach(org => {
      if (orgSurprise[org.id]) {
        orgSurprise[org.id].name = org.name;
      }
    });

    // Calculate averages and sort by surprise factor
    return Object.entries(orgSurprise)
      .map(([orgId, data]) => ({
        orgId,
        name: data.name || orgId,
        surpriseFactor: Math.round((data.total / data.count) * 100)
      }))
      .sort((a, b) => b.surpriseFactor - a.surpriseFactor)
      .slice(0, 15); // Top 15 for readability
  }, [data, selectedOrgId]);

  if (chartData.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  const isMonthlyView = selectedOrgId && data.organizations.length === 1;

  const handleBarClick = (data) => {
    if (data && data.orgId && onOrgClick && !isMonthlyView) {
      onOrgClick(data.orgId);
    }
  };

  const commonTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const isDark = document.body.classList.contains('dark-mode');
      return (
        <div style={{
          background: isDark ? '#16213e' : 'white',
          padding: '10px',
          border: isDark ? '1px solid #667eea' : '1px solid #ccc',
          borderRadius: '4px',
          color: isDark ? '#eee' : '#333'
        }}>
          <p style={{ margin: 0, fontWeight: 'bold', color: isDark ? '#eee' : '#333' }}>
            {isMonthlyView ? payload[0].payload.month : payload[0].payload.name}
          </p>
          <p style={{ margin: '4px 0 0 0', color: isDark ? '#eee' : '#333' }}>
            Surprise Factor: {payload[0].value}%
          </p>
          {!isMonthlyView && (
            <p style={{ margin: '4px 0 0 0', color: isDark ? '#aaa' : '#666', fontSize: '0.85rem' }}>
              Click to view details
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  // Render as BarChart for overview, LineChart for monthly trend
  if (isMonthlyView) {
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={100}
            interval={0}
            tick={{ fontSize: 12 }}
          />
          <YAxis label={{ value: 'Surprise Factor %', angle: -90, position: 'insideLeft' }} />
          <Tooltip content={commonTooltip} />
          <Legend />
          <Line
            type="monotone"
            dataKey="surpriseFactor"
            stroke="#764ba2"
            strokeWidth={2}
            name="Monthly Surprise Factor %"
            dot={{ fill: '#764ba2', r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  }

  // Overview mode - Bar Chart
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={100}
          interval={0}
          tick={{ fontSize: 12, cursor: 'pointer' }}
        />
        <YAxis label={{ value: 'Surprise Factor %', angle: -90, position: 'insideLeft' }} />
        <Tooltip content={commonTooltip} cursor={{ fill: 'rgba(118, 75, 162, 0.1)' }} />
        <Legend />
        <Bar
          dataKey="surpriseFactor"
          fill="#764ba2"
          name="Average Surprise Factor %"
          cursor="pointer"
          onClick={handleBarClick}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BillSurpriseChart;
