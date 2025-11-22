# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A React-based telecom analytics dashboard (proof-of-concept) that visualizes organization metrics, DSO (Days Sales Outstanding), churn risk, and service utilization. Built with Vite, React 18, and Recharts for data visualization.

## Common Commands

### Development
```bash
npm run dev          # Start dev server on http://localhost:3000 (auto-opens browser)
npm run build        # Create production build in dist/
npm run preview      # Preview production build locally
```

### First-Time Setup
```bash
npm install          # Install all dependencies
```

## Architecture

### Data Flow & State Management

The application uses a **centralized filtering architecture** where all data filtering happens in `App.jsx`:

1. **Mock Data Generation** (`src/mockData.js`)
   - Generates 25 organizations, 300+ accounts, 3000+ bills on application load
   - Bills are generated first, then DSO is calculated per organization
   - DSO influences satisfaction scores and churn risk (high DSO → lower satisfaction, higher churn)
   - Important functions: `generateOrganizations()`, `generateAccounts()`, `generateBills()`, `calculateDSO()`, `calculateMonthlyDSO()`, `predictNextMonthDSO()`

2. **Filtering Logic** (`App.jsx` lines 38-79)
   - Uses `useMemo` to prevent unnecessary recalculations
   - Filter hierarchy: Account selection → Organization selection → Size/Churn filters
   - When a specific account is selected, automatically shows its parent organization
   - All components receive `filteredData` prop containing pre-filtered organizations, accounts, and bills

3. **Component Communication**
   - Parent-to-child: `App.jsx` passes `filteredData` down to all visualization components
   - Child-to-parent: Components like `OrganizationTable` and `SatisfactionChart` call `onOrgClick` callback to update selection
   - No props drilling beyond 2 levels; state lives in `App.jsx`

### Key Components

**App.jsx** (Main container)
- Manages authentication, theme, and all filter state
- Performs all data filtering in `filteredData` useMemo
- Handles organization/account selection logic
- Login accepts any credentials (POC only)

**Filters.jsx**
- Type-ahead search across organizations and accounts
- Organization size and churn risk dropdowns
- Search disabled when filters are active (to avoid confusion)

**InsightBox.jsx**
- AI-powered insights component that analyzes current data
- Generates 3 contextual insights based on DSO, churn, satisfaction, adoption rates
- Uses priority system: Critical → Warning → Info → Success → Opportunity

**DSOTrendChart.jsx**
- Full-width chart showing 12-month DSO history + next month prediction
- Uses linear regression for prediction (based on last 6 months)
- Displays current and predicted DSO in metric cards
- Color-codes data points by DSO thresholds (0-2 days: green, 3-10: yellow, 10+: red)

**OrganizationTable.jsx**
- Sortable table with 8 columns (click headers to sort)
- Click any row to drill down to that organization
- Selected row is highlighted
- Custom sort logic for size (Small → Medium → Large → Enterprise)

**BillSurpriseChart.jsx**
- **Dual-mode behavior**:
  - Overview mode (no selection): Shows top 15 orgs by average surprise factor
  - Drill-down mode (org/account selected): Shows monthly trend for that entity
- Automatically switches modes based on `selectedOrgId` prop

### Data Correlation Design

DSO is the central metric that influences other data points:

- **High DSO (10+ days)**:
  - Satisfaction reduced by 12 points
  - Churn risk increased by 0.3
- **Moderate DSO (3-10 days)**:
  - Satisfaction reduced by 6 points
  - Churn risk increased by 0.15
- **Low DSO (0-2 days)**: No impact (healthy state)

Organizations with >70% autopay adoption typically have DSO < 5 days.

### Styling System

- Each component has its own CSS file (e.g., `MetricsCards.jsx` → `MetricsCards.css`)
- Global styles in `App.css` and `index.css`
- Dark mode implemented via `.dark-mode` class on `<body>` element
- Theme toggle controlled in `App.jsx` with `useEffect` to apply/remove class
- All components have dark mode variants using `.dark-mode` CSS selector

## Development Patterns

### Adding a New Chart Component

1. Create component file in `src/components/` (e.g., `NewChart.jsx`)
2. Accept `data` prop containing `{ organizations, accounts, bills }`
3. Use `useMemo` for any expensive calculations on filtered data
4. Import in `App.jsx` and add to charts grid
5. Create corresponding CSS file for styling with dark mode support
6. Test with filters to ensure data updates correctly

### Adding a New Metric

1. Calculate metric in the component using `filteredData`
2. If metric needs to appear in overview cards, modify `MetricsCards.jsx`
3. If metric influences correlations, update mock data generation in `mockData.js`
4. Update DSO calculation logic if metric should affect DSO

### Modifying Filter Behavior

All filter logic lives in the `filteredData` useMemo hook in `App.jsx:38-79`. The hierarchy is:
1. Check if specific account selected → filter to that account + its org
2. Else check if specific org selected → filter to that org
3. Else apply size and churn risk filters
4. Finally filter accounts by org IDs, then bills by account IDs

## Special Behaviors to Preserve

1. **Type-ahead search**: Minimum 2 characters to trigger suggestions
2. **Selection banner**: Shows in two places (header and below filters) when org/account selected
3. **Dark mode**: Must apply to `document.body` via `useEffect`, not just root div
4. **Bill Surprise Chart mode switching**: Automatically detects drill-down state
5. **DSO thresholds**: 0-2 (green), 3-10 (yellow), 10+ (red) - do not change without updating docs
6. **Login**: Currently accepts any username/password (POC only)

## Technical Constraints

- React 18 with Vite 5 (ES modules only - `"type": "module"` in package.json)
- All JavaScript files must use `.jsx` extension if they contain JSX
- Recharts for all visualizations (don't introduce new charting libraries)
- No backend - all data generated client-side in `mockData.js`
- Mock data regenerates on every page load (not persisted)

## File Organization

```
src/
├── App.jsx                        # Main container, auth, filtering
├── App.css                        # Global app styles
├── main.jsx                       # Entry point
├── index.css                      # Global base styles
├── mockData.js                    # Data generation and DSO calculations
└── components/
    ├── Filters.jsx                # Search and filter controls
    ├── Filters.css
    ├── InsightBox.jsx             # AI insights display
    ├── InsightBox.css
    ├── MetricsCards.jsx           # Overview metrics (9 cards)
    ├── MetricsCards.css
    ├── DSOTrendChart.jsx          # DSO trend with prediction
    ├── OrganizationTable.jsx      # Sortable org table
    ├── OrganizationTable.css
    ├── ServiceUtilization.jsx     # Bar chart
    ├── SatisfactionChart.jsx      # Scatter plot
    ├── AutopayPaperlessChart.jsx  # Dual pie charts
    ├── BillSurpriseChart.jsx      # Line chart (dual-mode)
    └── ChurnRiskChart.jsx         # Bar chart
```

## Port Configuration

Default dev server port is 3000 (configured in `vite.config.js`). Vite automatically tries next available port if 3000 is in use.
