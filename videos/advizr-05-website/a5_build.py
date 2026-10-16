import sys, json, random
P=sys.argv[1]; D=json.load(open(sys.argv[2])); CSS=open(sys.argv[3]).read(); THREEJS=open(sys.argv[4]).read()
GAP=0.3
st=[];t=0.3
for d in D: st.append(round(t,2)); t+=d+GAP
BR=round(t+0.2,2); END=round(BR+3.0,2)
def at(i,f): return round(st[i]+f*D[i],2)
def sc(i): return 0 if i==0 else round(st[i]-0.18,2)
bounds=[sc(i) for i in range(len(D))]+[BR]
def span(i): return bounds[i], round(bounds[i+1]-bounds[i],2)
CAPS=[[(0,"Website banwayi, sundar bhi hai,"),(0.62,"par <b>inquiry</b> nahi aati?")],
[(0,"Socho, ek shaandaar dukaan..."),(0.72,"par <b>darwaza</b> hi nahi!")],
[(0,"Zyadatar websites mein yahi hota hai.")],
[(0,"Number neeche kahin chhupa hai,"),(0.64,"<b>button</b> dikhta hi nahi.")],
[(0,"Mobile pe kholo,"),(0.42,"toh <b>dheemi</b> aur <b>tooti</b> hui.")],
[(0,"Har page pe ek saaf button rakho:"),(0.62,"<b>Call karo</b> ya <b>WhatsApp</b> karo.")],
[(0,"Mobile pe tez rakho,"),(0.44,"aur upar hi batao, aap kya karte ho.")],
[(0,"Sundar website nahi..."),(0.49,"<b>kaam karne wali</b> website chahiye.")],
[(0,"Aapki website mein <b>darwaza</b> hai?")],
[(0,"Comment mein likho <b>“WEBSITE”</b> \U0001F447")]]
html=[]; js=[]; pops=[]
def clip(id,s,d,inner,track=1,cls="full clip",style="",extra=""):
    html.append(f'<div id="{id}" class="{cls}" data-start="{s}" data-duration="{d}" data-track-index="{track}" style="{style}" {extra}>{inner}</div>')
def T(sel,fr,to,t,dur=0.4,ease="power3.out"):
    js.append(f'tl.fromTo("{sel}",{{{fr}}},{{{to},duration:{dur},ease:"{ease}"}},{round(t,2)});')
def head(id,s,d,lead,big,cls="",size=118):
    clip(id,s,d,f'<div class="lead">{lead}</div><div class="t3d {cls}" style="font-size:{size}px">{big}</div>',3,"clip head")
    T(f"#{id} .lead","opacity:0,y:24","opacity:1,y:0",s+0.02,0.3)
    T(f"#{id} .t3d","opacity:0,rotationX:-80,y:40,transformPerspective:900","opacity:1,rotationX:0,y:0",s+0.08,0.5,"back.out(1.5)")
def tilt(sel,t,d,a=-12,b=10):
    js.append(f'tl.fromTo("{sel}",{{rotationY:{a},rotationX:6,transformPerspective:1400}},{{rotationY:{b},rotationX:-3,duration:{d},ease:"sine.inOut",immediateRender:false}},{round(t,2)});')
def split(i,f,id,l1,b1,c1,l2,b2,c2,s1=118,s2=118):
    s,_=span(i); m=at(i,f); e=bounds[i+1]
    head(id+"a",s,round(m-s,2),l1,b1,c1,s1); head(id+"b",m,round(e-m,2),l2,b2,c2,s2)
