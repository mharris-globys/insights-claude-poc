import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

function ServiceUtilization({ data }) {
  const chartData = useMemo(() => {
    const { accounts } = data;

    if (accounts.length === 0) return [];

    // Calculate average utilization per service
    const serviceStats = {
      Voice: 0,
      Data: 0,
      SMS: 0,
      Roaming: 0,
      International: 0
    };

    accounts.forEach(account => {
      Object.entries(account.serviceUtilization).forEach(([service, value]) => {
        serviceStats[service] += value;
      });
    });

    return Object.entries(serviceStats).map(([service, total]) => ({
      service,
      utilization: Math.round(total / accounts.length)
    }));
  }, [data]);

  if (chartData.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="service" />
        <YAxis label={{ value: 'Utilization %', angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <Bar dataKey="utilization" fill="#667eea" name="Average Utilization %" />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ServiceUtilization;
