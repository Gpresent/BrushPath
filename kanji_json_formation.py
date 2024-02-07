import os

with open('joyo_kanji.tsx', 'w', encoding='utf-8') as kanji_tsx:
    kanji_tsx.write("\nexport const kanjiSVGs: {[key: string]: any} = {")
    for file in os.listdir('./joyo_kanji'):
        unicode = file[:-4]
        kanji_tsx.write("\n    '" + unicode + "' : require('./joyo_kanji/" + unicode + ".svg'),")
    kanji_tsx.write("\n};")
    
            
        