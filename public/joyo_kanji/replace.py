import re
import os

def modify_svg_namespace(svg_file):
    with open(svg_file, 'r') as f:
        svg_content = f.read()
    
    modified_svg_content = ""

    for line in svg_content.split("\n"):
        while line.find(" kvg:") != -1:
            line = re.sub(r' kvg:', ' kvg_', line)
        modified_svg_content += line + "\n"

    print(modified_svg_content)
    # Write the modified SVG content back to the file
    with open(svg_file, 'w') as f:
        f.write(modified_svg_content)

# Example usage:
if __name__ == "__main__":
    svg_file_path = "./04e00.svg"
    modify_svg_namespace(svg_file_path)
    print(f"Namespace tags in {svg_file_path} have been modified.")
