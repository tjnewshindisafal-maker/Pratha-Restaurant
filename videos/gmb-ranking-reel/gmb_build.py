import sys, json
P=sys.argv[1]
D=[2.58,1.15,1.51,2.73,1.75,2.35,3.70,2.62,1.54,2.88,1.37,1.15,1.51,2.15,3.30,2.13,4.60,2.82,2.35]
CAP=["Google pe business profile bana li?","Bahut achha.","Par calls nahi aate?","Kyunki profile banana sirf shuruaat hai.","Asli khel hai ranking.","Jab koi search karta hai “near me”,","toh zyadatar log sirf upar ke 3 result dekhte hain.","Aur agar aap 27th number pe ho,","toh aap dikhte hi nahi.","Google upar use rakhta hai jo active hai.","Roz nayi photos,","posts aur offers,","har review ka jawab,","aur sahi timing, sahi details.","Roz update karo, toh rank upar jaane lagti hai.","Aur rank upar, toh calls zyada.","Bina update ke profile bas ek board hai jo kisi ko dikhta nahi.","Aapki profile Google pe kis number pe hai?","Pata nahi? Toh comment mein likho “RANK”."]
SCENE_FIRST=[0,2,3,5,7,9,10,14,16,17]
st=[];t=0.3
for i,d in enumerate(D):
    if i in SCENE_FIRST and i>0: t+=0.3
    st.append(round(t,2)); t+=d+0.2
END=round(t+1.6,2)
def sc(i): # scene start
    k=SCENE_FIRST.index(i); return 0 if k==0 else round(st[i]-0.25,2)
bounds=[sc(i) for i in SCENE_FIRST]+[END]
def span(k): return bounds[k], round(bounds[k+1]-bounds[k],2)
L=lambda i: st[i]
html=[]; js=[]
def clip(id,s,d,inner,track=1,style="",cls="full clip"):
    html.append(f'<div id="{id}" class="{cls}" data-start="{s}" data-duration="{d}" data-track-index="{track}" style="{style}">{inner}</div>')
def head(id,s,d,lead,big,color="var(--ink)",size=110,extra=""):
    clip(id,s,d,f'<div class="lead">{lead}</div><div class="big" style="color:{color};font-size:{size}px">{big}</div>{extra}',track=3,cls="clip head")
    js.append(f'tl.fromTo("#{id} .lead",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.3,ease:"power2.out"}},{s+0.02});')
    js.append(f'tl.fromTo("#{id} .big",{{opacity:0,y:40,scale:0.92}},{{opacity:1,y:0,scale:1,duration:0.38,ease:"back.out(1.8)"}},{s+0.1});')
def pop(sel,t,dur=0.35,ease="back.out(2)",fr="opacity:0,scale:0.6",to="opacity:1,scale:1"):
    js.append(f'tl.fromTo("{sel}",{{{fr}}},{{{to},duration:{dur},ease:"{ease}"}},{round(t,2)});')
