"""Generate both public PDFs from the same HTML and print CSS served on localhost."""
from pathlib import Path
import os
from playwright.sync_api import sync_playwright

root = Path(__file__).resolve().parents[1]
base = os.environ.get('RESUME_BASE_URL', 'http://127.0.0.1:3016')
chrome = os.environ.get('CHROME_EXECUTABLE_PATH')
default = Path('C:/Program Files/Google/Chrome/Application/chrome.exe')
if not chrome and default.exists():
    chrome = str(default)
with sync_playwright() as pw:
    browser = pw.chromium.launch(executable_path=chrome)
    page = browser.new_page()
    for route, output in [('/', 'resume.pdf'), ('/en.html', 'resume-en.pdf')]:
        response = page.goto(base + route, wait_until='networkidle')
        assert response and response.ok, f'Could not load {route}'
        page.emulate_media(media='print')
        page.evaluate('document.fonts.ready')
        assert page.evaluate('document.fonts.check("400 14px Pretendard")')
        page.pdf(path=str(root / output), prefer_css_page_size=True, print_background=True,
                 display_header_footer=True, header_template='<span></span>',
                 footer_template='<div style="width:100%;padding-right:16mm;text-align:right;font-size:8px;color:#59636e"><span class="pageNumber"></span> / <span class="totalPages"></span></div>')
        print(output)
    browser.close()
