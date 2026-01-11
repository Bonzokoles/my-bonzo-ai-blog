
import os

API_DIR = r"Q:\mybonzo\mybonzoAIblog\src\pages\api"

def disable_prerender_recursive():
    print(f"🔧 Scanning for TS API files in {API_DIR} to disable prerender...")
    
    count = 0
    for root, dirs, files in os.walk(API_DIR):
        for file in files:
            if file.endswith(".ts"):
                filepath = os.path.join(root, file)
                
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                # Check if prerender is already set
                if "export const prerender = false;" in content:
                    print(f"⏩ Skipping (already set): {file}")
                    continue
                
                # Add prerender = false
                # Try to add it after imports if possible, or at top
                lines = content.splitlines()
                last_import_idx = -1
                for i, line in enumerate(lines):
                    if line.strip().startswith('import '):
                        last_import_idx = i
                
                # Insert after last import, or at top
                insert_pos = last_import_idx + 1
                lines.insert(insert_pos, "\nexport const prerender = false;")
                
                new_content = "\n".join(lines)
                
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                    
                print(f"✅ Updated: {file}")
                count += 1

    print(f"\n🎉 DONE! Updated {count} API files.")

if __name__ == "__main__":
    disable_prerender_recursive()
