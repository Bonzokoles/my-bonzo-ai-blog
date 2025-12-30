
import os
import re

TARGET_DIR = r"Q:\mybonzo\mybonzoAIblog\src\pages\pumo-guide"

def fix_files():
    print(f"🔧 Starting MD -> MDX + Prerender Fix in: {TARGET_DIR}")
    
    files = [f for f in os.listdir(TARGET_DIR) if f.endswith(".md")]
    
    if not files:
        print("⚠️ No .md files found!")
        return

    count = 0
    for filename in files:
        filepath = os.path.join(TARGET_DIR, filename)
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Check if already has frontmatter
        if content.strip().startswith('---'):
            # Find the end of frontmatter
            parts = content.split('---', 2)
            if len(parts) >= 3:
                # [0] empty, [1] frontmatter, [2] content
                frontmatter = parts[1]
                body = parts[2]
                
                # Check if layout is present
                # Standard MD files usually have layout in frontmatter.
                # MDX supports it too.
                
                # Construct new content with export
                new_content = f"---{frontmatter}---\n\nexport const prerender = true;\n{body}"
            else:
                # Weird format, just append to top? No, MDX needs frontmatter or imports first.
                # If no frontmatter, just add export at top
                new_content = f"export const prerender = true;\n\n{content}"
        else:
             new_content = f"export const prerender = true;\n\n{content}"
             
        # New filename
        new_filename = filename.replace('.md', '.mdx')
        new_filepath = os.path.join(TARGET_DIR, new_filename)
        
        # Write new file
        with open(new_filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
            
        # Delete old file
        os.remove(filepath)
        count += 1
        print(f"✅ Fixed: {filename} -> {new_filename}")

    print(f"\n🎉 DONE! Converted {count} files to MDX with prerender=true.")

if __name__ == "__main__":
    fix_files()
