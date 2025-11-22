import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'

function ChurnRiskChart({ data }) {
  const chartData = useMemo(() => {
    const { organizations } = data;

    const riskCounts = {
      Low: 0,
      Medium: 0,
      High: 0
    };

    organizations.forEach(org => {
      riskCounts[org.churnRiskCategory]++;
    });

    return [
      { risk: 'Low', count: riskCounts.Low, color: '#4caf50' },
      { risk: 'Medium', count: riskCounts.Medium, color: '#ff9800' },
      { risk: 'High', count: riskCounts.High, color: '#f44336' }
    ];
  }, [data]);

  if (data.organizations.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="risk" />
        <YAxis label={{ value: 'Organizations', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="count" name="Number of Organizations">
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ChurnRiskChart;
