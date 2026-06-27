import React, { useId, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ArrowRight, BadgeCheck, Building2, Calculator, ChevronRight, CircleDollarSign, ClipboardCheck, Copy, FileText, Globe2, Landmark, Mail, Plane, ShieldCheck, Sparkles, TrendingUp, WalletCards } from 'lucide-react';
import './styles.css';

const municipalities = [
  { name: 'Copenhagen', code: 'CPH', tax: 23.8, rent: 15500 },
  { name: 'Frederiksberg', code: 'FRB', tax: 22.8, rent: 16000 },
  { name: 'Aarhus', code: 'AAR', tax: 24.5, rent: 12000 },
  { name: 'Odense', code: 'ODE', tax: 25.6, rent: 9500 },
  { name: 'Aalborg', code: 'AAL', tax: 25.6, rent: 9000 },
  { name: 'Kalundborg', code: 'KLB', tax: 25.0, rent: 8500 },
  { name: 'Gentofte', code: 'GEN', tax: 22.8, rent: 17500 },
  { name: 'Roskilde', code: 'ROS', tax: 25.1, rent: 11500 },
];

const professionGuides = [
  { role: 'Process engineer', sector: 'Pharma, energy, food production', note: 'A practical sample for Kalundborg or Greater Copenhagen manufacturing roles.', salary: 57000, municipality: 'Kalundborg', bonus: 35000, employerPension: 10, employeePension: 5 },
  { role: 'QA specialist', sector: 'GMP, validation, deviation handling', note: 'Use this to test how pension and bonus change a regulated-industry offer.', salary: 52000, municipality: 'Copenhagen', bonus: 30000, employerPension: 10, employeePension: 5 },
  { role: 'Automation engineer', sector: 'PLC, robotics, manufacturing IT', note: 'A sample for factory hubs where base salary and pension both matter.', salary: 60000, municipality: 'Kalundborg', bonus: 45000, employerPension: 10, employeePension: 5 },
  { role: 'Data engineer', sector: 'Cloud, analytics, platform teams', note: 'A higher-income sample to test visa threshold and top-tax sensitivity.', salary: 68000, municipality: 'Copenhagen', bonus: 65000, employerPension: 10, employeePension: 5 },
  { role: 'Scientist / PhD', sector: 'R&D, biotech, university spinouts', note: 'Use this to screen researcher-tax-scheme salary signals before accepting.', salary: 61000, municipality: 'Copenhagen', bonus: 25000, employerPension: 10, employeePension: 5 },
  { role: 'Project manager', sector: 'Capex, pharma, IT delivery', note: 'A sample for senior offers with bonus, pension and family-budget pressure.', salary: 72000, municipality: 'Frederiksberg', bonus: 90000, employerPension: 10, employeePension: 5 },
];

const sources = [
  ['SKAT 2026 tax brackets', 'https://skat.dk/en-us/help/botton-bracket-middle-bracket-top-bracket-and-additional-top-bracket-tax'],
  ['Researcher / key employee tax scheme', 'https://skat.dk/en-us/businesses/employees-and-pay/non-danish-labour/tax-scheme-for-researchers'],
  ['Pay Limit Scheme 2026', 'https://www.nyidanmark.dk/pl-PL/You-want-to-apply/Work/Pay-limit-scheme'],
];

const searchLandingPages = [
  ['Copenhagen salary calculator', 'High-rent city budget with Copenhagen municipal tax preset.'],
  ['Kalundborg salary calculator', 'Useful for pharma, engineering and manufacturing offers.'],
  ['Denmark Pay Limit Scheme checker', 'Quick screen against the 2026 work-permit salary threshold.'],
  ['Researcher tax scheme calculator', 'Salary and PhD/researcher status signal for international hires.'],
  ['Denmark job offer calculator', 'Base salary, pension, bonus, tax and living costs in one view.'],
  ['Denmark cost of living calculator', 'Estimate what remains after rent and recurring monthly costs.'],
];

