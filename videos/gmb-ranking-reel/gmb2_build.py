import sys, json, random
P=sys.argv[1]; D=json.load(open(sys.argv[2])); CSS=open(sys.argv[3]).read()
GAP=0.32
st=[];t=0.25
for d in D: st.append(round(t,2)); t+=d+GAP
END=round(t+1.5,2)
def at(i,f): return round(st[i]+f*D[i],2)
def sc(i): return 0 if i==0 else round(st[i]-0.2,2)
bounds=[sc(i) for i in range(len(D))]+[END]
def span(i): return bounds[i], round(bounds[i+1]-bounds[i],2)
CAPS=[[(0,"Google pe business profile bana li?"),(0.62,"Bahut achha.")],[(0,"Par calls nahi aate?")],
[(0,"Kyunki profile banana sirf shuruaat hai."),(0.6,"Asli khel hai ranking.")],
[(0,"Jab koi search karta hai “near me”,"),(0.42,"toh zyadatar log sirf upar ke 3 result dekhte hain.")],
[(0,"Aur agar aap 27th number pe ho,"),(0.6,"toh aap dikhte hi nahi.")],
[(0,"Ek example dekho."),(0.4,"Ek hi area mein, do cafe.")],
[(0,"Pehla cafe: profile banaya, aur bhool gaya.")],
[(0,"Doosra cafe: roz nayi photos,"),(0.45,"posts aur offers, har review ka jawab.")],
[(0,"3 mahine baad?"),(0.25,"Pehla cafe: 27th number pe."),(0.68,"Doosra: Top 3 mein.")],
[(0,"Aur calls? Doosre ka phone bajta hi rehta hai.")],
[(0,"Kyunki Google upar use rakhta hai jo active hai.")],
[(0,"Roz update karo, toh rank upar."),(0.52,"Aur rank upar, toh calls zyada.")],
[(0,"Aapki profile Google pe kis number pe hai?"),(0.5,"Pata nahi? Toh comment mein likho “RANK”.")]]
html=[]; js=[]; pops=[]; whs=[]
def clip(id,s,d,inner,track=1,cls="full clip",style=""):
    html.append(f'<div id="{id}" class="{cls}" data-start="{s}" data-duration="{d}" data-track-index="{track}" style="{style}">{inner}</div>')
def T(sel,fr,to,t,dur=0.4,ease="power3.out",extra=""):
    js.append(f'tl.fromTo("{sel}",{{{fr}}},{{{to},duration:{dur},ease:"{ease}"{extra}}},{round(t,2)});')
def head(id,s,d,lead,big,color="var(--ink)",size=112):
    clip(id,s,d,f'<div class="lead">{lead}</div><div class="big" style="color:{color};font-size:{size}px">{big}</div>',track=3,cls="clip head")
    T(f"#{id} .lead","opacity:0,y:24","opacity:1,y:0",s+0.02,0.3)
    T(f"#{id} .big","opacity:0,scale:1.35,y:10","opacity:1,scale:1,y:0",s+0.08,0.42,"back.out(1.6)")
def enter(id,s):  # scene punch-in
    T(f"#{id} .stage","opacity:0,scale:1.12","opacity:1,scale:1",s,0.45,"power3.out")
