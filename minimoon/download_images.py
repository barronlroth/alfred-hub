import io, os, json, urllib.request
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw

ROOT=Path('/Users/barron/Developer/alfred-hub-minimoon/minimoon')
CANDIDATES={
'wickaninnish-inn':[
'https://www.wickinn.com/site/assets/files/1039/wickaninnish_inn_exterior_aerial_of_inn_and_chesterman_beach_by_marcus_paladino_2024-1.1400x976.jpg',
'https://www.wickinn.com/site/assets/files/1041/wickaninnish_in_guest_room_premier_room_first_floor_by_caitlin_gray_-_ronda_apr_2025-1.1400x976.jpg',
'https://www.wickinn.com/site/assets/files/1592/wickaninnish_inn_exterior_chesterman_beach_couple_by_jeremy_koreski_2024_2_copy.2000x1028.jpg'],
'montage-healdsburg':[
'https://uploads.montage.com/uploads/sites/4/2023/10/02161624/vineyard-room-big-box-1920x730.webp',
'https://uploads.montage.com/uploads/sites/4/2023/10/02161002/hero-footer-vine-1920x730.webp',
'https://uploads.montage.com/uploads/sites/4/2022/04/14120516/MHB-PROPERTY-EXTERIOR-01-3222-V1-3-1920x1080.webp'],
'post-ranch-inn':[
'https://postranchinn.com/wp-content/uploads/2023/09/gallery-ranch_coastal_82A6371.jpg',
'https://postranchinn.com/wp-content/uploads/spa_arch_couples_tub_S9A7844.jpg',
'https://postranchinn.com/wp-content/uploads/2023/09/ocean-house-hero_Q3A0397.jpg'],
'alila-ventana-big-sur':[
'https://bunny-wp-pullzone-gjwg5mwhdq.b-cdn.net/wp-content/uploads/2026/03/ALI-P0274-Man-in-Pool-2000x1333.jpg',
'https://bunny-wp-pullzone-gjwg5mwhdq.b-cdn.net/wp-content/uploads/2026/02/SJCAL_Ventana-Fireplace-Guestroom-Seating-Area-2000x1333.jpg',
'https://bunny-wp-pullzone-gjwg5mwhdq.b-cdn.net/wp-content/uploads/2026/03/Alila-Ventana-Spa-2-2000x1333.jpg'],
'farmhouse-inn':[
'https://www.farmhouseinn.com/files/7642/28473258_ImageLargeWidth.jpg',
'https://www.farmhouseinn.com/files/7642/29204681_ImageLargeWidth.jpg',
'https://www.farmhouseinn.com/files/7642/29285358_ImageLargeWidth.jpg'],
'harbor-house-inn':[
'https://static.wixstatic.com/media/72db9d_23813373b2a248f28607e95bd50dd6e2%7Emv2.jpg',
'https://static.wixstatic.com/media/72db9d_595eddf0ad1b40db83f1163076c4d43d~mv2.jpeg',
'https://static.wixstatic.com/media/72db9d_6028063da6c44bd5b14e4cd7dfd1aa03~mv2.jpeg'],
'meadowood-napa-valley':[
'https://meadowood.com/wp-content/uploads/2025/03/Nighttime-homepage-hero_1920px-min.jpg',
'https://meadowood.com/wp-content/uploads/2022/12/Cottage-Room_full-room_600x402.jpg',
'https://meadowood.com/wp-content/uploads/2022/12/Oakview-Room_Bedroom-nook-and-fireplace_600x402.jpg'],
'stanly-ranch':[
'https://dreffui1gbt6t.cloudfront.net/images/sr/stn-home-video-recrop-1-22.jpg',
'https://dreffui1gbt6t.cloudfront.net/images/sr/stn-gallery-stay-palomino-livingroom.jpg',
'https://dreffui1gbt6t.cloudfront.net/images/sr/STN_Galleries_Resort_101823_Asset-29.jpg'],
'solage':[
'https://dreffui1gbt6t.cloudfront.net/images/sol/sol-gal-resort-10.23-poolbright-land.jpg',
'https://dreffui1gbt6t.cloudfront.net/images/sol/sol-home-stayhover-patio.jpg',
'https://dreffui1gbt6t.cloudfront.net/images/sol/sol-gallery-stay-orchardsuite-outdoortub.jpg']}

def fetch(url):
    req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0','Referer':url.split('/')[0]+'//'+url.split('/')[2]+'/'})
    with urllib.request.urlopen(req,timeout=45) as r:return r.read()

report=[]
for slug,urls in CANDIDATES.items():
    d=ROOT/'assets'/'hotels'/slug; d.mkdir(parents=True,exist_ok=True)
    for i,url in enumerate(urls,1):
        try:
            raw=fetch(url); im=Image.open(io.BytesIO(raw)); im.load()
            srcdim=im.size
            im=ImageOps.exif_transpose(im).convert('RGB')
            if im.width>2200:
                h=round(im.height*2200/im.width); im=im.resize((2200,h),Image.Resampling.LANCZOS)
            out=d/f'{i}.webp'
            q=84
            while True:
                im.save(out,'WEBP',quality=q,method=6)
                if out.stat().st_size<900_000 or q<=64: break
                q-=5
            report.append({'slug':slug,'index':i,'ok':True,'source':url,'sourceDimensions':srcdim,'output':str(out.relative_to(ROOT)),'outputDimensions':im.size,'bytes':out.stat().st_size,'quality':q})
        except Exception as e:
            report.append({'slug':slug,'index':i,'ok':False,'source':url,'error':repr(e)})
(ROOT/'image-report.json').write_text(json.dumps(report,indent=2))
print(json.dumps(report,indent=2))
