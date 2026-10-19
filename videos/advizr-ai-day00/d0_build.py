import sys, json, random
P=sys.argv[1]; L=json.load(open(sys.argv[2])); CSS=open(sys.argv[3]).read(); THREEJS=open(sys.argv[4]).read()
D=[d for d,w in L]; WHO=[w for d,w in L]
GAP=0.3; st=[]; t=0.6
for d in D: st.append(round(t,2)); t+=d+GAP
BR=round(t+0.3,2); END=round(BR+3.2,2)
def at(i,f): return round(st[i]+f*D[i],2)
TXT=["Namaste! \U0001F44B Main hoon <b>Advizr Bhaiya</b>.",
"Aur ye hai Rahul. Ise digital marketing ka <b>kuch nahi</b> aata.",
"Sach mein bhaiya, kuch nahi! \U0001F605",
"90 din mein ise <b>AI wala Digital Marketer</b> banaunga \U0001F916",
"Har din ek naya sabak. Aap bhi <b>saath mein seekho</b> \U0001F4DA",
"90 din baad Rahul ek <b>asli business</b> ka campaign chalayega \U0001F680",
"Bhaiya... kya main kar paunga? \U0001F97A",
"Dekhte hain! Follow karo, aur comment mein likho: <b>“Main bhi seekhunga”</b> \U0001F447"]
html=[]; js=[]; pops=[]
def clip(id,s,d,inner,track=1,cls="clip",style=""):
    html.append(f'<div id="{id}" class="{cls}" data-start="{s}" data-duration="{round(d,2)}" data-track-index="{track}" style="{style}">{inner}</div>')
def T(sel,fr,to,t,dur=0.4,ease="power3.out"):
    js.append(f'tl.fromTo("{sel}",{{{fr}}},{{{to},duration:{dur},ease:"{ease}"}},{round(t,2)});')
# bubbles
for i,tx in enumerate(TXT):
    e = st[i+1]-0.08 if i+1<len(st) else BR
    w=WHO[i]; name="ADVIZR BHAIYA" if w=="B" else "RAHUL"
    clip(f"bb{i}",st[i]-0.05,e-st[i]+0.05,f'<span class="who">{name}</span>{tx}',4,f"clip bub {w.lower()}")
    T(f"#bb{i}","opacity:0,scale:0.5","opacity:1,scale:1",st[i]-0.05,0.35,"back.out(2)"); pops.append(st[i])
