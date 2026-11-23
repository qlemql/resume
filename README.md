# Taehyun Kim · Public resume

Korean and English resumes for frontend engineering roles.

- Korean: <https://resume-swart-phi-32.vercel.app/>
- English: <https://resume-swart-phi-32.vercel.app/en.html>

## Editing

`data/resume.json` is the source for both languages. It contains only the public resume text. Update matching Korean and English entries together, then run:

```sh
npm run build
```

This generates `index.html` and `en.html` without third-party Node dependencies. The generated files are committed because hosting serves this directory as a static site.

## PDFs

Serve the repository on localhost, then run the PDF script with Python Playwright and Chrome installed:

```sh
python -m http.server 3016 --bind 127.0.0.1
python scripts/generate-pdf.py
```

`RESUME_BASE_URL` defaults to `http://127.0.0.1:3016`. Set `CHROME_EXECUTABLE_PATH` if Chrome is installed elsewhere. After changing content or styles, regenerate both PDFs and inspect every page before publishing.

## Font

Pretendard Regular and Bold are embedded locally. See `assets/OFL.txt` for the SIL Open Font License. There are no remote font requests.
