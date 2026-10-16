import sys, json, random
P=sys.argv[1]; D=json.load(open(sys.argv[2])); CSS=open(sys.argv[3]).read(); THREEJS=open(sys.argv[4]).read()
GAP=0.3
st=[];t=0.3
for d in D: st.append(round(t,2)); t+=d+GAP
VEND=round(t,2); BR=VEND+0.2; END=round(BR+3.0,2)
def at(i,f): return round(st[i]+f*D[i],2)
def sc(i): return 0 if i==0 else round(st[i]-0.18,2)
bounds=[sc(i) for i in range(len(D))]+[BR]
def span(i): return bounds[i], round(bounds[i+1]-bounds[i],2)
CAPS=[[(0,"Google Ads mein clicks toh aa rahe hain,"),(0.72,"par <b>call</b> nahi?")],
[(0,"Ek baar dekho, log kya search karke aa rahe hain.")],
[(0,"Aap bechte ho: <b>AC repair</b>.")],
[(0,"Aur clicks aa rahe hain:"),(0.2,"“AC repair <b>job</b>”,"),(0.45,"“AC repair <b>course</b>”,"),(0.68,"“<b>free</b> mein AC kaise theek karein”.")],
[(0,"Har click ka <b>paisa</b> kat raha hai.")],
[(0,"Iska ilaaj hai:"),(0.28,"<b>Search Terms Report</b>"),(0.64,"aur <b>Negative Keywords</b>.")],
[(0,"Free, job, course jaise shabd..."),(0.62,"<b>bahar karo!</b>")],
[(0,"Sahi keyword, <b>sahi customer</b>.")],
[(0,"Aapne aakhri baar search terms kab dekhe the?")],
[(0,"Comment mein likho <b>“KEYWORDS”</b> \U0001F447")]]
html=[]; js=[]; pops=[]
def clip(id,s,d,inner,track=1,cls="full clip",style=""):
    html.append(f'<div id="{id}" class="{cls}" data-start="{s}" data-duration="{d}" data-track-index="{track}" style="{style}">{inner}</div>')
def T(sel,fr,to,t,dur=0.4,ease="power3.out"):
    js.append(f'tl.fromTo("{sel}",{{{fr}}},{{{to},duration:{dur},ease:"{ease}"}},{round(t,2)});')
def head(id,s,d,lead,big,cls="",size=118):
    clip(id,s,d,f'<div class="lead">{lead}</div><div class="t3d {cls}" style="font-size:{size}px">{big}</div>',3,"clip head")
    T(f"#{id} .lead","opacity:0,y:24","opacity:1,y:0",s+0.02,0.3)
    T(f"#{id} .t3d","opacity:0,rotationX:-80,y:40,transformPerspective:900","opacity:1,rotationX:0,y:0",s+0.08,0.5,"back.out(1.5)")
def tilt(sel,t,d,a=-14,b=10):
    js.append(f'tl.fromTo("{sel}",{{rotationY:{a},rotationX:8,transformPerspective:1400}},{{rotationY:{b},rotationX:-4,duration:{d},ease:"sine.inOut",immediateRender:false}},{round(t,2)});')
