# Uni Payment Flow Studio (UPFS)

<div align="center">
  <img src="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=1200&auto=format&fit=crop&q=80" width="100%" alt="UPFS Banner" style="border-radius: 12px; max-height: 280px; object-fit: cover;" />

  <br />

  [![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
  [![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)
</div>

---

## 📌 Overview

**Uni Payment Flow Studio (UPFS)** is an enterprise-grade visual workflow orchestration engine designed for high-throughput payment rails, multi-jurisdiction banking, automated treasury sweeps, fixed deposits, mutual fund SIPs, and stock clearing. 

It provides an interactive, directed acyclic graph (DAG) canvas that allows financial engineers, treasury managers, and fintech developers to compose, validate, wire, and execute complex fund flows with topological sorting, cycle detection, and real-time step tracing.

---

## ✨ Key Features

### 1. 🔀 Visual Workflow Studio (DAG Engine)
- **Interactive Drag & Connect**: Wire output ports to input ports with real-time snap detection, animated Bezier splines, and interactive wire disconnection badges.
- **Topological Sorting Execution**: Kahn’s Topological Sort Algorithm guarantees dependency-accurate sequential execution from triggers down to payouts.
- **Graph Cycle & Self-Loop Prevention**: Real-time BFS cycle detection blocks accidental circular references and duplicate edges.
- **Dynamic Bezier Routing**: Auto-calculates smooth forward S-curves ($\Delta X \ge 20\text{px}$) and smart backward loop offsets.
- **Live Step Pulse & Status Tracing**: Color-coded execution states (Active `#ff6d5a`, Completed `#10b981`, Idle `#3b3f54`).

### 2. 🏛️ Global Banking Hub & Penny Drop
- Multi-country bank account linking (HDFC, ICICI, SBI, JPMorgan, Barclays, DBS).
- Automated ₹1.00 / $0.01 Penny Drop verification with IMPS / FedNow verification codes.
- Real-time routing number, IFSC, and SWIFT BIC validation with dual operating balances.

### 3. 📈 Treasury Auto-Sweep & Fixed Deposits (FD / CD)
- Configurable threshold triggers (e.g., sweep all funds exceeding ₹50,000 / $10,000 into high-yield deposits).
- Tiered tenure yield calculation (7.25% APY, compound interest tables, and break penalty simulation).

### 4. 📊 Mutual Funds & Automated SIPs
- Automated recurring Systematic Investment Plans (SIP) into Index, Large-Cap, and Treasury funds.
- Live NAV fetching simulation, expense ratio monitoring, and asset allocation splitters.

### 5. 📉 Demat & Stock Holdings (CDSL / DTC Clearing)
- CDSL BOID & DTC depository account resolution.
- T+1 / Real-time clearing with auto-margin lock and pre-funded trade settlement.

### 6. 👤 Identity, CKYC & Multi-Account Aggregation
- Central identity node binding customer legal name, government ID (PAN, SSN, Aadhaar), and aggregated linked bank accounts.
- Multi-persona switcher (Alex Rivera, Priya Sharma, Marcus Vance) with CKYC Tier-3 verification status.

---

## 🏗️ Architecture & Project Structure

```
├── public/                     # Static assets and favicons
├── src/
│   ├── components/
│   │   ├── AccountSignIn.tsx       # Auth portal & KYC profile switcher
│   │   ├── DematHoldingsHub.tsx    # Depository & equity clearing viewer
│   │   ├── GlobalBankingHub.tsx    # Multi-currency bank account & penny drop manager
│   │   ├── MutualFundsHub.tsx      # Mutual fund portfolios & automated SIP rules
│   │   ├── NodePaletteModal.tsx    # Add Node template catalog (Fintech building blocks)
│   │   ├── NodeParameterModal.tsx  # Node configuration, raw JSON I/O, & wire linking
│   │   ├── WorkflowCanvas.tsx      # SVG-powered DAG canvas with panning & zoom
│   │   ├── WorkflowNavbar.tsx      # Top bar, workflow naming, and execution triggers
│   │   ├── WorkflowPreview.tsx     # Summary overview of active pipelines
│   │   └── WorkflowSidebar.tsx     # Financial Studio Hub navigation sidebar
│   ├── data/
│   │   └── workflowData.ts         # Default DAG graph nodes, edges, & template catalog
│   ├── App.tsx                     # Main layout coordinator, DAG runner, & state store
│   ├── index.css                   # Tailwind CSS v4 design system tokens
│   └── main.tsx                    # Application entrypoint
├── index.html                      # HTML entrypoint & typography fonts
├── metadata.json                   # Applet configuration & permissions
├── package.json                    # Project dependencies and npm scripts
├── tsconfig.json                   # TypeScript compiler options
└── vite.config.ts                  # Vite build configuration
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18.0 or higher recommended)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-org/uni-payment-flow-studio.git
   cd uni-payment-flow-studio
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be running at `http://localhost:3000`.

---

## 🛠️ Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the Vite local development server on port 3000 |
| `npm run build` | Compiles TypeScript and builds optimized production bundles to `/dist` |
| `npm run preview` | Previews the production build locally |
| `npm run lint` | Runs TypeScript static type checking without emitting files (`tsc --noEmit`) |
| `npm run clean` | Removes build artifacts and cached output directories |

---

## 🧩 Node Template Catalog

UPFS includes predefined banking and fintech node templates ready to drop into any canvas:

| Category | Node Name | Description |
| :--- | :--- | :--- |
| **Identity** | `Identity & Multi-Bank Aggregator` | Aggregates user KYC, ID verification, and linked depository accounts |
| **Banking** | `Bank Account (Savings / Operating)` | Source or target banking endpoint with Penny Drop validation |
| **Treasury** | `Auto-Sweep Rule Engine` | Rule-based liquidity rebalancer transferring surplus cash into yield |
| **Investments** | `Fixed Deposit (FD / CD)` | High-yield guaranteed term deposits with automated tenure rollover |
| **Investments** | `Mutual Fund SIP Trigger` | Systematic recurring purchase of direct growth index/equity funds |
| **Clearing** | `Demat Stock Clearing` | Depository trade settlement with automated margin allocation |
| **Payouts** | `Instant Real-time Payout (UPI / IMPS / RTP)` | Low-latency instant disbursement rail with webhook dispatch |

---

## 🛡️ License

Distributed under the **MIT License**. See `LICENSE` for more information.