BROW='<div class="card browser" id="{id}"><div class="bbar"><i></i><i></i><i></i><div class="url"></div></div><div class="hero"><div class="blob3"></div><h3>Your Business,<br/>Beautifully Online.</h3><p>Premium services in Pune</p></div><div class="rows"><div style="width:90%"></div><div style="width:70%"></div><div style="width:80%"></div></div></div>'
# S0
s,d=span(0)
clip("s0",s,d,'<div class="stage">'+BROW.format(id="br0")+'<div class="chip red" id="iq" style="top:40px;right:60px">\U0001F4E9 Inquiries: 0</div></div>',0)
split(0,0.62,"h0","sundar website bani","Website ✓","cyan","par","Inquiry ✗","red",130,150)
T("#br0","opacity:0,rotationX:60,y:200,transformPerspective:1400","opacity:1,rotationX:8,y:0",0.15,0.8,"back.out(1.2)")
tilt("#br0",0.9,d-0.9)
T("#iq","opacity:0,scale:0.3,rotation:-14","opacity:1,scale:1,rotation:-4",at(0,0.64),0.35,"back.out(2.4)"); pops.append(at(0,0.64))
# S1 shop (3D)
s,d=span(1)
clip("s1",s,d,'<div class="stage"><div class="chip red" id="nd" style="bottom:20px">\U0001F6AA Darwaza hi nahi!</div></div>',0)
split(1,0.72,"h1","socho, ek","Shaandaar Dukaan","","par","Darwaza? ✗","red",104,140)
T("#nd","opacity:0,y:60,scale:0.6","opacity:1,y:0,scale:1",at(1,0.74),0.4,"back.out(2)"); pops.append(at(1,0.74))
# S2 grid
s,d=span(2)
grads=["linear-gradient(135deg,#12c4ff,#6a5cff)","linear-gradient(135deg,#ff8a5c,#ff5c9a)","linear-gradient(135deg,#1fbf62,#12c4ff)","linear-gradient(135deg,#6a5cff,#b05cff)","linear-gradient(135deg,#ffc94a,#ff8a5c)","linear-gradient(135deg,#0aa6e0,#1fbf62)"]
minis=''.join(f'<div class="card mini" id="mi{k}"><div class="mh" style="background:{g}"></div><div class="ml" style="width:70%"></div><div class="ml" style="width:50%"></div><div class="stamp" id="sp{k}">NO DOOR</div></div>' for k,g in enumerate(grads))
clip("s2",s,d,f'<div class="stage"><div class="grid6">{minis}</div></div>',0)
head("h2",s,d,"zyadatar websites mein","Yahi Haal!","red",130)
js.append(f'tl.fromTo("#s2 .mini",{{opacity:0,y:80,rotationY:40}},{{opacity:1,y:0,rotationY:0,duration:0.4,stagger:0.07,ease:"back.out(1.5)"}},{s+0.05});')
js.append(f'tl.fromTo("#s2 .stamp",{{opacity:0,scale:2.4}},{{opacity:1,scale:1,duration:0.25,stagger:0.12,ease:"power4.in"}},{s+0.6});')
pops+= [s+0.85+0.12*k for k in range(0,6,2)]
# S3 long page
s,d=span(3)
secs=''.join('<div class="sec"></div>' for _ in range(5))
clip("s3",s,d,f'<div class="stage"><div class="card longpage"><div class="lp" id="lp">{secs}<div class="foot">Contact: +91 9XXXX XXXXX · email@site.com</div></div></div><div class="mag" id="mg" style="left:640px;top:160px"></div><div class="chip red" id="bq" style="top:20px;left:90px">Button? ✗</div></div>',0)
split(3,0.64,"h3","number","Chhupa Hai","","aur button","Gayab!","red",126,140)
js.append(f'tl.fromTo("#lp",{{y:0}},{{y:-560,duration:{round(D[3]*0.6,2)},ease:"power2.inOut"}},{s+0.2});')
js.append(f'tl.fromTo("#mg",{{x:0,y:0}},{{x:-380,y:420,duration:{round(D[3]*0.6,2)},ease:"sine.inOut"}},{s+0.2});')
T("#bq","opacity:0,scale:0.3","opacity:1,scale:1",at(3,0.66),0.35,"back.out(2.4)"); pops.append(at(3,0.66))
# S4 slow broken phone
s,d=span(4)
blocks=''.join(f'<div class="pb" id="pbk{k}" style="left:{30+ (k%2)*200}px;top:{80+k*130}px;width:{180 if k%2 else 360}px;height:110px"></div>' for k in range(5))
clip("s4",s,d,f'<div class="stage"><div class="phone" id="ph4"><div class="notch"></div>{blocks}<div class="spinner" id="spn"></div></div><div class="chip red" id="tm1" style="top:60px;right:80px">⏳ 3s</div><div class="chip red" id="tm2" style="top:60px;right:80px">⏳ 6s</div><div class="chip red" id="tm3" style="top:60px;right:80px">⏳ 9s...</div></div>',0)
split(4,0.42,"h4","mobile pe kholo","Slow...","red","aur","Tooti Hui!","red",140,134)
T("#ph4","opacity:0,y:200,rotation:4","opacity:1,y:0,rotation:0",s+0.05,0.5)
js.append(f'tl.fromTo("#spn",{{rotation:0}},{{rotation:1080,duration:{d},ease:"none"}},{s});')
for k,f in enumerate([0.12,0.3,0.48]):
    T(f"#tm{k+1}","opacity:0,scale:0.5","opacity:1,scale:1",at(4,f),0.25,"back.out(2)")
    if k<2: js.append(f'tl.to("#tm{k+1}",{{opacity:0,duration:0.1}},{at(4,[0.3,0.48][k])});')
