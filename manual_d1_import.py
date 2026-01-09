#!/usr/bin/env python3
"""
Manual D1 Import Script
Importuje produkty z WHITECAT JSON bezpośrednio do D1 przez wrangler
"""

import json
import sqlite3
import tempfile
import subprocess
import os
from pathlib import Path

# Paths
PRODUCTS_JSON_PATH = "U:/JIMBO_UNIFIED_CONTROL_hub/LIBRARIES/CONTROL_CENTER/MEBLEPUMO_INTEL/PUMO_AI_FRENDLY_operacja_WHITECAT/products.json"
DATABASE_ID = "90fe9b43-f8a4-4e78-94c5-c44aff4012e9"
DATABASE_NAME = "jimbo-rag-db"

def load_products():
    """Ładuje produkty z JSON"""
    print("📦 Loading products from JSON...")
    with open(PRODUCTS_JSON_PATH, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"✅ Loaded {len(products)} products")
    return products

def create_insert_sql(products):
    """Generuje SQL INSERT statements"""
    print("🔧 Generating SQL statements...")
    
    sql_statements = []
    
    for product_id, product in products.items():
        sql = f"""INSERT OR REPLACE INTO products (id, name, category, price, url, description) VALUES ('{product_id}', '{product['name'].replace("'", "''")}', '{product['category'].replace("'", "''")}', {product['price']}, '{product['url']}', '{product.get('manufacturer', '').replace("'", "''")}');"""
        sql_statements.append(sql)
    
    print(f"✅ Generated {len(sql_statements)} SQL statements")
    return sql_statements

def execute_batch_sql(sql_statements, batch_size=50):
    """Wykonuje SQL w batch'ach przez wrangler"""
    print(f"🚀 Executing SQL in batches of {batch_size}...")
    
    total_batches = len(sql_statements) // batch_size + (1 if len(sql_statements) % batch_size > 0 else 0)
    successful_batches = 0
    
    for i in range(0, len(sql_statements), batch_size):
        batch = sql_statements[i:i + batch_size]
        batch_num = i // batch_size + 1
        
        print(f"📦 Processing batch {batch_num}/{total_batches} ({len(batch)} records)...")
        
        # Łącz SQL statements w jeden string
        combined_sql = " ".join(batch)
        
        try:
            # Wykonaj przez wrangler d1 execute
            result = subprocess.run([
                "npx", "wrangler", "d1", "execute", DATABASE_NAME, 
                "--remote", "--command", combined_sql
            ], capture_output=True, text=True, timeout=30)
            
            if result.returncode == 0:
                print(f"✅ Batch {batch_num} successful")
                successful_batches += 1
            else:
                print(f"❌ Batch {batch_num} failed:")
                print(f"   STDOUT: {result.stdout}")
                print(f"   STDERR: {result.stderr}")
        except subprocess.TimeoutExpired:
            print(f"⏰ Batch {batch_num} timed out")
        except Exception as e:
            print(f"❌ Batch {batch_num} error: {e}")
    
    print(f"🎉 Import completed: {successful_batches}/{total_batches} batches successful")
    return successful_batches

def verify_import():
    """Weryfikuje czy import się udał"""
    print("🔍 Verifying import...")
    
    try:
        # Sprawdź liczbę rekordów
        result = subprocess.run([
            "npx", "wrangler", "d1", "execute", DATABASE_NAME,
            "--remote", "--command", "SELECT COUNT(*) as total FROM products;"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Import verification:")
            print(result.stdout)
        else:
            print("❌ Verification failed:")
            print(result.stderr)
            
        # Sprawdź przykładowe rekordy
        result = subprocess.run([
            "npx", "wrangler", "d1", "execute", DATABASE_NAME,
            "--remote", "--command", "SELECT id, name, category, price FROM products LIMIT 5;"
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("📊 Sample records:")
            print(result.stdout)
            
    except Exception as e:
        print(f"❌ Verification error: {e}")

def main():
    """Main import process"""
    print("🚀 Starting manual D1 import process...")
    print(f"📁 JSON Path: {PRODUCTS_JSON_PATH}")
    print(f"🗄️  Database: {DATABASE_NAME} ({DATABASE_ID})")
    print()
    
    # Check if JSON exists
    if not os.path.exists(PRODUCTS_JSON_PATH):
        print(f"❌ JSON file not found: {PRODUCTS_JSON_PATH}")
        return
    
    try:
        # Load data
        products = load_products()
        
        # Generate SQL
        sql_statements = create_insert_sql(products)
        
        # Execute in batches
        successful_batches = execute_batch_sql(sql_statements, batch_size=25)  # Smaller batches for stability
        
        if successful_batches > 0:
            # Verify
            verify_import()
            print()
            print("🎉 Manual import completed!")
            print(f"✅ Database ready at: {DATABASE_NAME}")
            print(f"🔗 Test at: http://localhost:4321/whitecat")
        else:
            print("❌ Import failed - no successful batches")
            
    except Exception as e:
        print(f"❌ Import failed: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    main()