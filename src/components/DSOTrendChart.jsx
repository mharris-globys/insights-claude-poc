import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts'
import { calculateMonthlyDSO, predictNextMonthDSO, calculateDSO } from '../mockData'

function DSOTrendChart({ data, selectedOrgId, selectedAccountId }) {
  const { chartData, currentDSO, predictedDSO } = useMemo(() => {
    const { bills, organizations, accounts } = data;

    // Determine which org to analyze
    let orgId = selectedOrgId;
    if (selectedAccountId && !orgId) {
      const account = accounts.find(acc => acc.id === selectedAccountId);
      if (account) orgId = account.organizationId;
    }

    // Calculate monthly DSO trend
    const monthly = calculateMonthlyDSO(bills, orgId);

    // Predict next month
    const predicted = predictNextMonthDSO(monthly);

    // Calculate current DSO (last 90 days)
    const current = calculateDSO(bills, orgId);

    // Add prediction to chart data
    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const chartDataWithPrediction = [
      ...monthly.map(m => ({ ...m, isPrediction: false })),
      {
        month: nextMonth.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
        dso: predicted,
        isPrediction: true
      }
    ];

    return {
      chartData: chartDataWithPrediction,
      currentDSO: current,
      predictedDSO: predicted
    };
  }, [data, selectedOrgId, selectedAccountId]);

  const getDSOColor = (dso) => {
    if (dso <= 2) return '#4caf50'; // Green
    if (dso <= 10) return '#ff9800'; // Yellow/Orange
    return '#f44336'; // Red
  };

  const getDSOStatus = (dso) => {
    if (dso <= 2) return 'Excellent';
    if (dso <= 10) return 'Good';
    return 'At Risk';
  };

  if (chartData.length === 0) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#999' }}>No data available</div>;
  }

  const CustomDot = (props) => {
    const { cx, cy, payload } = props;
    if (!payload.isPrediction) return null;

    return (
      <g>
        <circle cx={cx} cy={cy} r={6} fill="#764ba2" stroke="#fff" strokeWidth={2} />
        <circle cx={cx} cy={cy} r={3} fill="#fff" />
      </g>
    );
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <div style={{
          flex: 1,
          minWidth: '200px',
          padding: '1rem',
          background: getDSOColor(currentDSO) + '15',
          border: `2px solid ${getDSOColor(currentDSO)}`,
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Current DSO</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getDSOColor(currentDSO) }}>
            {currentDSO} days
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
            Status: {getDSOStatus(currentDSO)}
          </div>
        </div>

        <div style={{
          flex: 1,
          minWidth: '200px',
          padding: '1rem',
          background: getDSOColor(predictedDSO) + '15',
          border: `2px dashed ${getDSOColor(predictedDSO)}`,
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.25rem' }}>Predicted Next Month</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getDSOColor(predictedDSO) }}>
            {predictedDSO} days
          </div>
          <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
            {predictedDSO > currentDSO ? '↑ Increasing' : predictedDSO < currentDSO ? '↓ Decreasing' : '→ Stable'}
          </div>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="month"
            angle={-45}
            textAnchor="end"
            height={80}
            tick={{ fontSize: 12 }}
          />
          <YAxis label={{ value: 'Days', angle: -90, position: 'insideLeft' }} />

          {/* Reference lines for thresholds */}
          <ReferenceLine y={2} stroke="#4caf50" strokeDasharray="3 3" label={{ value: 'Excellent (0-2)', position: 'right', fill: '#4caf50', fontSize: 11 }} />
          <ReferenceLine y={10} stroke="#ff9800" strokeDasharray="3 3" label={{ value: 'Good (3-10)', position: 'right', fill: '#ff9800', fontSize: 11 }} />

          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const point = payload[0].payload;
                const isDark = document.body.classList.contains('dark-mode');
                return (
                  <div style={{
                    background: isDark ? '#16213e' : 'white',
                    padding: '10px',
                    border: `2px solid ${getDSOColor(point.dso)}`,
                    borderRadius: '4px',
                    color: isDark ? '#eee' : '#333'
                  }}>
                    <p style={{ margin: 0, fontWeight: 'bold', color: isDark ? '#eee' : '#333' }}>
                      {point.month} {point.isPrediction && '(Predicted)'}
                    </p>
                    <p style={{ margin: '4px 0 0 0', color: getDSOColor(point.dso) }}>
                      DSO: {point.dso} days - {getDSOStatus(point.dso)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend />

          {/* Actual data line */}
          <Line
            type="monotone"
            dataKey="dso"
            stroke="#764ba2"
            strokeWidth={2}
            name="DSO (Days)"
            dot={(props) => {
              const { cx, cy, payload } = props;
              const color = getDSOColor(payload.dso);
              return payload.isPrediction
                ? <CustomDot {...props} />
                : <circle cx={cx} cy={cy} r={4} fill={color} stroke="#fff" strokeWidth={2} />;
            }}
            strokeDasharray={(props) => {
              // Make predicted segment dashed
              return undefined;
            }}
          />

          {/* Color segments using Area */}
          <Area
            type="monotone"
            dataKey="dso"
            stroke="none"
            fill="url(#dsoGradient)"
            fillOpacity={0.1}
          />

          <defs>
            <linearGradient id="dsoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f44336" stopOpacity={0.3} />
              <stop offset="50%" stopColor="#ff9800" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#4caf50" stopOpacity={0.3} />
            </linearGradient>
          </defs>
        </ComposedChart>
      </ResponsiveContainer>

      <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#666', textAlign: 'center' }}>
        <strong>DSO Thresholds:</strong> Green (0-2 days), Yellow (3-10 days), Red (10+ days)
      </div>
    </div>
  );
}

export default DSOTrendChart;