for k in range(5):
    js.append(f'tl.to("#pbk{k}",{{rotation:{[-18,22,-10,30,-25][k]},x:{[-40,60,-30,50,-60][k]},y:{[30,-20,50,10,40][k]},duration:0.5,ease:"back.out(2)"}},{at(4,0.44)+k*0.05});')
js.append(f'tl.fromTo("#ph4",{{x:-10}},{{x:10,duration:0.05,repeat:7,yoyo:true,ease:"none",immediateRender:false}},{at(4,0.44)});')
# S5 buttons
s,d=span(5)
clip("s5",s,d,'<div class="stage"><div class="phone" id="ph5"><div class="notch"></div><div class="phero"><h4>AC Repair<br/>in Pune</h4><p>Same-day service</p></div><div class="pbtn call" id="bt1" style="top:450px">\U0001F4DE Call Now</div><div class="pbtn wa" id="bt2" style="top:580px">\U0001F4AC WhatsApp</div></div><div class="chip green" id="ok5" style="top:120px;right:60px">✓ Easy</div></div>',0)
split(5,0.62,"h5","har page pe","Saaf Button","green","call ya","WhatsApp ✓","green",128,126)
T("#ph5","opacity:0,rotationY:-60,scale:0.8","opacity:1,rotationY:0,scale:1",s+0.05,0.6,"back.out(1.3)")
T("#bt1","opacity:0,scale:0.4","opacity:1,scale:1",at(5,0.62),0.35,"back.out(2.5)"); pops.append(at(5,0.62))
T("#bt2","opacity:0,scale:0.4","opacity:1,scale:1",at(5,0.8),0.35,"back.out(2.5)"); pops.append(at(5,0.8))
js.append(f'tl.fromTo("#bt1",{{scale:1}},{{scale:1.07,duration:0.3,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{at(5,0.9)});')
T("#ok5","opacity:0,scale:0.4","opacity:1,scale:1",at(5,0.9),0.3,"back.out(2.4)")
# S6 fast
s,d=span(6)
clip("s6",s,d,'<div class="stage"><div class="phone" id="ph6"><div class="notch"></div><div class="phero" id="ph6h"><h4>AC Repair<br/>in Pune</h4><p>Same-day service · Call now</p></div><div class="pbtn call" style="top:450px">\U0001F4DE Call Now</div><div class="pbtn wa" style="top:580px">\U0001F4AC WhatsApp</div></div><div class="bolt" id="bo" style="left:140px;top:120px">⚡</div><div class="chip green" id="fs" style="top:60px;right:70px">⚡ Fast</div></div>',0)
split(6,0.44,"h6","mobile pe","Tez Rakho","cyan","aur upar hi batao","Aap Kya Karte Ho","",140,92)
T("#ph6","opacity:0,y:300","opacity:1,y:0",s+0.05,0.35,"power4.out")
T("#bo","opacity:0,scale:0.2,rotation:-30","opacity:1,scale:1,rotation:0",s+0.2,0.35,"back.out(3)"); pops.append(s+0.2)
T("#fs","opacity:0,scale:0.4","opacity:1,scale:1",s+0.4,0.3,"back.out(2.4)")
js.append(f'tl.fromTo("#ph6h",{{boxShadow:"inset 0 0 0 0 rgba(255,255,255,0)"}},{{boxShadow:"inset 0 0 0 10px rgba(255,255,255,0.9)",duration:0.35,yoyo:true,repeat:3,immediateRender:false}},{at(6,0.5)});')
# S7 + S8 shop with door (3D)
s,d=span(7)
clip("s7",s,d,'<div class="stage"></div>',0)
split(7,0.49,"h7","sundar website","Nahi ✗","red","kaam karne wali","Website ✓","green",150,130)
s8,d8=span(8)
clip("s8",s8,d8,'<div class="stage"></div>',0)
head("h8",s8,d8,"aapki website mein","Darwaza Hai?","cyan",128)
# S9 comment
s,d=span(9)
clip("s9",s,d,'<div class="stage"><div class="card cbox" id="cbx"><div class="av"></div><span class="ctext" id="ct">WEBSITE</span><span class="caret"></span><div class="send">➤</div></div></div>',0)
head("h9",s,d,"comment mein likho","“WEBSITE”","cyan",130)
T("#cbx","opacity:0,y:120,rotationX:50","opacity:1,y:0,rotationX:0",s+0.05,0.5,"back.out(1.5)")
T("#ct","clipPath:'inset(0 100% 0 0)'","clipPath:'inset(0 0% 0 0)'",at(9,0.45),0.6,"steps(7)"); pops.append(at(9,0.45)+0.65)
# brand
random.seed(5); cols=["#12c4ff","#1fbf62","#ffc94a","#ff5c7a","#8a6bff"]
conf=''.join(f'<div class="cf" style="left:{random.randint(20,1040)}px;top:{random.randint(-300,-40)}px;background:{random.choice(cols)}" data-dy="{random.randint(1600,2200)}" data-r="{random.randint(180,720)}"></div>' for _ in range(44))
clip("brand",BR,round(END-BR,2),f'<div class="brand"><div class="bmark3d"></div><div class="bname t3d">Advizr Media</div><div class="btag">Website • Google Ads • Meta Ads • CRM</div><div class="bcta" id="bc">DM karo, baat karte hain \U0001F4E9</div></div><div style="position:absolute;inset:0">{conf}</div>',2)
T("#brand .bname","opacity:0,y:40","opacity:1,y:0",BR+0.4,0.4)
T("#brand .btag","opacity:0,y:30","opacity:1,y:0",BR+0.6,0.4)
T("#bc","opacity:0,scale:0.6","opacity:1,scale:1",BR+0.8,0.4,"back.out(2)")
js.append(f'tl.fromTo("#bc",{{scale:1}},{{scale:1.06,duration:0.4,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{BR+1.3});')
js.append(f'gsap.utils.toArray("#brand .cf").forEach((el)=>tl.fromTo(el,{{y:0,rotation:0}},{{y:+el.dataset.dy,rotation:+el.dataset.r,duration:2.4,ease:"power1.in"}},{BR}));')
pops.append(BR+0.1)
caps=[]
for i,cl in enumerate(CAPS):
    for k,(f,tx) in enumerate(cl):
        a=at(i,f); b=at(i,cl[k+1][0])-0.03 if k+1<len(cl) else (st[i+1]-0.05 if i+1<len(st) else BR)
        caps.append((a,round(b-a,2),tx))
