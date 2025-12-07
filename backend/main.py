from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import duckdb
import pandas as pd
import numpy as np
from faker import Faker
import random
import os

app = FastAPI()

# Allow CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

PARQUET_FILE = "sales_data.parquet"

def generate_parquet_data():
    """Generates a Parquet file with 1 MILLION rows efficiently."""
    if not os.path.exists(PARQUET_FILE):
        print("Generating 1,000,000 rows (Simulating Enterprise Big Data)...")
        
        # 1. Define constants
        NUM_ROWS = 1_000_000
        categories = ['Enterprise', 'SaaS', 'Consumer', 'Healthcare', 'FinTech']
        regions = ['NA', 'EMEA', 'APAC', 'LATAM']
        statuses = ['Completed', 'Pending', 'Failed']
        
        probs = [0.40, 0.05, 0.20, 0.20, 0.15] 
        # 2. Vectorized Generation (The "Data Engineer" way)
        # Instead of a slow loop, we generate entire columns at once
        ids = np.arange(NUM_ROWS)
        cats = np.random.choice(categories, NUM_ROWS, p=probs)
        regs = np.random.choice(regions, NUM_ROWS)
        stats = np.random.choice(statuses, NUM_ROWS)
        amounts = np.round(np.random.uniform(100.0, 5000.0, NUM_ROWS), 2)
        
        # Generate dates efficiently
        start_date = np.datetime64('2023-01-01')
        end_date = np.datetime64('2024-12-31')
        days_diff = (end_date - start_date).astype(int)
        random_days = np.random.randint(0, days_diff, NUM_ROWS)
        dates = start_date + random_days
        
        # 3. Create DataFrame
        df = pd.DataFrame({
            "id": ids,
            "product_name": "Generic Product SKU-" + pd.Series(ids).astype(str), # Simple string op
            "category": cats,
            "amount": amounts,
            "region": regs,
            "date": dates,
            "status": stats
        })
        
        # 4. Save as Parquet
        df.to_parquet(PARQUET_FILE)
        print("1 Million Rows Generated and Saved to Parquet.")

# Generate data on startup
generate_parquet_data()

@app.get("/api/stats")
def get_stats():
    """
    FIXED: Uses a dedicated connection (con) for thread safety.
    """
    con = duckdb.connect(database=':memory:') # <--- Connect explicitly
    try:
        query = f"""
            SELECT category, SUM(amount) as total 
            FROM '{PARQUET_FILE}' 
            GROUP BY category 
            ORDER BY total DESC
        """
        result = con.execute(query).fetchall()
        return [{"category": r[0], "total": round(r[1], 2)} for r in result]
    finally:
        con.close() # <--- Always close

@app.get("/api/sales")
def get_sales(
    category: str = Query(None),
    limit: int = 100
):
    """
    FIXED: Uses a dedicated connection (con) for thread safety.
    """
    con = duckdb.connect(database=':memory:') # <--- Connect explicitly
    try:
        base_query = f"SELECT * FROM '{PARQUET_FILE}'"
        
        where_clause = ""
        if category:
            # Simple sanitization to prevent basic injection in this demo
            clean_category = category.replace("'", "''") 
            where_clause = f"WHERE category = '{clean_category}'"
            
        final_query = f"{base_query} {where_clause} LIMIT {limit}"
        
        # Execute via connection
        df_result = con.execute(final_query).df()
        
        # Convert dates to string for JSON serialization
        df_result['date'] = df_result['date'].astype(str)
        
        return {
            "data": df_result.to_dict(orient="records"),
            "count": len(df_result)
        }
    finally:
        con.close()