GC=lambda name,meta,extra="": f'<div class="gcard">{extra}<div class="gmap"><div class="pin"></div></div><div class="gbody"><div class="gname">{name}</div><div class="gmeta"><span class="stars">★★★★★</span> · {meta}</div><div class="gbtns"><div><i class="b1"></i>Call</div><div><i class="b2"></i>Directions</div><div><i class="b3"></i>Website</div><div><i class="b4"></i>Save</div></div></div></div>'
SHOP=lambda id,name,cls: f'<div class="shop {cls}" id="{id}"><div class="awn"></div><div class="sname">{name}</div><div class="door"></div><div class="win"></div></div>'
# 0 hook
s,d=span(0)
clip("s0",s,d,f'<div class="stage">{GC("Your Business","Shop · Open now")}<div class="okbadge" id="ok0">✓</div><div class="ring" id="rg0"></div></div>',0)
head("h0a",s,round(at(0,0.62)-s,2),"Google pe","Business Profile","var(--blue)",104)
head("h0b",at(0,0.62),round(bounds[1]-at(0,0.62),2),"bana li?","Bahut achha.","var(--green)",120)
T("#s0 .gcard","opacity:0,rotationX:70,y:160,transformPerspective:1200","opacity:1,rotationX:0,y:0",0.15,0.8,"back.out(1.3)")
js.append(f'tl.fromTo("#s0 .gbtns > div",{{opacity:0,y:24}},{{opacity:1,y:0,duration:0.25,stagger:0.08}},0.7);')
T("#ok0","opacity:0,scale:0,rotation:-90","opacity:1,scale:1,rotation:0",at(0,0.64),0.45,"back.out(2.2)"); pops.append(at(0,0.64))
T("#rg0","opacity:0.9,scale:0.3","opacity:0,scale:2.4",at(0,0.66),0.7,"power2.out")
# 1 dark
s,d=span(1)
clip("s1",s,d,'<div class="darkbg"></div><div class="vig" id="vg"></div><div class="stage"><div class="dk"><div class="lead w">par</div><div class="glow" id="gl">CALLS<br/>NAHI AATE?</div><div class="callbox" id="cb"><i class="b1 red"></i><span>Calls today</span><b>0</b></div></div></div>',0)
T("#gl","opacity:0,scale:1.6","opacity:1,scale:1",s+0.05,0.35,"power4.out")
js.append(f'tl.fromTo("#s1 .dk",{{x:-14}},{{x:14,duration:0.05,repeat:7,yoyo:true,ease:"none",immediateRender:false}},{s+0.38});')
js.append(f'tl.set("#s1 .dk",{{x:0}},{s+0.8});')
T("#cb","opacity:0,y:50","opacity:1,y:0",s+0.55,0.35,"back.out(2)")
js.append(f'tl.fromTo("#gl",{{textShadow:"0 0 8px rgba(255,40,40,0.35)"}},{{textShadow:"0 0 60px rgba(255,40,40,1)",duration:0.35,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{s+0.4});')
# 2 ranking
s,d=span(2)
spk=''.join(f'<div class="spark" style="left:{x}px;top:{y}px"></div>' for x,y in [(150,120),(860,200),(240,420),(780,480),(520,40),(940,620),(110,640)])
clip("s2",s,d,f'<div class="stage"><div class="prog" id="pg"><div class="plabel">Profile created</div><div class="pbar"><div class="pfill" id="pf"></div></div><div class="pends"><span class="tag blue">START</span><span class="tag grey">Customers</span></div></div><div class="ladder" id="lad"><div class="rung r3"><b>#3</b></div><div class="rung r2"><b>#2</b></div><div class="rung r1"><b>#1</b><div class="crown">★</div></div></div>{spk}</div>',0)
enter("s2",s)
head("h2a",s,round(at(2,0.6)-s,2),"profile banana","sirf START hai.","var(--ink)",100)
head("h2b",at(2,0.6),round(bounds[3]-at(2,0.6),2),"asli khel","RANKING","var(--blue)",150)
T("#pf","width:'0%'","width:'12%'",s+0.4,0.6,"power2.out")
js.append(f'tl.to("#pg",{{opacity:0,y:-80,duration:0.3}},{at(2,0.58)});')
js.append(f'tl.fromTo("#lad .rung",{{scaleY:0}},{{scaleY:1,duration:0.45,stagger:0.12,ease:"back.out(1.6)"}},{at(2,0.62)});')
js.append(f'tl.fromTo("#s2 .spark",{{opacity:0,scale:0,rotation:0}},{{opacity:1,scale:1,rotation:180,duration:0.4,stagger:0.07,ease:"back.out(3)"}},{at(2,0.75)});')
pops.append(at(2,0.62))
# 3 search
s,d=span(3)
res=''.join(f'<div class="res" id="res{n}"><span class="num">{n}</span><div><div class="rn">{nm}</div><div class="rs"><span class="stars">★★★★★</span> · Open</div></div><div class="rcall"></div></div>' for n,nm in [(1,"Cafe Aroma"),(2,"Brew House"),(3,"Daily Grind")])
rip=''.join(f'<div class="rip q{n}"></div>' for n in (1,2,3))
clip("s3",s,d,f'<div class="stage"><div class="phone"><div class="notch"></div><div class="sbar"><span class="g">G</span><span class="typed" id="ty">cafe near me</span><span class="caret"></span></div><div class="map"><div class="road a"></div><div class="road b"></div>{rip}<div class="mp p1">1</div><div class="mp p2">2</div><div class="mp p3">3</div></div><div class="results">{res}</div></div><div class="top3" id="t3">TOP 3</div></div>',0)
head("h3a",s,round(at(3,0.42)-s,2),"search:","“near me”","var(--blue)",124)
head("h3b",at(3,0.42),round(bounds[4]-at(3,0.42),2),"zyadatar log dekhte hain","sirf TOP 3","var(--ink)",120)
T("#s3 .phone","opacity:0,y:260,rotation:6","opacity:1,y:0,rotation:0",s+0.05,0.6,"power3.out")
T("#ty","clipPath:'inset(0 100% 0 0)'","clipPath:'inset(0 0% 0 0)'",at(3,0.08),1.0,"steps(12)")
js.append(f'tl.fromTo("#s3 .mp",{{opacity:0,y:-60}},{{opacity:1,y:0,duration:0.35,stagger:0.15,ease:"bounce.out"}},{at(3,0.3)});')
js.append(f'tl.fromTo("#s3 .rip",{{opacity:0.8,scale:0.2}},{{opacity:0,scale:2.2,duration:0.8,stagger:0.15,ease:"power2.out"}},{at(3,0.36)});')
js.append(f'tl.fromTo("#s3 .res",{{opacity:0,x:100}},{{opacity:1,x:0,duration:0.3,stagger:0.18,ease:"power3.out"}},{at(3,0.45)});')
pops += [at(3,0.45),at(3,0.45)+0.18,at(3,0.45)+0.36]
T("#t3","opacity:0,scale:3,rotation:-25","opacity:1,scale:1,rotation:6",at(3,0.72),0.35,"power4.in"); pops.append(at(3,0.72)+0.3)
# 4 #27
s,d=span(4)
rows=''.join(f'<div class="lrow{" me" if n==27 else ""}"><span class="ln">#{n}</span><span class="lt">{"Your Business" if n==27 else ""}</span></div>' for n in range(4,29))
clip("s4",s,d,f'<div class="stage"><div class="listwin"><div class="lcol" id="lcol">{rows}</div><div class="fadeT"></div><div class="fadeB"></div></div></div>',0)
head("h4a",s,round(at(4,0.6)-s,2),"aur aap ho","#27","var(--red)",180)
head("h4b",at(4,0.6),round(bounds[5]-at(4,0.6),2),"toh aap","dikhte hi nahi.","#8a8f98",104)
js.append(f'tl.fromTo("#lcol",{{y:0}},{{y:-2480,duration:{round(D[4]*0.5,2)},ease:"power3.inOut"}},{s+0.15});')
js.append(f'tl.to("#s4 .lrow.me",{{opacity:0.12,scale:0.92,duration:0.8}},{at(4,0.65)});')
# 5 example intro: two shops
s,d=span(5)
clip("s5",s,d,f'<div class="stage"><div class="exstamp" id="exs">EXAMPLE</div><div class="shops">{SHOP("shA","Cafe A","ga")}<div class="vs">VS</div>{SHOP("shB","Cafe B","gb")}</div><div class="note">*Samjhane ke liye example</div></div>',0)
head("h5",s,d,"ek hi area mein","Do Cafe","var(--ink)",130)
T("#exs","opacity:0,scale:2.6,rotation:-18","opacity:1,scale:1,rotation:-6",s+0.1,0.35,"power4.in"); pops.append(s+0.42)
T("#shA","opacity:0,x:-300","opacity:1,x:0",at(5,0.42),0.5,"back.out(1.4)")
T("#shB","opacity:0,x:300","opacity:1,x:0",at(5,0.5),0.5,"back.out(1.4)")
T("#s5 .vs","opacity:0,scale:0","opacity:1,scale:1",at(5,0.65),0.35,"back.out(3)")
CA=GC("Cafe A","Last update: 90 days ago",'<div class="ctag grey">CAFE A</div>')
CB=GC("Cafe B","Updated today",'<div class="ctag blue">CAFE B</div>')
# 6 cafe A neglected
s,d=span(6)
clip("s6",s,d,f'<div class="stage"><div class="cwrap">{CA}<div class="dust" id="dust"></div></div><div class="zz" id="zz">Zzz</div></div>',0)
head("h6",s,d,"pehla cafe","Banaya... bhool gaya.","#6b7280",96)
T("#s6 .gcard","opacity:0,y:120","opacity:1,y:0",s+0.05,0.5)
T("#s6 .gcard","filter:'grayscale(0)'","filter:'grayscale(1)'",at(6,0.45),0.9,"power1.inOut")
T("#dust","opacity:0","opacity:0.55",at(6,0.45),0.9,"power1.inOut")
js.append(f'tl.fromTo("#zz",{{opacity:0,y:20}},{{opacity:1,y:-40,duration:1.2,ease:"sine.out"}},{at(6,0.5)});')
# 7 cafe B active
s,d=span(7)
fly=[("Nayi photos","b5",-330,-190),("Post + Offer","b6",330,-150),("Review reply","b7",-320,250),("Updated today","b8",320,270)]
chips=''.join(f'<div class="fchip" id="fc{j}" style="left:calc(50% + {x}px);top:calc(50% + {y}px)"><i class="{c}"></i><span>{tx}</span><b>✓</b></div>' for j,(tx,c,x,y) in enumerate(fly))
clip("s7",s,d,f'<div class="stage"><div class="cwrap">{CB}</div>{chips}</div>',0)
head("h7",s,d,"doosra cafe","Roz Update","var(--blue)",126)
T("#s7 .gcard","opacity:0,scale:0.7","opacity:1,scale:0.86",s+0.05,0.45,"back.out(1.6)")
for j,f in enumerate([0.12,0.35,0.6,0.8]):
    T(f"#fc{j}","opacity:0,scale:0.3","opacity:1,scale:1",at(7,f),0.4,"back.out(2)"); pops.append(at(7,f))
