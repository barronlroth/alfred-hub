from pathlib import Path
from PIL import Image, ImageOps, ImageDraw, ImageFont, ImageStat
import hashlib, json, math, os

ROOT=Path('/Users/barron/Developer/alfred-hub-minimoon/minimoon')
ASSETS=ROOT/'assets/hotels'
OUT=ROOT/'research/contact-sheets'
OUT.mkdir(parents=True, exist_ok=True)
files=sorted([p for p in ASSETS.rglob('*') if p.is_file()])

def dhash(im, n=8):
    g=ImageOps.grayscale(im).resize((n+1,n), Image.Resampling.LANCZOS)
    px=list(g.getdata())
    bits=[]
    for y in range(n):
        row=px[y*(n+1):(y+1)*(n+1)]
        bits += [row[x] > row[x+1] for x in range(n)]
    v=0
    for b in bits: v=(v<<1)|b
    return f'{v:016x}'

records=[]
for p in files:
    rel=p.relative_to(ROOT).as_posix()
    rec={'hotel':p.parent.name,'file':p.name,'localPath':rel,'bytes':p.stat().st_size}
    try:
        raw=p.read_bytes(); rec['sha256']=hashlib.sha256(raw).hexdigest()
        with Image.open(p) as im:
            im.load()
            rgb=im.convert('RGB')
            rec.update({'format':im.format,'width':im.width,'height':im.height,'aspectRatio':round(im.width/im.height,4),'mode':im.mode,'dhash':dhash(rgb)})
            st=ImageStat.Stat(ImageOps.grayscale(rgb.resize((128,128))))
            rec['luminanceMean']=round(st.mean[0],2); rec['luminanceStdDev']=round(st.stddev[0],2)
            rec['programmaticVerdict']='pass'
            flags=[]
            if min(im.width, im.height)<600: flags.append('low-resolution')
            if im.width/im.height>3 or im.height/im.width>2: flags.append('extreme-aspect-ratio')
            if st.stddev[0]<5: flags.append('near-blank')
            if flags: rec['programmaticVerdict']='review'; rec['flags']=flags
    except Exception as e:
        rec.update({'programmaticVerdict':'corrupt','error':str(e)})
    records.append(rec)

# exact duplicate groups
by={}
for r in records: by.setdefault(r.get('sha256'),[]).append(r['localPath'])
exact=[v for k,v in by.items() if k and len(v)>1]
# near duplicates via dhash hamming <= 5
pairs=[]
for i,a in enumerate(records):
    for b in records[i+1:]:
        if 'dhash' not in a or 'dhash' not in b: continue
        d=(int(a['dhash'],16)^int(b['dhash'],16)).bit_count()
        if d<=5: pairs.append({'a':a['localPath'],'b':b['localPath'],'distance':d})

(ROOT/'research/image-analysis-programmatic.json').write_text(json.dumps({'imageCount':len(records),'exactDuplicateGroups':exact,'nearDuplicatePairs':pairs,'images':records},indent=2)+'\n')

# 5 sheets of 15, 5 cols x 3 rows
font=ImageFont.load_default(size=14)
for si,start in enumerate(range(0,len(records),15),1):
    batch=records[start:start+15]
    sheet=Image.new('RGB',(5*340,3*250),(244,242,237))
    d=ImageDraw.Draw(sheet)
    for j,r in enumerate(batch):
        x=(j%5)*340; y=(j//5)*250
        try:
            with Image.open(ROOT/r['localPath']) as im:
                thumb=ImageOps.contain(im.convert('RGB'),(320,205),Image.Resampling.LANCZOS)
                px=x+10+(320-thumb.width)//2; py=y+5+(205-thumb.height)//2
                sheet.paste(thumb,(px,py))
        except: pass
        label=f"{start+j+1:02d} {r['hotel']}/{r['file']}\n{r.get('width','?')}x{r.get('height','?')}"
        d.rectangle((x+5,y+210,x+335,y+248),fill=(255,255,255))
        d.text((x+10,y+214),label,fill=(20,20,20),font=font,spacing=2)
    sheet.save(OUT/f'gallery-audit-{si}.jpg',quality=92)
print(json.dumps({'count':len(records),'hotels':len(set(r['hotel'] for r in records)),'exactDuplicateGroups':exact,'nearDuplicatePairs':pairs,'reviews':[{'path':r['localPath'],'flags':r.get('flags')} for r in records if r['programmaticVerdict']!='pass'],'sheets':[str(p) for p in sorted(OUT.glob('*.jpg'))]},indent=2))
