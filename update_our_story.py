#!/usr/bin/env python3
import re

# Read the index.html file
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Read the new HTML
with open('our-story-new.html', 'r', encoding='utf-8') as f:
    new_html = f.read()

# Find and replace the Our Story section
# Pattern to match from <!-- ===== OUR STORY ===== --> to </section>
pattern = r'<!-- ===== OUR STORY ===== -->.*?</section>\s*(?=\n\n<!-- ===== NUTRITION SECTION REMOVED =====|$)'

# Replace with new content
content = re.sub(pattern, new_html.strip(), content, flags=re.DOTALL)

# Write back to index.html
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Our Story section updated successfully!")
