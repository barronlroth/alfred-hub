from pathlib import Path
import json

ROOT=Path('/Users/barron/Developer/alfred-hub-minimoon/minimoon')
analysis=json.loads((ROOT/'research/image-analysis-programmatic.json').read_text())
source={}
names={}
for fn in ['westcoast.json','cayman.json']:
    data=json.loads((ROOT/'research'/fn).read_text())
    for h in data:
        names[h['slug']]=h['name']
        for im in h.get('images',[]): source[im['localPath']]={k:im.get(k) for k in ['sourceUrl','sourceName','caption','alt']}
source['assets/hotels/four-seasons-oahu-ko-olina/3.jpg']={
  'sourceUrl':'https://www.fourseasons.com/alt/img-opt/~80.1530.0,0000-400,5000-3000,0000-1687,5000/publish/content/dam/fourseasons/images/web/OAH/OAH_331_original.jpg',
  'sourceName':'Four Seasons Resort Oahu at Ko Olina official site',
  'caption':'The adults-only infinity pool overlooking the Pacific',
  'alt':'Aerial view of the Four Seasons Oahu adults-only infinity pool, lawn, palms, and Pacific Ocean'
}
repairs={
 'assets/hotels/four-seasons-oahu-ko-olina/3.jpg':{
   'status':'repaired-pass','original':{'sha256':'db6144c188ee6e6714d2da895b768889a4f5f04184e90b81f38ff1f722c76270','width':1530,'height':1913,'visualDescription':'Portrait image of guests seated in a vintage aircraft','sourceUrl':None},
   'issue':'Definite gallery relevance problem: the aircraft lifestyle image did not depict the named hotel or its property and was visually inconsistent with the property gallery.',
   'replacementSourceUrl':source['assets/hotels/four-seasons-oahu-ko-olina/3.jpg']['sourceUrl'],
   'replacementSourceName':source['assets/hotels/four-seasons-oahu-ko-olina/3.jpg']['sourceName']
 },
 'assets/hotels/meadowood-napa-valley/1.webp':{
   'status':'repaired-pass','original':{'sha256':'abc22d673c279532e734c447ed65c1865fdb1cc80ec1744bc3b0dab32941dca5','width':1920,'height':1093,'visualDescription':'Near-black night-sky frame with only a dark tree line; the property was not legible at gallery size','sourceUrl':'https://meadowood.com/wp-content/uploads/2025/03/Nighttime-homepage-hero_1920px-min.jpg'},
   'issue':'Definite usability problem: the frame appeared nearly blank at gallery size and did not legibly show the hotel.',
   'replacementSourceUrl':'https://meadowood.com/wp-content/uploads/2021/10/Hill-House_Bedroom-to-Living_600x402.jpg',
   'replacementSourceName':'Meadowood official site'
 }
}
byhotel={}
for idx,r in enumerate(analysis['images'],1):
    p=r['localPath']; slug=r['hotel']; sheet=(idx-1)//15+1
    rec={k:r[k] for k in ['file','localPath','format','mode','bytes','width','height','aspectRatio','sha256','dhash','luminanceMean','luminanceStdDev','programmaticVerdict']}
    rec['contactSheet']=f'research/contact-sheets/gallery-audit-{sheet}.jpg'
    rec['contactSheetItem']=idx
    rec['sourceMetadata']=source.get(p)
    if p in repairs:
        rec['visualVerdict']='repaired-pass'
        rec['visualNotes']='Replacement visually verified at full resolution: valid named-property image; no blank/logo, corruption, duplicate, low-resolution, or gallery-breaking composition issue.'
        rec['replacement']=repairs[p]
    else:
        rec['visualVerdict']='pass'
        rec['visualNotes']='Visually inspected in the labeled contact sheet; no definite blank/logo, wrong-property, duplicate, unusable-quality, extreme-aspect, or corruption issue.'
    byhotel.setdefault(slug,[]).append(rec)

hotels=[]
for slug in sorted(byhotel):
    imgs=byhotel[slug]
    hotels.append({'slug':slug,'name':names.get(slug,slug.replace('-',' ').title()),'imageCount':len(imgs),'images':imgs})

out={
 'auditVersion':1,
 'generatedAt':'2026-08-19T03:52:28Z',
 'scope':'All current files under assets/hotels/* across every region',
 'method':{
   'programmatic':['Pillow decode/load verification','dimensions and aspect ratio','file size and format','SHA-256 exact duplicate detection','64-bit dHash near-duplicate screening (Hamming distance <= 5)','luminance mean/standard deviation blank-screening'],
   'visual':'All 75 images inspected in five labeled 15-image contact sheets; replacements re-inspected individually at full resolution.',
   'thresholds':{'lowResolution':'either dimension < 600 px','extremeLandscape':'width/height > 3.0','extremePortrait':'height/width > 2.0','nearBlank':'grayscale standard deviation < 5','nearDuplicate':'dHash Hamming distance <= 5'}
 },
 'summary':{
   'hotelCount':len(hotels),'imageCount':sum(h['imageCount'] for h in hotels),'expectedImageCount':75,'countVerified':sum(h['imageCount'] for h in hotels)==75,
   'imagesPerHotel':{h['slug']:h['imageCount'] for h in hotels},
   'corruptFiles':sum(1 for r in analysis['images'] if r['programmaticVerdict']=='corrupt'),
   'lowResolutionAfterRepair':sum(1 for r in analysis['images'] if 'low-resolution' in r.get('flags',[])),
   'extremeAspectRatiosAfterRepair':sum(1 for r in analysis['images'] if 'extreme-aspect-ratio' in r.get('flags',[])),
   'nearBlankAfterRepair':sum(1 for r in analysis['images'] if 'near-blank' in r.get('flags',[])),
   'exactDuplicateGroupCount':len(analysis['exactDuplicateGroups']),
   'nearDuplicatePairCount':len(analysis['nearDuplicatePairs']),
   'definiteProblemsFound':len(repairs),'replacementsCompleted':len(repairs),'remainingDefiniteProblems':0,
   'sourceMetadataRecords':sum(1 for h in hotels for i in h['images'] if i['sourceMetadata'] is not None)
 },
 'duplicateGroups':analysis['exactDuplicateGroups'],
 'nearDuplicatePairs':analysis['nearDuplicatePairs'],
 'replacements':[{'localPath':p,**v} for p,v in repairs.items()],
 'notes':['No structured Hawaii image-source JSON existed; the Four Seasons Oahu replacement source is therefore recorded here.','Existing structured source metadata was updated in research/westcoast.json for the Meadowood replacement.','Null sourceMetadata means no corresponding structured source record was available; it is not an invented URL.'],
 'hotels':hotels
}
(ROOT/'research/image-audit.json').write_text(json.dumps(out,indent=2,ensure_ascii=False)+'\n')
print(json.dumps(out['summary'],indent=2))
