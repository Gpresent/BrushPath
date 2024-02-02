import os

newdir = './kanji_cleaned'
if not os.path.exists(newdir):
    os.makedirs(newdir)

filenum = 0

for file in os.listdir('./kanji'):
    with open('./kanji/' + file, 'r', encoding='utf-8') as f:
        content = f.read()
        with open(newdir + '/' + file, 'w', encoding='utf-8') as f2:
            comment_start = content.find('<!--')
            comment_end = content.find('-->')
            while comment_start != -1:
                content = content[:comment_start] + content[comment_end+3:]
                comment_start = content.find('<!--')
                comment_end = content.find('-->')
            f2.write(content)
            print(str(filenum) + " files cleaned")
            filenum += 1