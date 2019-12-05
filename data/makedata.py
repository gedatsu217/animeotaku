import sys
import json
import csv
import requests
import re
import datetime
import calendar

def search(keyword, date1, date2):
    
    url = "https://www.pixiv.net/search.php?word="+keyword+"&scd="+date1+"&ecd="+date2
    
    res = requests.get(url)
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

args = sys.argv
if len(args)==4:
    rcsv = args[1]      #読み込むcsv
    rjson = args[2]     #取得済みのjson
    wjson = args[3]     #書き込み先の新規json
else:
    print("error:few args")
    exit(0)


csvfile = open(rcsv, "r")
reader = csv.reader(csvfile)

with open(rjson, "r") as jsonfile:
    data = json.load(jsonfile)

flag=0
for row in reader:
    #最初の行だけ読み飛ばす
    if flag==0:
        flag=1
        continue

    print(row[0])
    title = row[0]
    hits = {}
    tags = {}


    for d in data:
        if d["title"]==title:
            data.remove(d)

    for year in range(2007, 2020):
        for month in range(1,13):
            ym = str(year)+"-"+str(month).zfill(2)
            print(title+ym)
            begin_date = str(datetime.date(year, month, 1))
            end_date = str(datetime.date(year, month, calendar.monthrange(year, month)[1]))
            if flag==0:
                flag=1
                continue
            try:
                result = search(title, begin_date, end_date)
            except:
                continue
            hits[ym] = result["hits"]
            tags[ym] = result["tags"]

    data.append({"title": title, "hits": hits, "tags": tags})
    fw = open(wjson, "w")
    json.dump(data, fw, indent=4, ensure_ascii=False)
    