js.append(f'tl.fromTo("#s7 .gcard",{{boxShadow:"0 30px 80px rgba(26,86,240,0.15)"}},{{boxShadow:"0 30px 110px rgba(26,86,240,0.55)",duration:0.6,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{at(7,0.3)});')
# 8 three months later: split
s,d=span(8)
clip("s8",s,d,'''<div class="stage"><div class="split"><div class="side a" id="sdA"><div class="sl">CAFE A</div><div class="rwin s"><div class="rcol s" id="rcA"><div class="rk s">#9</div><div class="rk s">#15</div><div class="rk s">#21</div><div class="rk s red">#27</div></div></div><div class="arr down">▼</div></div>
<div class="side b" id="sdB"><div class="sl">CAFE B</div><div class="rwin s"><div class="rcol s" id="rcB"><div class="rk s">#9</div><div class="rk s">#6</div><div class="rk s">#4</div><div class="rk s grn">#3</div></div></div><div class="arr up">▲</div><div class="badge3" id="b3">TOP 3</div></div></div><div class="note">*Samjhane ke liye example</div></div>''',0)
head("h8",s,d,"3 mahine baad","Result?","var(--ink)",130)
T("#sdA","opacity:0,x:-200","opacity:1,x:0",s+0.1,0.45)
T("#sdB","opacity:0,x:200","opacity:1,x:0",s+0.2,0.45)
js.append(f'tl.fromTo("#rcA",{{y:0}},{{y:-660,duration:1.0,ease:"power2.inOut"}},{at(8,0.25)});')
js.append(f'tl.fromTo("#rcB",{{y:0}},{{y:-660,duration:1.0,ease:"power2.inOut"}},{at(8,0.68)});')
T("#b3","opacity:0,scale:2.5,rotation:-20","opacity:1,scale:1,rotation:-6",at(8,0.68)+1.0,0.3,"power4.in"); pops.append(at(8,0.68)+1.25)
# 9 calls
s,d=span(9)
calls=''.join(f'<div class="call" id="call{j}"><i class="b1"></i><div><b>Incoming call</b><span>New customer</span></div></div>' for j in range(3))
clip("s9",s,d,f'<div class="stage"><div class="miniA" id="mA"><b>Cafe A</b><span>Calls: 0</span></div><div class="phone2" id="ph2"><div class="notch"></div><div class="pname">Cafe B</div><div class="ringc"></div><div class="ringc r2"></div><div class="bell">☎</div></div><div class="calls">{calls}</div></div>',0)
head("h9",s,d,"aur calls?","Phone bajta rahe!","var(--green)",108)
T("#ph2","opacity:0,y:200","opacity:1,y:0",s+0.05,0.45)
T("#mA","opacity:0,y:30","opacity:0.85,y:0",s+0.2,0.35)
js.append(f'tl.fromTo("#ph2",{{rotation:-5}},{{rotation:5,duration:0.06,repeat:21,yoyo:true,ease:"none",immediateRender:false}},{at(9,0.3)});')
js.append(f'tl.set("#ph2",{{rotation:0}},{at(9,0.3)+1.35});')
js.append(f'tl.fromTo("#s9 .ringc",{{opacity:0.7,scale:0.6}},{{opacity:0,scale:1.9,duration:0.8,stagger:0.3,repeat:2,ease:"power2.out"}},{at(9,0.3)});')
for j in range(3):
    T(f"#call{j}","opacity:0,y:70,scale:0.9","opacity:1,y:0,scale:1",at(9,0.35)+j*0.4,0.35,"back.out(1.8)"); pops.append(at(9,0.35)+j*0.4)
