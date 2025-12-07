# Lakehouse Viewer: High-Performance Analytics Dashboard

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Stack](https://img.shields.io/badge/stack-React%20%7C%20FastAPI%20%7C%20DuckDB%20%7C%20Docker-orange)

## 🚀 Overview
**Lakehouse Viewer** is a full-stack data analytics application designed to simulate a **Databricks/Delta Lake** environment locally. 

It handles the ingestion, processing, and visualization of **1,000,000+ rows** of sales data. By leveraging **DuckDB** (as an embedded OLAP engine) and **Parquet** (Columnar Storage), the application achieves sub-50ms query performance for aggregations and filtering, demonstrating how modern "Lakehouse" architectures decouple storage from compute.

## 🎯 Key Features (Aligned with Enterprise Requirements)

*   **Big Data Simulation:** Automatically generates **1 Million rows** of synthetic data using **Vectorized NumPy operations** on startup.
*   **OLAP Architecture:** Uses **DuckDB** to query **Parquet** files directly, mimicking the performance benefits of Databricks SQL / Delta Lake without the cloud overhead.
*   **Interactive Analytics:**
    *   **Drill-Down:** Clicking a bar in the Revenue Chart instantly filters the detailed grid below.
    *   **Server-Side Filtering:** Implements **Parameterized Queries** in FastAPI to prevent SQL injection and ensure efficient data retrieval.
*   **High-Performance UI:**
    *   **Virtualization:** Uses **Ag-Grid** to render large datasets without DOM lag.
    *   **State Management:** Uses **TanStack Query (React Query)** for caching, background refetching, and eliminating UI flickering.
*   **DevOps Ready:** Fully containerized with **Docker** and **Docker Compose** for consistent deployment.

## 🛠️ Tech Stack

### Frontend
*   **Framework:** React 18 (Vite)
*   **State/Cache:** TanStack Query (React Query v5)
*   **Visualization:** Recharts (Responsive D3 wrapper)
*   **Data Grid:** AG Grid (Enterprise-grade table virtualization)
*   **Styling:** Tailwind CSS

### Backend
*   **API:** Python FastAPI (Async support)
*   **Compute Engine:** DuckDB (In-process SQL OLAP)
*   **Data Processing:** Pandas & NumPy (Vectorized generation)
*   **Storage Format:** Parquet (Columnar)

### Infrastructure
*   **Containerization:** Docker (Node 20-Alpine & Python 3.11-Slim)
*   **Orchestration:** Docker Compose

---

## ⚡ Quick Start

### Prerequisites
*   Docker Desktop installed.

### Installation
1.  **Clone the repository**
    ```bash
    git clone https://github.com/pswitchy/Lakehouse-Viewer.git
    cd Lakehouse-Viewer
    ```

2.  **Run with Docker Compose**
    ```bash
    docker-compose up --build
    ```
    *Note: The first run may take a few seconds to generate the 1 Million row Parquet file.*

3.  **Access the Application**
    *   **Dashboard:** [http://localhost:5173](http://localhost:5173)
    *   **API Docs (Swagger):** [http://localhost:8000/docs](http://localhost:8000/docs)

---

## 🏗️ Architecture Decisions

### Why DuckDB + Parquet?
Traditional row-based databases (PostgreSQL/SQLite) struggle with analytical queries (aggregations) on large datasets.
*   **Parquet** allows for high compression and column-based reading (reading only the "Category" and "Amount" columns, ignoring others).
*   **DuckDB** acts as a local "Databricks Cluster," performing vectorized query execution on that Parquet file.
*   **Result:** Aggregating 1M rows takes milliseconds, making the UI feel instant.

### Why TanStack Query?
Instead of manually managing `useEffect` and loading states, TanStack Query handles:
*   **Stale-while-revalidate:** The UI shows old data while fetching new data when filters change.
*   **Caching:** Switching back to a previously visited category is instant.

---

## Screenshot

<img width="1470" height="790" alt="Screenshot 2025-12-07 at 9 20 18 PM" src="https://github.com/user-attachments/assets/7d74d1f2-b490-4ea3-a96d-f12e594db171" />