pops=[]
GCARD='''<div class="gcard"><div class="gmap"><div class="pin"></div></div><div class="gbody"><div class="gname">Your Business</div><div class="gmeta"><span class="stars">★★★★★</span> · Shop · Open now</div><div class="gbtns"><div><i class="b1"></i>Call</div><div><i class="b2"></i>Directions</div><div><i class="b3"></i>Website</div><div><i class="b4"></i>Save</div></div></div></div>'''
# S1
s,d=span(0)
clip("s1",s,d,f'<div class="center" id="s1c">{GCARD}<div class="okbadge" id="ok1">✓</div></div>',track=0)
head("h0",s,round(L(1)-s,2),"Google pe","Business Profile","var(--blue)",104,'<div class="sub" id="h0s">bana li?</div>')
js.append(f'tl.fromTo("#h0s",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.3}},{L(0)+1.2});')
head("h1",L(1),round(bounds[1]-L(1),2),"","Bahut achha.","var(--green)",118)
pop("#s1c .gcard",0.35,0.55,"back.out(1.5)","opacity:0,y:120,rotation:-4","opacity:1,y:0,rotation:0")
pop("#ok1",L(1)+0.05,0.4); pops.append(L(1)+0.05)
js.append(f'tl.fromTo("#s1c .gbtns > div",{{opacity:0,y:20}},{{opacity:1,y:0,duration:0.25,stagger:0.1}},0.8);')
# S2 dark
s,d=span(1)
clip("s2",s,d,'<div class="darkbg"></div><div class="dk"><div class="lead w">par</div><div class="glow">CALLS<br/>NAHI AATE?</div><div class="callbox" id="cb"><i class="b1 red"></i><span>Calls today</span><b>0</b></div></div>',track=0)
pop("#s2 .glow",s+0.1,0.4,"power3.out","opacity:0,scale:1.25","opacity:1,scale:1")
pop("#cb",s+0.6,0.35,"back.out(2)","opacity:0,y:40","opacity:1,y:0")
js.append(f'tl.fromTo("#s2 .glow",{{textShadow:"0 0 10px rgba(255,40,40,0.4)"}},{{textShadow:"0 0 50px rgba(255,40,40,0.95)",duration:0.5,yoyo:true,repeat:2,ease:"sine.inOut"}},{s+0.5});')
# S3
s,d=span(2)
clip("s3",s,d,'''<div class="center"><div class="prog"><div class="plabel">Profile created</div><div class="pbar"><div class="pfill" id="pf"></div></div><div class="pends"><span class="tag blue">START</span><span class="tag grey">Customers</span></div></div>
<div class="ladder" id="lad"><div class="rung r3"><b>#3</b></div><div class="rung r2"><b>#2</b></div><div class="rung r1"><b>#1</b></div></div></div>''',track=0)
head("h3",s,round(L(4)-s,2),"Profile banana","sirf START hai.","var(--ink)",100)
head("h4",L(4),round(bounds[3]-L(4),2),"asli khel","RANKING","var(--blue)",140)
js.append(f'tl.fromTo("#pf",{{width:"0%"}},{{width:"12%",duration:0.6,ease:"power2.out"}},{s+0.4});')
js.append(f'tl.to("#s3 .prog",{{opacity:0,y:-60,duration:0.3}},{L(4)-0.1});')
js.append(f'tl.fromTo("#lad .rung",{{scaleY:0}},{{scaleY:1,duration:0.4,stagger:0.12,ease:"back.out(1.6)"}},{L(4)+0.1});')
# S4 phone search
s,d=span(3)
res=''.join(f'<div class="res" id="res{n}"><span class="num">{n}</span><div><div class="rn">{nm}</div><div class="rs"><span class="stars">★★★★★</span> · Open</div></div><div class="rcall"></div></div>' for n,nm in [(1,"Cafe Aroma"),(2,"Brew House"),(3,"Daily Grind")])
clip("s4",s,d,f'''<div class="center"><div class="phone"><div class="notch"></div><div class="sbar"><span class="g">G</span><span class="typed" id="ty">cafe near me</span><span class="caret"></span></div>
<div class="map"><div class="road a"></div><div class="road b"></div><div class="mp p1">1</div><div class="mp p2">2</div><div class="mp p3">3</div></div><div class="results">{res}</div><div class="top3" id="t3">TOP 3</div></div></div>''',track=0)
head("h5",s,round(L(6)-s,2),"search:","“near me”","var(--blue)",120)
head("h6",L(6),round(bounds[4]-L(6),2),"zyadatar log dekhte hain","sirf TOP 3","var(--ink)",116)
pop("#s4 .phone",s+0.05,0.5,"power3.out","opacity:0,y:200","opacity:1,y:0")
js.append(f'tl.fromTo("#ty",{{clipPath:"inset(0 100% 0 0)"}},{{clipPath:"inset(0 0% 0 0)",duration:1.1,ease:"steps(12)"}},{L(5)+0.3});')
js.append(f'tl.fromTo("#s4 .mp",{{opacity:0,y:-40}},{{opacity:1,y:0,duration:0.3,stagger:0.15,ease:"bounce.out"}},{L(5)+1.5});')
js.append(f'tl.fromTo("#s4 .res",{{opacity:0,x:80}},{{opacity:1,x:0,duration:0.3,stagger:0.18,ease:"power3.out"}},{L(6)+0.1});')
pop("#t3",L(6)+1.2,0.4); pops+= [L(6)+0.1,L(6)+0.28,L(6)+0.46]
js.append(f'tl.fromTo("#t3",{{scale:1}},{{scale:1.1,duration:0.35,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{L(6)+1.65});')
# S5 scroll to #27
s,d=span(4)
rows=''.join(f'<div class="lrow{" me" if n==27 else ""}"><span class="ln">#{n}</span><span class="lt">{"Your Business" if n==27 else ""}</span></div>' for n in range(4,29))
clip("s5",s,d,f'<div class="center"><div class="listwin"><div class="lcol" id="lcol">{rows}</div><div class="fadeT"></div><div class="fadeB"></div></div></div>',track=0)
head("h7",s,round(L(8)-s,2),"aur aap ho","#27","var(--red)",170)
head("h8",L(8),round(bounds[5]-L(8),2),"toh aap","dikhte hi nahi.","#8a8f98",104)
js.append(f'tl.fromTo("#lcol",{{y:0}},{{y:-2480,duration:2.0,ease:"power2.inOut"}},{s+0.2});')
js.append(f'tl.to("#s5 .lrow.me",{{opacity:0.15,duration:0.8}},{L(8)+0.2});')
# S6 active
s,d=span(5)
clip("s6",s,d,f'<div class="center">{GCARD.replace("Open now","Updated today")}<div class="active" id="act"><span class="dot"></span>ACTIVE</div></div>',track=0)
head("h9",s,d,"Google upar rakhta hai","ACTIVE ko","var(--green)",130)
pop("#s6 .gcard",s+0.05,0.45,"power3.out","opacity:0,y:100","opacity:1,y:0")
pop("#act",s+0.7,0.35); pops.append(s+0.7)
js.append(f'tl.fromTo("#act .dot",{{scale:1}},{{scale:1.6,duration:0.4,yoyo:true,repeat:5,ease:"sine.inOut",immediateRender:false}},{s+1.1});')
# S7 checklist
s,d=span(6)
items=[("Nayi photos","b5"),("Posts & offers","b6"),("Review ka reply","b7"),("Sahi timing & details","b8")]
ck=''.join(f'<div class="ck" id="ck{j}"><i class="{c}"></i><span>{tx.replace("&","&amp;")}</span><b>✓</b></div>' for j,(tx,c) in enumerate(items))
clip("s7",s,d,f'<div class="center"><div class="cklist">{ck}</div></div>',track=0)
head("h10",s,d,"daily karna hai","ROZ UPDATE","var(--blue)",128)
for j in range(4):
    pop(f"#ck{j}",L(10+j)+0.05,0.35,"back.out(1.7)","opacity:0,x:-120","opacity:1,x:0"); pops.append(L(10+j)+0.05)
    pop(f"#ck{j} b",L(10+j)+0.4,0.3)
