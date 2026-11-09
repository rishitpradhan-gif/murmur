# Murmur: take it home

1. Extract this whole ZIP.
2. Install Python 3.10+ if needed: https://www.python.org/downloads/
3. Open a terminal in this folder and run:

```
python3 serve.py
```

Windows: `py -3 serve.py`.

Open http://127.0.0.1:8000 in your browser. Keep the terminal open; Ctrl+C stops it.

Port busy? Run `python3 serve.py --port 8001` and use http://127.0.0.1:8001 instead.

Do not double-click app/index.html: use the local server. No Node.js installation or build step is required. Typefaces load from Google Fonts when online; offline viewing uses local fallbacks. Sound/photo processing stays on your device.

Try it online: https://murmur-rishit.rishit-pradhan.chatgpt.site
Source and full instructions: https://github.com/rishitpradhan-gif/murmur