# S0 dashboard (real screenshot)
s,d=span(0)
clip("s0",s,d,'<div class="stage"><div class="glass shot" id="dsh"><img src="assets/img/gads-dashboard.jpg" alt="Google Ads dashboard" /></div><div class="glass callchip" id="kc">\U0001F4DE Calls: <b>0</b></div></div>',0)
head("h0a",s,round(at(0,0.72)-s,2),"Google Ads mein","Clicks \u2713")
head("h0b",at(0,0.72),round(bounds[1]-at(0,0.72),2),"par","Calls \u2717","red",150)
T("#dsh","opacity:0,rotationX:70,y:220,transformPerspective:1400","opacity:1,rotationX:12,y:0",0.5,0.8,"back.out(1.2)")
tilt("#dsh",1.3,d-1.3,-10,8)
T("#kc","opacity:0,scale:0.3,rotation:-12","opacity:1,scale:1,rotation:-4",at(0,0.74),0.35,"back.out(2.5)"); pops.append(at(0,0.74))
js.append(f'tl.fromTo("#kc",{{boxShadow:"0 0 0 rgba(255,77,94,0)"}},{{boxShadow:"0 0 70px rgba(255,77,94,0.95)",duration:0.3,yoyo:true,repeat:3,immediateRender:false}},{at(0,0.78)});')
# S1 search terms
s,d=span(1)
clip("s1",s,d,'<div class="stage"><div class="glass srch" id="sr"><div class="mag"></div><span>Search Terms Report</span></div><div class="glass stlist" id="stl"><div class="st"><span>search term</span><b>clicks</b></div><div class="st"><span>• • • • •</span><b>?</b></div><div class="st"><span>• • • •</span><b>?</b></div><div class="st"><span>• • • • • •</span><b>?</b></div></div></div>',0)
head("h1",s,d,"ek baar dekho, log kya","SEARCH kar rahe?","",104)
T("#sr","opacity:0,scale:0.6,rotationY:-40","opacity:1,scale:1,rotationY:0",s+0.05,0.5,"back.out(1.6)")
T("#stl","opacity:0,y:120,rotationX:40","opacity:1,y:0,rotationX:0",s+0.35,0.5)
js.append(f'tl.fromTo("#sr .mag",{{x:0,rotation:0}},{{x:30,rotation:15,duration:0.5,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{s+0.6});')
# S2 AC
s,d=span(2)
winds=''.join(f'<div class="wind" style="left:{x}px;top:250px"></div>' for x in (210,290,370,450))
clip("s2",s,d,f'<div class="stage"><div class="acbox" id="acb"><div class="ac" id="acu"></div>{winds}<div class="acl t3d" style="font-size:72px">AC Repair \U0001F527</div></div></div>',0)
head("h2",s,d,"aap bechte ho","Service","gold",120)
T("#acu","opacity:0,y:-200,rotationX:70","opacity:1,y:0,rotationX:0",s+0.05,0.55,"back.out(1.4)")
js.append(f'tl.fromTo("#s2 .wind",{{opacity:0,y:-20}},{{opacity:0.8,y:40,duration:0.6,stagger:0.1,repeat:2,ease:"sine.out",immediateRender:false}},{s+0.5});')
T("#acb .acl","opacity:0,scale:0.5","opacity:1,scale:1",s+0.45,0.4,"back.out(2)"); pops.append(s+0.45)
# S3 wrong terms
s,d=span(3)
terms=[("ac repair <u>job</u>","Naukri dhoondh raha"),("ac repair <u>course</u>","Seekhna chahta"),("<u>free</u> mein AC kaise theek karein","Khud karega")]
tr=''.join(f'<div class="glass term" id="tm{j}"><span class="mag" style="width:44px;height:44px;border-width:7px"></span><span class="q">{q}</span><span class="x">✗ {x}</span></div>' for j,(q,x) in enumerate(terms))
clip("s3",s,d,f'<div class="stage"><div class="terms">{tr}</div></div>',0)
head("h3",s,d,"aur clicks aa rahe hain","Galat Searches","red",116)
for j,f in enumerate([0.12,0.45,0.68]):
    T(f"#tm{j}",f"opacity:0,x:{300 if j%2 else -300},rotationY:{-50 if j%2 else 50}","opacity:1,x:0,rotationY:0",at(3,f),0.45,"back.out(1.4)"); pops.append(at(3,f))
    T(f"#tm{j} .x","opacity:0,scale:0","opacity:1,scale:1",at(3,f)+0.35,0.3,"back.out(2.5)")
# S4 coins
s,d=span(4)
coins=''.join(f'<div class="coin" id="cn{j}" style="left:{x}px;top:330px">₹</div>' for j,x in enumerate((475,475,475,475)))
mins=''.join(f'<div class="minus" id="mn{j}" style="left:{x}px;top:{y}px">−₹</div>' for j,(x,y) in enumerate([(160,120),(780,160),(200,560),(760,600)]))
clip("s4",s,d,f'<div class="stage"><div class="wallet" id="wl"></div><div style="position:absolute;inset:0" data-layout-allow-overlap>{coins}{mins}</div></div>',0)
head("h4",s,d,"har click ka","Paisa Kat Raha!","gold",112)
T("#wl","opacity:0,scale:0.6","opacity:1,scale:1",s+0.05,0.4,"back.out(1.8)")
for j in range(4):
    tt=s+0.25+j*0.22
    T(f"#mn{j}","opacity:0,scale:0.4","opacity:1,scale:1",tt+0.45,0.3,"back.out(2.5)"); pops.append(tt+0.3)
