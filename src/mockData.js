// Mock data generator for Telecom Insights Portal

const services = ['Voice', 'Data', 'SMS', 'Roaming', 'International'];
const organizationNames = [
  'Acme Corp', 'TechStart Inc', 'Global Solutions', 'Enterprise Systems',
  'Digital Innovations', 'Cloud Services Ltd', 'Network Solutions',
  'Smart Tech', 'Future Communications', 'Connect Plus',
  'Business Network', 'Corporate Telecom', 'Data Dynamics',
  'Mobile First', 'Enterprise Connect', 'Digital Wave',
  'Tech Ventures', 'Global Connect', 'Business Solutions',
  'Innovation Labs', 'Metro Networks', 'City Communications',
  'Regional Telecom', 'Local Business', 'Small Ventures'
];

// Random number generators
const random = (min, max) => Math.random() * (max - min) + min;
const randomInt = (min, max) => Math.floor(random(min, max + 1));
const randomChoice = (arr) => arr[randomInt(0, arr.length - 1)];
const randomBool = (probability = 0.5) => Math.random() < probability;

// Generate a normal distribution value
const randomNormal = (mean, stdDev) => {
  let u = 0, v = 0;
  while(u === 0) u = Math.random();
  while(v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
};

// Generate weighted surprise factor (heavily weighted towards low values)
const randomSurpriseFactor = () => {
  const rand = Math.random();

  // 50% chance: 0-10% surprise factor
  if (rand < 0.50) {
    return random(0, 0.10);
  }
  // 30% chance: 10-20% surprise factor
  else if (rand < 0.80) {
    return random(0.10, 0.20);
  }
  // 10% chance: 20-40% surprise factor
  else if (rand < 0.90) {
    return random(0.20, 0.40);
  }
  // 5% chance: 40-60% surprise factor
  else if (rand < 0.95) {
    return random(0.40, 0.60);
  }
  // 3% chance: 60-80% surprise factor
  else if (rand < 0.98) {
    return random(0.60, 0.80);
  }
  // 2% chance: 80-100% surprise factor (outliers)
  else {
    return random(0.80, 1.00);
  }
};

// Organization size categories
const getOrgSize = (accountCount) => {
  if (accountCount <= 5) return 'Small';
  if (accountCount <= 20) return 'Medium';
  if (accountCount <= 50) return 'Large';
  return 'Enterprise';
};

// Churn risk categories
const getChurnRisk = (score) => {
  if (score < 0.3) return 'Low';
  if (score < 0.6) return 'Medium';
  return 'High';
};

// Generate organizations
export const generateOrganizations = (count = 25) => {
  const orgs = [];

  for (let i = 0; i < count; i++) {
    const accountCount = Math.max(1, Math.floor(randomNormal(15, 20)));
    const satisfactionScore = Math.min(100, Math.max(0, randomNormal(75, 15)));

    // Calculate total billing (avg per account × number of accounts)
    const avgBillPerAccount = Math.round(randomNormal(500, 200));
    const totalBilling = avgBillPerAccount * accountCount;

    const org = {
      id: `ORG-${String(i + 1).padStart(4, '0')}`,
      name: organizationNames[i],
      accountCount,
      size: getOrgSize(accountCount),
      satisfactionScore: Math.round(satisfactionScore * 10) / 10,
      churnRisk: 0, // Will be calculated based on DSO after bill generation
      churnRiskCategory: 'Low', // Will be updated after DSO calculation
      autopayAdoption: Math.min(100, Math.max(0, randomNormal(60, 20))),
      paperlessAdoption: Math.min(100, Math.max(0, randomNormal(70, 18))),
      averageBillAmount: totalBilling,
      createdDate: new Date(2020, randomInt(0, 11), randomInt(1, 28))
    };

    orgs.push(org);
  }

  return orgs;
};

// Generate accounts for an organization
export const generateAccounts = (organizations) => {
  const accounts = [];
  let accountId = 1;

  organizations.forEach(org => {
    for (let i = 0; i < org.accountCount; i++) {
      const hasAutopay = randomBool(org.autopayAdoption / 100);
      const hasPaperless = randomBool(org.paperlessAdoption / 100);

      // Service utilization percentages
      const serviceUtilization = {};
      services.forEach(service => {
        serviceUtilization[service] = Math.round(random(10, 95));
      });

      const account = {
        id: `ACC-${String(accountId).padStart(6, '0')}`,
        organizationId: org.id,
        organizationName: org.name,
        phoneNumber: `+1-555-${String(randomInt(1000, 9999))}-${String(randomInt(1000, 9999))}`,
        accountType: randomChoice(['Postpaid', 'Prepaid']),
        status: randomChoice(['Active', 'Active', 'Active', 'Suspended']),
        autopay: hasAutopay,
        paperless: hasPaperless,
        serviceUtilization,
        createdDate: new Date(
          org.createdDate.getFullYear(),
          org.createdDate.getMonth() + randomInt(0, 24),
          randomInt(1, 28)
        )
      };

      accounts.push(account);
      accountId++;
    }
  });

  return accounts;
};

// Generate bills for accounts with payment behavior influenced by org satisfaction/churn
export const generateBills = (accounts, organizations) => {
  const bills = [];
  const currentDate = new Date();
  const monthsToGenerate = 12; // Last 12 months

  // Create org lookup map
  const orgMap = {};
  organizations.forEach(org => {
    orgMap[org.id] = org;
  });

  accounts.forEach(account => {
    const org = orgMap[account.organizationId];
    if (!org) return;

    // Calculate payment behavior based on org satisfaction
    // High satisfaction (>80%) → Fast payment (0-2 days) - paid up accounts
    // Medium satisfaction (60-80%) → Normal payment (3-8 days)
    // Low satisfaction (<60%) → Slow payment (10-20 days) - at-risk accounts

    const satisfactionFactor = org.satisfactionScore / 100; // 0-1

    // Calculate target DSO for this org (inverse of satisfaction)
    // Excellent orgs (100% sat): 0 days, Good orgs (70% sat): 6 days, At-risk orgs (50% sat): 10 days, Poor orgs (0% sat): 20 days
    const baseDSO = 20 * (1 - satisfactionFactor);
    const targetDSO = Math.max(0, Math.min(20, baseDSO)); // Clamp between 0-20 days

    for (let monthOffset = 0; monthOffset < monthsToGenerate; monthOffset++) {
      const billDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - monthOffset,
        randomInt(1, 28)
      );

      // Skip if bill date is before account creation
      if (billDate < account.createdDate) continue;

      // Base amount with some variation
      const baseAmount = randomNormal(150, 50);

      // Service charges
      const serviceCharges = {};
      let totalServiceCharges = 0;
      services.forEach(service => {
        const utilization = account.serviceUtilization[service] / 100;
        const charge = Math.max(0, randomNormal(30 * utilization, 15));
        serviceCharges[service] = Math.round(charge * 100) / 100;
        totalServiceCharges += serviceCharges[service];
      });

      const totalAmount = Math.round((baseAmount + totalServiceCharges) * 100) / 100;

      // Generate surprise factor using weighted distribution
      // (heavily weighted towards low values for realistic bill predictability)
      const surpriseFactor = randomSurpriseFactor();

      // Payment behavior influenced by org satisfaction and churn risk
      let isPaid = false;
      let paidDate = null;

      // Older bills are more likely to be paid
      const billAge = monthOffset;

      // Payment probability increases with:
      // - Higher satisfaction
      // - Older bills
      // - Autopay enabled

      const autopayBoost = account.autopay ? 0.2 : 0;
      const ageBoost = Math.min(0.4, billAge * 0.05); // +5% per month old, max 40%
      const paymentProbability = Math.min(0.95,
        0.4 + (satisfactionFactor * 0.4) + autopayBoost + ageBoost
      );

      isPaid = randomBool(paymentProbability);

      if (isPaid) {
        // Payment timing based on targetDSO with variation
        const daysToPayment = Math.max(1, Math.round(randomNormal(targetDSO, targetDSO * 0.3)));
        paidDate = new Date(billDate.getTime() + daysToPayment * 24 * 60 * 60 * 1000);
      }

      const bill = {
        id: `BILL-${account.id}-${billDate.getFullYear()}${String(billDate.getMonth() + 1).padStart(2, '0')}`,
        accountId: account.id,
        organizationId: account.organizationId,
        billDate,
        dueDate: new Date(billDate.getTime() + 15 * 24 * 60 * 60 * 1000),
        amount: totalAmount,
        serviceCharges,
        paid: isPaid,
        paidDate: paidDate,
        surpriseFactor: Math.round(surpriseFactor * 100) / 100
      };

      bills.push(bill);
    }
  });

  return bills;
};

