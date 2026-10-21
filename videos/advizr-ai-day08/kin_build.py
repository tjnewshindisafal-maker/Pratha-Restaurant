import sys, json, re, html as H
P=sys.argv[1]; SPEC=json.load(open(sys.argv[2])); CSS=open(sys.argv[3]).read()
L=SPEC["lines"]; GAP=SPEC.get("gap",0.28)
st=[];t=0.4
for ln in L: st.append(round(t,2)); t+=ln["dur"]+GAP
VEND=round(t,2)
endp=SPEC["end"]; END=round(VEND+endp["hold"],2)
html=[]; js=[]; pops=[]
def clip(id,s,d,inner,track=1,cls="clip",style=""):
    html.append(f'<div id="{id}" class="{cls}" data-start="{round(s,2)}" data-duration="{round(d,2)}" data-track-index="{track}" style="{style}">{inner}</div>')
def T(sel,fr,to,t,dur=0.35,ease="power3.out"):
    js.append(f'tl.fromTo("{sel}",{{{fr}}},{{{to},duration:{dur},ease:"{ease}"}},{round(t,2)});')
# flatten phrases with absolute times
phr=[]
for i,ln in enumerate(L):
    ps=ln["phrases"]
    for k,p in enumerate(ps):
        a=st[i]+p["f"]*ln["dur"]
        b=st[i]+ps[k+1]["f"]*ln["dur"] if k+1<len(ps) else st[i]+ln["dur"]
        e=st[i+1]-0.05 if (k+1==len(ps) and i+1<len(L)) else (st[i]+ps[k+1]["f"]*ln["dur"]-0.03 if k+1<len(ps) else VEND)
        phr.append(dict(a=round(a,2),b=round(b,2),e=round(e,2),text=p["text"],who=ln["who"],card=p.get("card"),line=i))
phr.append(dict(a=VEND,b=VEND+1.2,e=END,text=endp["text"],who="B",card=endp.get("card"),line=-1))
def words(txt):
    out=[]
    for tok in txt.split():
        k=tok.startswith("*"); tok=tok.lstrip("*")
        cls=""
        if k:
            m=re.match(r"^\[(\w)\](.*)$",tok)
            if m: cls=" "+m.group(1); tok=m.group(2)
        out.append((tok,k,cls))
    return out
# speaker tags per line
for i,ln in enumerate(L):
    e=st[i+1]-0.05 if i+1<len(L) else VEND
    nm="\U0001F64B RAHUL" if ln["who"]=="R" else "ADVIZR BHAIYA"
    if ln.get("tag",True):
        clip(f"who{i}",st[i]-0.05,e-st[i]+0.05,nm,5,f"clip who {ln['who'].lower()}")
        T(f"#who{i}","opacity:0,y:-20","opacity:1,y:0",st[i]-0.05,0.25)
cards=[]
for j,p in enumerate(phr):
    ws=words(p["text"]); tot=sum(len(w)+2 for w,_,_ in ws); acc=0
    spans=''.join(f'<span class="w{" k"+c if k else ""}" id="p{j}w{n}">{w}</span>' for n,(w,k,c) in enumerate(ws))
    clip(f"ph{j}",p["a"]-0.02,p["e"]-p["a"]+0.02,spans,4,f"clip tb {p['who'].lower()}")
    span=(p["b"]-p["a"])*0.88
    for n,(w,k,c) in enumerate(ws):
        tt=p["a"]+acc/tot*span; acc+=len(w)+2
        if k:
            T(f"#p{j}w{n}","opacity:0,scale:1.8,y:10","opacity:1,scale:1,y:0",tt,0.32,"back.out(2.2)"); pops.append(tt)
        else:
            T(f"#p{j}w{n}","opacity:0,y:26","opacity:1,y:0",tt,0.22,"power2.out")
    if p["card"]: cards.append((j,p["a"]+0.25,p["card"]))
for ci,(j,ca,card) in enumerate(cards):
    ce = cards[ci+1][1]-0.05 if ci+1<len(cards) else END
    # cards end at line boundary when next phrase has no card? keep until next card
    clip(f"cd{ci}",ca,ce-ca,card["html"],3,"clip card",card.get("style",""))
    T(f"#cd{ci}","opacity:0,y:80,scale:0.85","opacity:1,y:0,scale:1",ca,0.45,"back.out(1.7)"); pops.append(ca)
    for a in card.get("anim",[]):
        js.append(a.replace("{T}",str(round(ca,2))))
if SPEC.get("pill"):
    clip("pill",0,VEND,SPEC["pill"],5,"clip pill")
    T("#pill","opacity:0,y:-30","opacity:1,y:0",0.1,0.4,"back.out(2)")
aud=[f'<audio id="music-bed" src="assets/music/bed.m4a" data-start="0" data-duration="{END}" data-track-index="10" data-volume="0.09" data-automation=\'{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0}},{{"t":0.4,"v":1}},{{"t":{round(END-1.2,2)},"v":1}},{{"t":{END},"v":0}}]}}]}}\'></audio>']
for i,ln in enumerate(L): aud.append(f'<audio id="vo-{i}" src="assets/voice/vo-{i}.m4a" data-start="{st[i]}" data-duration="{ln["dur"]}" data-track-index="{20+i%6}" data-volume="1"></audio>')
for j,tt in enumerate(sorted(set(round(x,2) for x in pops))): aud.append(f'<audio id="sfx-p{j}" src="assets/sfx/pop.wav" data-start="{tt}" data-duration="0.18" data-track-index="{41+j%3}" data-volume="0.12"></audio>')
out=f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>{SPEC.get("title","Advizr Reel")}</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
{CSS}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1080" data-height="1920">
      <div id="bg" class="full clip" data-start="0" data-duration="{END}" data-track-index="9"><div class="gridB"></div><div class="gridA"></div><div class="grain"></div></div>
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
open(P+'/index.html','w').write(out); print(END, st)
