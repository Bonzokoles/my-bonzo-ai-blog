"""
Simple D1 Import - Alternative Method
Importuje małe batch'e produktów bezpośrednio przez D1 API
"""

import json
import time

# Load products data
def load_products():
    products_path = r"U:\JIMBO_UNIFIED_CONTROL_hub\LIBRARIES\CONTROL_CENTER\MEBLEPUMO_INTEL\PUMO_AI_FRENDLY_operacja_WHITECAT\products.json"
    
    with open(products_path, 'r', encoding='utf-8') as f:
        products = json.load(f)
    
    print(f"📦 Loaded {len(products)} products")
    return products

def create_batch_files(products, batch_size=20):
    """Tworzy małe pliki SQL do importu"""
    import os
    
    # Create temp directory
    temp_dir = "d1_import_batches"
    if not os.path.exists(temp_dir):
        os.makedirs(temp_dir)
    
    batch_files = []
    product_items = list(products.items())
    
    for i in range(0, len(product_items), batch_size):
        batch = product_items[i:i + batch_size]
        batch_num = i // batch_size + 1
        
        filename = f"{temp_dir}/batch_{batch_num:03d}.sql"
        
        with open(filename, 'w', encoding='utf-8') as f:
            f.write("-- Batch import SQL\n")
            for product_id, product in batch:
                # Escape single quotes
                name = product['name'].replace("'", "''")
                category = product['category'].replace("'", "''") 
                manufacturer = product.get('manufacturer', '').replace("'", "''")
                
                sql = f"INSERT OR REPLACE INTO products (id, name, category, price, url, description) VALUES ('{product_id}', '{name}', '{category}', {product['price']}, '{product['url']}', '{manufacturer}');\n"
                f.write(sql)
        
        batch_files.append(filename)
        print(f"📝 Created {filename} with {len(batch)} products")
    
    return batch_files

def main():
    print("🚀 Starting Simple D1 Import...")
    
    # Load data
    products = load_products()
    
    # Create batch files
    batch_files = create_batch_files(products, batch_size=10)  # Very small batches
    
    print(f"\n✅ Created {len(batch_files)} batch files")
    print("📋 Manual import steps:")
    print("1. Open each .sql file in d1_import_batches/")
    print("2. Copy content and run in Cloudflare Dashboard > D1 > jimbo-rag-db > Console")
    print("3. Or run: npx wrangler d1 execute jimbo-rag-db --remote --file=batch_001.sql")
    print("\n🎯 After import, test at: http://localhost:4321/whitecat")

if __name__ == "__main__":
    main()