// Calculate DSO (Days Sales Outstanding) for organizations
export const calculateDSO = (bills, organizationId = null) => {
  const currentDate = new Date();
  const filteredBills = organizationId
    ? bills.filter(b => b.organizationId === organizationId)
    : bills;

  // Get bills from last 90 days
  const recentBills = filteredBills.filter(bill => {
    const daysSinceBill = (currentDate - bill.billDate) / (1000 * 60 * 60 * 24);
    return daysSinceBill <= 90;
  });

  if (recentBills.length === 0) return 0;

  // Calculate average days to payment
  let totalDays = 0;
  let billCount = 0;

  recentBills.forEach(bill => {
    if (bill.paid && bill.paidDate) {
      // For paid bills, calculate days between bill date and payment date
      const daysToPay = (bill.paidDate - bill.billDate) / (1000 * 60 * 60 * 24);
      totalDays += daysToPay;
      billCount++;
    } else if (!bill.paid) {
      // For unpaid bills, calculate days since bill date
      const daysOutstanding = (currentDate - bill.billDate) / (1000 * 60 * 60 * 24);
      totalDays += daysOutstanding;
      billCount++;
    }
  });

  return billCount > 0 ? Math.round(totalDays / billCount) : 0;
};

// Calculate monthly DSO trend
export const calculateMonthlyDSO = (bills, organizationId = null) => {
  const currentDate = new Date();
  const monthlyDSO = [];

  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 0);

    const filteredBills = bills.filter(bill => {
      const matchesOrg = !organizationId || bill.organizationId === organizationId;
      return matchesOrg && bill.billDate >= monthDate && bill.billDate <= monthEnd;
    });

    let totalDays = 0;
    let billCount = 0;

    filteredBills.forEach(bill => {
      if (bill.paid && bill.paidDate) {
        const daysToPay = (bill.paidDate - bill.billDate) / (1000 * 60 * 60 * 24);
        totalDays += daysToPay;
        billCount++;
      } else if (!bill.paid) {
        const daysOutstanding = (currentDate - bill.billDate) / (1000 * 60 * 60 * 24);
        totalDays += daysOutstanding;
        billCount++;
      }
    });

    const dso = billCount > 0 ? Math.round(totalDays / billCount) : 0;

    monthlyDSO.push({
      month: monthDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }),
      date: monthDate,
      dso
    });
  }

  return monthlyDSO;
};