for j,(a,dd,tx) in enumerate(caps): clip(f"sub{j}",a,dd,f'<span>{tx}</span>',4,"clip subw")
bghtml='<div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div><div class="floorw"><div class="floor" id="fl"></div></div>'
bgjs=[f'tl.fromTo("#fl",{{y:0}},{{y:120,duration:2,repeat:{int(END/2)+1},ease:"none"}},0);',
 f'tl.fromTo(".o1",{{x:-60,y:0}},{{x:120,y:140,duration:{round(END/2,2)},repeat:1,yoyo:true,ease:"sine.inOut"}},0);',
 f'tl.fromTo(".o2",{{x:40,y:0}},{{x:-140,y:-120,duration:{round(END/2,2)},repeat:1,yoyo:true,ease:"sine.inOut"}},0);']
aud=[f'<audio id="music-bed" src="assets/music/bed.m4a" data-start="0" data-duration="{END}" data-track-index="10" data-volume="0.1" data-automation=\'{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0}},{{"t":0.4,"v":1}},{{"t":{round(END-1.2,2)},"v":1}},{{"t":{END},"v":0}}]}}]}}\'></audio>']
for i,d in enumerate(D): aud.append(f'<audio id="vo-{i}" src="assets/voice/vo-{i}.m4a" data-start="{st[i]}" data-duration="{d}" data-track-index="{20+i%6}" data-volume="1"></audio>')
for j,tt in enumerate(sorted(pops)): aud.append(f'<audio id="sfx-p{j}" src="assets/sfx/pop.wav" data-start="{round(tt,2)}" data-duration="0.18" data-track-index="{41+j%3}" data-volume="0.2"></audio>')
T5=f'window.__T5 = {{ s1: {bounds[1]}, s1e: {bounds[2]}, s7: {bounds[7]}, s8e: {bounds[9]}, door: {at(7,0.5)}, walk: {round(at(7,0.5)+0.5,2)}, br: {BR}, logoY: 760 }};'
out=f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Advizr Website Door</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
{CSS}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1080" data-height="1920">
      <div id="bg" class="full clip" data-start="0" data-duration="{END}" data-track-index="9">{bghtml}</div>
      <div id="tl3" class="full clip" data-start="0" data-duration="{END}" data-track-index="8" data-layout-allow-occlusion style="pointer-events:none"><canvas id="three-layer" width="1080" height="1920" style="width:1080px;height:1920px;display:block"></canvas></div>
{chr(10).join("      "+h for h in html)}
{chr(10).join("      "+a for a in aud)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
{chr(10).join("      "+j for j in bgjs+js)}
      window.__timelines["main"] = tl;
    </script>
    <script>{T5}</script>
    <script type="module">
{THREEJS}
    </script>
  </body>
</html>
'''
open(P+'/index.html','w').write(out); print(END)