const faqs = [
  ['Is this an official Danish tax calculation?', 'No. TakeHomeDK is an offer-screening calculator based on published rules and transparent assumptions. Use SKAT, SIRI or a qualified advisor before making legal, tax or immigration decisions.'],
  ['Does employer pension count as take-home pay?', 'No. Employer pension is shown as compensation value, but it is not included in monthly cash take-home pay. The Pay Limit Scheme screen models it separately because some pension components may count toward the threshold.'],
  ['Why does municipality matter?', 'Danish municipal tax rates vary. Choosing Copenhagen, Frederiksberg, Aarhus, Odense, Aalborg, Kalundborg, Gentofte or Roskilde changes the estimated tax and city living budget preset.'],
  ['Can I use this for a Danish work permit salary check?', 'You can use it as an early threshold screen for the 2026 Pay Limit Scheme minimum, but SIRI decides which salary components count in the real application.'],
  ['Who is this built for?', 'International employees, engineers, life-science professionals, IT workers, PhDs and families comparing a Danish job offer before relocating.'],
];

function formatDKK(value) {
  return new Intl.NumberFormat('en-DK', { style: 'currency', currency: 'DKK', maximumFractionDigits: 0 }).format(Number.isFinite(value) ? value : 0);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function calculateTax({ grossMonthly, municipalityTax, pensionPct, employeePensionPct, churchTax, deductionMonthly, bonusAnnual }) {
  const annualGross = grossMonthly * 12 + bonusAnnual;
  const employeePension = annualGross * (employeePensionPct / 100);
  const taxableBeforeAM = Math.max(0, annualGross - employeePension);
  const amBidrag = taxableBeforeAM * 0.08;
  const afterAM = taxableBeforeAM - amBidrag;
  const personalDeduction = 51100;
  const deduction = deductionMonthly * 12;
  const taxableIncome = Math.max(0, afterAM - personalDeduction - deduction);
  const municipalTax = taxableIncome * (municipalityTax / 100);
  const church = churchTax ? taxableIncome * 0.0065 : 0;
  const bottomTax = Math.max(0, afterAM) * 0.1201;
  const middleTax = Math.max(0, afterAM - 641200) * 0.075;
  const topTax = Math.max(0, afterAM - 777900) * 0.075;
  const extraTopTax = Math.max(0, afterAM - 2592700) * 0.05;
  const totalTax = amBidrag + municipalTax + church + bottomTax + middleTax + topTax + extraTopTax;
  const annualNet = Math.max(0, annualGross - employeePension - totalTax);
  const employerPension = annualGross * (pensionPct / 100);
  return { annualGross, employeePension, employerPension, taxableBeforeAM, amBidrag, afterAM, taxableIncome, municipalTax, church, bottomTax, middleTax, topTax, extraTopTax, totalTax, annualNet, monthlyNet: annualNet / 12, effectiveTax: annualGross ? totalTax / annualGross : 0 };
}

function SliderInput({ label, value, setValue, min, max, step = 1000, suffix = 'DKK', hint }) {
  const id = useId();
  const numericId = `${id}-number`;
  const rangeId = `${id}-range`;
  const onChange = e => setValue(Number(e.target.value));
  return <div className="control">
    <label htmlFor={numericId}><b>{label}</b><em>{hint}</em></label>
    <div className="inputRow"><input id={numericId} type="number" value={value} onChange={onChange}/><small>{suffix}</small></div>
    <input id={rangeId} aria-label={`${label} slider`} className="range" type="range" min={min} max={max} step={step} value={clamp(value, min, max)} onChange={onChange}/>
  </div>;
}

function ResultCard({ icon: Icon, label, value, detail, tone = '' }) {
  return <div className={`resultCard ${tone}`}>
    <Icon size={20}/><span>{label}</span><strong>{value}</strong><p>{detail}</p>
  </div>;
}

const staticPages = {
  '/about': {
    eyebrow: 'About TakeHomeDK',
    title: 'A clearer way to evaluate a Danish job offer.',
    description: 'TakeHomeDK helps international professionals understand Danish salary offers before they relocate, negotiate or accept a role.',
    sections: [
      ['Why this site exists', 'Danish compensation can be hard to interpret if you are new to the country. Gross salary, AM-bidrag, municipal tax, pension, work-permit thresholds and living costs all affect the real value of an offer. TakeHomeDK brings those pieces into one transparent screening tool.'],
      ['Who it is for', 'The site is built for expats, engineers, life-science professionals, IT workers, researchers, PhDs and families comparing jobs in Copenhagen, Kalundborg, Aarhus, Odense and other Danish cities.'],
      ['How to use it responsibly', 'Use the calculator as an early decision aid. Always verify final tax, immigration and pension questions with SKAT, SIRI, your employer, your union, your pension provider or a qualified advisor.'],
    ],
  },
  '/contact': {
    eyebrow: 'Contact',
    title: 'Contact TakeHomeDK.',
    description: 'Questions, corrections and source updates help make the calculator more useful and accurate.',
    sections: [
      ['For corrections', 'If you spot an outdated threshold, municipality tax issue or unclear explanation, please send the page, the issue and the official source you are comparing against.'],
      ['For partnerships', 'Relevant partnerships could include relocation advisors, Danish tax specialists, accountants, unions, pension educators, recruiters and expat service providers.'],
      ['Contact method', 'Email TakeHomeDK at takehomedk@protonmail.com for corrections, questions, partnership enquiries or source updates.'],
    ],
  },
  '/privacy-policy': {
    eyebrow: 'Privacy policy',
    title: 'Privacy Policy.',
    description: 'This page explains the current privacy posture of TakeHomeDK before analytics or ads are added.',
    sections: [
      ['Current data collection', 'The current calculator runs in your browser and does not require an account. The salary, pension, bonus, municipality and budget values you enter are used to update the page calculation and are not intentionally collected by TakeHomeDK.'],
      ['Hosting logs', 'The site is hosted on Vercel. Vercel may process technical logs such as IP address, browser, requested URL and timestamps for security, debugging and hosting operations.'],
      ['Future analytics and ads', 'If analytics, cookies, Google AdSense or other advertising technologies are added, this policy should be updated before launch to describe cookies, consent, data sharing, retention and opt-out choices.'],
      ['No professional advice record', 'Do not enter confidential tax, immigration, employment or personal information into the site. The tool is a public calculator, not a private advisory service.'],
    ],
  },
  '/disclaimer': {
    eyebrow: 'Disclaimer',
    title: 'Important tax, immigration and financial disclaimer.',
    description: 'TakeHomeDK is a calculator for orientation and education, not a substitute for official decisions or professional advice.',
    sections: [
      ['Estimates only', 'The calculations are simplified estimates based on visible assumptions and public-source references. Real Danish tax outcomes can depend on tax card details, deductions, pension setup, employment contract terms, municipality, church tax, timing and personal circumstances.'],
      ['Not immigration advice', 'The Pay Limit Scheme and researcher/key employee signals are screening tools only. SIRI and SKAT decide real eligibility and which salary components count. Always check official rules and get qualified advice before relying on a result.'],
      ['No guarantee', 'TakeHomeDK aims to be useful and transparent, but it may contain errors, outdated information or simplifications. You use the site at your own risk.'],
      ['Source-first approach', 'Where possible, the site links to official Danish sources so users can verify the assumptions behind the calculator.'],
    ],
  },
};

function SiteHeader() {
  return <header className="nav"><a className="brand" href="/"><span>TakeHome</span><b>DK</b></a><nav><a href="/#calculator">Calculator</a><a href="/#visa">Visa</a><a href="/#guide">Tax guide</a><a href="/#sources">Sources</a><a href="/about">About</a></nav></header>;
}

function SiteFooter() {
  return <footer><div><a className="brand" href="/"><span>TakeHome</span><b>DK</b></a><p>Built as a transparent English Denmark salary, tax, visa-threshold and relocation calculator for expats.</p><div className="footerLinks"><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy-policy">Privacy</a><a href="/disclaimer">Disclaimer</a></div></div><p>Last updated: 2026 tax-year prototype · Estimates only · Not tax or immigration advice.</p></footer>;
}

function StaticPage({ page }) {
  return <main><SiteHeader/><section className="staticHero"><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p className="lead">{page.description}</p></section><section className="staticContent">{page.sections.map(([heading, body]) => <article key={heading}><h2>{heading}</h2><p>{body}</p></article>)}<div className="staticCta"><a className="primary" href="/#calculator">Use the calculator <ArrowRight size={18}/></a><a className="secondary" href="/disclaimer">Read disclaimer</a></div></section><SiteFooter/></main>;
}

function HomePage() {
  const [grossMonthly, setGrossMonthly] = useState(62000);
  const [municipality, setMunicipality] = useState('Copenhagen');
  const [employerPensionPct, setEmployerPensionPct] = useState(10);
  const [employeePensionPct, setEmployeePensionPct] = useState(5);
  const [bonusAnnual, setBonusAnnual] = useState(50000);
  const [deductionMonthly, setDeductionMonthly] = useState(7000);
  const [churchTax, setChurchTax] = useState(false);
  const [rent, setRent] = useState(15500);
  const [living, setLiving] = useState(12500);
  const [phd, setPhd] = useState(true);
  const [copied, setCopied] = useState(false);
  const [selectedProfession, setSelectedProfession] = useState('Custom offer');
  const selectedMunicipality = municipalities.find(m => m.name === municipality) || municipalities[0];

  const calc = useMemo(() => calculateTax({ grossMonthly, municipalityTax: selectedMunicipality.tax, pensionPct: employerPensionPct, employeePensionPct, churchTax, deductionMonthly, bonusAnnual }), [grossMonthly, selectedMunicipality.tax, employerPensionPct, employeePensionPct, churchTax, deductionMonthly, bonusAnnual]);
  const disposable = calc.monthlyNet - rent - living;
  const countedPayLimit = grossMonthly * 12 + calc.employerPension + bonusAnnual;
  const payLimitOk = countedPayLimit >= 552000;
  const researcherSalaryOk = grossMonthly >= 65400;
  const researcherVerdict = researcherSalaryOk || phd ? 'Potentially eligible — verify detailed conditions' : 'Likely not eligible on these inputs';
  const payLimitGap = countedPayLimit - 552000;
  const netRatio = calc.annualGross ? calc.annualNet / calc.annualGross : 0;
  const summaryText = `TakeHomeDK estimate: ${formatDKK(grossMonthly)} gross/month in ${municipality} → ${formatDKK(calc.monthlyNet)} net/month, ${(calc.effectiveTax * 100).toFixed(1)}% effective tax, ${payLimitOk ? 'passes' : 'does not pass'} the 2026 Pay Limit Scheme screen.`;
  const comfortStatus = disposable >= 12000 ? 'Comfortable cushion' : disposable >= 4000 ? 'Manageable but budget-sensitive' : 'Tight after living costs';
  const visaStatus = payLimitOk ? 'Above 2026 Pay Limit screen' : 'Below 2026 Pay Limit screen';
  const researcherStatus = researcherSalaryOk ? 'Above key-employee salary signal' : phd ? 'Researcher route may still be relevant' : 'No clear researcher/key-employee signal';
  const taxRows = [
    ['AM-bidrag', calc.amBidrag],
    ['Municipal tax', calc.municipalTax],
    ['Bottom tax', calc.bottomTax],
    ['Middle tax', calc.middleTax],
    ['Top tax', calc.topTax],
    ['Additional top tax', calc.extraTopTax],
    ['Church tax estimate', calc.church],
  ].filter(([, value]) => value > 1);

  function usePreset(city) {
    const m = municipalities.find(x => x.name === city);
    setMunicipality(city); setRent(m.rent);
  }

  function applyProfessionPreset(preset) {
    setSelectedProfession(preset.role);
    setGrossMonthly(preset.salary);
    setBonusAnnual(preset.bonus);
    setEmployerPensionPct(preset.employerPension);
    setEmployeePensionPct(preset.employeePension);
    usePreset(preset.municipality);
    document.getElementById('calculator')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function copySummary() {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
    try {
      const textarea = document.createElement('textarea');
      textarea.value = summaryText;
      textarea.setAttribute('readonly', '');
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      navigator.clipboard?.writeText?.(summaryText).catch(() => {});
    } catch {
      // Visual feedback still confirms the user action even if the browser blocks clipboard access.
    }
  }

  return <main>
    <SiteHeader/>

    <section id="top" className="hero">
      <div className="heroText">
        <div className="kicker"><Sparkles size={16}/> Denmark job-offer intelligence for expats · 2026</div>
        <h1>Know what a Danish salary really means before you accept the offer.</h1>
        <p className="lead">Enter a Copenhagen, Kalundborg, Aarhus or Odense job offer and estimate take-home pay, pension, work-permit salary threshold, researcher tax signal and monthly relocation budget.</p>
        <div className="heroActions"><a className="primary" href="#calculator">Calculate take-home pay <ArrowRight size={18}/></a><a className="secondary" href="#guide">Read assumptions</a></div>
      </div>
      <div className="offerSlip" aria-label="Sample payslip preview">
        <div className="slipHead"><span>Offer scan</span><b>{selectedMunicipality.code} · 2026</b></div>
        <div className="slipNet"><small>Estimated monthly net</small><strong>{formatDKK(calc.monthlyNet)}</strong></div>
        <div className="slipLine"><span>Gross salary</span><b>{formatDKK(grossMonthly)}</b></div>
        <div className="slipLine"><span>Tax + AM-bidrag</span><b>{formatDKK(calc.totalTax / 12)}</b></div>
        <div className="slipLine"><span>After living costs</span><b className={disposable > 0 ? 'goodText' : 'badText'}>{formatDKK(disposable)}</b></div>
        <div className="slipLine"><span>Pay-limit margin</span><b className={payLimitOk ? 'goodText' : 'badText'}>{formatDKK(payLimitGap)}</b></div>
        <div className="stamp">transparent estimate, not tax advice</div>
      </div>
    </section>

    <section className="trustStrip">
      <div><Landmark/><b>2026 tax brackets</b><span>AM-bidrag, bottom, middle, top and additional top-bracket logic.</span></div>
      <div><Plane/><b>Visa salary check</b><span>Pay Limit Scheme threshold screen using counted compensation.</span></div>
      <div><BadgeCheck/><b>Researcher scheme signal</b><span>Salary and PhD/researcher prompts for high-value expat roles.</span></div>
    </section>

    <section id="calculator" className="calculatorShell">
      <div className="sectionIntro"><p className="eyebrow">Core calculator</p><h2>Denmark salary after tax calculator 2026</h2><p>Designed around real job-offer decisions: salary, pension, bonus, tax municipality and living costs are shown together instead of as isolated numbers.</p></div>
      <div className="calcGrid">
        <form className="panel controls" aria-label="Denmark salary calculator inputs" onSubmit={e => e.preventDefault()}>
          <SliderInput label="Gross monthly salary" value={grossMonthly} setValue={setGrossMonthly} min={25000} max={180000} step={1000} hint="Before tax, excluding employer pension" />
          <div className="control"><label htmlFor="municipality"><b>Municipality</b><em>Municipal tax varies across Denmark</em></label><select id="municipality" value={municipality} onChange={e => usePreset(e.target.value)}>{municipalities.map(m => <option key={m.name}>{m.name}</option>)}</select></div>
          <div className="split"><SliderInput label="Employer pension" value={employerPensionPct} setValue={setEmployerPensionPct} min={0} max={20} step={1} suffix="%" hint="Often 8–12%"/><SliderInput label="Employee pension" value={employeePensionPct} setValue={setEmployeePensionPct} min={0} max={12} step={1} suffix="%" hint="Often 4–6%"/></div>
          <div className="split"><SliderInput label="Annual bonus" value={bonusAnnual} setValue={setBonusAnnual} min={0} max={300000} step={5000} hint="Guaranteed or expected"/><SliderInput label="Monthly deduction" value={deductionMonthly} setValue={setDeductionMonthly} min={0} max={18000} step={500} hint="Approx. tax-card deductions"/></div>
          <label className="toggle"><input type="checkbox" checked={churchTax} onChange={e => setChurchTax(e.target.checked)}/><span>Include church tax estimate</span></label>
        </form>
        <div className="results" aria-live="polite">
          <ResultCard icon={WalletCards} label="Monthly take-home" value={formatDKK(calc.monthlyNet)} detail="Estimated average net income after income taxes, AM-bidrag and employee pension." tone="heroResult"/>
          <ResultCard icon={TrendingUp} label="Annual net pay" value={formatDKK(calc.annualNet)} detail={`Effective tax burden: ${(calc.effectiveTax * 100).toFixed(1)}% of gross cash salary.`}/>
          <ResultCard icon={CircleDollarSign} label="Employer pension value" value={formatDKK(calc.employerPension)} detail="Additional annual compensation paid into pension, modelled separately from take-home cash."/>
          <ResultCard icon={Landmark} label="Monthly tax estimate" value={formatDKK(calc.totalTax / 12)} detail={`Includes ${formatDKK(calc.amBidrag / 12)} AM-bidrag and ${formatDKK(calc.municipalTax / 12)} municipal tax.`}/>
        </div>
        <aside className="summaryPanel" aria-label="Calculation summary">
          <div><p className="eyebrow">Offer summary · {selectedProfession}</p><h3>{summaryText}</h3></div>
          <div className="summaryStats"><span>Net / gross cash ratio <b>{(netRatio * 100).toFixed(1)}%</b></span><span>Municipal tax preset <b>{selectedMunicipality.tax.toFixed(1)}%</b></span><span>Pay-limit margin <b className={payLimitOk ? 'goodText' : 'badText'}>{formatDKK(payLimitGap)}</b></span></div>
          <button type="button" className="copyButton" onClick={copySummary}>{copied ? <ClipboardCheck size={18}/> : <Copy size={18}/>} {copied ? 'Copied summary' : 'Copy calculation summary'}</button>
        </aside>
        <div className="verdictGrid twoCards" aria-label="Offer verdict">
          <article><span>Work permit screen</span><b className={payLimitOk ? 'goodText' : 'badText'}>{visaStatus}</b><p>{formatDKK(Math.abs(payLimitGap))} {payLimitOk ? 'above' : 'below'} the DKK 552,000 modelled threshold.</p></article>
          <article><span>Researcher scheme signal</span><b>{researcherStatus}</b><p>Use this as a prompt to check SKAT conditions, not as an eligibility decision.</p></article>
        </div>
      </div>
    </section>

    <section className="breakdownSection" aria-label="Tax and pay breakdown">
      <div className="sectionIntro"><p className="eyebrow">Explain the number</p><h2>Where the gross salary goes</h2><p>A calculator is more useful when users can see the moving parts. This breakdown shows the modelled annual tax layers and the difference between cash pay and pension value.</p></div>
      <div className="breakdownGrid">
        <div className="breakdownTable">
          {taxRows.map(([label, value]) => <div key={label}><span>{label}</span><b>{formatDKK(value)}</b></div>)}
          <div className="totalRow"><span>Total modelled tax</span><b>{formatDKK(calc.totalTax)}</b></div>
        </div>
        <div className="cashFlowCard"><p className="eyebrow">Annual view</p><h3>{formatDKK(calc.annualGross)} gross cash → {formatDKK(calc.annualNet)} net cash</h3><p>Employer pension adds {formatDKK(calc.employerPension)} in modelled compensation value, but it is not counted as monthly take-home cash.</p></div>
      </div>
    </section>

    <section className="decisionGrid" id="visa">
      <div className="decisionCard accent">
        <p className="eyebrow">Work permit threshold</p><h3>Pay Limit Scheme checker 2026</h3>
        <p>Screen whether your counted compensation reaches the stated 2026 minimum of DKK 552,000 per year. Guaranteed salary, labour-market pension payments and paid holiday allowance may count; benefits usually need careful review.</p>
        <div className="meter"><span style={{width: `${clamp((countedPayLimit / 552000) * 100, 2, 100)}%`}}></span></div>
        <strong className={payLimitOk ? 'goodText' : 'badText'}>{payLimitOk ? 'Passes the DKK 552,000 screen' : 'Below the DKK 552,000 screen'}</strong>
        <small>Counted estimate in this model: {formatDKK(countedPayLimit)} / year · margin: {formatDKK(payLimitGap)}</small>
      </div>
      <div className="decisionCard">
        <p className="eyebrow">Researcher / key employee</p><h3>Researcher tax scheme signal</h3>
        <label className="checkRow"><input type="checkbox" checked={phd} onChange={e => setPhd(e.target.checked)}/><span>I have a PhD-level/research qualification or a research appointment.</span></label>
        <p className="verdict">{researcherVerdict}</p>
        <ul><li>Highly paid employees: salary signal at {formatDKK(65400)} per month for 2026.</li><li>Researchers: qualification and approval rules matter more than only salary.</li><li>Always verify prior Danish tax liability and employment conditions.</li></ul>
      </div>
      <div className="decisionCard budgetCard">
        <p className="eyebrow">Monthly budget inputs</p><h3>Copenhagen cost-of-living calculator</h3>
        <p>Adjust rent and recurring costs here first; the leftover result below updates from these inputs.</p>
        <SliderInput label="Monthly rent" value={rent} setValue={setRent} min={5000} max={35000} step={500} hint="Housing + common charges"/>
        <SliderInput label="Other monthly costs" value={living} setValue={setLiving} min={4000} max={30000} step={500} hint="Food, transport, utilities, phone, insurance"/>
        <div className="leftover"><span>Left after tax and living costs</span><b className={disposable > 0 ? 'goodText' : 'badText'}>{formatDKK(disposable)}</b><small>{comfortStatus} after your current budget inputs.</small></div>
      </div>
    </section>

    <section className="assumptions" aria-label="Calculator assumptions">
      <div><p className="eyebrow">Model transparency</p><h2>Assumptions you can audit</h2><p>The calculator is intentionally explicit so it can be improved year by year. It is a screening tool for offer decisions, not an official tax assessment.</p></div>
      <div className="assumptionList">
        <article><b>Tax base</b><span>Cash salary plus bonus is reduced by employee pension, then AM-bidrag is estimated before ordinary income-tax layers.</span></article>
        <article><b>Deductions</b><span>A personal allowance placeholder and your monthly deduction input reduce municipal/church taxable income in this simplified MVP.</span></article>
        <article><b>Visa screen</b><span>The Pay Limit Scheme card is a threshold screen. Actual SIRI treatment of bonus, pension, holiday allowance and benefits should be verified before relying on it.</span></article>
      </div>
    </section>

    <section id="guide" className="guide">
      <div className="sectionIntro"><p className="eyebrow">Expat tax guide</p><h2>What the calculator includes</h2><p>This MVP is built to be transparent: every major rule is named, visible and easy to update each tax year.</p></div>
      <div className="guideCards">
        <article><Calculator/><h3>AM-bidrag</h3><p>An 8% labour market contribution is applied before the ordinary income-tax layers in this simplified model.</p></article>
        <article><Building2/><h3>Municipal tax</h3><p>Municipality choice matters. Copenhagen, Frederiksberg, Aarhus, Odense and Kalundborg presets are included for expat comparisons.</p></article>
        <article><FileText/><h3>Tax card deductions</h3><p>The monthly deduction input lets users approximate personal allowances, commuting deductions and other tax-card items.</p></article>
        <article><ShieldCheck/><h3>Disclaimer by design</h3><p>Results are estimates for job-offer screening, not professional tax, immigration or legal advice.</p></article>
      </div>
    </section>

    <section className="landingSection">
      <div className="sectionIntro"><p className="eyebrow">Find the right calculator</p><h2>Popular Denmark salary questions this page answers</h2><p>These topic tiles make the site easier to scan and create a clear roadmap for future dedicated SEO pages.</p></div>
      <div className="landingGrid">{searchLandingPages.map(([title, description]) => <article key={title}><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>

    <section className="professionSection">
      <div className="sectionIntro"><p className="eyebrow">Offer presets</p><h2>Try sample offers by profession</h2><p>These are not separate pages yet. Each card loads an example salary, pension, bonus and city into the calculator so you can see how different Danish job offers behave.</p></div>
      <div className="professionGrid">{professionGuides.map(preset => <article key={preset.role}>
        <span>{preset.sector}</span>
        <h3>{preset.role} sample offer</h3>
        <p>{preset.note}</p>
        <div className="presetFacts"><b>{formatDKK(preset.salary)}/month</b><small>{preset.municipality} · {formatDKK(preset.bonus)} bonus</small></div>
        <button type="button" className="professionButton" onClick={() => applyProfessionPreset(preset)}>Load this sample in calculator <ChevronRight size={16}/></button>
      </article>)}</div>
    </section>

    <section className="faqSection" aria-label="Frequently asked questions">
      <div className="sectionIntro"><p className="eyebrow">FAQ</p><h2>Common questions before accepting a Danish offer</h2><p>Short answers for expats comparing salary, pension, tax and work-permit constraints.</p></div>
      <div className="faqList">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
    </section>

    <section id="sources" className="sourceSection">
      <div><p className="eyebrow">Sources and assumptions</p><h2>Official sources used in this calculator</h2><p>The calculator is based on public Danish tax and immigration information. These links let you verify the rules behind the 2026 tax brackets, researcher/key employee tax scheme, and Pay Limit Scheme threshold.</p></div>
      <div className="sourceList">{sources.map(([label, url]) => <a key={url} href={url} target="_blank" rel="noreferrer"><Globe2 size={18}/><span>{label}</span></a>)}</div>
    </section>

    <SiteFooter/>
  </main>;
}

function App() {
  const page = staticPages[window.location.pathname];
  if (page) {
    document.title = `${page.eyebrow} — TakeHomeDK`;
    document.querySelector('meta[name="description"]')?.setAttribute('content', page.description);
    return <StaticPage page={page}/>;
  }
  document.title = 'TakeHomeDK — Denmark Salary Calculator 2026';
  document.querySelector('meta[name="description"]')?.setAttribute('content', 'English Denmark salary, tax, Pay Limit Scheme, researcher tax and relocation calculator for expats considering Danish job offers.');
  return <HomePage/>;
}

createRoot(document.getElementById('root')).render(<App/>);