// Predict next month's DSO using simple linear regression
export const predictNextMonthDSO = (monthlyDSO) => {
  if (monthlyDSO.length < 3) return monthlyDSO[monthlyDSO.length - 1]?.dso || 0;

  // Use last 6 months for prediction
  const recentData = monthlyDSO.slice(-6);
  const n = recentData.length;

  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;

  recentData.forEach((point, index) => {
    const x = index;
    const y = point.dso;
    sumX += x;
    sumY += y;
    sumXY += x * y;
    sumX2 += x * x;
  });

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  const prediction = Math.round(slope * n + intercept);
  return Math.max(0, prediction); // DSO can't be negative
};

// Generate complete dataset with realistic correlations
export const generateMockData = () => {
  // Generate organizations with base satisfaction (churn risk calculated later)
  const organizations = generateOrganizations(25);
  const accounts = generateAccounts(organizations);

  // Generate bills with payment behavior influenced by org satisfaction
  const bills = generateBills(accounts, organizations);

  // Calculate DSO for each organization and use it to determine churn risk
  const orgDSO = {};
  organizations.forEach(org => {
    const dso = calculateDSO(bills, org.id);
    orgDSO[org.id] = dso;
  });

  // Add DSO to organization data and calculate churn risk based on DSO
  // DSO → Churn Risk relationship:
  // 0-2 days (excellent) → Low churn risk (0.1-0.25)
  // 3-10 days (good) → Medium churn risk (0.3-0.55)
  // 10-20 days (at-risk) → High churn risk (0.6-0.85)
  const orgsWithDSO = organizations.map(org => {
    const dso = orgDSO[org.id] || 0;

    // Calculate churn risk based on DSO with some randomness
    let churnRisk;
    if (dso <= 2) {
      // Excellent DSO → Low churn risk
      churnRisk = random(0.1, 0.25);
    } else if (dso <= 10) {
      // Good DSO → Medium churn risk (proportional to DSO)
      const dsoFactor = (dso - 2) / 8; // 0-1 range for DSO 2-10
      churnRisk = random(0.25 + dsoFactor * 0.15, 0.4 + dsoFactor * 0.15);
    } else {
      // At-risk DSO → High churn risk (proportional to DSO)
      const dsoFactor = Math.min(1, (dso - 10) / 10); // 0-1 range for DSO 10-20
      churnRisk = random(0.6 + dsoFactor * 0.1, 0.75 + dsoFactor * 0.1);
    }

    return {
      ...org,
      dso,
      churnRisk: Math.min(0.95, churnRisk), // Cap at 95%
      churnRiskCategory: getChurnRisk(churnRisk)
    };
  });

  return {
    organizations: orgsWithDSO,
    accounts,
    bills
  };
};

// Generate and export data
const mockData = generateMockData();

export const organizations = mockData.organizations;
export const accounts = mockData.accounts;
export const bills = mockData.bills;

export default mockData;
