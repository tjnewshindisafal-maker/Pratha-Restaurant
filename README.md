# Pratha Restaurant

Website project for Pratha Restaurant.

## Project Structure

```
.
├── index.html      # Homepage
├── css/            # Stylesheets
├── js/             # Scripts
├── games/          # Browser games (HTML5)
├── images/         # Images and media assets
└── pages/          # Additional pages (menu, about, contact, etc.)
```

## Getting Started

Open `index.html` in a browser, or serve the folder with any static file server, e.g.:

```
python3 -m http.server
```

## Games

### Paratha Stack (`games/paratha-stack/index.html`)

A one-tap HTML5 stacking game: tap to drop each paratha onto the stack; any overhang is cut off. Three perfect drops in a row widen the paratha again. It runs in any browser with no build step and saves the best score locally.

The game already calls the YouTube Playables SDK (`window.ytgame`) when it is present: first-frame/game-ready signals, score reporting, cloud save of the best score, pause/resume and audio on/off. To submit it to YouTube Playables, add the SDK script tag from the official Playables docs in `<head>` and follow their submission checklist.

## Status

Project scaffolding only — pages and content to be added.
