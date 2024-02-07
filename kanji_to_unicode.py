import os

newdir = './nlevels'
if not os.path.exists(newdir):
    os.makedirs(newdir)

kanji_list = [
    "軍兵島村門戸武城総団線設勢党史営府巻介蔵造根寺査将改県泉像細谷奥再血算象清技州領橋芸型香量久境階区波移域周接鉄頃材個協各帯歴編裏比坂装省税競囲辺河極防低林導森丸胸陸療諸管仲革担効賞星復片並底温軽録腰著乱章殿布角仏永誌減略準委令刊焼里圧額印池臣庫農板恋羽専逆腕短普岩竹児毛版宇況被岸超豊含植補暴課跡触玉震億肩劇刺述輪浅純薄阪韓固巨講般湯捨衣替央骨齢照層弱築脳航快翌旧筆換群爆捜油叫伸承雲練紹包庁測占混倍乳荒詰栄床則禁順枚厚皮輸濃簡孫丈黄届絡採傾鼻宝患延律希甘湾沈販欧砂尊紅複泊荷枝依幼斬勇昇寿菜季液券祭袋燃毒札狙脇卒副敬針拝浴悩汚灯坊尻涙停了汗郵幅童虫埋舟闇棒貨肌臓塩均湖損膝辛双軒績干姓掘籍珍訓預署漁緑畳咲貿踊封兆柱駐祝炭柔雇乾鋭氷隅冊糸募硬塗憎泥脂粉詞筒掃塔賢拾麦刷卵械皿祈灰召溶磨粒喫机貯匹綿贈凍瓶帽涼秒湿蒸菓耕鉱膚胃挟郊銅鈍貝缶枯滴符畜軟濯隻伺沸曇肯燥零"
]
separated_kanji = ', '.join(kanji_list)

kanji_unicode = {kanji: f"U+{ord(kanji):04X}" for kanji in separated_kanji}

with open(os.path.join(newdir, "n2.txt"), 'w', encoding='utf-8') as temp_file:
    for kanji, unicode in kanji_unicode.items():
        temp_file.write(f"{kanji}: {unicode}\n")
 