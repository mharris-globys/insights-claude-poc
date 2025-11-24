import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

function BillSurpriseChart({ data }) {
  const chartData = useMemo(() => {
    const { bills, organizations } = data;

    if (organizations.length === 0) return [];

    // Calculate average surprise factor per organization
    const orgSurpriseFactors = {};

    bills.forEach(bill => {
      if (!orgSurpriseFactors[bill.organizationId]) {
        orgSurpriseFactors[bill.organizationId] = {
          total: 0,
          count: 0
        };
      }
      orgSurpriseFactors[bill.organizationId].total += bill.surpriseFactor;
      orgSurpriseFactors[bill.organizationId].count += 1;
    });

    // Calculate average surprise factor for each org
    const orgAverages = Object.entries(orgSurpriseFactors).map(([orgId, data]) => ({
      orgId,
      averageSurprise: (data.total / data.count) * 100 // Convert to percentage
    }));

    // Create bins for surprise factor ranges (0-10%, 10-20%, etc.)
    const bins = [
      { range: '0-10%', min: 0, max: 10, count: 0, color: '#4caf50' },
      { range: '10-20%', min: 10, max: 20, count: 0, color: '#8bc34a' },
      { range: '20-30%', min: 20, max: 30, count: 0, color: '#cddc39' },
      { range: '30-40%', min: 30, max: 40, count: 0, color: '#ffeb3b' },
      { range: '40-50%', min: 40, max: 50, count: 0, color: '#ffc107' },
      { range: '50-60%', min: 50, max: 60, count: 0, color: '#ff9800' },
      { range: '60-70%', min: 60, max: 70, count: 0, color: '#ff5722' },
      { range: '70-80%', min: 70, max: 80, count: 0, color: '#f44336' },
      { range: '80-90%', min: 80, max: 90, count: 0, color: '#e91e63' },
      { range: '90-100%', min: 90, max: 100, count: 0, color: '#9c27b0' }
    ];

    // Count organizations in each bin
    orgAverages.forEach(({ averageSurprise }) => {
      const bin = bins.find(b => averageSurprise >= b.min && averageSurprise < b.max) || bins[bins.length - 1];
      bin.count++;
    });

    // Return only bins with data (or all bins to show the full distribution)
    return bins.map(({ range, count, color }) => ({ range, count, color }));
  }, [data]);

  if (chartData.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  const customTooltip = ({ active, payload }) => {
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
            Surprise Factor: {payload[0].payload.range}
          </p>
          <p style={{ margin: '4px 0 0 0', color: isDark ? '#eee' : '#333' }}>
            Organizations: {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="range"
          label={{ value: 'Surprise Factor Range', position: 'insideBottom', offset: -5 }}
          tick={{ fontSize: 11 }}
        />
        <YAxis
          label={{ value: 'Number of Organizations', angle: -90, position: 'insideLeft' }}
          allowDecimals={false}
        />
        <Tooltip content={customTooltip} />
        <Legend />
        <Bar
          dataKey="count"
          name="Organizations"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default BillSurpriseChart;
