import { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'

function AutopayPaperlessChart({ data }) {
  const chartData = useMemo(() => {
    const { accounts } = data;

    if (accounts.length === 0) return { autopay: [], paperless: [] };

    const autopayEnabled = accounts.filter(acc => acc.autopay).length;
    const paperlessEnabled = accounts.filter(acc => acc.paperless).length;

    return {
      autopay: [
        { name: 'Autopay Enabled', value: autopayEnabled, color: '#4caf50' },
        { name: 'Manual Payment', value: accounts.length - autopayEnabled, color: '#e0e0e0' }
      ],
      paperless: [
        { name: 'Paperless Enabled', value: paperlessEnabled, color: '#2196f3' },
        { name: 'Paper Billing', value: accounts.length - paperlessEnabled, color: '#e0e0e0' }
      ]
    };
  }, [data]);

  if (data.accounts.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#666' }}>Autopay</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData.autopay}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              dataKey="value"
            >
              {chartData.autopay.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <h4 style={{ textAlign: 'center', marginBottom: '0.5rem', color: '#666' }}>Paperless</h4>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={chartData.paperless}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              dataKey="value"
            >
              {chartData.paperless.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AutopayPaperlessChart;