# badge + series (until brand)
clip("badge",0,BR,'DAY 0/90',6,"clip badge")
clip("series",0,BR,'Advizr Bhaiya ki Class<br/><b>90 Din AI Challenge</b>',6,"clip series")
T("#badge","opacity:0,x:-120","opacity:1,x:0",0.1,0.5,"back.out(1.8)")
T("#series","opacity:0,x:120","opacity:1,x:0",0.2,0.5,"back.out(1.8)")
# panels
p0e=st[1]-0.1
clip("p0",0,p0e,'<div class="panel"><div class="lead">shuru ho raha hai</div><div class="t3d cyan" style="font-size:150px">90 DIN</div><div class="t3d" style="font-size:96px">AI CHALLENGE</div></div>',3,"clip full")
T("#p0 .lead","opacity:0,y:20","opacity:1,y:0",0.25,0.3)
T("#p0 .t3d.cyan","opacity:0,rotationX:-90,y:40,transformPerspective:900","opacity:1,rotationX:0,y:0",0.3,0.55,"back.out(1.5)")
T("#p0 .t3d:not(.cyan)","opacity:0,scale:1.6","opacity:1,scale:1",0.6,0.4,"power4.out"); pops.append(0.6)
s1=st[1]-0.1; e1=st[3]-0.1
clip("p1",s1,e1-s1,'<div class="panel"><div class="meter"><div class="mlab"><span>Rahul ka level</span><span style="color:#e8344a">0% \U0001F605</span></div><div class="mbar"><div class="mfill" id="mf1"></div></div></div></div>',3,"clip full")
T("#p1 .meter","opacity:0,y:40","opacity:1,y:0",s1+0.1,0.4)
js.append(f'tl.fromTo("#mf1",{{width:"0%"}},{{width:"3%",duration:0.5}},{s1+0.5});')
clip("qm1",st[1]+1.2,e1-st[1]-1.2,'?',6,"clip qm")
T("#qm1","opacity:0,scale:0.3,rotation:-30","opacity:1,scale:1,rotation:0",st[1]+1.2,0.4,"back.out(3)")
js.append(f'tl.fromTo("#qm1",{{y:0}},{{y:-20,duration:0.4,yoyo:true,repeat:5,ease:"sine.inOut",immediateRender:false}},{st[1]+1.6});')
s3=st[3]-0.1; e3=st[4]-0.1
clip("p3",s3,e3-s3,'<div class="panel"><div class="lead">90 din mein</div><div class="t3d red" style="font-size:110px">ZERO</div><div class="t3d" style="font-size:70px">↓</div><div class="t3d green" style="font-size:96px">AI MARKETER</div></div>',3,"clip full")
js.append(f'tl.fromTo("#p3 .t3d",{{opacity:0,y:40,scale:0.7}},{{opacity:1,y:0,scale:1,duration:0.4,stagger:0.35,ease:"back.out(2)"}},{s3+0.1});')
pops += [s3+0.1, s3+0.8]
s4=st[4]-0.1; e4=st[5]-0.1
cal=''.join(f'<div id="cd{k}">{k}</div>' for k in range(1,31))
clip("p4",s4,e4-s4,f'<div class="panel"><div class="cal">{cal}</div><div class="tease"><b>Roz 1 sabak</b> · 90 din</div></div>',3,"clip full")
js.append(f'tl.fromTo("#p4 .cal div",{{opacity:0,scale:0.4}},{{opacity:1,scale:1,duration:0.25,stagger:0.03,ease:"back.out(2)"}},{s4+0.05});')
js.append(f'tl.to("#p4 .cal div",{{background:"linear-gradient(135deg,#0aa6e0,#3a6cff)",color:"#fff",duration:0.1,stagger:0.06}},{s4+1.2});')
s5=st[5]-0.1; e5=st[6]-0.1
clip("p5",s5,e5-s5,'<div class="panel"><div class="rocket" id="rk">\U0001F680</div><div class="t3d cyan" style="font-size:100px">DAY 90</div><div class="tease">Rahul ka <b>pehla real campaign</b></div></div>',3,"clip full")
T("#rk","opacity:0,y:200,rotation:-20","opacity:1,y:0,rotation:0",s5+0.05,0.6,"back.out(1.6)"); pops.append(s5+0.05)
T("#p5 .t3d","opacity:0,scale:1.5","opacity:1,scale:1",s5+0.4,0.4,"power4.out")
T("#p5 .tease","opacity:0,y:20","opacity:1,y:0",s5+0.7,0.3)
s6=st[6]-0.1; e6=st[7]-0.1
clip("qm6",s6,e6-s6,'?',6,"clip qm")
T("#qm6","opacity:0,scale:0.3","opacity:1,scale:1",s6+0.1,0.35,"back.out(3)")
s7=st[7]-0.1
clip("p7",s7,BR-s7,'<div class="panel"><div class="card cbox" id="cbx"><div class="av"></div><span class="ctext" id="ct" style="font-size:44px">Main bhi seekhunga \U0001F64B</span><div class="send">➤</div></div><div class="tease">➕ <b>Follow</b> karo, kal se Day 1</div></div>',3,"clip full")
T("#cbx","opacity:0,y:80,rotationX:50,transformPerspective:1200","opacity:1,y:0,rotationX:0",s7+0.05,0.5,"back.out(1.5)")
T("#ct","clipPath:'inset(0 100% 0 0)'","clipPath:'inset(0 0% 0 0)'",at(7,0.45),0.8,"steps(12)")
T("#p7 .tease","opacity:0,scale:0.6","opacity:1,scale:1",at(7,0.7),0.35,"back.out(2)"); pops.append(at(7,0.7))
# brand end
random.seed(9); cols=["#12c4ff","#1fbf62","#ffc94a","#ff5c7a","#8a6bff"]
conf=''.join(f'<div class="cf" style="left:{random.randint(20,1040)}px;top:{random.randint(-300,-40)}px;background:{random.choice(cols)}" data-dy="{random.randint(1600,2200)}" data-r="{random.randint(180,720)}"></div>' for _ in range(44))
clip("brand",BR,END-BR,f'<div class="brand"><div class="bmark3d"></div><div class="bname t3d">Advizr Media</div><div class="btag">Kal: <b style="color:#0aa6e0">Day 1</b> — AI karta kya hai?</div><div class="bcta" id="bc">Follow karo \U0001F514</div></div><div style="position:absolute;inset:0">{conf}</div>',2,"clip full")
T("#brand .bname","opacity:0,y:40","opacity:1,y:0",BR+0.4,0.4)
T("#brand .btag","opacity:0,y:30","opacity:1,y:0",BR+0.6,0.4)
T("#bc","opacity:0,scale:0.6","opacity:1,scale:1",BR+0.8,0.4,"back.out(2)")
js.append(f'tl.fromTo("#bc",{{scale:1}},{{scale:1.06,duration:0.4,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{BR+1.3});')
js.append(f'gsap.utils.toArray("#brand .cf").forEach((el)=>tl.fromTo(el,{{y:0,rotation:0}},{{y:+el.dataset.dy,rotation:+el.dataset.r,duration:2.4,ease:"power1.in"}},{BR}));')
pops.append(BR+0.1)
lines=[[st[i],round(st[i]+D[i],2),WHO[i]] for i in range(len(D))]
TC={"lines":lines,"br":BR,"logoY":760,"rEnter":round(st[1]+1.0,2),"wave":[[0.3,st[0]+D[0]],[st[7],st[7]+1.2]],"shrug":[[st[2],st[2]+D[2]]],"spin":round(st[3]+0.8,2)}
bghtml='<div class="orb o1"></div><div class="orb o2"></div><div class="orb o3"></div><div class="floorw"><div class="floor" id="fl"></div></div>'
bgjs=[f'tl.fromTo("#fl",{{y:0}},{{y:120,duration:2,repeat:{int(END/2)+1},ease:"none"}},0);',
 f'tl.fromTo(".o1",{{x:-60,y:0}},{{x:120,y:140,duration:{round(END/2,2)},repeat:1,yoyo:true,ease:"sine.inOut"}},0);',
 f'tl.fromTo(".o2",{{x:40,y:0}},{{x:-140,y:-120,duration:{round(END/2,2)},repeat:1,yoyo:true,ease:"sine.inOut"}},0);']
aud=[f'<audio id="music-bed" src="assets/music/bed.m4a" data-start="0" data-duration="{END}" data-track-index="10" data-volume="0.1" data-automation=\'{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0}},{{"t":0.4,"v":1}},{{"t":{round(END-1.2,2)},"v":1}},{{"t":{END},"v":0}}]}}]}}\'></audio>']
for i,d in enumerate(D): aud.append(f'<audio id="vo-{i}" src="assets/voice/vo-{i}.m4a" data-start="{st[i]}" data-duration="{d}" data-track-index="{20+i%6}" data-volume="1"></audio>')
for j,tt in enumerate(sorted(pops)): aud.append(f'<audio id="sfx-p{j}" src="assets/sfx/pop.wav" data-start="{round(tt,2)}" data-duration="0.18" data-track-index="{41+j%3}" data-volume="0.18"></audio>')
out=f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Advizr Bhaiya Day 0</title>
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
    <script>window.__TC = {json.dumps(TC)};</script>
    <script type="module">
{THREEJS}
    </script>
  </body>
</html>
'''
open(P+'/index.html','w').write(out); print(END, st)