js.append(f'tl.fromTo("#wl",{{x:-10}},{{x:10,duration:0.06,repeat:9,yoyo:true,ease:"none",immediateRender:false}},{s+0.4});')
# S5 fix
s,d=span(5)
clip("s5",s,d,'<div class="stage"><div class="shield" id="sh">✓</div><div class="duo"><div class="glass pill b" id="p1">Search Terms Report</div><div class="glass pill g" id="p2">Negative Keywords</div></div></div>',0)
head("h5",s,d,"iska ilaaj","2 Step Fix","green",126)
T("#sh","opacity:0,rotationY:180,scale:0.5","opacity:1,rotationY:0,scale:1",s+0.05,0.8,"back.out(1.4)")
T("#p1","opacity:0,y:60","opacity:1,y:0",at(5,0.28),0.4,"back.out(2)"); pops.append(at(5,0.28))
T("#p2","opacity:0,y:60","opacity:1,y:0",at(5,0.64),0.4,"back.out(2)"); pops.append(at(5,0.64))
js.append(f'tl.fromTo("#sh",{{filter:"drop-shadow(0 30px 50px rgba(0,0,0,0.5))"}},{{filter:"drop-shadow(0 0 60px rgba(69,226,140,0.9))",duration:0.4,yoyo:true,repeat:3,immediateRender:false}},{at(5,0.65)});')
# S6 kick out
s,d=span(6)
clip("s6",s,d,'<div class="stage"><div class="door" id="dr">EXIT →</div><div class="chips"><div class="glass wchip" id="w0">FREE</div><div class="glass wchip" id="w1">JOB</div><div class="glass wchip" id="w2">COURSE</div></div></div>',0)
head("h6",s,d,"aise shabd","BAHAR KARO!","red",128)
T("#dr","opacity:0,rotationY:-70","opacity:1,rotationY:0",s+0.05,0.5)
for j,f in enumerate([0.02,0.14,0.26]):
    T(f"#w{j}","opacity:0,scale:0.3","opacity:1,scale:1",at(6,f),0.3,"back.out(2.5)"); pops.append(at(6,f))
js.append(f'tl.to(["#w0","#w1","#w2"],{{x:560,rotation:25,opacity:0,duration:0.5,stagger:0.12,ease:"power3.in"}},{at(6,0.62)});')
# S7 target
s,d=span(7)
clip("s7",s,d,'<div class="stage"><div class="target" id="tg"></div><div class="arrowd" id="ar" style="left:180px;top:440px"></div><div class="glass callok" id="ck">\U0001F4DE Call aaya ✓</div></div>',0)
head("h7",s,d,"sahi keyword =","Sahi Customer","green",118)
T("#tg","opacity:0,rotationY:70,scale:0.6","opacity:1,rotationY:20,scale:1",s+0.05,0.5)
T("#ar","opacity:0,x:-500","opacity:1,x:0",s+0.35,0.3,"power4.in"); pops.append(s+0.62)
js.append(f'tl.fromTo("#tg",{{scale:1}},{{scale:1.06,duration:0.12,yoyo:true,repeat:1,immediateRender:false}},{s+0.65});')
T("#ck","opacity:0,y:50","opacity:1,y:0",at(7,0.5),0.35,"back.out(2)")
# S8 calendar
s,d=span(8)
clip("s8",s,d,'<div class="stage"><div class="cal" id="cl"><div class="calt">LAST CHECKED</div><div class="caln">?</div></div></div>',0)
head("h8",s,d,"aapne aakhri baar","Kab Dekha?","",130)
T("#cl","opacity:0,rotationX:-90,transformOrigin:'50% 0%'","opacity:1,rotationX:0",s+0.05,0.7,"bounce.out")
tilt("#cl",s+0.8,d-0.8,-12,12)
# S9 comment
s,d=span(9)
random.seed(3); cols=["#4f8bff","#2fd27a","#ffc53d","#ff4d5e","#a46bff"]
conf=''.join(f'<div class="cf" style="left:{random.randint(20,1040)}px;top:{random.randint(-300,-40)}px;background:{random.choice(cols)}" data-dy="{random.randint(1600,2200)}" data-r="{random.randint(180,720)}"></div>' for _ in range(44))
clip("s9",s,d,'<div class="stage"><div class="glass cbox" id="cbx"><div class="av"></div><span class="ctext" id="ct">KEYWORDS</span><span class="caret"></span><div class="send">➤</div></div></div>',0)
head("h9",s,d,"comment mein likho","“KEYWORDS”","gold",124)
T("#cbx","opacity:0,y:120,rotationX:50","opacity:1,y:0,rotationX:0",s+0.05,0.5,"back.out(1.5)")
T("#ct","clipPath:'inset(0 100% 0 0)'","clipPath:'inset(0 0% 0 0)'",at(9,0.5),0.6,"steps(8)")
pops.append(at(9,0.5)+0.65)
# brand
clip("brand",BR,round(END-BR,2),f'<div class="brand"><div class="bmark3d" id="bm"></div><div class="bname t3d">Advizr Media</div><div class="btag">Google Ads • Meta Ads • CRM • Local SEO</div><div class="bcta" id="bc">DM karo, baat karte hain \U0001F4E9</div></div><div style="position:absolute;inset:0">{conf}</div>',0)
T("#brand .bname","opacity:0,y:40","opacity:1,y:0",BR+0.4,0.4)
T("#brand .btag","opacity:0,y:30","opacity:1,y:0",BR+0.6,0.4)
T("#bc","opacity:0,scale:0.6","opacity:1,scale:1",BR+0.8,0.4,"back.out(2)")
js.append(f'tl.fromTo("#bc",{{scale:1}},{{scale:1.06,duration:0.4,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{BR+1.3});')
js.append(f'gsap.utils.toArray("#brand .cf").forEach((el)=>tl.fromTo(el,{{y:0,rotation:0}},{{y:+el.dataset.dy,rotation:+el.dataset.r,duration:2.4,ease:"power1.in"}},{BR}));')
pops.append(BR+0.1)
# captions
caps=[]
for i,cl in enumerate(CAPS):
    for k,(f,tx) in enumerate(cl):
        a=at(i,f); b=at(i,cl[k+1][0])-0.03 if k+1<len(cl) else (st[i+1]-0.05 if i+1<len(st) else BR)
        caps.append((a,round(b-a,2),tx))