# 10 active
s,d=span(10)
clip("s10",s,d,'<div class="stage"><div class="gbig" id="gb"><span class="c1">G</span></div><div class="pulse" id="pu"></div><div class="active" id="act"><span class="dot"></span>ACTIVE = UPAR</div></div>',0)
head("h10",s,d,"Google upar rakhta hai","ACTIVE ko","var(--green)",132)
T("#gb","opacity:0,scale:0.4,rotation:-90","opacity:1,scale:1,rotation:0",s+0.05,0.6,"back.out(1.6)")
js.append(f'tl.fromTo("#pu",{{opacity:0.7,scale:0.6}},{{opacity:0,scale:2.0,duration:0.9,repeat:2,ease:"power2.out"}},{s+0.5});')
T("#act","opacity:0,y:40","opacity:1,y:0",at(10,0.45),0.35,"back.out(2)"); pops.append(at(10,0.45))
# 11 rank up / calls up
s,d=span(11)
nums=''.join(f'<div class="rk">#{n}</div>' for n in [27,19,12,7,3])
clip("s11",s,d,f'<div class="stage"><div class="eq"><div class="eqi" id="e1"><div class="eqt">ROZ UPDATE</div></div><div class="eqa">→</div><div class="eqi" id="e2"><div class="eqt b">RANK ↑</div></div><div class="eqa">→</div><div class="eqi" id="e3"><div class="eqt g">CALLS ↑</div></div></div><div class="rankbox" id="rbx"><div class="arrow">▲</div><div class="rwin"><div class="rcol" id="rcol">{nums}</div></div></div></div>',0)
head("h11",s,d,"simple formula","Update = Calls","var(--blue)",112)
for j,f in enumerate([0.02,0.3,0.55]):
    T(f"#e{j+1}","opacity:0,scale:0.5","opacity:1,scale:1",at(11,f),0.35,"back.out(2)"); pops.append(at(11,f))