# S8 rank up + calls
s,d=span(7)
nums=''.join(f'<div class="rk">#{n}</div>' for n in [27,19,12,7,3])
calls=''.join(f'<div class="call" id="call{j}"><i class="b1"></i><div><b>Incoming call</b><span>New customer</span></div></div>' for j in range(3))
clip("s8",s,d,f'<div class="center"><div class="rankbox" id="rbx"><div class="arrow">▲</div><div class="rwin"><div class="rcol" id="rcol">{nums}</div></div></div><div class="calls">{calls}</div></div>',track=0)
head("h14",s,round(L(15)-s,2),"roz update =","RANK UP","var(--blue)",140)
head("h15",L(15),round(bounds[8]-L(15),2),"rank upar =","CALLS UP","var(--green)",140)
pop("#rbx",s+0.05,0.4)
js.append(f'tl.fromTo("#rcol",{{y:0}},{{y:-1040,duration:2.2,ease:"power2.inOut"}},{L(14)+0.4});')
js.append(f'tl.fromTo("#rbx .arrow",{{y:0}},{{y:-30,duration:0.3,yoyo:true,repeat:5,ease:"sine.inOut",immediateRender:false}},{L(14)+0.4});')
js.append(f'tl.to("#rbx",{{scale:0.62,y:-170,duration:0.4,ease:"power2.inOut"}},{L(15)-0.1});')
for j in range(3):
    pop(f"#call{j}",L(15)+0.15+j*0.45,0.35,"back.out(1.8)","opacity:0,y:60","opacity:1,y:0"); pops.append(L(15)+0.15+j*0.45)
