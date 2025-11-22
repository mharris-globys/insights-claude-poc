import { useMemo } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ZAxis } from 'recharts'

function SatisfactionChart({ data, onOrgClick, selectedOrgId }) {
  const chartData = useMemo(() => {
    return data.organizations.map(org => ({
      id: org.id,
      name: org.name,
      satisfaction: org.satisfactionScore,
      accountCount: org.accountCount,
      churnRisk: org.churnRisk * 100, // Convert to percentage for better axis display
      size: org.size
    }));
  }, [data]);

  const handleClick = (data) => {
    if (data && data.payload && onOrgClick) {
      onOrgClick(data.payload.id);
    }
  };

  const getColor = (churnRisk) => {
    // churnRisk is now in percentage (0-100)
    if (churnRisk < 30) return '#4caf50'; // Green for low risk
    if (churnRisk < 60) return '#ff9800'; // Orange for medium risk
    return '#f44336'; // Red for high risk
  };

  // Calculate dot size range based on account count
  const getDotSize = (accountCount) => {
    // Map account count to dot radius (min 50, max 500 for good visibility)
    return Math.max(50, Math.min(500, accountCount * 8));
  };

  if (chartData.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart margin={{ top: 10, right: 10, bottom: 20, left: 10 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          type="number"
          dataKey="churnRisk"
          name="Churn Risk"
          label={{ value: 'Churn Risk (%)', position: 'insideBottom', offset: -10 }}
          domain={[0, 100]}
        />
        <YAxis
          type="number"
          dataKey="satisfaction"
          name="Satisfaction"
          label={{ value: 'Satisfaction Score (%)', angle: -90, position: 'insideLeft' }}
          domain={[0, 100]}
        />
        <ZAxis type="number" dataKey="accountCount" range={[50, 500]} />
        <Tooltip
          cursor={{ strokeDasharray: '3 3' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              const isDark = document.body.classList.contains('dark-mode');
              return (
                <div style={{
                  background: isDark ? '#16213e' : 'white',
                  padding: '10px',
                  border: isDark ? '1px solid #667eea' : '1px solid #ccc',
                  borderRadius: '4px',
                  color: isDark ? '#eee' : '#333'
                }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: isDark ? '#eee' : '#333' }}>{data.name}</p>
                  <p style={{ margin: '4px 0 0 0', color: isDark ? '#eee' : '#333' }}>Satisfaction: {data.satisfaction.toFixed(1)}%</p>
                  <p style={{ margin: '4px 0 0 0', color: isDark ? '#eee' : '#333' }}>Churn Risk: {data.churnRisk.toFixed(0)}%</p>
                  <p style={{ margin: '4px 0 0 0', color: isDark ? '#eee' : '#333' }}>Size: {data.size} ({data.accountCount} accounts)</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Scatter
          name="Organizations"
          data={chartData}
          onClick={handleClick}
          cursor="pointer"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={getColor(entry.churnRisk)}
              stroke={selectedOrgId === entry.id ? '#1976d2' : 'none'}
              strokeWidth={selectedOrgId === entry.id ? 3 : 0}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export default SatisfactionChart;