T("#rbx","opacity:0,y:60","opacity:1,y:0",at(11,0.1),0.4)
js.append(f'tl.fromTo("#rcol",{{y:0}},{{y:-1040,duration:{round(D[11]*0.6,2)},ease:"power2.inOut"}},{at(11,0.15)});')
# 12 CTA
s,d=span(12)
random.seed(7); cols=["#1a56f0","#12893d","#f5a623","#e02d2d","#7c3aed"]
conf=''.join(f'<div class="cf" style="left:{random.randint(20,1040)}px;top:{random.randint(-300,-40)}px;background:{random.choice(cols)};transform:rotate({random.randint(0,90)}deg)" data-dy="{random.randint(1500,2100)}" data-r="{random.randint(180,720)}"></div>' for _ in range(46))
clip("s12",s,d,f'''<div class="stage"><div class="q" id="q">?</div><div class="chip c1">#1?</div><div class="chip c2">#9?</div><div class="chip c3">#27?</div><div class="cbox" id="cbx"><div class="av"></div><span class="ctext" id="ct">RANK</span><span class="caret dark"></span><div class="send">➤</div></div></div><div class="confw">{conf}</div>''',0)
head("h12a",s,round(at(12,0.5)-s,2),"aapki profile","kis number pe?","var(--ink)",112)
head("h12b",at(12,0.5),round(END-at(12,0.5),2),"pata nahi? comment mein likho","“RANK”","var(--blue)",170)
T("#q","opacity:0,scale:0.3,rotation:-30","opacity:1,scale:1,rotation:0",s+0.1,0.55,"back.out(1.7)")
js.append(f'tl.fromTo("#s12 .chip",{{opacity:0,scale:0.4}},{{opacity:1,scale:1,duration:0.3,stagger:0.2,ease:"back.out(2.4)"}},{s+0.5});')
js.append(f'tl.fromTo("#s12 .chip",{{y:0}},{{y:-18,duration:0.6,yoyo:true,repeat:3,ease:"sine.inOut",immediateRender:false}},{s+1.1});')
js.append(f'tl.to(["#q","#s12 .chip"],{{opacity:0.12,duration:0.3}},{at(12,0.48)});')
T("#cbx","opacity:0,y:100","opacity:1,y:0",at(12,0.52),0.4,"back.out(1.6)")
T("#ct","clipPath:'inset(0 100% 0 0)'","clipPath:'inset(0 0% 0 0)'",at(12,0.62),0.5,"steps(4)")
tc=at(12,0.62)+0.7
js.append(f'tl.fromTo("#cbx .send",{{scale:1}},{{scale:1.3,duration:0.2,yoyo:true,repeat:1,ease:"sine.inOut",immediateRender:false}},{tc});')
js.append(f'gsap.utils.toArray("#s12 .cf").forEach((el)=>tl.fromTo(el,{{y:0,rotation:0}},{{y:+el.dataset.dy,rotation:+el.dataset.r,duration:2.2,ease:"power1.in"}},{tc+0.15}));')
pops.append(tc)
# subtitles
caps=[]
for i,cl in enumerate(CAPS):
    for k,(f,tx) in enumerate(cl):
        a=at(i,f); b=at(i,cl[k+1][0])-0.03 if k+1<len(cl) else (st[i+1]-0.05 if i+1<len(st) else END)
        caps.append((a,round(b-a,2),tx))