# S9 board in fog
s,d=span(8)
clip("s9",s,d,'<div class="center"><div class="board" id="brd"><div class="bface">YOUR<br/>BUSINESS</div><div class="post"></div></div><div class="fog" id="fog"></div></div>',track=0)
head("h16",s,d,"bina update ke profile","Board jo dikhta nahi.","var(--ink)",96)
pop("#brd",s+0.1,0.5,"back.out(1.4)","opacity:0,y:150","opacity:1,y:0")
js.append(f'tl.fromTo("#fog",{{opacity:0}},{{opacity:0.92,duration:2.4,ease:"power1.in"}},{L(16)+1.4});')
# S10 CTA
s,d=span(9)
clip("s10",s,d,'''<div class="center"><div class="q" id="q">?</div><div class="chip c1">#1?</div><div class="chip c2">#9?</div><div class="chip c3">#27?</div>
<div class="cbox" id="cbx"><div class="av"></div><span class="ctext" id="ct">RANK</span><span class="caret dark"></span><div class="send">➤</div></div></div>''',track=0)
head("h17",s,round(L(18)-s,2),"aapki profile","kis number pe?","var(--ink)",110)
head("h18",L(18),round(END-L(18),2),"pata nahi? comment mein likho","“RANK”","var(--blue)",160)
pop("#q",s+0.1,0.5,"back.out(1.6)","opacity:0,scale:0.3,rotation:-20","opacity:1,scale:1,rotation:0")
js.append(f'tl.fromTo("#s10 .chip",{{opacity:0,scale:0.5}},{{opacity:1,scale:1,duration:0.3,stagger:0.2,ease:"back.out(2)"}},{s+0.6});')
js.append(f'tl.to(["#q","#s10 .chip"],{{opacity:0.15,duration:0.3}},{L(18)-0.05});')
pop("#cbx",L(18)+0.1,0.4,"back.out(1.6)","opacity:0,y:80","opacity:1,y:0")
js.append(f'tl.fromTo("#ct",{{clipPath:"inset(0 100% 0 0)"}},{{clipPath:"inset(0 0% 0 0)",duration:0.6,ease:"steps(4)"}},{L(18)+0.7});')
js.append(f'tl.fromTo("#cbx .send",{{scale:1}},{{scale:1.25,duration:0.3,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{L(18)+1.5});')
# subtitles
for i,c in enumerate(CAP):
    e = st[i+1]-0.05 if i+1<len(st) else END
    clip(f"sub{i}",st[i],round(e-st[i],2),f'<span>{c}</span>',track=4,cls="clip subw")
# audio
aud=[f'<audio id="music-bed" src="assets/music/bed.m4a" data-start="0" data-duration="{END}" data-track-index="10" data-volume="0.1" data-automation=\'{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0}},{{"t":0.4,"v":1}},{{"t":{round(END-1.4,2)},"v":1}},{{"t":{END},"v":0}}]}}]}}\'></audio>']
for i,d in enumerate(D):
    aud.append(f'<audio id="vo-{i}" src="assets/voice/vo-{i}.m4a" data-start="{st[i]}" data-duration="{d}" data-track-index="{20+i%6}" data-volume="1"></audio>')
aud.append(f'<audio id="sfx-imp" src="assets/sfx/impact.wav" data-start="{bounds[1]}" data-duration="0.7" data-track-index="40" data-volume="0.3"></audio>')
for j,t in enumerate(pops):
    aud.append(f'<audio id="sfx-p{j}" src="assets/sfx/pop.wav" data-start="{round(t,2)}" data-duration="0.18" data-track-index="{41+j%3}" data-volume="0.22"></audio>')
CSS=open(sys.argv[2]).read()
out=f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Google Business Ranking</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
{CSS}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1080" data-height="1920">
      <div id="bg" class="full clip" data-start="0" data-duration="{END}" data-track-index="9"></div>
      {chr(10).join("      "+h for h in html)}
      {chr(10).join("      "+a for a in aud)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
      {chr(10).join("      "+j for j in js)}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
open(P+'/index.html','w').write(out)
print(END, st)
