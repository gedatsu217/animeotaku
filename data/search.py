import requests
import re
import sys

args = sys.argv
# 指定したキーワード，指定した日付のpixiv投稿数を取得
# keyword は検索ワード
# date は yyyy-mm-dd の書式
def search(keyword, date1, date2):
    
    url = "https://www.pixiv.net/search.php?word="+keyword+"&scd="+date1+"&ecd="+date2
    
    res = requests.get(url)
    try:
        res.raise_for_status()
    except:
        return 0
    content = res.text
    result = re.search(r"[0-9]*件投稿", content).group()
    result = result[0:-3]

#その検索期間での関連タグを取得
    related_tags=[]
    tag_data = re.search(r"data-related-tags=.*]", content).group()
    tag_data = re.sub(r"\\u(([0-9]|[a-f]){4})", lambda x= r"\u\1": x.group().encode().decode("unicode-escape"), tag_data)
    tag_data = re.sub("&quot;", "\"", tag_data)
    related_tags = re.findall(r"(?<=\"tag\":\").*?(?=\",\"tag_translation)", tag_data)
    print(related_tags)
    return result


keyword=args[1]
date1=args[2]

if len(args)==3:
    date2 = args[2]
else:
    date2 = args[3]

ans = search(keyword, date1, date2)

print(ans)