for j,(a,dd,tx) in enumerate(caps):
    clip(f"sub{j}",a,dd,f'<span>{tx}</span>',4,"clip subw")
aud=[f'<audio id="music-bed" src="assets/music/bed.m4a" data-start="0" data-duration="{END}" data-track-index="10" data-volume="0.1" data-automation=\'{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0}},{{"t":0.4,"v":1}},{{"t":{round(END-1.4,2)},"v":1}},{{"t":{END},"v":0}}]}}]}}\'></audio>']
for i,d in enumerate(D):
    aud.append(f'<audio id="vo-{i}" src="assets/voice/vo-{i}.m4a" data-start="{st[i]}" data-duration="{d}" data-track-index="{20+i%6}" data-volume="1"></audio>')
aud.append(f'<audio id="sfx-imp" src="assets/sfx/impact.wav" data-start="{bounds[1]}" data-duration="0.7" data-track-index="40" data-volume="0.3"></audio>')
for j,tt in enumerate(sorted(pops)):
    aud.append(f'<audio id="sfx-p{j}" src="assets/sfx/pop.wav" data-start="{round(tt,2)}" data-duration="0.18" data-track-index="{41+j%3}" data-volume="0.2"></audio>')
blobs='<div class="blob bl1"></div><div class="blob bl2"></div><div class="blob bl3"></div><div class="blob bl4"></div>'
bgjs=[f'tl.fromTo(".bl{n}",{{x:{a},y:{b}}},{{x:{c},y:{e},duration:{round(END/3,2)},repeat:2,yoyo:true,ease:"sine.inOut"}},0);' for n,(a,b,c,e) in enumerate([(-60,0,80,120),(40,-40,-90,60),(0,60,70,-80),(-40,-20,60,90)],1)]
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
      <div id="bg" class="full clip" data-start="0" data-duration="{END}" data-track-index="9">{blobs}<div class="grain"></div></div>
{chr(10).join("      "+h for h in html)}
{chr(10).join("      "+a for a in aud)}
    </div>
    <script>
      window.__timelines = window.__timelines || {{}};
      const tl = gsap.timeline({{ paused: true }});
{chr(10).join("      "+j for j in bgjs+js)}
      window.__timelines["main"] = tl;
    </script>
  </body>
</html>
'''
open(P+'/index.html','w').write(out)
print(END, st)
