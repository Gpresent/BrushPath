import os

with open('joyo_kanji.tsx', 'w', encoding='utf-8') as kanji_tsx:
    for file in os.listdir('./joyo_kanji'):
        unicode = file[:-4]
        with open(f'./joyo_kanji/{file}', 'r', encoding='utf-8') as file:
            kanji_tsx.write("const svg_" + unicode + " = require('./joyo_kanji/" + unicode + ".svg');\n")
    kanji_tsx.write("\nexport const kanjiSVGs = {")
    for file in os.listdir('./joyo_kanji'):
        unicode = file[:-4]
        kanji_tsx.write("\n    '" + unicode + "' : svg_" + unicode + ",")
    kanji_tsx.write("\n};")
    
            
        