# Videos (HyperFrames)

Video projects built with [HyperFrames](https://github.com/heygen-com/hyperframes) — HTML in, MP4 out.

## One-time setup (per machine / cloud session)

Requires Node.js 22+ and FFmpeg.

```bash
npm install -g hyperframes            # CLI
hyperframes browser ensure            # headless Chrome used for rendering
hyperframes skills update             # Claude Code skills (/hyperframes, /general-video, ...)
pip install kokoro-onnx soundfile     # optional: offline AI voiceover
hyperframes doctor                    # verify
```

## Projects

| Project | What it is |
| --- | --- |
| `distress-sale/` | 60s vertical (1080x1920) commercial property ad — footage, text cards, AI voiceover, music bed |

## Everyday commands (run inside a project folder)

```bash
hyperframes timeline      # list tracks and clips
hyperframes check         # lint + layout + contrast checks
hyperframes preview       # Studio editor in the browser (live reload)
hyperframes render --output renders/out.mp4
```

Edit `index.html` to change text, timing (`data-start` / `data-duration`), footage ranges
(`data-media-start`, `data-playback-rate`) or audio (`data-volume`, `data-automation`).
