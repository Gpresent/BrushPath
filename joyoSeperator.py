import os
import shutil

newdir = './joyo_kanji'
if not os.path.exists(newdir):
    os.makedirs(newdir)

def is_joyo_kanji(character):
    if '\u4E00' <= character <= '\u9FFF' or '\u3400' <= character <= '\u4DBF':
        #print("is joyo")
        return True
    return False

def check_filenames_in_directory(source_directory, target_directory):
    try:
        for filename in os.listdir(source_directory):
            if filename.endswith('.svg'):
                hex_string = filename[:-4]  # Remove .svg)
                try:
                    character = chr(int(hex_string, 16))
                    if is_joyo_kanji(character):
                        #print(f"'{hex_string}' (from '{filename}') represents a Jōyō Kanji character.")
                        shutil.copy(os.path.join(source_directory, filename),
                                    os.path.join(target_directory, filename))
                except ValueError:
                    print(f"'{hex_string}' (from '{filename}') is not a valid Unicode code point.")
    except FileNotFoundError:
        print("The directory does not exist.")

entries = os.listdir('./kanji_cleaned')
files = [entry for entry in entries if os.path.isfile(os.path.join('./kanji_cleaned', entry))]

directory_path = './kanji_cleaned'
test_string = "漢字"
check_filenames_in_directory(directory_path, './joyo_kanji')
#is_joyo_kanji(test_string)

#for file in files:
    #print(file)