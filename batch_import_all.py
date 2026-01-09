#!/usr/bin/env python3
"""
Batch D1 Importer
Automatyczny import wszystkich batch files do D1 database
"""

import os
import subprocess
import time

def import_all_batches():
    print("🚀 Starting batch import...")
    
    batch_dir = "d1_import_batches"
    if not os.path.exists(batch_dir):
        print(f"❌ Directory {batch_dir} not found")
        return
        
    # Get all SQL files
    sql_files = [f for f in os.listdir(batch_dir) if f.endswith('.sql')]
    sql_files.sort()  # Import in order
    
    print(f"📦 Found {len(sql_files)} batch files")
    
    success_count = 0
    error_count = 0
    
    for i, filename in enumerate(sql_files, 1):
        file_path = os.path.join(batch_dir, filename)
        
        print(f"📝 Importing {filename} ({i}/{len(sql_files)})...")
        
        try:
            # Execute wrangler command
            cmd = [
                "npx", "wrangler", "d1", "execute", "jimbo-rag-db", 
                "--remote", f"--file={file_path}"
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=30  # 30 second timeout per batch
            )
            
            if result.returncode == 0:
                print(f"✅ {filename} imported successfully")
                success_count += 1
            else:
                print(f"❌ {filename} failed: {result.stderr}")
                error_count += 1
                
        except subprocess.TimeoutExpired:
            print(f"⏰ {filename} timed out")
            error_count += 1
        except Exception as e:
            print(f"💥 {filename} error: {e}")
            error_count += 1
            
        # Small delay between batches
        if i < len(sql_files):
            time.sleep(0.5)
    
    print(f"\n📊 Import Summary:")
    print(f"✅ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📦 Total: {len(sql_files)}")
    
    if success_count > 0:
        print(f"\n🎯 Test at: http://localhost:4321/whitecat")

if __name__ == "__main__":
    import_all_batches()