# Danish Ali
**QA Engineer | Manual & Automation | CI/CD | AI-Assisted Test Automation**
Pickering, ON, Canada (GTA) • (647) 833-9990 • syeddanishdev@gmail.com
[linkedin.com/in/syeddanishdev](https://linkedin.com/in/syeddanishdev) • [github.com/syeddanishdev](https://github.com/syeddanishdev)

Download PDF → [DanishAli_Resume.pdf](./DanishAli_Resume.pdf)

![Profile views](https://komarev.com/ghpvc/?username=syeddanishdev&color=brightgreen)

### Profile
QA Engineer with 9+ years across SaaS, gaming, telecom, and research. Currently a Quality Assurance Analyst at Statflo, owning a Playwright/TypeScript suite (regression pass rate 34% → 100%), GitHub Actions pipelines, and Allure + Slack reporting. Previously reduced post-release issues by 25% at ServiceTitan and cut regression time by up to 50%. 3x published VR/UX researcher (QoMEX 2020).

### Technical Skills
- Automation: Playwright (expert), TypeScript, AI test generation (Gemini 1.5 Flash), Appium
- API & Performance: Postman, SoapUI, k6, Charles Proxy, Unity Profiler
- Tools & CI/CD: GitHub Actions, Allure, Slack automation, TestRail, Jira, Jenkins, GitLab CI
- Data: SQL-based data validation across environments
- Domains: Web, Mobile (iOS/Android), Game Engines (Unity), VR/AR

### Professional Experience

**Statflo – Toronto, Canada**
**Quality Assurance Analyst** → March 2026 – Present
- Own and maintain a Playwright/TypeScript E2E suite; raised regression pass rate from 34% to 100% and eliminated all flaky tests
- Fixed race conditions and timeouts; added configurable parallel worker scaling (1–6) in CI
- Design and maintain GitHub Actions pipelines (environment-based triggers, parallel execution, artifact retention)
- Built Allure reporting with historical trends on GitHub Pages and automated Slack regression reports
- Reduced repository size 99.7% (26 GB → 80 MB), speeding up pipeline clones and checkouts
- Wrote spec-level test contracts for 100% of the suite, enforced in CI to prevent documentation drift
- Triaged dependency security vulnerabilities (SSRF, prototype pollution)

**ServiceTitan – Toronto, Canada**
**QA Engineer** → March 2024 – March 2026
- Designed and shipped open-source AI tool (ai-playwright-genAI) that converts plain-English scenarios into production Playwright tests using Google Gemini
- Built and maintain Playwright automation suite integrated with GitHub Actions, cutting manual regression effort significantly
- Reduced post-release defects 25% through tighter shift-left practices and pipeline monitoring
- Own functional, regression, and API testing for scheduling, dispatch, and invoicing modules

**Unity Technologies**
**QA Engineer** → June 2021 – March 2024
- Delivered Playwright + internal framework automation for Unity Play and Struckd (web + mobile game platform)
- Performed deep performance testing with Unity Profiler; caught memory leaks and frame-rate drops on Android devices
- Standardized automation practices and mentored team members on modern E2E testing

**T-Labs, Telekom Innovation Laboratories – Berlin, Germany**
**QA Tester** → October 2018 – May 2021
- Tested mobile apps and VR/AR prototypes in fast research cycles
- Reduced regression effort 50% by introducing early automation adoption

**Raptor Interactive**
**QA Analyst** → March 2015 – April 2017
- Tested mobile games for gameplay flow, monetization, and network stability
- Automated smoke and device-compatibility checks with Appium
- Discovered a critical monetization defect pre-launch, protecting revenue

**SATISTRUM**
**Jr QA Tester** → January 2014 – February 2015
- Tested early-stage Android and web applications and documented defects in Jira
- Proposed automation for repetitive regression scenarios; recommendation was adopted as team standard

### Open Source & AI Testing Projects (github.com/syeddanishdev)
- **ai-playwright-genAI** → GenAI-powered test automation showcasing LLM-based test case generation and intelligent test data creation using Google Gemini
- **ai-playwright-demo** → Modern test automation framework leveraging Playwright with AI-powered test generation and execution
- **Manual-Testing-QA** → Comprehensive manual testing repository with test cases, checklists, and QA best practices
- **reqres-api-testing-demo** → RESTful API testing framework demonstrating API validation and integration testing patterns
- **TestRail-QA-Setup** → TestRail configuration and integration guide for test management and reporting workflows

### Research & Publications (QoMEX 2020 – IEEE)
- "Influence of Hand Tracking as a way of Interaction in Virtual Reality on User Experience"
- "Comparing emotional states induced by 360° videos via HMD vs screen"
- "User Experience of Reading in Virtual Reality – Text Distance, Size and Contrast"

### Certifications
Playwright JS/TS Automation Testing from Scratch & Framework • Global Privacy and Data Protection (GDPR) • California Consumer Privacy Act • Security Awareness Fundamentals • Android Development

### Education
Master of Science in Computer Science → Technische Universität Berlin
Bachelor of Science in Computer Science → National College of Business Administration & Economics, Lahore

Languages: English (native), German (basic)

---

### How this site is tested
This portfolio is covered by its own Playwright suite, run by [Site tests](.github/workflows/site-tests.yml) on every push and nightly:

- **Interactions:** theme toggle, mobile menu, phone reveal, hero terminal, live CI status panel, bug hunt game
- **Accessibility:** axe-core WCAG 2.1 A/AA scans in dark, light, and bug-hunt modes
- **Visual regression:** full-page screenshots at desktop and mobile widths
- **Links:** every internal anchor and external link must resolve
- **Lighthouse CI:** accessibility score of 95+ is enforced

Results are published with the site: [Allure report](https://syeddanishdev.github.io/report/) · [Lighthouse](https://syeddanishdev.github.io/lighthouse/)

```bash
npm ci
npx playwright install chromium
npm test                        # full suite
npm run test:update-snapshots   # refresh local visual baselines
npm run lighthouse              # Lighthouse CI
```

Linux visual baselines are generated in CI: run the workflow manually with **update_snapshots** checked.
