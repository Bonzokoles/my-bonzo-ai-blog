#!/usr/bin/env python3
"""
Single File D1 Importer
Generuje jeden wielki plik SQL z wszystkimi produktami
"""

import json
import os

def create_single_import_file():
    print("🚀 Creating single import file...")
    
    # Load products
    products_file = "src/data/whitecat/products.json"
    if not os.path.exists(products_file):
        print(f"❌ Products file not found: {products_file}")
        return
    
    with open(products_file, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📦 Loaded {len(products)} products")
    
    # Create SQL file
    sql_content = "-- All Products Import\n-- Generated automatically\n\n"
    sql_content += "BEGIN TRANSACTION;\n\n"
    
    for product_id, product_data in products.items():
        name = product_data.get('name', '').replace("'", "''")
        category = product_data.get('category', '').replace("'", "''")
        price = product_data.get('price', 0)
        url = product_data.get('url', '').replace("'", "''")
        description = product_data.get('description', '').replace("'", "''")
        
        sql_content += f"INSERT OR REPLACE INTO products (id, name, category, price, url, description) VALUES ('{product_id}', '{name}', '{category}', {price}, '{url}', '{description}');\n"
    
    sql_content += "\nCOMMIT;\n"
    
    # Write to file
    output_file = "all_products_import.sql"
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"✅ Created {output_file} with {len(products)} products")
    print(f"📝 Import with: npx wrangler d1 execute jimbo-rag-db --remote --file={output_file}")
    
    return output_file

if __name__ == "__main__":
    create_single_import_file()