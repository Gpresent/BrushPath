import os
import json

kanji_list = []

for file in os.listdir('joyo_kanji'):
    if file.endswith('.svg'):
        kanji_list.append(file[:-4])

with open('joyo_kanji.json', 'w') as f:
    json.dump(kanji_list, f)