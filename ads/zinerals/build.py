import subprocess, pathlib
CH="/root/.cache/hyperframes/chrome/chrome-headless-shell/linux-152.0.7977.30/chrome-headless-shell-linux64/chrome-headless-shell"
BASE='''<!doctype html><html><head><meta charset="utf-8"><style>
@font-face{font-family:"Marcellus";src:url("assets/marcellus-latin-400-normal.woff2")}
@font-face{font-family:"Montserrat";src:url("assets/montserrat-latin-500-normal.woff2");font-weight:500}
@font-face{font-family:"Montserrat";src:url("assets/montserrat-latin-700-normal.woff2");font-weight:700}
@font-face{font-family:"Montserrat";src:url("assets/montserrat-latin-800-normal.woff2");font-weight:800}
@font-face{font-family:"Montserrat";src:url("assets/montserrat-latin-900-normal.woff2");font-weight:900}
:root{--plum:#241040;--plum2:#170a2b;--violet:#5b3a9b;--lilac:#cdb6f2;--lav:#f1ebfa;--teal:#0d4d50;--pink:#f6c1cb}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:1080px;height:1350px;overflow:hidden;background:var(--plum2);font-family:"Montserrat",sans-serif}
.ad{position:relative;width:1080px;height:1350px;overflow:hidden}
.bg{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.tube{position:absolute;filter:drop-shadow(0 30px 40px rgba(23,10,43,.5))}
.logo{font-family:"Marcellus",serif;color:#fff;font-size:64px;line-height:1}
.h1{font-weight:900;color:#fff;line-height:1.02;letter-spacing:-2px}
.pill{display:inline-block;font-weight:800;border-radius:60px;padding:12px 28px}
.cta{position:absolute;left:50px;right:50px;bottom:44px;height:112px;border-radius:30px;background:var(--plum);display:flex;align-items:center;justify-content:space-between;padding:0 22px 0 40px}
.cta .t{color:#fff;font-weight:700;font-size:36px}
.cta .b{background:var(--lilac);color:var(--plum);font-weight:900;font-size:38px;padding:18px 40px;border-radius:22px}
.note{position:absolute;font-size:20px;color:rgba(255,255,255,.75);font-weight:500}
</style></head><body><div class="ad">{body}</div></body></html>'''
CTA='<div class="cta"><span class="t">zinerals.com</span><span class="b">SHOP NOW →</span></div>'
ads={}
ads["01-before-after"]=f'''
<img class="bg" src="assets/dry.webp" style="clip-path:inset(0 50% 0 0);object-position:30% 45%">
<img class="bg" src="assets/glow.webp" style="clip-path:inset(0 0 0 50%);object-position:30% 45%">
<div style="position:absolute;left:538px;top:0;bottom:0;width:4px;background:#fff"></div>
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(23,10,43,.85) 0%,rgba(23,10,43,0) 30%,rgba(23,10,43,0) 55%,rgba(23,10,43,.9) 100%)"></div>
<div style="position:absolute;left:50px;right:50px;top:50px;text-align:center"><div class="h1" style="font-size:82px">Dry, dull skin?</div><div class="h1" style="font-size:58px;color:var(--lilac);margin-top:10px">72HR hydration + glow</div></div>
<div class="pill" style="position:absolute;left:50px;top:330px;background:rgba(23,10,43,.85);color:#fff;font-size:30px;letter-spacing:6px">BEFORE</div>
<div class="pill" style="position:absolute;right:50px;top:330px;background:var(--lilac);color:var(--plum);font-size:30px;letter-spacing:6px">AFTER</div>
<img class="tube" src="assets/tube-cut.png" style="left:420px;top:640px;width:240px;height:554px">
<div style="position:absolute;left:50px;top:1010px;color:#fff;font-weight:800;font-size:34px;line-height:1.4">Hyaluronic Acid<br>+ Pentavitin</div>
<div style="position:absolute;right:50px;top:1010px;color:#fff;font-weight:800;font-size:34px;line-height:1.4;text-align:right">Niacinamide<br>brightens</div>
<div class="note" style="right:50px;top:1258px;bottom:auto;display:none"></div>
{CTA}<div class="note" style="left:0;right:0;top:1318px;text-align:center;font-size:16px">Representational images</div>'''
ads["02-72hr-benefits"]=f'''
<img class="bg" src="assets/splash.webp">
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(23,10,43,.7) 0%,rgba(23,10,43,.1) 35%,rgba(23,10,43,.1) 70%,rgba(23,10,43,.75) 100%)"></div>
<div style="position:absolute;left:0;right:0;top:40px;text-align:center"><div class="logo">zinerals</div></div>
<div class="h1" style="position:absolute;left:50px;top:150px;font-size:230px;color:#fff;letter-spacing:-8px">72<span style="font-size:110px;letter-spacing:0">HR</span></div>
<div class="h1" style="position:absolute;left:58px;top:390px;font-size:56px;color:var(--plum);letter-spacing:0">DEEP<br>HYDRATION</div>
<img class="tube" src="assets/tube-cut.png" style="left:600px;top:150px;width:400px;height:924px;transform:rotate(6deg)">
<div style="position:absolute;left:50px;top:600px;display:flex;flex-direction:column;gap:22px">
<div class="pill" style="background:#fff;color:var(--plum);font-size:38px">💧 72HR moisture</div>
<div class="pill" style="background:#fff;color:var(--plum);font-size:38px">✨ Brightens dull skin</div>
<div class="pill" style="background:#fff;color:var(--plum);font-size:38px">🫧 Oil-free gel</div>
<div class="pill" style="background:#fff;color:var(--plum);font-size:38px">🌿 Fragrance free</div>
</div>{CTA}'''
ads["03-ingredients"]=f'''
<img class="bg" src="assets/flatlay.webp" style="object-position:50% 40%">
<div style="position:absolute;left:0;right:0;top:0;height:300px;background:linear-gradient(180deg,rgba(241,235,250,.98) 55%,rgba(241,235,250,0))"></div>
<div style="position:absolute;left:0;right:0;top:46px;text-align:center"><div class="h1" style="font-size:66px;color:var(--plum)">What's inside matters</div><div style="font-weight:700;font-size:32px;color:var(--violet);margin-top:12px;letter-spacing:4px">MINERAL-BASED · 72HR HYDRATION</div></div>
<img class="tube" src="assets/tube-cut.png" style="left:400px;top:250px;width:280px;height:647px">
{"".join(f'<div class="pill" style="position:absolute;{pos};background:rgba(36,16,64,.92);color:#fff;font-size:32px;text-align:center;line-height:1.2;border-radius:24px"><b style=\\"color:var(--lilac)\\">{n}</b><br><span style="font-weight:500;font-size:26px">{d}</span></div>' for n,d,pos in [("Hyaluronic Acid","deep hydration","left:40px;top:330px"),("Pentavitin","72HR moisture","right:40px;top:330px"),("Niacinamide","brightens","left:40px;top:560px"),("Panthenol","skin-loving","right:40px;top:560px"),("Red Algae","mineral-rich","left:40px;top:790px"),("Vitamin E","antioxidant","right:40px;top:790px")])}
{CTA}'''
ads["04-for-him-and-her"]=f'''
<img class="bg" src="assets/couple.webp" style="object-position:50% 20%">
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(23,10,43,0) 45%,rgba(23,10,43,.92) 82%)"></div>
<div style="position:absolute;left:50px;top:850px;width:620px"><div class="h1" style="font-size:76px">One moisturizer.</div><div class="h1" style="font-size:76px;color:var(--lilac)">Both of you.</div><div style="color:#fff;font-weight:600;font-size:32px;margin-top:16px">Light gel · All skin types</div></div>
<div style="position:absolute;right:50px;top:760px;width:300px;height:440px;border-radius:36px;background:radial-gradient(circle at 50% 30%,#fff,var(--lav) 60%,#d9c8f5);overflow:hidden"><img src="assets/tube-cut.png" style="position:absolute;left:68px;top:20px;width:164px;height:379px"></div>
{CTA}'''
ads["05-gel-texture"]=f'''
<img class="bg" src="assets/gel.webp" style="object-position:40% 40%">
<div style="position:absolute;inset:0;background:linear-gradient(180deg,rgba(23,10,43,.75) 0%,rgba(23,10,43,0) 32%,rgba(23,10,43,0) 60%,rgba(23,10,43,.85) 100%)"></div>
<div style="position:absolute;left:50px;right:50px;top:50px"><div class="h1" style="font-size:84px">Light gel.</div><div class="h1" style="font-size:84px;color:var(--lilac)">Zero stickiness.</div></div>
<div style="position:absolute;left:50px;top:1010px;display:flex;gap:14px;flex-wrap:wrap;width:640px">
<span class="pill" style="background:#fff;color:var(--plum);font-size:30px">Oil-free</span><span class="pill" style="background:#fff;color:var(--plum);font-size:30px">Fast-absorbing</span><span class="pill" style="background:#fff;color:var(--plum);font-size:30px">Non-comedogenic</span></div>
<img class="tube" src="assets/tube-cut.png" style="left:770px;top:760px;width:230px;height:531px;transform:rotate(-8deg)">
{CTA}'''
ads["06-facewash"]=f'''
<div class="bg" style="background:radial-gradient(circle at 50% 35%,#15676b 0%,var(--teal) 55%,#08363a 100%)"></div>
<div style="position:absolute;left:0;right:0;top:44px;text-align:center"><div class="h1" style="font-size:70px">Glow starts with a wash</div><div style="color:var(--pink);font-weight:800;font-size:34px;margin-top:12px;letter-spacing:4px">BRIGHTENS · CLEANSES · GLOWS</div></div>
<img src="assets/facewash.png" style="position:absolute;left:115px;top:210px;width:850px;height:850px;border-radius:40px;box-shadow:0 30px 60px rgba(0,0,0,.4)">
<div class="cta" style="background:#fff"><span class="t" style="color:var(--teal)">zinerals.com</span><span class="b" style="background:var(--teal);color:#fff">SHOP NOW →</span></div>'''
for name,body in ads.items():
    f=pathlib.Path(f"{name}.html"); f.write_text(BASE.replace("{body}",body))
    subprocess.run([CH,"--no-sandbox","--headless","--hide-scrollbars","--force-device-scale-factor=1","--window-size=1080,1350","--virtual-time-budget=3000",f"--screenshot={pathlib.Path('out').resolve()}/{name}.png",f"file://{f.resolve()}"],capture_output=True)
    print(name, pathlib.Path(f"out/{name}.png").exists())
