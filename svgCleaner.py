import os

newdir = './kanji_cleaned'
if not os.path.exists(newdir):
    os.makedirs(newdir)

filenum = 0

for file in os.listdir('./kanji'):
    with open('./kanji/' + file, 'r', encoding='utf-8') as f:
        content = f.read()
        with open(newdir + '/' + file, 'w', encoding='utf-8') as f2:
            for line in content.split('\n'):
                if '<g id="kvg:StrokeNumbers' in line:
                    f2.write('<g id="kvg:StrokeNumbers_' + file[0,file.find('.')] + '" font-size="8" fill="#210c0c"\n')
                else:
                    f2.write(line + '\n')
            print(str(filenum) + " files cleaned")
            filenum += 1