# Quick Start Guide

## Get Up and Running in 30 Seconds

### 1. Open a Terminal

Navigate to the project directory:

```bash
cd c:\src\git\insights-poc
```

### 2. Start the Development Server

```bash
npm run dev
```

### 3. Open Your Browser

The portal will automatically open at: **http://localhost:3000**

If it doesn't open automatically, manually navigate to http://localhost:3000 in your browser.

## What You'll See

You'll be greeted with a fully interactive dashboard showing:

- 📊 **8 Metric Cards** with key statistics
- 📈 **5 Interactive Charts** visualizing different aspects of telecom data
- 📋 **Organization Table** with 25 sample organizations
- 🔍 **Filters** for organization size and churn risk
- 🖱️ **Click any organization** in the table to drill down

## Try These Features

1. **Filter by Organization Size**
   - Use the "Organization Size" dropdown to filter by Small, Medium, Large, or Enterprise

2. **Filter by Churn Risk**
   - Use the "Churn Risk" dropdown to show only Low, Medium, or High risk organizations

3. **Click an Organization**
   - Click any row in the organization table
   - All charts and metrics update to show only that organization's data
   - A blue banner appears showing which organization is selected
   - Click "Clear Selection" to return to the full view

4. **Explore the Charts**
   - Hover over any chart element for detailed tooltips
   - Observe how different organizations perform across metrics

## Sample Insights You Can Discover

- Which organizations have the highest churn risk?
- How does satisfaction correlate with account count?
- What's the autopay and paperless adoption rate?
- Which organizations have the most surprising bills?
- How are services being utilized across the customer base?

## Stopping the Server

Press `Ctrl+C` in the terminal to stop the development server.

## Next Steps

See the full **README.md** for:
- Detailed feature descriptions
- Production build instructions
- Self-hosting options
- Data model explanation
