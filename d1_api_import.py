#!/usr/bin/env python3
"""
D1 API Import via REST
Importuje produkty przez Cloudflare API zamiast wrangler CLI
"""

import json
import requests
import os
from typing import Dict, Any

def import_via_api():
    """Import products using Cloudflare D1 REST API"""
    print("🚀 Starting API import to D1...")
    
    # Load products
    products_file = "src/data/whitecat/products.json"
    if not os.path.exists(products_file):
        print(f"❌ Products file not found: {products_file}")
        return
    
    with open(products_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📦 Loaded {len(products)} products")
    
    # Configuration
    account_id = "YOUR_ACCOUNT_ID"  # Replace with actual
    database_id = "90fe9b43-f8a4-4e78-94c5-c44aff4012e9"
    api_token = "YOUR_API_TOKEN"  # Replace with actual
    
    # API endpoint
    url = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/d1/database/{database_id}/query"
    
    headers = {
        "Authorization": f"Bearer {api_token}",
        "Content-Type": "application/json"
    }
    
    # Prepare batch insert
    batch_size = 50
    success_count = 0
    error_count = 0
    
    product_items = list(products.items())
    
    for i in range(0, len(product_items), batch_size):
        batch = product_items[i:i + batch_size]
        
        # Build SQL for batch
        sql_queries = []
        for product_id, product_data in batch:
            name = product_data.get('name', '').replace("'", "''")
            category = product_data.get('category', '').replace("'", "''") 
            price = product_data.get('price', 0)
            url = product_data.get('url', '').replace("'", "''")
            description = product_data.get('description', '').replace("'", "''")
            
            query = f"INSERT OR REPLACE INTO products (id, name, category, price, url, description) VALUES ('{product_id}', '{name}', '{category}', {price}, '{url}', '{description}');"
            sql_queries.append(query)
        
        # Send batch request
        payload = {
            "sql": " ".join(sql_queries)
        }
        
        print(f"📤 Sending batch {i//batch_size + 1}/{(len(product_items) + batch_size - 1)//batch_size} ({len(batch)} products)...")
        
        try:
            response = requests.post(url, headers=headers, json=payload, timeout=30)
            
            if response.status_code == 200:
                result = response.json()
                if result.get('success', False):
                    print(f"✅ Batch imported successfully")
                    success_count += len(batch)
                else:
                    print(f"❌ API error: {result.get('errors', [])}")
                    error_count += len(batch)
            else:
                print(f"❌ HTTP {response.status_code}: {response.text}")
                error_count += len(batch)
                
        except Exception as e:
            print(f"💥 Request error: {e}")
            error_count += len(batch)
    
    print(f"\n📊 Import Summary:")
    print(f"✅ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📦 Total: {len(products)}")

def print_config_template():
    """Print configuration instructions"""
    print("\n🔧 Configuration Required:")
    print("1. Get Account ID from Cloudflare Dashboard")
    print("2. Create API Token with D1 permissions:")
    print("   - Zone:D1:Edit for all accounts")
    print("3. Replace YOUR_ACCOUNT_ID and YOUR_API_TOKEN in script")
    print("4. Run: python d1_api_import.py")

if __name__ == "__main__":
    print_config_template()
    
    # Uncomment to run import (after configuration):
    # import_via_api()