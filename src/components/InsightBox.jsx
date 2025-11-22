import { useMemo } from 'react'
import { calculateDSO } from '../mockData'
import './InsightBox.css'

function InsightBox({ data }) {
  const insights = useMemo(() => {
    const { organizations, accounts, bills } = data;

    if (organizations.length === 0) return [];

    const insights = [];

    // Calculate aggregate metrics
    const totalOrgs = organizations.length;
    const avgSatisfaction = organizations.reduce((sum, org) => sum + org.satisfactionScore, 0) / totalOrgs;
    const highChurnOrgs = organizations.filter(org => org.churnRiskCategory === 'High').length;
    const churnRate = (highChurnOrgs / totalOrgs) * 100;

    // DSO analysis
    const currentDSO = calculateDSO(bills);
    const avgOrgDSO = organizations.reduce((sum, org) => sum + (org.dso || 0), 0) / totalOrgs;

    // Autopay/Paperless
    const autopayRate = (accounts.filter(acc => acc.autopay).length / accounts.length) * 100;
    const paperlessRate = (accounts.filter(acc => acc.paperless).length / accounts.length) * 100;

    // Bill payment analysis
    const unpaidBills = bills.filter(b => !b.paid);
    const unpaidAmount = unpaidBills.reduce((sum, b) => sum + b.amount, 0);
    const totalRevenue = bills.reduce((sum, b) => sum + b.amount, 0);
    const unpaidRate = (unpaidAmount / totalRevenue) * 100;

    // Generate insights based on data

    // 1. DSO Insight
    if (currentDSO > 10) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        title: 'High Days Sales Outstanding',
        message: `Average DSO is ${Math.round(currentDSO)} days, indicating payment collection delays. This correlates with ${churnRate.toFixed(0)}% high-risk customers. Consider implementing automated payment reminders or incentivizing autopay enrollment.`
      });
    } else if (currentDSO >= 3) {
      insights.push({
        type: 'info',
        icon: 'ℹ️',
        title: 'Moderate Payment Collection Times',
        message: `DSO is ${Math.round(currentDSO)} days. While within acceptable range, there's opportunity to improve by promoting autopay (current adoption: ${autopayRate.toFixed(0)}%).`
      });
    } else {
      insights.push({
        type: 'success',
        icon: '✅',
        title: 'Excellent Payment Performance',
        message: `Outstanding DSO of ${Math.round(currentDSO)} days indicates healthy payment collection. ${autopayRate.toFixed(0)}% autopay adoption is driving timely payments.`
      });
    }

    // 2. Churn Risk Insight
    if (churnRate > 30) {
      insights.push({
        type: 'critical',
        icon: '🚨',
        title: 'Critical Churn Risk',
        message: `${highChurnOrgs} organizations (${churnRate.toFixed(0)}%) are at high risk of churning. Immediate action required: Focus on orgs with DSO > 10 days and satisfaction < 60%. Consider personalized retention offers.`
      });
    } else if (churnRate > 15) {
      insights.push({
        type: 'warning',
        icon: '⚡',
        title: 'Elevated Churn Risk',
        message: `${churnRate.toFixed(0)}% of organizations showing elevated churn risk. Review billing surprise factors and payment experience for these accounts.`
      });
    }

    // 3. Satisfaction & Growth Opportunity
    if (avgSatisfaction < 70) {
      insights.push({
        type: 'warning',
        icon: '📉',
        title: 'Below-Target Satisfaction',
        message: `Average satisfaction is ${avgSatisfaction.toFixed(0)}%. Analysis shows strong correlation between high DSO and low satisfaction. Streamlining billing and payment processes could improve scores by 10-15%.`
      });
    } else if (avgSatisfaction > 80) {
      const lowAdoption = Math.min(autopayRate, paperlessRate);
      if (lowAdoption < 70) {
        insights.push({
          type: 'opportunity',
          icon: '💡',
          title: 'Growth Opportunity Identified',
          message: `With ${avgSatisfaction.toFixed(0)}% satisfaction, customers are receptive to new features. Consider campaigns to boost ${autopayRate < paperlessRate ? 'autopay' : 'paperless'} adoption from ${lowAdoption.toFixed(0)}% to reduce DSO further.`
        });
      }
    }

    // 4. Payment Behavior Insight
    if (unpaidRate > 20) {
      insights.push({
        type: 'warning',
        icon: '💰',
        title: 'High Outstanding Receivables',
        message: `${unpaidRate.toFixed(0)}% of total revenue ($${unpaidAmount.toLocaleString()}) remains unpaid. ${(100 - autopayRate).toFixed(0)}% of accounts lack autopay. Automated payment solutions could recover significant revenue.`
      });
    }

    // 5. Best Performers Insight (if viewing filtered data)
    if (totalOrgs < 25) {
      const bestOrg = organizations.reduce((best, org) =>
        (org.satisfactionScore > (best?.satisfactionScore || 0) && org.dso <= 5) ? org : best
      , null);

      if (bestOrg) {
        insights.push({
          type: 'success',
          icon: '🌟',
          title: 'Best Practice Model',
          message: `${bestOrg.name} demonstrates excellence: ${bestOrg.satisfactionScore.toFixed(0)}% satisfaction with ${bestOrg.dso} day DSO. Their ${bestOrg.autopayAdoption.toFixed(0)}% autopay adoption can serve as a benchmark.`
        });
      }
    } else {
      // Overall health for full dataset
      const healthScore = (
        (avgSatisfaction / 100) * 0.3 +
        (1 - churnRate / 100) * 0.3 +
        (autopayRate / 100) * 0.2 +
        (Math.max(0, 1 - currentDSO / 30)) * 0.2
      ) * 100;

      if (healthScore >= 75) {
        insights.push({
          type: 'success',
          icon: '📊',
          title: 'Strong Overall Performance',
          message: `Portfolio health score: ${healthScore.toFixed(0)}/100. Satisfaction (${avgSatisfaction.toFixed(0)}%) and DSO (${Math.round(currentDSO)} days) are within healthy ranges. Continue monitoring high-risk segments.`
        });
      }
    }

    return insights.slice(0, 3); // Show top 3 insights
  }, [data]);

  if (insights.length === 0) {
    return null;
  }

  return (
    <div className="insight-box">
      <div className="insight-header">
        <h3>🤖 AI-Powered Insights</h3>
        <span className="insight-badge">Live Analysis</span>
      </div>
      <div className="insights-container">
        {insights.map((insight, index) => (
          <div key={index} className={`insight-item ${insight.type}`}>
            <div className="insight-icon">{insight.icon}</div>
            <div className="insight-content">
              <h4>{insight.title}</h4>
              <p>{insight.message}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default InsightBox;
