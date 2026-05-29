import ScrollReveal from '@/components/landing/ScrollReveal'

export default function LandingPage() {
  return (
    <>
      {/* NAV */}
      <nav className="lp-nav">
        <div className="lp-logo">
          <div className="lp-logo-dot" />
          job_copilot
        </div>
        <ul className="lp-nav-links">
          <li><a href="#features">features</a></li>
          <li><a href="#vs">vs others</a></li>
          <li><a href="#pricing">pricing</a></li>
          <li><a href="#faq">faq</a></li>
        </ul>
        <a href="#pricing" className="lp-btn-nav">get started →</a>
      </nav>

      {/* HERO */}
      <section className="lp-hero">
        <div className="lp-grid-bg" />
        <div className="lp-hero-glow" />
        <div className="lp-hero-glow-2" />

        <div className="lp-hero-badge">
          <div className="lp-badge-dot" />
          Built for software engineers
        </div>

        <h1>
          Stop spray-and-praying.
          <span className="line2">Start landing.</span>
        </h1>

        <p className="lp-hero-sub">
          Most tools help you apply to <strong>200 jobs</strong>.<br />
          Job Copilot helps you actually get <strong>the one you want</strong>.<br />
          AI-powered resume tailoring, cold outreach, and application tracking — built specifically for SWEs.
        </p>

        <div className="lp-hero-cta">
          <a href="#pricing" className="lp-btn-primary">
            ⚡ Get early access free
          </a>
          <a href="#features" className="lp-btn-ghost">
            see how it works →
          </a>
        </div>

        <p className="lp-hero-note">No credit card required · 3 free tailors/month forever · Cancel anytime</p>

        <div className="lp-hero-founder">
          <div className="lp-founder-dot" />
          <span>Built by a SWE actively job hunting — every feature is something I needed myself</span>
        </div>

        <div className="lp-terminal-wrap">
          <div className="lp-terminal">
            <div className="lp-terminal-bar">
              <div className="lp-t-dot lp-t-red" />
              <div className="lp-t-dot lp-t-yellow" />
              <div className="lp-t-dot lp-t-green" />
              <div className="lp-t-title">job_copilot — tailor.sh</div>
            </div>
            <div className="lp-terminal-body">
              <div><span className="t-comment"># Paste your JD. Job Copilot does the rest.</span></div>
              <div style={{ marginTop: 12 }}><span className="t-cmd">$</span> <span className="t-out">copilot tailor --jd stripe-swe.txt --resume my_resume.pdf</span></div>
              <div style={{ marginTop: 8 }}><span className="t-key">→ Parsing</span> <span className="t-out">job description...</span></div>
              <div><span className="t-key">→ Extracting</span> <span className="t-out">JD signals: </span><span className="t-val">{`["distributed systems", "Java", "Kafka", "high-scale APIs"]`}</span></div>
              <div><span className="t-key">→ Rewriting</span> <span className="t-out">8 bullet points to match role...</span></div>
              <div><span className="t-key">→ ATS score:</span> <span className="t-good">87/100</span> <span className="t-dim">(was 51/100)</span></div>
              <div><span className="t-key">→ Missing keywords added:</span> <span className="t-val">{`["event-driven", "low-latency", "observability"]`}</span></div>
              <div style={{ marginTop: 8 }}><span className="t-good">✓ Resume tailored.</span> <span className="t-out">Downloading alex_stripe_swe.docx...</span></div>
              <div style={{ marginTop: 8 }}><span className="t-cmd">$</span> <span className="t-cursor" /></div>
            </div>
          </div>
        </div>
      </section>

      <div className="lp-divider" />

      {/* PROBLEM */}
      <ScrollReveal>
        <section id="problem" className="lp-section">
          <div className="lp-section-label">// the problem</div>
          <h2 className="lp-section-title">The SWE job market is brutal.<br />Most tools make it worse.</h2>
          <p className="lp-section-sub">Generic AI tools were built for everyone, which means they're optimized for no one. Especially not engineers.</p>

          <div className="lp-problem-grid">
            <div className="lp-problem-card">
              <div className="lp-problem-num">01</div>
              <span className="lp-problem-icon">🎯</span>
              <div className="lp-problem-title">Your resume isn&apos;t ATS-optimized</div>
              <p className="lp-problem-desc">ATS systems filter out 75% of candidates before a human ever reads them. A generic resume — even a great one — gets killed by keyword mismatch.</p>
            </div>
            <div className="lp-problem-card">
              <div className="lp-problem-num">02</div>
              <span className="lp-problem-icon">📬</span>
              <div className="lp-problem-title">Cold outreach gets no replies</div>
              <p className="lp-problem-desc">Copy-pasting &ldquo;I&apos;m interested in the SWE role&rdquo; to a hiring manager is invisible. Engineers need technical, specific outreach — not sales templates.</p>
            </div>
            <div className="lp-problem-card">
              <div className="lp-problem-num">03</div>
              <span className="lp-problem-icon">📊</span>
              <div className="lp-problem-title">You&apos;re losing track of your pipeline</div>
              <p className="lp-problem-desc">Spreadsheets break. You forget to follow up. Applications go dark. A 7-day no-response is a signal — and most engineers miss it.</p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <div className="lp-divider" />

      {/* FEATURES */}
      <ScrollReveal>
        <section id="features" className="lp-section">
          <div className="lp-section-label">// features</div>
          <h2 className="lp-section-title">Built for the way engineers<br />actually get jobs.</h2>
          <p className="lp-section-sub">Not volume. Not spam. Targeted, high-signal applications that get you to the phone screen.</p>

          <div className="lp-features-grid">
            <div className="lp-feature-card">
              <div className="lp-feature-tag">Core</div>
              <div className="lp-feature-title">SWE Resume Tailoring</div>
              <p className="lp-feature-desc">Paste a JD, upload your resume. Claude rewrites your bullets to match the role&apos;s exact tech stack, seniority signals, and ATS keywords — without hallucinating experience you don&apos;t have. <strong>Every output is a .docx you can download instantly.</strong></p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-tag">Core</div>
              <div className="lp-feature-title">ATS Score Checker</div>
              <p className="lp-feature-desc">See your keyword match score before you apply. We extract critical and nice-to-have keywords from the JD and show you exactly what&apos;s missing. <strong>Know your score before the algorithm does.</strong></p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-tag green">Pro</div>
              <div className="lp-feature-title">Cold Email + Apollo Enrichment</div>
              <p className="lp-feature-desc">Enter the company and role. We find the hiring manager via Apollo, then Claude drafts a cold email that references the company&apos;s <strong>actual tech stack and engineering blog</strong> — not a generic template. Engineers get replies when they sound like engineers.</p>
            </div>

            <div className="lp-feature-card span2">
              <div className="lp-feature-tag green">Pro — Application Dashboard</div>
              <div className="lp-feature-title">Your full pipeline. Every round tracked. Auto follow-ups when it goes quiet.</div>
              <p className="lp-feature-desc" style={{ marginBottom: 20 }}>Track every application through Applied → Phone Screen → Technical → System Design → Offer. Get <strong>automated follow-up email drafts</strong> if an application goes more than 7 days without a response. Never let a role ghost you silently again.</p>

              <div className="lp-dashboard-mini">
                <div className="lp-dash-header">
                  <span>company</span>
                  <span>role</span>
                  <span>stage</span>
                  <span>days</span>
                  <span>follow-up</span>
                </div>
                <div className="lp-dash-row">
                  <span className="lp-dash-company">Stripe</span>
                  <span className="lp-dash-role">Sr. SWE</span>
                  <span className="lp-stage tech"><span className="lp-stage-dot" />Technical</span>
                  <span style={{ color: 'var(--muted)' }}>2d</span>
                  <span className="lp-follow-up ok">— on track</span>
                </div>
                <div className="lp-dash-row">
                  <span className="lp-dash-company">Vercel</span>
                  <span className="lp-dash-role">Backend Eng</span>
                  <span className="lp-stage screen"><span className="lp-stage-dot" />Phone Screen</span>
                  <span style={{ color: 'var(--muted)' }}>5d</span>
                  <span className="lp-follow-up ok">— on track</span>
                </div>
                <div className="lp-dash-row">
                  <span className="lp-dash-company">Linear</span>
                  <span className="lp-dash-role">SWE II</span>
                  <span className="lp-stage applied"><span className="lp-stage-dot" />Applied</span>
                  <span style={{ color: 'var(--red)', fontWeight: 600 }}>8d</span>
                  <span className="lp-follow-up">⚡ draft follow-up</span>
                </div>
                <div className="lp-dash-row">
                  <span className="lp-dash-company">Notion</span>
                  <span className="lp-dash-role">Infra Eng</span>
                  <span className="lp-stage offer"><span className="lp-stage-dot" />Offer</span>
                  <span style={{ color: 'var(--muted)' }}>—</span>
                  <span className="lp-follow-up ok" style={{ color: 'var(--green)' }}>🎉 congrats</span>
                </div>
              </div>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-tag">Core</div>
              <div className="lp-feature-title">Cover Letter Generator</div>
              <p className="lp-feature-desc">Not a template. A real, personalized cover letter that connects your specific experience to the role&apos;s core needs. <strong>200 words. No fluff. Human tone.</strong></p>
            </div>

            <div className="lp-feature-card">
              <div className="lp-feature-tag purple">Coming soon</div>
              <div className="lp-feature-title">GitHub Portfolio Sync</div>
              <p className="lp-feature-desc">Connect your GitHub. We surface your most relevant repos per JD and generate one-line project descriptions that match the role&apos;s tech stack. <strong>Let your code speak first.</strong></p>
            </div>
          </div>
        </section>
      </ScrollReveal>

      <div className="lp-divider" />

      {/* VS */}
      <ScrollReveal>
        <section id="vs" className="lp-section">
          <div className="lp-section-label">// vs others</div>
          <h2 className="lp-section-title">Quality over quantity.<br />Every time.</h2>
          <p className="lp-section-sub">While other tools help you spray 200 applications a week, we help you land the 3 you actually care about.</p>

          <div style={{ overflowX: 'auto', border: '1px solid var(--border)', borderRadius: 12 }}>
            <table className="lp-vs-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th>Other tools</th>
                  <th className="col-us">Job Copilot</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Built for software engineers', 'Generic for all roles', 'SWE-specific signals'],
                  ['Transparent pricing', 'Hidden credits, $68+ true cost', '$12/mo flat, no gotchas'],
                  ['Resume tailoring quality', 'Keyword stuffing, generic rewrites', 'Role-aware, tone-matched'],
                  ['Cold email enrichment', 'Not included', 'Apollo + tech context'],
                  ['Application round tracking', 'Basic or missing', 'Full SWE pipeline stages'],
                  ['Auto follow-up drafts', 'Not available', 'After 7 days silence'],
                  ['Free tier', 'No free trial', '3 tailors/mo free forever'],
                ].map(([feature, other, us]) => (
                  <tr key={feature}>
                    <td>{feature}</td>
                    <td><span className="lp-cross">✗</span> {other}</td>
                    <td className="lp-us-col"><span className="lp-check">✓</span> {us}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </ScrollReveal>

      <div className="lp-divider" />

      {/* PRICING */}
      <ScrollReveal>
        <section id="pricing" className="lp-section">
          <div className="lp-section-label">// pricing</div>
          <h2 className="lp-section-title">Simple. Transparent.<br />No hidden credits.</h2>
          <p className="lp-section-sub">One number. That&apos;s it. Cancel anytime.</p>

          <div className="lp-pricing-grid">
            <div className="lp-pricing-card">
              <div className="lp-pricing-tier">Free</div>
              <div className="lp-pricing-price">$0</div>
              <div className="lp-pricing-period">forever</div>
              <ul className="lp-pricing-items">
                <li><span className="lp-check">✓</span> 3 resume tailors / month</li>
                <li><span className="lp-check">✓</span> 3 cover letters / month</li>
                <li><span className="lp-check">✓</span> ATS score checker</li>
                <li><span className="lp-check">✓</span> Track up to 5 applications</li>
                <li className="locked"><span style={{ color: 'var(--muted2)' }}>✗</span> Cold email + Apollo lookup</li>
                <li className="locked"><span style={{ color: 'var(--muted2)' }}>✗</span> Unlimited tailors</li>
                <li className="locked"><span style={{ color: 'var(--muted2)' }}>✗</span> Auto follow-up drafts</li>
              </ul>
              <a href="#" className="lp-btn-pricing ghost">start free →</a>
            </div>

            <div className="lp-pricing-card featured">
              <div className="lp-pricing-badge">Most popular</div>
              <div className="lp-pricing-tier">Pro</div>
              <div className="lp-pricing-price">$12</div>
              <div className="lp-pricing-period">per month · cancel anytime</div>
              <ul className="lp-pricing-items">
                <li><span className="lp-check">✓</span> Unlimited resume tailors</li>
                <li><span className="lp-check">✓</span> Unlimited cover letters</li>
                <li><span className="lp-check">✓</span> ATS score + gap analysis</li>
                <li><span className="lp-check">✓</span> Unlimited application tracking</li>
                <li><span className="lp-check">✓</span> Cold email + Apollo enrichment</li>
                <li><span className="lp-check">✓</span> Auto follow-up after 7 days</li>
                <li><span className="lp-check">✓</span> Full SWE pipeline stages</li>
              </ul>
              <a href="#" className="lp-btn-pricing solid">get Pro →</a>
            </div>
          </div>

          <p style={{ marginTop: 20, fontFamily: 'var(--font-mono)', fontSize: 11, color: 'var(--muted2)' }}>
            Break-even is 5 paying users. We&apos;re not here to grow at all costs — we&apos;re here to be useful.
          </p>
        </section>
      </ScrollReveal>

      <div className="lp-divider" />

      {/* FAQ */}
      <ScrollReveal>
        <section id="faq" className="lp-section">
          <div className="lp-section-label">// faq</div>
          <h2 className="lp-section-title" style={{ marginBottom: 40 }}>Common questions.</h2>

          <div className="lp-faq-list">
            {[
              {
                q: 'Does the AI actually understand software engineering roles?',
                a: "Yes — unlike generic tools, our prompts are tuned for SWE signals: distributed systems, system design, tech stack matching, seniority language. It won't rewrite your Java backend experience to sound like a marketing role.",
              },
              {
                q: "Will it make up experience I don't have?",
                a: <>No. Job Copilot only rewrites what&apos;s already in your resume. It reframes and rewords your actual experience — it never invents technologies, companies, or outcomes you didn&apos;t have. <strong>Your resume stays truthful.</strong></>,
              },
              {
                q: 'How does the 7-day follow-up feature work?',
                a: <>When you log an application and it hasn&apos;t moved stages in 7 days, Job Copilot flags it and generates a draft follow-up email to the recruiter or hiring manager. You review it, edit if needed, and send — <strong>you&apos;re always in control.</strong></>,
              },
              {
                q: "What's the Apollo integration for?",
                a: "Apollo is a contact enrichment tool. You enter a company and target role — we find the hiring manager's name and email. Claude then writes a cold email using that contact's context plus the company's tech signals. Much better than a LinkedIn InMail.",
              },
              {
                q: "Is there really no hidden pricing?",
                a: "Really. $0 for free, $12/mo for Pro. No credits, no per-application fees, no surprise upsells after signup. We saw what competitors do and built the opposite.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="lp-faq-item">
                <div className="lp-faq-q">{q}</div>
                <p className="lp-faq-a">{a}</p>
              </div>
            ))}
          </div>
        </section>
      </ScrollReveal>

      {/* FINAL CTA */}
      <ScrollReveal>
        <div className="lp-cta-final">
          <div className="lp-cta-glow" />
          <h2>Ready to land your next role?</h2>
          <p>Start free. No credit card. Your first tailored resume in under 60 seconds.</p>
          <a href="#pricing" className="lp-btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
            ⚡ Get started free
          </a>
        </div>
      </ScrollReveal>

      {/* FOOTER */}
      <footer className="lp-footer">
        <div className="lp-logo">
          <div className="lp-logo-dot" />
          job_copilot
        </div>
        <span>Built for engineers, by an engineer.</span>
        <span>© 2026 Job Copilot</span>
      </footer>
    </>
  )
}
