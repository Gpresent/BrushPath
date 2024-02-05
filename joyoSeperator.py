import os
import shutil

newdir = './joyo_kanji'
if not os.path.exists(newdir):
    os.makedirs(newdir)

joyo_kanji = []
joyo_kanji_unicode = []
def get_joyo_kanji():
    with open('joyo-kanji-code-u.csv', 'r', encoding='utf-8') as file:
        for line in file:
            if line[0] != '#':
                joyo_kanji.append(line[0])
    for kanji in joyo_kanji:
        joyo_kanji_unicode.append(hex(ord(kanji))[2:].rjust(5, "0"))

def is_joyo_kanji(character):
    return character in joyo_kanji_unicode

def check_filenames_in_directory(source_directory, target_directory):
    try:
        for filename in os.listdir(source_directory):
            if filename.endswith('.svg'):
                hex_string = filename[:-4]  # Remove .svg)
                try:
                    if is_joyo_kanji(hex_string):
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
# get_joyo_kanji()
# print(joyo_kanji_unicode)

#for file in files:
    #print(file)