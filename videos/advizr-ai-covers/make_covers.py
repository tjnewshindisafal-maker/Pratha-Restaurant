import subprocess, os, html
D=os.path.dirname(os.path.abspath(__file__))
CH="/opt/pw-browsers/chromium-1194/chrome-linux/chrome"
DAYS=[
 (0,"Advizr Bhaiya ki Class","advizr-logo.svg",["🙋 Rahul: zero se shuru","📅 90 din, roz 1 sabak","🆓 Sirf FREE AI tools","🚀 Day 90: asli campaign"]),
 (1,"AI Karta Kya Hai?","chatgpt-logo.svg",["✍️ Caption likhega","🎨 Poster banayega","🌙 Raat 2 baje jawab","🧠 AI = auzaar, dimaag = aap"]),
 (2,"ChatGPT se 30 Din Plan","chatgpt-logo.svg",["🏪 Business + customer likho","📊 Table mein plan maango","🎬 Topic + reel + caption","❓ Customer ka sawaal = reel"]),
 (3,"R-T-C-F Prompt Formula","chatgpt-logo.svg",["🎭 R = Role","🎯 T = Task","📍 C = Context","📊 F = Format"]),
 (4,"Canva AI se Poster","canva.svg",["✨ Magic Design","⚡ 10 design ready","📞 Logo + number","📐 Magic Resize"]),
 (5,"Reel ka Hook","instagram.svg",["⏱️ Pehle 3 second","❓ Sawaal se shuru","❌ Galti se shuru","🔢 Number se shuru"]),
 (6,"WhatsApp Auto Reply","whatsapp.svg",["🌙 Away message","⚡ Quick replies","📋 /price = 1 click","🤖 Replies ChatGPT se"]),
 (7,"Google Review ka Reply","google.svg",["😡 Gussa nahi, reply","🙏 Polite + sorry","📞 Fix + call karo","📈 Profile upar"]),
 (8,"Instagram SEO","instagram.svg",["🔍 Insta = search engine","✍️ Pehli line = keywords","#️⃣ Sirf 3-5 hashtag","❌ 30 hashtag = spam"]),
 (9,"Product Photo AI se","canva.svg",["🪟 Khidki wali roshni","✂️ Background remover","✨ Magic Edit","✅ Product asli dikhao"]),
 (10,"10 Din ka Recap","advizr-logo.svg",["🧰 8 FREE AI tools","💸 Kharcha: ₹0","☕ Pehla client: cafe","🔥 Ab asli test"]),
]
CSS=open(os.path.join(D,"cover.css")).read()
def dots(n):
    s=""
    start=max(0,n-3); 
    for k in range(start,start+7):
        cls="done" if k<n else ("cur" if k==n else "todo")
        s+=f'<span class="d {cls}">{"✓" if k<n else k}</span>'
    return s+'<span class="more">…90</span>'
os.makedirs(os.path.join(D,"out"),exist_ok=True)
for n,topic,logo,chips in DAYS:
    tile_cls="tile dark" if logo=="advizr-logo.svg" else "tile"
    h=f'''<!doctype html><html><head><meta charset="utf-8"><style>{CSS}</style></head><body><div class="c">
<div class="bgA"></div>
<div class="kick">90 Din AI Challenge…</div>
<div class="day">DAY</div>
<div class="row"><div class="num">{n:02d}</div><div class="topic">{html.escape(topic)}</div></div>
<div class="{tile_cls}"><img src="assets/{logo}"></div>
<div class="chips">{"".join(f"<div>{html.escape(c)}</div>" for c in chips)}</div>
<div class="foot"><div class="dots">{dots(n)}</div><div class="brand"><span class="bt"><img src="assets/advizr-logo.svg"></span>ADVIZR</div></div>
<div class="hint">Advizr Bhaiya ki Class · @advizr_media</div>
</div></body></html>'''
    p=os.path.join(D,f"c{n:02d}.html");open(p,"w").write(h)
    out=os.path.join(D,"out",f"cover-day{n:02d}.png")
    subprocess.run([CH,"--headless=new","--no-sandbox","--hide-scrollbars","--force-device-scale-factor=1","--window-size=1080,1920",f"--screenshot={out}","--virtual-time-budget=2000","file://"+p],capture_output=True)
    subprocess.run(["ffmpeg","-loglevel","error","-y","-i",out,"-q:v","2",out.replace(".png",".jpg")])
    os.remove(p); print(out, os.path.exists(out))
