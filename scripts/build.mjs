import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const root = new URL("../", import.meta.url);
const data = JSON.parse(readFileSync(new URL("data/resume.json", root), "utf8"));
const escape = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
})[char]);

const render = (locale) => {
  const ko = locale === "ko";
  const t = (value) => escape(value[locale]);
  const resultText = (value) => t(value).replace(/(90\.7%|75\.83%|10분 초과에서 3분 이하|over ten minutes to three minutes or less)/g, '<strong>$1</strong>');
  const list = (items) => `<ul>\n${items.map((item) => `  <li>${escape(item)}</li>`).join("\n")}\n</ul>`;
  const labels = ko
    ? { summary: "소개", experience: "경력", skills: "기술", side: "개인 프로젝트", education: "교육", context: "배경", work: "한 일", result: "결과·진행 상태" }
    : { summary: "Summary", experience: "Experience", skills: "Skills", side: "Side Projects", education: "Education", context: "Context", work: "What I did", result: "Outcome / status" };
  const experiences = data.experience.map((company, index) => `<article class="experience${company.projects.length ? "" : " compact"}" id="company-${index}">
<header><h3>${t(company.company)}</h3><p class="muted period">${t(company.period)}</p></header>
<p class="job-role">${t(company.role)}</p><p class="muted">${t(company.meta)}</p>
<p class="company-summary">${t(company.summary)}</p>
${company.projects.map((project, projectIndex) => `<section class="project">
<h4><span class="project-number" aria-hidden="true">${String(projectIndex + 1).padStart(2, '0')}</span>${t(project.title)}</h4>
<p class="project-context">${t(project.context)}</p>
<div class="detail work">${list(project.work[locale])}</div>
<div class="detail result"><h5>${labels.result}</h5><p>${resultText(project.result)}</p></div>
</section>`).join("\n")}
<section class="project extra"><h4>${t(company.extraTitle)}</h4>${list(company.extra[locale])}</section>
</article>`).join("\n");
  const contact = `<a href="mailto:${escape(data.email)}">${escape(data.email)}</a><a href="${escape(data.github)}">github.com/qlemql</a>`;
  return `<!doctype html>
<html lang="${locale}">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${t(data.name)} · ${escape(data.role)}</title><meta name="description" content="${t(data.summary)}">
<link rel="stylesheet" href="/styles.css">
<link rel="canonical" href="https://resume-swart-phi-32.vercel.app/${ko ? "" : "en.html"}">
<link rel="alternate" hreflang="ko" href="https://resume-swart-phi-32.vercel.app/">
<link rel="alternate" hreflang="en" href="https://resume-swart-phi-32.vercel.app/en.html">
</head><body>
<nav aria-label="${ko ? "이력서 메뉴" : "Resume navigation"}"><a href="${ko ? "/en.html" : "/"}" lang="${ko ? "en" : "ko"}">${ko ? "English" : "한국어"}</a><a href="/${ko ? "resume.pdf" : "resume-en.pdf"}">${ko ? "PDF 다운로드" : "Download PDF"}</a></nav>
<main><header class="intro"><div class="identity"><h1>${t(data.name)}</h1><p class="role">${escape(data.role)}</p></div><p class="contact">${contact}</p></header>
<section id="summary"><h2>${labels.summary}</h2><p>${t(data.summary)}</p></section>
<section id="experience"><h2>${labels.experience}</h2>${experiences}</section>
<section id="skills"><h2>${labels.skills}</h2><dl>
${data.skills.map((group) => `<div><dt>${t(group.title)}</dt><dd>${t(group.items)}</dd></div>`).join("\n")}
</dl></section>
<section id="side-projects"><h2>${labels.side}</h2>
${data.sideProjects.map((project) => `<article class="project"><h3>${t(project.title)}</h3><p>${t(project.description)}</p><p class="links">${project.links.map((link) => `<a href="${escape(link.url)}">${escape(link.label)}</a>`).join(" ")}</p></article>`).join("\n")}
</section>
<section id="education"><h2>${labels.education}</h2>
${data.education.map((entry) => `<div class="education"><h3>${t(entry.title)}</h3><p class="muted">${t(entry.detail)}</p></div>`).join("\n")}
</section></main></body></html>\n`;
};

["ko", "en"].forEach((locale) => {
  const target = new URL(locale === "ko" ? "index.html" : "en.html", root);
  writeFileSync(target, render(locale));
  process.stdout.write(`Generated ${fileURLToPath(target)}\n`);
});