for j,(a,dd,tx) in enumerate(caps): clip(f"sub{j}",a,dd,f'<span>{tx}</span>',4,"clip subw")
# bg
random.seed(11)
dust=''.join(f'<div class="dust" id="ds{j}" style="left:{random.randint(0,1070)}px;top:{random.randint(0,1900)}px"></div>' for j in range(26))
bghtml=f'<div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div><div class="floorw"><div class="floor" id="fl"></div></div>{dust}'
bgjs=[f'tl.fromTo("#fl",{{y:0}},{{y:120,duration:2,repeat:{int(END/2)+1},ease:"none"}},0);',
 f'tl.fromTo(".o1",{{x:-60,y:0}},{{x:120,y:140,duration:{round(END/2,2)},repeat:1,yoyo:true,ease:"sine.inOut"}},0);',
 f'tl.fromTo(".o2",{{x:40,y:0}},{{x:-140,y:-120,duration:{round(END/2,2)},repeat:1,yoyo:true,ease:"sine.inOut"}},0);',
 f'gsap.utils.toArray("#bg .dust").forEach((el,i)=>tl.fromTo(el,{{y:0,opacity:0.2}},{{y:-260-(i%5)*40,opacity:0.8,duration:{round(END,2)},ease:"none"}},0));']
aud=[f'<audio id="music-bed" src="assets/music/bed.m4a" data-start="0" data-duration="{END}" data-track-index="10" data-volume="0.1" data-automation=\'{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0}},{{"t":0.4,"v":1}},{{"t":{round(END-1.2,2)},"v":1}},{{"t":{END},"v":0}}]}}]}}\'></audio>']
for i,d in enumerate(D): aud.append(f'<audio id="vo-{i}" src="assets/voice/vo-{i}.m4a" data-start="{st[i]}" data-duration="{d}" data-track-index="{20+i%6}" data-volume="1"></audio>')
for j,tt in enumerate(sorted(pops)): aud.append(f'<audio id="sfx-p{j}" src="assets/sfx/pop.wav" data-start="{round(tt,2)}" data-duration="0.18" data-track-index="{41+j%3}" data-volume="0.2"></audio>')
aud.append(f'<audio id="sfx-imp" src="assets/sfx/impact.wav" data-start="{at(0,0.74)}" data-duration="0.7" data-track-index="40" data-volume="0.25"></audio>')
out=f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Advizr Google Ads Keywords</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
{CSS}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1080" data-height="1920">
      <div id="bg" class="full clip" data-start="0" data-duration="{END}" data-track-index="9">{bghtml}</div>
{chr(10).join("      "+h for h in html)}
      <div id="tl3" class="full clip" data-start="0" data-duration="{END}" data-track-index="7" data-layout-allow-occlusion style="z-index:4;pointer-events:none"><canvas id="three-layer" width="1080" height="1920" style="width:1080px;height:1920px;display:block"></canvas></div>
{chr(10).join("      "+a for a in aud)}
    </div>
    <script>window.__T12 = {{ s0end: {bounds[1]}, s4: {bounds[4]}, s4end: {bounds[5]}, br: {BR}, logoY: 760 }};</script>
    <script type="module">
{THREEJS}
    </script>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
{chr(10).join("      "+j for j in bgjs+js)}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
open(P+'/index.html','w').write(out); print(END)
