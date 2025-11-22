# Telecom Insights Portal - POC

A proof-of-concept interactive dashboard for viewing telecom account insights and trends across organizations.

## Features

- **Comprehensive Metrics Dashboard**: Overview cards showing key statistics
- **Service Utilization**: Bar chart showing average usage across Voice, Data, SMS, Roaming, and International services
- **Organization Satisfaction**: Scatter plot correlating satisfaction scores with account counts, color-coded by churn risk
- **Autopay & Paperless Adoption**: Pie charts showing adoption rates
- **Churn Risk Analysis**: Distribution of organizations by risk category (Low/Medium/High)
- **Bill Surprise Factor**: Line chart showing organizations with unexpected billing variations
- **Interactive Organization Table**: Clickable table with drill-down capabilities
- **Filtering**: Filter by organization size and churn risk level
- **Drill-Down**: Click any organization in the table to view its specific metrics

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **Recharts** - Charting library
- **Mock Data** - Comprehensive generated dataset with 25 organizations, 300+ accounts, and 3000+ bills

## Data Model

The portal works with three main entities:

1. **Organizations**: Business customers with multiple accounts
   - Size classification (Small/Medium/Large/Enterprise)
   - Satisfaction scores
   - Churn risk levels
   - Adoption metrics

2. **Accounts**: Individual customer accounts grouped under organizations
   - Service utilization per service type
   - Autopay and paperless preferences
   - Account status

3. **Bills**: Monthly bills per account
   - Service charges breakdown
   - Surprise factor (deviation from expected amount)
   - Payment status and dates

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn

### Installation

1. Navigate to the project directory:
   ```bash
   cd c:\src\git\insights-poc
   ```

2. Install dependencies (already done if you followed the build steps):
   ```bash
   npm install
   ```

### Running the Application

Start the development server:

```bash
npm run dev
```

This will:
- Start the Vite dev server on http://localhost:3000
- Automatically open the portal in your default browser
- Enable hot module replacement for instant updates

### Building for Production

Build the optimized production bundle:

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Preview Production Build

To preview the production build locally:

```bash
npm run preview
```

## Self-Hosting Options

### Option 1: Development Server (Recommended for POC)

Simply run `npm run dev` and access at http://localhost:3000

### Option 2: Production Build + Simple HTTP Server

1. Build the application:
   ```bash
   npm run build
   ```

2. Serve the `dist` folder using any static file server:

   **Using Python:**
   ```bash
   cd dist
   python -m http.server 8000
   ```

   **Using Node.js http-server:**
   ```bash
   npx http-server dist -p 8000
   ```

   **Using the built-in Vite preview:**
   ```bash
   npm run preview
   ```

3. Access at http://localhost:8000 (or the port you specified)

### Option 3: Deploy to Static Hosting

The built application (in `dist/`) can be deployed to:
- GitHub Pages
- Netlify
- Vercel
- AWS S3 + CloudFront
- Any static web hosting service

## Using the Portal

### Filters

Use the filter dropdowns at the top to:
- Filter by **Organization Size**: Small, Medium, Large, or Enterprise
- Filter by **Churn Risk**: Low, Medium, or High risk categories

### Interactive Features

1. **Click on any organization** in the table to drill down and view only that organization's data
2. When an organization is selected, a banner appears showing which organization is selected
3. Click **Clear Selection** to return to the full view
4. Hover over chart elements for detailed tooltips
5. All metrics and charts update dynamically based on filters and selections

### Understanding the Metrics

- **Satisfaction Score**: Organization satisfaction rating (0-100%)
- **Churn Risk**: Probability of organization leaving (shown as percentage and category)
- **Autopay/Paperless Adoption**: Percentage of accounts using these features
- **Service Utilization**: Average usage percentage across service types
- **Bill Surprise Factor**: How unexpected the bill amounts are (higher = more surprising)

## Mock Data

The application generates realistic mock data on load:
- 25 organizations with varying sizes
- 300+ accounts distributed across organizations
- 3,000+ bills spanning 12 months
- Realistic correlations (e.g., higher satisfaction = lower churn risk)
- Normal distribution of metrics for realistic patterns

## Browser Compatibility

Modern browsers with ES6+ support:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Performance

The application is optimized for:
- Fast initial load with code splitting
- Efficient re-renders using React useMemo
- Responsive design for desktop and tablet devices
- Smooth interactions and transitions

## Future Enhancements (Beyond POC Scope)

- Real API integration
- Export to CSV/PDF
- Date range filtering
- Trend analysis over time
- User authentication
- Customizable dashboards
- Alert notifications for high-risk accounts

## Troubleshooting

### Port already in use
If port 3000 is already in use, Vite will automatically try the next available port.

### Dependencies issues
If you encounter dependency issues, try:
```bash
rm -rf node_modules package-lock.json
npm install
```

### Build errors
Ensure you're using Node.js v16 or higher:
```bash
node --version
```

## License

This is a proof-of-concept demonstration application.
