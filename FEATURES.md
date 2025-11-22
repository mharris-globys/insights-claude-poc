# Telecom Insights Portal - Feature List

## All Implemented Features

### 🔐 Authentication
- **Login Screen** - Username/password authentication (accepts any credentials for POC)
- **Logout Functionality** - Logout button in header that returns to login page
- **Session Management** - State is cleared on logout

### 🎨 UI/UX
- **Dark Mode Toggle** - Switch between light and dark themes (button in top right)
- **Responsive Design** - Works on desktop and tablet devices
- **Interactive Charts** - Hover tooltips on all visualizations
- **Sortable Tables** - Click column headers to sort (ascending/descending)

### 🔍 Filtering & Search
- **Type-Ahead Search** - Search for organizations or accounts with auto-suggestions
  - Search by organization name or ID
  - Search by account phone number or ID
  - Shows up to 10 suggestions with relevant details
  - Click to select and filter data

- **Organization Size Filter** - Filter by Small/Medium/Large/Enterprise
- **Churn Risk Filter** - Filter by Low/Medium/High risk
- **Drill-Down** - Click any organization in the table to view only that organization's data

### 📊 Metrics Dashboard
- **8 Overview Metric Cards**:
  1. Total Organizations
  2. Total Accounts
  3. Average Satisfaction Score
  4. Autopay Adoption Rate
  5. Paperless Adoption Rate
  6. High Churn Risk Percentage
  7. Average Service Usage
  8. Total Revenue

### 📈 Visualizations

#### 1. Service Utilization Chart (Bar Chart)
- Shows average utilization across 5 service types
- Services: Voice, Data, SMS, Roaming, International
- Updates based on selected org/account filter

#### 2. Organization Satisfaction Chart (Scatter Plot)
- X-axis: Number of accounts
- Y-axis: Satisfaction score
- Color-coded by churn risk (Green=Low, Orange=Medium, Red=High)
- Interactive tooltips show org name, satisfaction, accounts, and churn risk
- Updates based on filters

#### 3. Autopay & Paperless Adoption (Dual Pie Charts)
- Side-by-side pie charts showing adoption rates
- Left: Autopay enabled vs manual payment
- Right: Paperless enabled vs paper billing
- Updates based on selected org/account

#### 4. Bill Surprise Factor (Line Chart)
- **Two Modes**:
  - **Overview Mode** (when no org selected): Shows top 15 organizations by average surprise factor
  - **Drill-Down Mode** (when org/account selected): Shows monthly trend over time with latest month as current
- Automatically switches modes based on selection
- Chart title updates to indicate "(Monthly Trend)" when in drill-down mode

#### 5. Churn Risk Distribution (Bar Chart)
- Shows count of organizations by risk category
- Color-coded: Green (Low), Orange (Medium), Red (High)
- Updates based on filters

### 📋 Organization Details Table
- **Sortable Columns** - Click any column header to sort
  - Sort indicators: ⇅ (unsorted), ↑ (ascending), ↓ (descending)
  - All 8 columns are sortable

- **Displayed Columns**:
  1. Organization (name + ID)
  2. Size (badge with category)
  3. Account Count
  4. Satisfaction Score (progress bar + percentage)
  5. Churn Risk (badge with category + percentage)
  6. Autopay Adoption %
  7. Paperless Adoption %
  8. Average Bill Amount

- **Click to Drill Down** - Click any row to filter all charts to that organization
- **Visual Selection** - Selected row is highlighted in blue
- **Hover Effects** - Rows highlight on mouse over

### 🔄 Dynamic Data Relationships
- **Smart Filtering**: Selecting a specific account automatically shows its parent organization
- **Cascading Updates**: All charts and metrics update simultaneously when filters change
- **Context Preservation**: Selection banner shows what is currently filtered
- **Clear Selection**: One-click button to return to full view

### 💾 Mock Data
- **25 Organizations** - Mix of Small (1-5 accounts), Medium (6-20), Large (21-50), Enterprise (50+)
- **300+ Accounts** - Distributed across organizations with realistic patterns
- **3,000+ Bills** - 12 months of billing data per account
- **Realistic Correlations**:
  - Higher satisfaction tends toward lower churn risk
  - Normal distribution of most metrics
  - Varying service utilization patterns
  - Surprise factor variations showing billing unpredictability

## Technical Implementation

### State Management
- React useState for UI state (login, dark mode, filters)
- useMemo for performance-optimized data filtering
- useEffect for side effects (dark mode class application)

### Component Architecture
- **App.jsx** - Main container with auth and theme logic
- **Filters.jsx** - Search and filter controls with type-ahead
- **MetricsCards.jsx** - Overview statistics cards
- **ServiceUtilization.jsx** - Bar chart component
- **SatisfactionChart.jsx** - Scatter plot component
- **AutopayPaperlessChart.jsx** - Dual pie chart component
- **BillSurpriseChart.jsx** - Line chart with dual-mode logic
- **ChurnRiskChart.jsx** - Bar chart component
- **OrganizationTable.jsx** - Sortable table with drill-down

### Styling
- CSS modules with dark mode support
- Responsive design with media queries
- Consistent color scheme and spacing
- Smooth transitions and hover effects

## Feature Highlights

### Type-Ahead Search
The search box provides real-time suggestions as you type:
- Minimum 2 characters to trigger suggestions
- Searches across organization names, IDs, account phone numbers, and IDs
- Shows 5 organizations + 5 accounts maximum
- Click outside to close, or select a suggestion
- Disables size/risk filters when specific org/account is selected

### Bill Surprise Factor Intelligence
When no organization is selected:
- Shows top 15 organizations ranked by average surprise factor
- Helps identify organizations with most unpredictable billing

When an organization or account is selected:
- Switches to monthly trend view automatically
- Shows surprise factor over last 12 months
- Latest month represents current billing period
- Helps identify billing volatility patterns over time

### Sortable Table
Click any column header to sort:
- **Organization**: Alphabetical by name
- **Size**: Small → Medium → Large → Enterprise
- **Accounts**: Numerical count
- **Satisfaction**: Score percentage
- **Churn Risk**: Risk score (0-1)
- **Autopay/Paperless**: Adoption percentage
- **Avg Bill**: Dollar amount

Clicking the same header toggles between ascending and descending order.

### Dark Mode
Toggle in top-right corner:
- Switches entire application to dark theme
- Preserves all functionality and readability
- Dark blues and purples for professional look
- Light text on dark backgrounds

## Data Flow

1. User logs in → Sets `isLoggedIn` to true
2. User applies filters → `filters` state updates
3. `filteredData` memo recalculates → Filters organizations, accounts, and bills
4. All components receive updated `filteredData` → Charts and table re-render
5. User selects organization → `selectedOrgId` updates → All views narrow to that org
6. BillSurpriseChart detects selection → Switches to monthly trend mode
7. User clears selection → Returns to overview mode

## Browser Requirements
- Modern browser with ES6+ support
- JavaScript enabled
- Minimum 1024px width recommended for optimal experience
- Works on Chrome, Firefox, Safari, Edge (latest versions)

## Performance Optimizations
- useMemo prevents unnecessary recalculations
- Component-level styling reduces CSS overhead
- Efficient filtering algorithms
- Debounced search (via React state batching)
- Virtual DOM updates only changed components
