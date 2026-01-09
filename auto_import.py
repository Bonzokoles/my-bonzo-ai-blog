#!/usr/bin/env python3
"""
Auto Import with YES responses
Importuje batch files z automatycznym potwierdzaniem
"""

import subprocess
import os
import time
from pathlib import Path

def auto_import_batches():
    print("🚀 Starting auto-import with YES responses...")
    
    batch_dir = Path("d1_import_batches")
    if not batch_dir.exists():
        print(f"❌ Directory {batch_dir} not found")
        return
    
    # Get all SQL files
    sql_files = sorted(batch_dir.glob("batch_*.sql"))
    print(f"📦 Found {len(sql_files)} batch files")
    
    success_count = 0
    error_count = 0
    
    for i, file_path in enumerate(sql_files, 1):
        print(f"📝 Importing {file_path.name} ({i}/{len(sql_files)})...")
        
        try:
            # Use --yes flag to auto-confirm
            cmd = [
                "npx", "wrangler", "d1", "execute", "jimbo-rag-db",
                "--remote", f"--file={file_path}", "--yes"
            ]
            
            result = subprocess.run(
                cmd,
                capture_output=True,
                text=True,
                timeout=60,
                cwd=os.getcwd()
            )
            
            if result.returncode == 0:
                print(f"✅ {file_path.name} imported successfully")
                success_count += 1
            else:
                print(f"❌ {file_path.name} failed: {result.stderr}")
                error_count += 1
                
        except subprocess.TimeoutExpired:
            print(f"⏰ {file_path.name} timed out")
            error_count += 1
        except Exception as e:
            print(f"💥 {file_path.name} error: {e}")
            error_count += 1
        
        # Small delay between imports
        time.sleep(0.5)
    
    print(f"\n📊 Final Summary:")
    print(f"✅ Success: {success_count}")
    print(f"❌ Errors: {error_count}")
    print(f"📦 Total products: {success_count * 10}")
    print(f"🎯 Test at: http://localhost:4322/whitecat")

if __name__ == "__main__":
    auto_import_batches()