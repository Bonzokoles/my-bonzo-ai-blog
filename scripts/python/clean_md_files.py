
import os

TARGET_DIR = r"Q:\mybonzo\mybonzoAIblog\src\pages\pumo-guide"

def clean_files():
    print(f"🧹 Cleaning MD files in: {TARGET_DIR}")
    
    files = [f for f in os.listdir(TARGET_DIR) if f.endswith(".md")]
    
    count = 0
    for filename in files:
        filepath = os.path.join(TARGET_DIR, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check for export line
        if "export const prerender = true;" in content:
            new_content = content.replace("export const prerender = true;", "").strip()
            # If it left double empty newlines at top, maybe clean up
            # But strip() helps.
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            count += 1
            print(f"✨ Cleaned: {filename}")
            
    print(f"🎉 Processed {count} files.")

if __name__ == "__main__":
    clean_files()
