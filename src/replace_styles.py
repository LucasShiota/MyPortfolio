import os
import re

astro_dir = r'c:\Users\lshio\Desktop\Lucas Shiota\GitHub Repo\MyPortfolio\src'

tailwind_map = {
    r'text-align:\s*center;?': '@apply text-center;',
    r'text-align:\s*left;?': '@apply text-left;',
    r'text-align:\s*right;?': '@apply text-right;',
    
    r'font-weight:\s*300;?': '@apply font-light;',
    r'font-weight:\s*500;?': '@apply font-medium;',
    r'font-weight:\s*600;?': '@apply font-semibold;',
    r'font-weight:\s*700;?': '@apply font-bold;',
    r'font-weight:\s*900;?': '@apply font-black;',
    r'font-weight:\s*bold;?': '@apply font-bold;',
    r'font-weight:\s*bolder;?': '@apply font-black;',
    
    r'text-transform:\s*uppercase;?': '@apply uppercase;',
    r'text-transform:\s*lowercase;?': '@apply lowercase;',
    r'text-transform:\s*capitalize;?': '@apply capitalize;',
    
    r'font-family:\s*monospace;?': '@apply font-mono;',
    r'font-family:\s*ui-monospace.*?monospace;?': '@apply font-mono;',
    
    # Text sizes
    r'font-size:\s*clamp\(2\.5rem,\s*5vw,\s*4\.5rem\);?': '@apply txt-h1;',
    r'font-size:\s*3rem;?': '@apply text-5xl;',
    r'font-size:\s*2rem;?': '@apply txt-h2;',
    r'font-size:\s*1\.5rem;?': '@apply txt-h3;',
    r'font-size:\s*1\.3rem;?': '@apply text-xl;',
    r'font-size:\s*1\.25rem;?': '@apply txt-h4;',
    r'font-size:\s*1\.2rem;?': '@apply text-xl;',
    r'font-size:\s*1\.15rem;?': '@apply txt-h5;',
    r'font-size:\s*1\.1rem;?': '@apply txt-body-lg;',
    r'font-size:\s*1rem;?': '@apply txt-body;',
    r'font-size:\s*0\.95rem;?': '@apply txt-body-sm;',
    r'font-size:\s*0\.9rem;?': '@apply txt-body-sm;',
    r'font-size:\s*0\.85rem;?': '@apply txt-tag;',
    r'font-size:\s*0\.75rem;?': '@apply text-xs;',
    r'font-size:\s*8vh;?': '@apply text-[8vh];',
    
    r'line-height:\s*1(?![.\d]);?': '@apply leading-none;',
    r'line-height:\s*1\.1;?': '@apply leading-tight;',
    r'line-height:\s*1\.2;?': '@apply leading-snug;',
    r'line-height:\s*1\.4;?': '@apply leading-normal;',
    r'line-height:\s*1\.5;?': '@apply leading-relaxed;',
    r'line-height:\s*1\.6;?': '@apply leading-loose;',
}

def get_relative_css_path(astro_file_path):
    # Find relative path from current astro file dir to src/styles/global.css
    src_styles_dir = os.path.join(astro_dir, 'styles')
    global_css_path = os.path.join(src_styles_dir, 'global.css')
    
    file_dir = os.path.dirname(astro_file_path)
    # relative path
    rel_path = os.path.relpath(global_css_path, file_dir)
    return rel_path.replace("\\", "/")


def clean_and_replace():
    modified_files = []
    for root, _, files in os.walk(astro_dir):
        for file in files:
            if file.endswith('.astro'):
                filepath = os.path.join(root, file)
                with open(filepath, 'r', encoding='utf-8') as f:
                    content = f.read()

                new_content = content
                changed = False

                for k, v in tailwind_map.items():
                    # perform replacement if matching
                    if re.search(k, new_content):
                        new_content = re.sub(k, v, new_content)
                        changed = True

                # If changed and involves our custom txt-* classes, ensure @reference is in <style>
                if changed:
                    has_custom_txt = "txt-h" in new_content or "txt-body" in new_content or "txt-tag" in new_content
                    # add txt-brand for custom check if we want, but if style doesn't have reference, we add it.

                    if '<style>' in new_content and has_custom_txt:
                        rel_path = get_relative_css_path(filepath)
                        ref_str = f'@reference "{rel_path}";'
                        
                        # Find all styles and inject if not present
                        # Because someone could have multiple <style> blocks or we just find the first one
                        if ref_str not in new_content and '@reference' not in new_content:
                            new_content = new_content.replace('<style>', f'<style>\n  {ref_str}\n')
                    
                    if new_content != content:
                        with open(filepath, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        modified_files.append(file)
                        print(f'Modified: {file}')

    print(f'Done. Modified {len(modified_files)} files.')

if __name__ == '__main__':
    clean_and_replace()
