import sys
import json
import csv
import requests
import re
import datetime
import calendar
import requests_html

def search(keyword, date1, date2):
    
    url = "https://www.pixiv.net/search.php?word="+keyword+"&scd="+date1+"&ecd="+date2
    
    res = requests_html.HTMLSession().get(url)
    res.html.render()
    print(res.text)
    try:
        res.raise_for_status()

        content = res.text
        hits = re.search(r"[0-9]*件", content).group()
        hits = int(hits[0:-1])
    except:
        return {"hits": 0, "tags": []}

#その検索期間での関連タグを取得
    related_tags=[]
    tag_data = re.search(r"data-related-tags=.*]", content).group()
    tag_data = re.sub(r"\\u(([0-9]|[a-f]){4})", lambda x= r"\u\1": x.group().encode().decode("unicode-escape"), tag_data)
    tag_data = re.sub("&quot;", "\"", tag_data)
    related_tags = re.findall(r"(?<=\"tag\":\").*?(?=\",\"tag_translation)", tag_data)
    return {"hits": hits, "tags": related_tags}


print(search("まちカドまぞく","2019-10-01","2019-10-31"))