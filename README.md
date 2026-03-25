# Deal Widget — Zoho CRM Embedded Widget

A custom Zoho CRM widget built with React that provides an enhanced interface for managing **Deals**, **Related Quotes**, and **Data Transactions** directly within a Deal record page.

## Features

- **Deal Details** — View and edit deal information (Deal Name, Contact, Account, Amount)
- **Related Quotes Management**
  - View related quotes in a paginated table
  - Create new quotes with product line items
  - Edit existing quotes (subject, stage, carrier, products)
  - Delete quotes with confirmation
- **Data Transactions (Subform)**
  - Display transaction subform data in a table
  - Add new transactions via dialog
  - Inline edit existing transactions
  - Delete transactions with confirmation
  - All changes persist to Zoho CRM automatically

## Tech Stack

| Layer        | Technology                            |
| ------------ | ------------------------------------- |
| Framework    | React 19                              |
| Bundler      | Vite 7                                |
| UI Library   | MUI v7 (Material UI)                  |
| CRM SDK      | Zoho Embedded App SDK v1.2            |

## Project Structure

```
src/
├── main.jsx                  → App entry point
├── App.jsx                   → Zoho SDK init, page load handler
├── App.css                   → Root layout styles
└── components/
    ├── Header.jsx            → Widget title bar
    ├── DealDetails.jsx       → Deal form + orchestrates child components
    ├── RelatedQuotes.jsx     → Quotes section layout
    ├── TableComponent.jsx    → Paginated quotes table with actions
    ├── CreateQuotes.jsx      → Create quote dialog with product picker
    ├── EditQuotes.jsx        → Edit quote dialog
    ├── DeleteRecord.jsx      → Delete confirmation dialog
    └── DataTransaction.jsx   → Transaction subform CRUD table
```

## Prerequisites

- **Node.js** ≥ 18
- A **Zoho CRM** account with widget development access
- The widget must be deployed/tested inside a Zoho CRM Deal record page

## Getting Started

### Install dependencies

```bash
npm install
```

### Run in development mode

```bash
npm run dev
```

### Build for production

```bash
npm run build
```

The production bundle will be output to the `dist/` folder, ready for uploading to Zoho CRM as a widget.

## Zoho CRM Setup

1. **Create a Widget** in Zoho CRM Developer Console (Settings → Developer Hub → Widgets)
2. Set the widget hosting type to **External** and point it to your dev server URL or upload the built `dist/` folder
3. **Attach the widget** to the Deals module as a **Button / Related List / Web Tab** widget
4. Ensure the following are configured in your Zoho CRM org:
   - `Subform_1` subform on the Deals module (with fields: `Transaction_Name`, `Transaction_Email`, `Transaction_Amount`, `Transaction_Date`)
   - A Zoho CRM serverless function named `quotesWidget` that returns `Quote_Stage` and `Carrier` field picklist options
   - Products module with records (used in quote creation)

## Zoho CRM APIs Used

| API                                    | Purpose                          |
| -------------------------------------- | -------------------------------- |
| `ZOHO.embeddedApp.on("PageLoad")`      | Get record ID & module context   |
| `ZOHO.CRM.API.getRecord`              | Fetch deal record details        |
| `ZOHO.CRM.API.updateRecord`           | Update deal / quote / subform    |
| `ZOHO.CRM.API.getRelatedRecords`      | Fetch related quotes             |
| `ZOHO.CRM.API.getAllRecords`           | Fetch all products               |
| `ZOHO.CRM.API.insertRecord`           | Create a new quote               |
| `ZOHO.CRM.API.deleteRecord`           | Delete a quote                   |
| `ZOHO.CRM.FUNCTIONS.execute`          | Call serverless function          |
| `ZOHO.CRM.UI.Resize`                  | Resize widget window             |
| `ZOHO.CRM.UI.Popup.closeReload`       | Close widget & reload parent     |

## Scripts

| Command           | Description                    |
| ----------------- | ------------------------------ |
| `npm run dev`     | Start Vite dev server with HMR |
| `npm run build`   | Production build to `dist/`    |
| `npm run preview` | Preview production build       |
| `npm run lint`    | Run ESLint                     |
