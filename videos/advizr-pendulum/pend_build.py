import sys
P=sys.argv[1]
H=1.2; A=20
NEEDS=["NEED MORE<br/>LEADS?","NEED<br/>GOOGLE ADS?","NEED<br/>META ADS?","NEED<br/>A CRM?","NEED<br/>LOCAL SEO?"]
WE='<span class="we">WE GOT<br/>YOU.</span>'
FINAL='<span class="fin">LET’S<br/>GROW.</span>'
XR,XL=948,132
halves=[]
for k,n in enumerate(NEEDS):
    halves.append((f'<span class="nd">{n}</span>',WE,-1))   # moving left: left=old need, right=new WE
    nxt=f'<span class="nd">{NEEDS[k+1]}</span>' if k+1<len(NEEDS) else FINAL
    halves.append((nxt,WE,+1))   # moving right: left=new, right=old WE
NH=len(halves); TEND=NH*H; END=round(TEND+2.6,2)
html=[];js=[]
for h,(lt,rt,dirn) in enumerate(halves):
    s=round(h*H,2)
    x0,x1=(XR,XL) if dirn<0 else (XL,XR)
    html.append(f'<div id="hv{h}" class="clip txtw" data-start="{s}" data-duration="{H}" data-track-index="2"><div class="layer l" id="L{h}">{lt}</div><div class="layer r" id="R{h}">{rt}</div></div>')
    js.append(f'tl.fromTo("#L{h}",{{clipPath:"inset(0px {1080-x0}px 0px 0px)"}},{{clipPath:"inset(0px {1080-x1}px 0px 0px)",duration:{H},ease:"sine.inOut"}},{s});')
    js.append(f'tl.fromTo("#R{h}",{{clipPath:"inset(0px 0px 0px {x0}px)"}},{{clipPath:"inset(0px 0px 0px {x1}px)",duration:{H},ease:"sine.inOut"}},{s});')
    r0,r1=(-A,A) if dirn<0 else (A,-A)
    js.append(f'tl.fromTo("#pend",{{rotation:{r0}}},{{rotation:{r1},duration:{H},ease:"sine.inOut",immediateRender:{"true" if h==0 else "false"}}},{s});')
    js.append(f'tl.fromTo("#tag",{{rotation:{-r0*0.35}}},{{rotation:{-r1*0.35},duration:{H},ease:"sine.inOut",immediateRender:{"true" if h==0 else "false"}}},{s});')
html.append(f'<div id="final" class="clip txtw" data-start="{round(TEND,2)}" data-duration="{round(END-TEND,2)}" data-track-index="2"><div class="layer l">{FINAL}</div><div class="dm" id="dm">DM karo — baat karte hain \U0001F4E9</div></div>')
js.append(f'tl.fromTo("#pend",{{rotation:{-A}}},{{rotation:0,duration:0.7,ease:"sine.inOut",immediateRender:false}},{round(TEND,2)});')
js.append(f'tl.fromTo("#tag",{{rotation:{A*0.35}}},{{rotation:0,duration:0.7,ease:"sine.inOut",immediateRender:false}},{round(TEND,2)});')
js.append(f'tl.fromTo("#pend",{{y:0}},{{y:-1700,duration:0.7,ease:"back.in(1.4)",immediateRender:false}},{round(TEND+0.6,2)});')
js.append(f'tl.fromTo("#dm",{{opacity:0,y:30}},{{opacity:1,y:0,duration:0.5,ease:"back.out(2)"}},{round(TEND+1.2,2)});')
js.append(f'tl.fromTo("#glow",{{opacity:0.75,scale:1}},{{opacity:1,scale:1.08,duration:{H},repeat:{NH+1},yoyo:true,ease:"sine.inOut"}},0);')
CSS=open(sys.argv[2]).read()
out=f'''<!doctype html>
<html lang="en" data-resolution="portrait">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <title>Advizr We Got You</title>
    <script src="assets/vendor/gsap.min.js"></script>
    <style>
{CSS}
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="{END}" data-width="1080" data-height="1920">
      <div id="bg" class="full clip" data-start="0" data-duration="{END}" data-track-index="0"><div id="glow"></div><div class="vig"></div></div>
      <div id="top" class="clip" data-start="0" data-duration="{END}" data-track-index="1"><img src="assets/img/advizr-logo.svg" alt="" /><span>Advizr Media</span></div>
      {chr(10).join("      "+x for x in html)}
      <div id="pw" class="full clip" data-start="0" data-duration="{END}" data-track-index="5"><div id="pend"><div class="string"></div><div id="tag"><img src="assets/img/advizr-logo.svg" alt="Advizr Media" /></div></div></div>
      <div id="foot" class="clip" data-start="0" data-duration="{END}" data-track-index="6"><div class="svc">GOOGLE ADS · META ADS · CRM · LOCAL SEO</div><div class="brand">ADVIZR MEDIA</div></div>
      <audio id="music-bed" src="assets/music/bed.m4a" data-start="0" data-duration="{END}" data-track-index="10" data-volume="0.55" data-automation='{{"version":1,"lanes":[{{"target":"volume","points":[{{"t":0,"v":0}},{{"t":0.3,"v":1}},{{"t":{round(END-1.2,2)},"v":1}},{{"t":{END},"v":0}}]}}]}}'></audio>
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
open(P+'/index.html','w').write(out); print(END)
