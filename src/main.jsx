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
  ['Copenhagen salary calculator', 'High-rent city budget with Copenhagen municipal tax preset.', '/copenhagen-salary-calculator'],
  ['Kalundborg salary calculator', 'Useful for pharma, engineering and manufacturing offers.', '/kalundborg-salary-calculator'],
  ['Denmark Pay Limit Scheme checker', 'Quick screen against the 2026 work-permit salary threshold.', '/denmark-pay-limit-scheme-checker-2026'],
  ['Researcher tax scheme calculator', 'Salary and PhD/researcher status signal for international hires.', '/denmark-researcher-tax-scheme'],
  ['Denmark job offer calculator', 'Base salary, pension, bonus, tax and living costs in one view.', '/denmark-salary-calculator-2026'],
  ['Denmark cost of living calculator', 'Estimate what remains after rent and recurring monthly costs.', '/copenhagen-cost-of-living-calculator'],
  ['Copenhagen rent guide by salary', 'Choose where to live to save more from a Danish job offer.', '/copenhagen-rent-guide-salary-location'],
];

const salaryGuideLinks = [
  ['Data scientist salary Denmark', '/data-scientist-salary-denmark'],
  ['Data analyst salary Denmark', '/data-analyst-salary-denmark'],
  ['AI engineer salary Denmark', '/ai-engineer-salary-denmark'],
  ['Data engineer salary Denmark', '/data-engineer-salary-denmark'],
  ['Environmental engineer salary Denmark', '/environmental-engineer-salary-denmark'],
  ['QA specialist salary Denmark', '/qa-specialist-salary-denmark'],
  ['Automation engineer salary Denmark', '/automation-engineer-salary-denmark'],
  ['Mechanical engineer salary Denmark', '/mechanical-engineer-salary-denmark'],
  ['Electrical engineer salary Denmark', '/electrical-engineer-salary-denmark'],
  ['Civil engineer salary Denmark', '/civil-engineer-salary-denmark'],
  ['Project manager salary Denmark', '/project-manager-salary-denmark'],
  ['Scientist salary Denmark', '/scientist-salary-denmark'],
  ['Business analyst salary Denmark', '/business-analyst-salary-denmark'],
];


const guideCategories = [
  {
    eyebrow: 'Start here',
    slug: '/guides/salary-calculators',
    title: 'Core Denmark offer calculators',
    description: 'Use these pages first when you need to understand Danish take-home pay, taxes, pension value, work-permit salary thresholds and monthly budget pressure.',
    links: [
      ['Denmark salary calculator 2026', 'Full after-tax offer calculator for expats.', '/denmark-salary-calculator-2026'],
      ['Copenhagen salary calculator', 'City-specific salary and rent-pressure guide.', '/copenhagen-salary-calculator'],
      ['Kalundborg salary calculator', 'Pharma and manufacturing salary guide for West Zealand.', '/kalundborg-salary-calculator'],
      ['Copenhagen cost of living calculator', 'Budget what remains after rent and recurring costs.', '/copenhagen-cost-of-living-calculator'],
      ['Copenhagen and Zealand rent guide', 'Compare rent ranges and savings trade-offs by job location.', '/copenhagen-rent-guide-salary-location'],
    ]
  },
  {
    eyebrow: 'Visa and tax',
    slug: '/guides/visa-tax',
    title: 'Work-permit and Danish tax guides',
    description: 'Pages for candidates who need to understand whether an offer is high enough for immigration routes and how Danish tax layers affect the real result.',
    links: [
      ['Pay Limit Scheme checker 2026', 'Screen offers against the 2026 salary threshold.', '/denmark-pay-limit-scheme-checker-2026'],
      ['Researcher tax scheme guide', 'Understand salary and researcher/key employee scheme signals.', '/denmark-researcher-tax-scheme'],
      ['Denmark tax guide for expats 2026', 'Plain-English AM-bidrag, municipal tax and pension guide.', '/denmark-tax-guide-expats-2026'],
    ]
  },
  {
    eyebrow: 'Life science and engineering',
    slug: '/guides/engineering-pharma',
    title: 'Engineering and pharma salary guides',
    description: 'Role-specific pages for expats comparing Danish engineering, pharma, QA, automation and scientist offers.',
    links: [
      ['Process engineer salary Denmark', 'Pharma, energy and production offer guide.', '/process-engineer-salary-denmark'],
      ['Pharma engineer salary Denmark', 'Life-science engineering salary and pension guide.', '/pharma-engineer-salary-denmark'],
      ['QA specialist salary Denmark', 'GMP, validation and regulated-industry salary guide.', '/qa-specialist-salary-denmark'],
      ['Automation engineer salary Denmark', 'PLC, robotics and manufacturing IT salary guide.', '/automation-engineer-salary-denmark'],
      ['Environmental engineer salary Denmark', 'Sustainability, consulting and permitting salary guide.', '/environmental-engineer-salary-denmark'],
      ['Mechanical engineer salary Denmark', 'Manufacturing, energy and equipment salary guide.', '/mechanical-engineer-salary-denmark'],
      ['Electrical engineer salary Denmark', 'Energy, automation and utilities salary guide.', '/electrical-engineer-salary-denmark'],
      ['Civil engineer salary Denmark', 'Construction, infrastructure and consulting salary guide.', '/civil-engineer-salary-denmark'],
      ['Scientist salary Denmark', 'R&D, biotech and PhD-level offer guide.', '/scientist-salary-denmark'],
    ]
  },
  {
    eyebrow: 'Tech and business',
    slug: '/guides/tech-data-business',
    title: 'Tech, data and business salary guides',
    description: 'Guides for international candidates evaluating Danish data, AI, software, project and business roles.',
    links: [
      ['Data scientist salary Denmark', 'Tax, pension, bonus and work-permit context.', '/data-scientist-salary-denmark'],
      ['Data analyst salary Denmark', 'Analytics salary and cost-of-living guide.', '/data-analyst-salary-denmark'],
      ['AI engineer salary Denmark', 'AI/ML salary, relocation and tax guide.', '/ai-engineer-salary-denmark'],
      ['Data engineer salary Denmark', 'Cloud, platform and data infrastructure guide.', '/data-engineer-salary-denmark'],
      ['Software engineer salary Copenhagen', 'Copenhagen tech salary and living-budget guide.', '/software-engineer-salary-copenhagen'],
      ['Project manager salary Denmark', 'Capex, IT and delivery manager salary guide.', '/project-manager-salary-denmark'],
      ['Business analyst salary Denmark', 'Business, finance and consulting salary guide.', '/business-analyst-salary-denmark'],
    ]
  }
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


const rentGuideAreas = [
  { area: 'Copenhagen municipality', oneBed: '10,000–15,000', twoBed: '14,000–22,000', family: '18,000–30,000+', bestFor: 'Jobs in central Copenhagen, universities, hospitals, consultancies, tech offices; best when commute time matters more than maximum savings.', saveTip: 'To save, compare outer districts such as Amager, Sydhavn, Nordvest and Valby before paying inner-city prices.' },
  { area: 'Frederiksberg', oneBed: '11,000–16,000', twoBed: '15,000–24,000', family: '20,000–32,000+', bestFor: 'High-salary Copenhagen jobs where central access, metro, schools and neighbourhood quality are important.', saveTip: 'Excellent location but rarely the cheapest choice; choose it when salary is strong or commute/family convenience is worth the premium.' },
  { area: 'Gentofte', oneBed: '12,000–18,000', twoBed: '17,000–27,000', family: '24,000–40,000+', bestFor: 'Senior roles in north Copenhagen, families prioritising schools, space and quiet residential areas.', saveTip: 'Often expensive; if the job is not north of Copenhagen, compare Lyngby, Roskilde or outer Copenhagen before committing.' },
  { area: 'Lyngby / Kongens Lyngby', oneBed: '10,000–15,000', twoBed: '14,000–22,000', family: '18,000–30,000', bestFor: 'DTU, pharma, engineering, biotech and north-Copenhagen office jobs with train or car access.', saveTip: 'A strong compromise when north-Copenhagen jobs are relevant: usually less central than Copenhagen/Frederiksberg but still not cheap.' },
  { area: 'Hørsholm', oneBed: '9,500–14,000', twoBed: '13,000–20,000', family: '17,000–28,000', bestFor: 'Jobs in Hørsholm, DTU science park, life-science clusters and north Zealand families with car access.', saveTip: 'Can be good value versus Gentofte, but check transport carefully if you do not have a car.' },
  { area: 'Roskilde', oneBed: '8,500–12,500', twoBed: '11,500–17,000', family: '15,000–24,000', bestFor: 'People working west of Copenhagen, hybrid Copenhagen workers, families wanting lower rent with train access.', saveTip: 'One of the best savings compromises for Copenhagen-area jobs if you accept the commute.' },
  { area: 'Kalundborg', oneBed: '6,500–10,000', twoBed: '8,500–13,500', family: '11,000–18,000', bestFor: 'Pharma, process engineering, manufacturing, automation and QA jobs in Kalundborg.', saveTip: 'Usually the strongest rent-saving choice for Kalundborg jobs; avoid paying Copenhagen rent unless your personal life requires it.' },
  { area: 'Holbæk', oneBed: '6,500–9,500', twoBed: '8,500–13,000', family: '11,000–17,000', bestFor: 'West Zealand jobs, Kalundborg-adjacent roles, families wanting lower rent and more space.', saveTip: 'Often a practical middle ground between Copenhagen prices and Kalundborg/local west-Zealand work locations.' },
  { area: 'Odense', oneBed: '7,000–10,500', twoBed: '9,000–14,500', family: '12,000–20,000', bestFor: 'Jobs in Odense, Funen, robotics, university, healthcare, engineering and family relocation budgets.', saveTip: 'If the job is in Odense, living locally usually beats a Copenhagen-based lifestyle financially. “Oddense” is commonly spelled Odense.' },
];

const rentSourceLinks = [
  ['Statistics Denmark rent indices', 'https://www.dst.dk/en/Statistik/emner/oekonomi/ejendomme/huslejeindeks'],
  ['Borger.dk rental housing guidance', 'https://www.borger.dk/bolig-og-flytning/Lejebolig/Soeg-en-lejebolig'],
  ['BoligPortal rental listings', 'https://www.boligportal.dk/'],
  ['Lejebolig.dk rental listings', 'https://www.lejebolig.dk/'],
  ['Wise Denmark cost-of-living guide', 'https://wise.com/gb/blog/cost-of-living-in-denmark'],
  ['Nestpick Copenhagen rent overview', 'https://www.nestpick.com/copenhagen/'],
];

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
    description: 'This page explains how TakeHomeDK handles calculator inputs, hosting logs and Google Analytics traffic measurement.',
    sections: [
      ['Current data collection', 'The current calculator runs in your browser and does not require an account. The salary, pension, bonus, municipality and budget values you enter are used to update the page calculation and are not intentionally collected by TakeHomeDK.'],
      ['Hosting logs', 'The site is hosted on Vercel. Vercel may process technical logs such as IP address, browser, requested URL and timestamps for security, debugging and hosting operations.'],
      ['Google Analytics', 'TakeHomeDK uses Google Analytics 4 to understand aggregated website traffic, popular pages, referral sources and basic engagement. Google Analytics may use cookies or similar technologies to measure visits. Do not enter confidential tax, immigration, employment or personal information into the calculator.'],
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
  '/copenhagen-rent-guide-salary-location': {
    eyebrow: 'Copenhagen area rent guide',
    title: 'Where to live near Copenhagen, Zealand and Odense to save the most from your salary.',
    description: 'Compare rent ranges in Copenhagen, Frederiksberg, Gentofte, Lyngby, Hørsholm, Roskilde, Kalundborg, Holbæk and Odense before accepting a Danish job offer.',
    rentGuide: true,
    sections: [
      ['The rent decision is usually the biggest salary decision', 'For many international professionals, rent is the single largest monthly cost after Danish tax. A 60,000 DKK gross salary can feel comfortable in Kalundborg, Holbæk or Odense but much tighter in central Copenhagen, Frederiksberg or Gentofte. The best place to live is therefore not always the nicest area; it is the area that fits your job location, commute tolerance, family needs and monthly savings target.'],
      ['A practical rent rule for newcomers', 'As a first screening rule, try to keep cold rent below 30–35% of expected monthly net pay if you are single, and below 35–40% for a couple or family only when the second income or child-related needs justify it. If rent plus utilities consumes more than 45% of net pay, the offer may still work, but savings and lifestyle flexibility become much weaker.'],
      ['How to compare locations against a job offer', 'Start with the job location, not the dream neighbourhood. If the job is in Copenhagen, compare Copenhagen, Frederiksberg, Lyngby and Roskilde. If it is north of Copenhagen, compare Lyngby, Hørsholm and Gentofte. If it is in Kalundborg or west Zealand, compare Kalundborg and Holbæk before paying Copenhagen rent. If it is in Odense, living locally is usually the simplest financial choice.'],
      ['Important caveat about rent ranges', 'The ranges below are indicative market-screening ranges for private rental apartments and family homes. Real listings vary by size, condition, furnished status, utilities, deposit, location, lease type and whether the home is private, social housing or cooperative. Always check current listings before signing.'],
    ],
    faqs: [
      ['Is Copenhagen always the best place for expats?', 'No. Copenhagen is convenient and international, but it is often the most expensive choice. If your job is in Kalundborg, Holbæk, Roskilde, Odense, Lyngby or Hørsholm, living closer to work can save a large amount every month.'],
      ['Should I live in Copenhagen and commute to Kalundborg?', 'Usually not if your goal is to save money. Copenhagen rent plus a long commute can erase much of the value of a strong pharma or manufacturing salary. Kalundborg or Holbæk will often create a better savings profile.'],
      ['Is Frederiksberg worth the premium?', 'Frederiksberg can be worth it for high earners who value central location, metro access and lifestyle. For maximum savings, compare outer Copenhagen, Lyngby or Roskilde before choosing Frederiksberg.'],
      ['How should families think about rent?', 'Families should compare rent, school/daycare access, commute reliability and space together. A cheaper area that requires two cars or a painful commute may not actually be cheaper in lived reality.'],
      ['What is the safest first move when relocating?', 'If possible, use temporary housing for the first 1–3 months. It gives you time to visit neighbourhoods, understand commute routes and avoid signing an expensive lease under pressure.'],
    ],
    related: [
      ['Copenhagen cost of living calculator', '/copenhagen-cost-of-living-calculator'],
      ['Copenhagen salary calculator', '/copenhagen-salary-calculator'],
      ['Kalundborg salary calculator', '/kalundborg-salary-calculator'],
      ['Denmark salary calculator 2026', '/denmark-salary-calculator-2026'],
      ['Guides hub', '/guides'],
    ],
    sourceNote: 'Rent ranges are indicative planning ranges based on public rent-index context from Statistics Denmark, Danish public rental-search guidance and current market-listing portals. They are designed for salary screening, not as a guarantee that a specific listing will be available.',
  },

};

const seoPages = {
  '/denmark-salary-calculator-2026': {
    eyebrow: 'Denmark salary calculator 2026',
    title: 'Denmark salary after tax calculator for expats in 2026.',
    description: 'Estimate Danish take-home pay from gross salary, pension, bonus, municipality, AM-bidrag and tax-card deductions before accepting a job offer.',
    sections: [
      ['What this page helps you calculate', 'A Danish job offer is rarely understandable from the gross monthly salary alone. The real decision depends on income tax, AM-bidrag, employee pension, employer pension, bonus, tax deductions, municipality and living costs. This page explains how to use TakeHomeDK as an offer-screening calculator before you accept, negotiate or relocate.'],
      ['Which salary number to enter', 'Enter the gross monthly salary before tax and before employer pension. If the contract lists an annual salary, divide the cash salary by 12 and enter expected or guaranteed bonus separately. Employer pension should be entered as a percentage because it adds compensation value but is normally not paid as monthly take-home cash.'],
      ['How to interpret the result', 'Focus on monthly net pay, annual net pay, effective tax burden, employer pension value and the budget result after rent and recurring costs. The calculator is not an official SKAT assessment; it is a transparent estimate that helps you compare offers and identify questions to ask your employer, union, tax advisor or relocation contact.'],
      ['Best next step', 'After calculating your base case, test a conservative scenario with higher rent, lower deductions and no bonus. If the offer still leaves a comfortable monthly buffer, it is more resilient. If it only works with optimistic assumptions, negotiate salary, pension, relocation support or a signing bonus before accepting.'],
    ],
  },
  '/copenhagen-salary-calculator': {
    eyebrow: 'Copenhagen salary calculator',
    title: 'Copenhagen salary calculator: estimate take-home pay and rent pressure.',
    description: 'Calculate what a Copenhagen job offer may leave after Danish taxes, pension and typical high city living costs.',
    sections: [
      ['Why Copenhagen needs its own calculation', 'Copenhagen is Denmark’s largest expat job market, but it is also one of the most expensive places to rent. A salary that looks high on paper can feel very different once municipal tax, pension contributions, rent, utilities, food, transport and insurance are considered together.'],
      ['What to include in your Copenhagen budget', 'Start with rent and common charges, then add utilities, phone, internet, transport, groceries, insurance, A-kasse or union fees, fitness and travel. For newcomers, the first months may also include deposits, furniture, CPR-related setup delays and temporary accommodation.'],
      ['How to use the calculator for negotiation', 'Set the municipality to Copenhagen, enter the gross monthly salary, pension percentages and bonus, then adjust monthly rent to match realistic housing options. If the leftover amount is thin, use the result as a salary-negotiation prompt rather than a final answer.'],
      ['Who this is most useful for', 'This page is especially useful for engineers, software developers, data professionals, pharma specialists, researchers and families comparing Copenhagen against other Danish cities or offers in Sweden, Germany or the Netherlands.'],
    ],
  },
  '/kalundborg-salary-calculator': {
    eyebrow: 'Kalundborg salary calculator',
    title: 'Kalundborg salary calculator for pharma and engineering job offers.',
    description: 'Estimate take-home pay, pension value and living budget for Kalundborg job offers in pharma, engineering and manufacturing.',
    sections: [
      ['Why Kalundborg is different', 'Kalundborg is a major Danish manufacturing and pharma hub, and many international candidates compare offers there with Copenhagen-based roles. Housing costs may be lower than central Copenhagen, but commuting, car needs, family logistics and relocation preferences still matter.'],
      ['How to model a Kalundborg offer', 'Choose Kalundborg in the municipality field, enter gross monthly salary, pension percentages and bonus, then adjust rent to your real housing plan. For some professionals, living in or near Kalundborg creates a stronger monthly budget than commuting from Copenhagen.'],
      ['What pharma candidates should check', 'For process engineers, automation engineers, QA specialists, validation professionals and scientists, pension, bonus, paid holidays, relocation support and contract type can materially affect the total offer. Compare total compensation rather than only the monthly salary.'],
      ['Visa and researcher-tax relevance', 'Many Kalundborg offers are high enough to trigger Pay Limit Scheme or researcher/key employee questions. Use the calculator as an early screen, then verify the actual immigration and tax treatment with SIRI, SKAT and the employer before relying on it.'],
    ],
  },
  '/denmark-pay-limit-scheme-checker-2026': {
    eyebrow: 'Pay Limit Scheme Denmark 2026',
    title: 'Denmark Pay Limit Scheme salary checker for 2026.',
    description: 'Check whether a Danish job offer appears to meet the 2026 Pay Limit Scheme salary threshold before applying for a work permit.',
    sections: [
      ['What the Pay Limit Scheme screen does', 'The Pay Limit Scheme is relevant for many non-EU candidates considering work in Denmark. TakeHomeDK includes a simple threshold screen using the 2026 minimum of DKK 552,000 per year, based on the salary components modelled in the calculator.'],
      ['Which compensation may matter', 'Guaranteed salary, labour-market pension payments and paid holiday allowance may be relevant, while benefits, variable bonus and non-guaranteed compensation need careful review. The calculator gives a screening estimate, not a legal decision.'],
      ['How to reduce risk before accepting', 'Ask the employer to confirm which salary components are used in the work permit application and whether the contract clearly supports the required threshold. Keep written documentation and check the current SIRI guidance before relying on any calculator.'],
      ['When to get professional help', 'If your offer is close to the threshold, includes unusual benefits, has a large bonus component, or involves part-time work, get qualified immigration advice before assuming the offer qualifies. A small difference can matter for application timing and approval.'],
    ],
  },
  '/denmark-researcher-tax-scheme': {
    eyebrow: 'Researcher tax scheme Denmark',
    title: 'Denmark researcher and key employee tax scheme: salary signal and checks.',
    description: 'Understand how to screen a Danish offer for researcher or key employee tax scheme relevance before taking professional advice.',
    sections: [
      ['What the calculator can signal', 'The Danish researcher/key employee tax scheme can be important for highly paid international hires and qualified researchers. TakeHomeDK provides a simple signal based on salary level and whether a PhD-level or research qualification may be relevant.'],
      ['Salary is not the only condition', 'For highly paid employees, the salary level is a key signal. For researchers, qualification, appointment type, approval and prior Danish tax liability can matter. This is why the calculator says potentially eligible rather than eligible.'],
      ['Questions to ask before relocation', 'Ask the employer whether the scheme is expected to apply, who handles the application, how pension and bonus are treated, and whether your prior Danish tax status creates any issue. Confirm with SKAT or a qualified advisor before making decisions.'],
      ['Why this page matters for PhDs and specialists', 'International PhDs, scientists, engineers and life-science specialists often compare offers across countries. A special tax scheme can materially change the effective value of a Danish offer, so it deserves early attention during negotiation.'],
    ],
  },
  '/copenhagen-cost-of-living-calculator': {
    eyebrow: 'Copenhagen cost of living calculator',
    title: 'Copenhagen cost of living calculator for salary decisions.',
    description: 'Estimate what remains from a Danish salary after tax, pension, rent and recurring monthly costs in Copenhagen.',
    sections: [
      ['Why take-home pay is not enough', 'A salary can look attractive after tax but still feel tight if rent and recurring costs are underestimated. Copenhagen housing costs are often the biggest uncertainty for newcomers, especially families and people arriving before they know the rental market.'],
      ['Costs to include', 'Include rent, utilities, heating, internet, mobile phone, transport, groceries, insurance, A-kasse or union membership, childcare if relevant, fitness, subscriptions and travel. Also remember one-off relocation costs such as deposit, furniture and temporary accommodation.'],
      ['How to stress-test your budget', 'Run three scenarios: optimistic, realistic and conservative. In the conservative scenario, use higher rent, higher recurring costs and no bonus. If the leftover amount is still positive, the offer is more robust.'],
      ['How this supports negotiation', 'If the budget result is weak, negotiate before accepting. Possible levers include base salary, employer pension, relocation support, signing bonus, temporary housing, paid travel, flexible location or support for spouse/family relocation.'],
    ],
  },
  '/denmark-tax-guide-expats-2026': {
    eyebrow: 'Denmark tax guide for expats 2026',
    title: 'Denmark tax guide for expats: AM-bidrag, municipal tax and salary offers.',
    description: 'A plain-English guide to the Danish salary tax layers expats need to understand before accepting a job offer in 2026.',
    sections: [
      ['The main tax layers', 'A Danish salary estimate usually starts with AM-bidrag, then ordinary income tax layers, municipal tax, possible church tax and personal deductions. The exact result depends on the individual tax card and personal situation.'],
      ['Why municipality matters', 'Municipal tax differs across Denmark. This is why the calculator includes city presets such as Copenhagen, Frederiksberg, Aarhus, Odense, Aalborg, Kalundborg, Gentofte and Roskilde. The same gross salary can produce a different net estimate depending on municipality.'],
      ['How pension affects take-home pay', 'Employee pension reduces monthly cash but builds retirement savings. Employer pension increases compensation value but is not normally take-home cash. When comparing offers, separate monthly spending power from total compensation value.'],
      ['What expats should verify', 'Before accepting, verify your preliminary income assessment, tax card, deductions, pension setup, relocation support and any researcher/key employee or work permit assumptions. Use TakeHomeDK to identify the questions, then confirm with official sources.'],
    ],
  },
  '/process-engineer-salary-denmark': {
    eyebrow: 'Process engineer salary Denmark',
    title: 'Process engineer salary in Denmark: estimate take-home pay from an offer.',
    description: 'Use TakeHomeDK to evaluate Danish process engineer salary offers in pharma, energy, food production and manufacturing.',
    sections: [
      ['Why process engineers need total-offer analysis', 'Process engineering offers in Denmark often include pension, bonus, location differences and sometimes relocation support. Gross salary alone does not show how the offer feels after tax, rent and recurring costs.'],
      ['Key inputs to compare', 'Enter base monthly salary, employer pension, employee pension, annual bonus, municipality and expected rent. For pharma or manufacturing hubs, compare both Copenhagen and Kalundborg-style scenarios if location is flexible.'],
      ['Questions to ask the employer', 'Ask how bonus is calculated, whether pension starts immediately, whether relocation support is taxable, how overtime or on-call work is handled, and whether the role supports any work permit or researcher-tax considerations.'],
      ['How to use the result', 'If take-home pay is acceptable but the budget is tight, negotiate relocation assistance or a signing bonus. If the salary is close to a visa threshold, verify counted components before accepting.'],
    ],
  },
  '/pharma-engineer-salary-denmark': {
    eyebrow: 'Pharma engineer salary Denmark',
    title: 'Pharma engineer salary in Denmark: tax, pension and relocation calculator.',
    description: 'Estimate the net value of Danish pharma engineering job offers, including pension, bonus, visa threshold and living-cost pressure.',
    sections: [
      ['Why pharma offers can be complex', 'Pharma engineering roles may include base salary, employer pension, employee pension, bonus, relocation support and different work locations. A strong gross salary can still produce different real outcomes depending on tax municipality and housing costs.'],
      ['What to model first', 'Start with the contract salary and pension percentages. Add guaranteed or expected bonus separately, choose the work or residence municipality, and model realistic living costs. Then check the Pay Limit Scheme screen if work permission matters.'],
      ['Useful checks for international candidates', 'Confirm whether relocation assistance is offered, whether bonus is guaranteed, how pension is structured, and whether the employer has experience supporting international hires. For specialist or PhD-level roles, ask about researcher/key employee tax scheme relevance.'],
      ['Why this matters before acceptance', 'Once you relocate, housing deposits, family logistics and administrative setup make changes harder. A clear pre-acceptance calculation helps you negotiate while you still have leverage.'],
    ],
  },
  '/software-engineer-salary-copenhagen': {
    eyebrow: 'Software engineer salary Copenhagen',
    title: 'Software engineer salary in Copenhagen: estimate net pay and living budget.',
    description: 'Calculate how much a Copenhagen software engineer offer may leave after Danish tax, pension and city living costs.',
    sections: [
      ['Why Copenhagen tech salaries need context', 'Software engineer offers in Copenhagen can look attractive, but rent, taxes, pension and bonus structure determine the real monthly outcome. International candidates should compare net pay and budget buffer, not only gross salary.'],
      ['Inputs that matter most', 'Enter gross monthly salary, pension percentages, bonus and Copenhagen municipality. Then test rent levels that match realistic apartments for your household size. The leftover monthly amount is often the clearest decision metric.'],
      ['Comparing Denmark with other countries', 'Tech candidates often compare Copenhagen with Berlin, Amsterdam, Stockholm or remote roles. Denmark may offer strong work-life balance and benefits, but the take-home and cost-of-living calculation should be explicit before deciding.'],
      ['Negotiation ideas', 'If base salary is difficult to move, consider negotiating pension, signing bonus, relocation package, temporary housing, flexible work location, equipment budget or extra vacation.'],
    ],
  },
  '/data-scientist-salary-denmark': {
    eyebrow: 'Data scientist salary Denmark',
    title: 'Data scientist salary in Denmark: estimate take-home pay and offer value.',
    description: 'Evaluate Danish data scientist offers with tax, pension, bonus, city costs and work-permit salary threshold context.',
    sections: [
      ['Why this role needs a full salary calculation', 'Data scientist salaries in Denmark can include base pay, pension, bonus and sometimes stock or one-off relocation support. The monthly gross salary is only the first number; the real offer depends on Danish tax, employee pension, municipality and living costs.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/data-analyst-salary-denmark': {
    eyebrow: 'Data analyst salary Denmark',
    title: 'Data analyst salary in Denmark: net pay and cost-of-living estimate.',
    description: 'Screen Danish data analyst job offers by modelling take-home pay, pension, bonus and living costs.',
    sections: [
      ['Why this role needs a full salary calculation', 'Data analyst roles vary between public sector, consulting, finance, life science and tech companies. A slightly lower gross salary may still be attractive if pension, work-life balance, city choice and budget result are strong.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/ai-engineer-salary-denmark': {
    eyebrow: 'AI engineer salary Denmark',
    title: 'AI engineer salary in Denmark: estimate tax, pension and relocation budget.',
    description: 'Calculate the real monthly value of AI engineer and machine-learning engineer offers in Denmark.',
    sections: [
      ['Why this role needs a full salary calculation', 'AI engineer and machine-learning engineer roles may include higher base salary, bonus, stock-like incentives, pension and relocation support. Danish tax and living costs determine how much becomes usable monthly cash.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/data-engineer-salary-denmark': {
    eyebrow: 'Data engineer salary Denmark',
    title: 'Data engineer salary in Denmark: take-home pay, pension and bonus calculator.',
    description: 'Estimate Danish data engineer offer value after tax, employee pension, employer pension and living costs.',
    sections: [
      ['Why this role needs a full salary calculation', 'Data engineers are in demand across pharma, finance, consulting, SaaS and industrial companies in Denmark. Offers can differ by cloud stack, seniority, pension and bonus, so total compensation is more useful than gross salary alone.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/environmental-engineer-salary-denmark': {
    eyebrow: 'Environmental engineer salary Denmark',
    title: 'Environmental engineer salary in Denmark: estimate net pay and relocation budget.',
    description: 'Evaluate Danish environmental engineering offers with taxes, pension, municipality and cost-of-living context.',
    sections: [
      ['Why this role needs a full salary calculation', 'Environmental engineers may work in consulting, water, waste, energy, manufacturing, pharma, permitting, sustainability or public-sector roles. Salary and pension structures can vary significantly by employer type.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/qa-specialist-salary-denmark': {
    eyebrow: 'QA specialist salary Denmark',
    title: 'QA specialist salary in Denmark: GMP, validation and pharma offer calculator.',
    description: 'Estimate take-home pay and total offer value for QA specialist roles in Danish pharma, biotech and regulated industries.',
    sections: [
      ['Why this role needs a full salary calculation', 'QA, GMP, validation and compliance roles are common entry points for international life-science professionals in Denmark. Offers often combine stable salary, pension and bonus, but the after-tax result needs modelling.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/automation-engineer-salary-denmark': {
    eyebrow: 'Automation engineer salary Denmark',
    title: 'Automation engineer salary in Denmark: net pay and job-offer calculator.',
    description: 'Calculate real offer value for Danish automation, PLC, robotics and manufacturing IT roles.',
    sections: [
      ['Why this role needs a full salary calculation', 'Automation engineers can work in pharma, robotics, manufacturing, energy and industrial IT. Compensation may reflect shift needs, travel, on-call responsibility, project delivery and plant location.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/mechanical-engineer-salary-denmark': {
    eyebrow: 'Mechanical engineer salary Denmark',
    title: 'Mechanical engineer salary in Denmark: after-tax offer calculator.',
    description: 'Estimate Danish mechanical engineering take-home pay, pension value, bonus and living-cost impact.',
    sections: [
      ['Why this role needs a full salary calculation', 'Mechanical engineers in Denmark work across manufacturing, energy, pharma equipment, consulting, infrastructure and product development. Pension, location and bonus can change the offer value materially.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/electrical-engineer-salary-denmark': {
    eyebrow: 'Electrical engineer salary Denmark',
    title: 'Electrical engineer salary in Denmark: net pay, pension and relocation estimate.',
    description: 'Screen Danish electrical engineering offers with take-home pay, pension, tax and living-cost calculations.',
    sections: [
      ['Why this role needs a full salary calculation', 'Electrical engineers may find roles in energy, automation, pharma, manufacturing, utilities, construction, robotics and consulting. Salary levels and bonus structures vary by sector and seniority.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/civil-engineer-salary-denmark': {
    eyebrow: 'Civil engineer salary Denmark',
    title: 'Civil engineer salary in Denmark: after-tax salary and cost-of-living calculator.',
    description: 'Estimate real monthly value from civil engineering offers in Denmark before relocating or negotiating.',
    sections: [
      ['Why this role needs a full salary calculation', 'Civil engineers in Denmark may work in infrastructure, consulting, construction, sustainability, water, transport and public-sector projects. Salary is only part of the offer; pension and living costs matter.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/project-manager-salary-denmark': {
    eyebrow: 'Project manager salary Denmark',
    title: 'Project manager salary in Denmark: estimate net pay and total compensation.',
    description: 'Evaluate Danish project manager offers with salary, pension, bonus, tax municipality and relocation budget in one calculator.',
    sections: [
      ['Why this role needs a full salary calculation', 'Project managers in Denmark work across pharma, IT, engineering, construction, consulting and transformation roles. Seniority, bonus, pension and sector can make offers hard to compare from gross salary alone.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/scientist-salary-denmark': {
    eyebrow: 'Scientist salary Denmark',
    title: 'Scientist salary in Denmark: PhD, biotech and pharma offer calculator.',
    description: 'Estimate take-home pay and researcher-tax-scheme relevance for scientist and PhD-level roles in Denmark.',
    sections: [
      ['Why this role needs a full salary calculation', 'Scientist roles may involve PhD-level qualifications, research appointments, pharma R&D, biotech, universities or startups. Tax scheme eligibility and pension can matter as much as base salary.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
  '/business-analyst-salary-denmark': {
    eyebrow: 'Business analyst salary Denmark',
    title: 'Business analyst salary in Denmark: estimate take-home pay and budget.',
    description: 'Calculate the net monthly value of Danish business analyst offers after tax, pension and living costs.',
    sections: [
      ['Why this role needs a full salary calculation', 'Business analyst roles exist in finance, pharma, consulting, IT, public sector and operations. Sector, seniority, bonus and pension can shift the real value of an offer.'],
      ['What to enter in the calculator', 'Enter the gross monthly salary, employer pension, employee pension, annual bonus and the municipality where you expect to live. Then test realistic rent and recurring costs to see monthly disposable income.'],
      ['Questions to ask before accepting', 'Ask about pension start date, bonus rules, relocation support, hybrid work, overtime or travel expectations, and whether the employer supports work permits for international candidates when needed.'],
      ['How to use the result', 'Compare monthly net pay, annual net pay, employer pension value, Pay Limit Scheme margin and leftover money after living costs. Use the numbers to negotiate salary, relocation support or contract terms before accepting.'],
    ],
  },
};

Object.assign(staticPages, seoPages);


const enhancedSeoPages = {
  '/denmark-salary-calculator-2026': {
    eyebrow: 'Denmark salary calculator 2026',
    title: 'Denmark salary after tax calculator for expats in 2026.',
    description: 'Use TakeHomeDK to estimate Danish take-home pay, pension value, work-permit threshold status and monthly living-cost buffer before accepting a job offer.',
    sections: [
      ['Start with the decision, not the tax formula', 'A Danish job offer is not simply “gross salary minus tax”. International candidates need to understand how monthly cash, pension value, bonus, municipality, deductions, visa thresholds and rent interact. This page is designed for the practical question: if you accept this offer, what will actually land in your budget each month and what should you clarify before signing?'],
      ['Which gross salary should you enter?', 'Enter the fixed gross monthly cash salary before tax and before employer pension. If your offer is annual, divide the fixed cash salary by 12. Enter expected or guaranteed bonus separately because it may not behave like stable monthly income. Employer pension should be entered as a percentage because it adds compensation value, but it is not normally available for rent, food or monthly spending.'],
      ['How TakeHomeDK models the offer', 'The calculator estimates employee pension, AM-bidrag, municipal tax, bottom/middle/top tax layers, optional church tax and tax-card-style deductions. It then separates monthly net cash from employer pension value and shows a Pay Limit Scheme threshold screen. This makes the result useful for negotiation, relocation budgeting and early immigration questions.'],
      ['What a strong Danish offer should show', 'A strong result is not only a high monthly net salary. Look for a healthy net/gross ratio, enough leftover money after realistic rent and recurring costs, clear pension terms, a documented bonus policy and a comfortable margin above any relevant work-permit threshold. If one of those is weak, the offer may still be good, but it needs closer review.'],
      ['Example offer interpretation', 'Imagine a role offering DKK 62,000 per month, 10% employer pension, 5% employee pension and a DKK 50,000 annual bonus in Copenhagen. The key question is not whether DKK 62,000 sounds high; it is whether the calculated monthly net income leaves enough after housing and whether the counted compensation is comfortably above the 2026 Pay Limit Scheme threshold if immigration is relevant.'],
      ['Negotiation checklist before accepting', 'Ask whether salary is paid over 12 months, whether bonus is guaranteed or discretionary, when pension starts, whether relocation support is taxable, which municipality you are expected to live or work in, and whether the employer has handled international work permits before. Use the calculator summary as a concrete basis for salary and relocation negotiations.'],
      ['Important limitation', 'This is an offer-screening tool, not an official tax assessment. Your final tax depends on your Danish tax card, deductions, pension setup, personal circumstances and official interpretation. Use TakeHomeDK to identify the right questions, then verify with SKAT, SIRI, your employer, union, pension provider or a qualified advisor.'],
    ],
    faqs: [
      ['Is this calculator official?', 'No. It is a transparent estimate based on public rules and assumptions. Use it for screening and comparison, then verify final details with official sources.'],
      ['Should I include employer pension in gross salary?', 'No. Enter gross monthly cash salary separately and employer pension as a percentage so you can see monthly cash and total compensation value separately.'],
      ['Why does municipality matter?', 'Municipal tax rates vary across Denmark, so Copenhagen, Frederiksberg, Aarhus, Odense, Kalundborg and other locations can produce different estimates.'],
      ['Can I use this for salary negotiation?', 'Yes. The best use is to turn a vague feeling into specific numbers: monthly net pay, annual net pay, pension value, visa margin and budget buffer.'],
    ],
    related: [['Copenhagen salary calculator','/copenhagen-salary-calculator'], ['Pay Limit Scheme checker','/denmark-pay-limit-scheme-checker-2026'], ['Denmark tax guide','/denmark-tax-guide-expats-2026']],
    sourceNote: 'Uses public Danish tax and immigration source links listed in the homepage Sources and assumptions section.'
  },
  '/copenhagen-salary-calculator': {
    eyebrow: 'Copenhagen salary calculator',
    title: 'Copenhagen salary calculator: estimate take-home pay and rent pressure.',
    description: 'Estimate how much a Copenhagen job offer leaves after Danish taxes, pension contributions and realistic city living costs.',
    sections: [
      ['Why Copenhagen needs a separate calculation', 'Copenhagen is the first Danish city many expats consider, but it is also where housing costs can most quickly distort a salary decision. A gross salary that looks comfortable may feel only average after AM-bidrag, income tax, employee pension, rent, utilities, transport, insurance and groceries.'],
      ['The Copenhagen salary question people really ask', 'The useful question is not “is this salary high?” but “can this salary support the life I expect in Copenhagen?” A single person in a shared apartment, a couple in a one-bedroom flat and a family needing childcare will experience the same gross salary very differently.'],
      ['How to set up the calculator', 'Choose Copenhagen as the municipality, enter the fixed gross monthly salary, employer pension, employee pension and bonus. Then adjust the rent and monthly living-cost inputs. Do not use a fantasy rent: use actual listings or a conservative estimate for your first year in Denmark.'],
      ['Costs to include beyond rent', 'Include heating, electricity, water, internet, phone, transport, groceries, insurance, A-kasse or union membership, fitness, subscriptions and travel. If you are relocating, remember deposits, furniture, temporary accommodation and administrative setup costs.'],
      ['How to compare Copenhagen with other cities', 'Run the same salary in Copenhagen, Aarhus, Odense, Aalborg, Kalundborg or Frederiksberg. Sometimes the higher Copenhagen salary is partly offset by housing. Sometimes Copenhagen still wins because the job market, spouse opportunities or career upside are stronger. The point is to compare using net monthly budget, not only salary.'],
      ['When to negotiate', 'If the calculator shows a tight leftover amount after realistic rent, negotiate before accepting. You can ask for higher base salary, a signing bonus, temporary housing, relocation allowance, paid flights, flexible work location or support for spouse/family relocation.'],
      ['Copenhagen-specific caution', 'Do not base a relocation decision on the cheapest apartment you find online. New arrivals often face limited options at first. A conservative rent assumption makes the offer decision safer.'],
    ],
    faqs: [
      ['Is Copenhagen much more expensive than other Danish cities?', 'Housing is usually the biggest difference. Some other costs are similar, but rent can change the monthly budget dramatically.'],
      ['Should I use Copenhagen or Frederiksberg as municipality?', 'Use the municipality where you expect to live for tax modelling. Frederiksberg is separate from Copenhagen and may have a different tax preset.'],
      ['What is the most important output?', 'For relocation decisions, monthly net pay and leftover money after rent/living costs are usually more useful than annual gross salary.'],
      ['Can this help with salary negotiation?', 'Yes. It helps you explain exactly why a gross salary may need adjustment for Copenhagen living costs.'],
    ],
    related: [['Denmark salary calculator','/denmark-salary-calculator-2026'], ['Copenhagen cost of living','/copenhagen-cost-of-living-calculator'], ['Software engineer Copenhagen','/software-engineer-salary-copenhagen']],
    sourceNote: 'Copenhagen estimates depend on municipality assumptions and user-entered living costs; verify personal tax-card details with official sources.'
  },
  '/denmark-pay-limit-scheme-checker-2026': {
    eyebrow: 'Pay Limit Scheme Denmark 2026',
    title: 'Denmark Pay Limit Scheme salary checker for 2026.',
    description: 'Screen whether a Danish job offer appears to meet the 2026 Pay Limit Scheme salary threshold before relying on it for a work permit.',
    sections: [
      ['What the Pay Limit Scheme checker is for', 'Many non-EU candidates need to know whether a Danish job offer is high enough for a work permit route. TakeHomeDK includes a salary-threshold screen for the 2026 Pay Limit Scheme minimum of DKK 552,000 per year, but it should be treated as an early warning system rather than a legal conclusion.'],
      ['Why “counted salary” matters', 'The amount that matters for immigration may not be identical to the headline compensation number in a recruiter email. Guaranteed salary, labour-market pension payments and paid holiday allowance may be relevant, while benefits, discretionary bonus and unusual compensation components need careful review.'],
      ['How to use the calculator safely', 'Enter fixed monthly salary, pension percentages and bonus separately. Look at the Pay Limit Scheme margin, not only the pass/fail label. A large positive margin is more reassuring than a result that barely clears the threshold. If the offer is close to the line, do not rely on a calculator.'],
      ['Questions to ask the employer', 'Ask which compensation components will be included in the work-permit application, whether the salary is guaranteed in the contract, whether pension is labour-market pension, how holiday allowance is treated and whether the company has recently sponsored non-EU hires.'],
      ['Red flags', 'Be careful if the offer relies heavily on discretionary bonus, non-cash benefits, one-off payments, unpaid leave, part-time structure or future salary increases. Those details may affect whether the offer is safe for a Pay Limit Scheme application.'],
      ['Why the 2026 threshold matters for negotiation', 'If your offer is below or barely above the threshold, salary negotiation is not only about lifestyle; it may affect whether the employment route is viable. A clear margin can reduce stress during relocation and application processing.'],
      ['Final responsibility', 'SIRI decides real applications. Use TakeHomeDK to prepare questions and identify risk, then verify with the employer, SIRI guidance or a qualified immigration advisor.'],
    ],
    faqs: [
      ['What threshold does the calculator use?', 'It uses DKK 552,000 per year for the 2026 Pay Limit Scheme screen.'],
      ['Does bonus count?', 'It depends on the real rules and contract details. Treat bonus carefully and verify before relying on it.'],
      ['What if my salary is just above the threshold?', 'Get confirmation from the employer or an advisor. A narrow margin is a risk signal.'],
      ['Is this immigration advice?', 'No. It is a screening calculator only. SIRI and qualified advisors should be used for real applications.'],
    ],
    related: [['Denmark salary calculator','/denmark-salary-calculator-2026'], ['Researcher tax scheme','/denmark-researcher-tax-scheme'], ['Data scientist salary','/data-scientist-salary-denmark']],
    sourceNote: 'Verify the Pay Limit Scheme details with New to Denmark/SIRI before relying on any calculation.'
  },
  '/denmark-tax-guide-expats-2026': {
    eyebrow: 'Denmark tax guide for expats 2026',
    title: 'Denmark tax guide for expats: AM-bidrag, municipal tax and salary offers.',
    description: 'A plain-English guide to the Danish tax layers expats need to understand when comparing job offers in 2026.',
    sections: [
      ['The tax issue expats notice first', 'Denmark often has higher headline tax than some countries, but Danish compensation also includes pensions, paid holiday, public services and strong labour-market protections. The practical task is to estimate monthly net pay accurately enough to make a relocation decision.'],
      ['AM-bidrag in plain English', 'AM-bidrag is an 8% labour market contribution applied before ordinary income-tax layers in this simplified model. Expats often miss it when doing a quick mental calculation from gross salary to net salary.'],
      ['Municipal tax matters', 'Danish municipal tax varies by municipality. This is why a Copenhagen, Frederiksberg, Aarhus, Odense or Kalundborg scenario may differ even with the same gross salary. Choose the place you expect to live, not only the place your office is located.'],
      ['Pension changes the feel of salary', 'Employee pension reduces current monthly cash but builds savings. Employer pension increases total compensation but is not usually available for daily spending. When comparing two offers, separate monthly spending power from long-term compensation value.'],
      ['Deductions and tax card assumptions', 'Real tax depends on your preliminary income assessment and tax card. Commuting, interest, personal allowances and other items may affect the final result. The calculator includes a monthly deduction input so you can approximate the effect, but it is not a replacement for SKAT.'],
      ['How to use this guide during offer review', 'First calculate a base scenario. Then run a conservative scenario with lower deductions, higher rent and no bonus. If the offer works in both cases, it is more robust. If it only works under optimistic assumptions, negotiate or ask more questions.'],
      ['What to verify after signing', 'After accepting, check your tax card, preliminary income assessment, CPR setup, pension enrollment, holiday rules and any researcher/key employee or work-permit assumptions. Small administrative details can change cash flow in the first months.'],
    ],
    faqs: [
      ['Is Danish tax the same everywhere?', 'No. Municipal tax differs, and personal deductions also matter.'],
      ['Is employer pension take-home pay?', 'No. It is compensation value, but not monthly cash.'],
      ['Does this replace SKAT?', 'No. It helps you prepare and estimate; SKAT determines your actual tax situation.'],
      ['Why does the calculator include living costs?', 'Because relocation decisions depend on disposable income after rent and recurring costs, not only tax.'],
    ],
    related: [['Denmark salary calculator','/denmark-salary-calculator-2026'], ['Researcher tax scheme','/denmark-researcher-tax-scheme'], ['Copenhagen salary calculator','/copenhagen-salary-calculator']],
    sourceNote: 'The calculator links to public SKAT tax-bracket and researcher/key employee tax scheme sources from the homepage.'
  },
  '/data-scientist-salary-denmark': {
    eyebrow: 'Data scientist salary Denmark',
    title: 'Data scientist salary in Denmark: estimate take-home pay and offer value.',
    description: 'Evaluate Danish data scientist offers with tax, pension, bonus, city costs and work-permit salary threshold context.',
    sections: [
      ['Why data scientist salary comparisons are tricky', 'Data scientist roles in Denmark can sit in pharma, finance, SaaS, industrial analytics, consulting, public sector or AI product teams. Two offers with the same gross salary can feel very different if pension, bonus, location and housing costs differ.'],
      ['Compensation components to separate', 'Separate base salary, employer pension, employee pension, annual bonus, equity-like incentives and relocation support. For monthly budgeting, fixed salary after tax matters most. For total compensation, pension and bonus matter too. Do not mix all components into one optimistic number.'],
      ['Copenhagen versus other Danish locations', 'Many data scientist jobs are in Greater Copenhagen, but roles also exist in Aarhus, Odense, Aalborg and pharma/manufacturing hubs. Use the calculator to test both salary and rent differences. A lower-rent city can sometimes produce a stronger monthly budget even with a lower gross salary.'],
      ['Visa and Pay Limit Scheme considerations', 'Data scientist salaries may exceed the Pay Limit Scheme threshold, but non-EU candidates should still verify which components count. A high bonus or unclear pension setup should not be assumed to solve immigration requirements without documentation.'],
      ['Questions to ask the employer', 'Ask whether bonus is guaranteed, whether pension is calculated on base salary, whether relocation support is provided, whether the company sponsors work permits, whether hybrid work affects location, and whether the role has on-call or production responsibility.'],
      ['Negotiation strategy', 'If the salary is below your target but the company is strong, negotiate total package: base salary, sign-on bonus, relocation support, temporary housing, pension, conference budget, Danish courses or flexible work location. Use the calculator result to show the monthly gap.'],
      ['How to use this page', 'Run your offer through the calculator, copy the summary, then create a conservative version with no bonus and higher rent. If the conservative scenario still works, the offer is safer. If not, negotiate before accepting.'],
    ],
    faqs: [
      ['Should stock or equity be included?', 'Do not rely on it for monthly budgeting. Treat it separately from stable cash salary.'],
      ['Is Copenhagen the best place for data scientists?', 'It has the largest job market, but the best offer depends on salary, rent, company quality and career growth.'],
      ['Can data scientist roles qualify for work permits?', 'Often yes if salary and documentation meet requirements, but SIRI decides the actual application.'],
      ['What should I negotiate first?', 'Base salary and relocation support usually affect first-year comfort more directly than uncertain bonus.'],
    ],
    related: [['AI engineer salary','/ai-engineer-salary-denmark'], ['Data analyst salary','/data-analyst-salary-denmark'], ['Copenhagen salary calculator','/copenhagen-salary-calculator']],
    sourceNote: 'Use official SIRI and SKAT sources for final immigration and tax interpretation.'
  },
  '/ai-engineer-salary-denmark': {
    eyebrow: 'AI engineer salary Denmark',
    title: 'AI engineer salary in Denmark: estimate tax, pension and relocation budget.',
    description: 'Calculate the real monthly value of AI engineer and machine-learning engineer offers in Denmark.',
    sections: [
      ['Why AI engineer offers need extra scrutiny', 'AI engineer, machine-learning engineer and applied AI roles can include high salaries, bonus, equity-like incentives, relocation packages and specialist tax questions. The headline package may be attractive, but monthly net cash and housing costs still decide daily comfort.'],
      ['Base salary versus total package', 'For Danish relocation, base salary is the safest number to budget from. Pension and bonus are important, but they do not always behave like salary. Equity, stock options or startup upside should be considered separately from rent-paying cash.'],
      ['Tax and researcher-scheme angle', 'Some AI roles may overlap with research, PhD-level work or highly qualified specialist hiring. If the salary is high or the role is research-heavy, ask whether the researcher/key employee tax scheme is relevant, but verify conditions carefully.'],
      ['Work-permit threshold check', 'AI engineer offers may clear the Pay Limit Scheme threshold, yet the actual application depends on documented salary components. Use the margin as a risk indicator: a large margin is better than a barely passing result.'],
      ['City and lifestyle trade-offs', 'Copenhagen offers a strong tech ecosystem but higher rent. Aarhus, Odense and hybrid roles may offer different trade-offs. Run multiple locations in the calculator to compare monthly budget, not only career upside.'],
      ['Negotiation levers for AI roles', 'Consider negotiating base salary, signing bonus, relocation support, conference or GPU/cloud budget, remote flexibility, pension, title/seniority and paid learning time. For family relocation, temporary housing may be more valuable than a small salary increase.'],
      ['Decision rule', 'Treat the offer as strong when fixed monthly net pay supports your realistic cost of living, total compensation is transparent, visa/tax assumptions are documented and the role has credible career upside.'],
    ],
    faqs: [
      ['Should I include equity in the calculator?', 'No. Model stable cash salary first; treat equity separately as upside.'],
      ['Can AI roles use the researcher tax scheme?', 'Possibly in some cases, but salary, qualification, role and prior tax status must be verified.'],
      ['Is bonus reliable for budgeting?', 'Only if it is guaranteed and clearly documented. Otherwise run a no-bonus scenario.'],
      ['What city should I model?', 'Use where you expect to live. If flexible, compare Copenhagen with Aarhus, Odense or other realistic options.'],
    ],
    related: [['Data scientist salary','/data-scientist-salary-denmark'], ['Denmark researcher tax scheme','/denmark-researcher-tax-scheme'], ['Pay Limit Scheme checker','/denmark-pay-limit-scheme-checker-2026']],
    sourceNote: 'Researcher/key employee and work-permit assumptions should be verified with SKAT and SIRI.'
  }
};

Object.assign(staticPages, enhancedSeoPages);


const salaryRangeSources = [
  ['IDA Salary Statistics', 'https://ida.dk/en/career-and-legal-advice/salary/idas-salary-statistics'],
  ['IDA data science salary guide', 'https://studerende.ida.dk/english/about-to-graduate/salary/data-science-salary-what-you-will-earn/'],
  ['SDU engineering salary note', 'https://www.sdu.dk/en/om-sdu/fakulteterne/teknik/uddannelse/ingeniorledighed'],
  ['Aarhus University engineering salaries', 'https://ingenioer.au.dk/en/education/a-career-as-an-engineer/high-starting-salaries-for-young-engineers-in-denmark'],
  ['Jobindex salary tool methodology', 'https://www.jobindex.dk/tjek-din-loen/engineer?lang=en'],
  ['Levels.fyi Denmark data scientist data', 'https://www.levels.fyi/t/data-scientist/locations/denmark'],
];

const salaryRangeByPath = {
  '/process-engineer-salary-denmark': {
    range: '47,000–75,000 DKK / month',
    typical: 'Around 55,000–65,000 DKK/month is a practical mid-career screening band for many Danish process roles.',
    note: 'For process engineers, use IDA/engineering public benchmarks as the anchor, then adjust upward for pharma, GMP, production responsibility, shift/on-call expectations and Kalundborg or Greater Copenhagen demand.'
  },
  '/pharma-engineer-salary-denmark': {
    range: '50,000–80,000 DKK / month',
    typical: 'Specialist pharma engineering offers often screen well from the high-50s to low-70s before bonus and pension details.',
    note: 'Pharma roles can sit above general engineering benchmarks because regulated manufacturing, validation, process ownership and expansion projects create strong demand.'
  },
  '/software-engineer-salary-copenhagen': {
    range: '50,000–85,000 DKK / month',
    typical: 'Senior Copenhagen software roles often need a high-50s or 60k+ gross salary to feel comfortable after rent.',
    note: 'Software compensation varies widely by seniority, stack, company type, bonus/equity and Copenhagen housing assumptions.'
  },
  '/data-scientist-salary-denmark': {
    range: '41,000–80,000 DKK / month',
    typical: 'IDA’s public data-science graduate guidance is around 41k/month; experienced private-sector roles can move substantially higher.',
    note: 'The lower end reflects public graduate guidance; the upper screening band is informed by public tech-compensation and STEM salary sources for experienced candidates.'
  },
  '/data-analyst-salary-denmark': {
    range: '38,000–60,000 DKK / month',
    typical: 'Many analyst offers should be tested around 42,000–55,000 DKK/month depending on industry and experience.',
    note: 'Finance, consulting, life science and senior analytics roles may sit above entry-level analyst roles; pension and bonus can materially change total value.'
  },
  '/ai-engineer-salary-denmark': {
    range: '55,000–90,000 DKK / month',
    typical: 'For experienced AI/ML engineering, high-50s to 70k+ is a reasonable first screening band before bonus/equity.',
    note: 'AI engineering can price closer to senior software/data engineering than entry data science, especially for production ML, cloud, MLOps or specialist research roles.'
  },
  '/data-engineer-salary-denmark': {
    range: '52,000–85,000 DKK / month',
    typical: 'Experienced cloud/data-platform roles often screen around 58,000–75,000 DKK/month.',
    note: 'Cloud, platform ownership, data infrastructure, regulated data and on-call responsibility can move offers above generic analyst levels.'
  },
  '/environmental-engineer-salary-denmark': {
    range: '43,000–70,000 DKK / month',
    typical: 'Public-sector and consulting roles can vary; private specialist roles should often be tested in the high-40s to 60s.',
    note: 'Use general engineering benchmarks as the anchor, then adjust for consulting, permitting, sustainability, water, energy or manufacturing specialization.'
  },
  '/qa-specialist-salary-denmark': {
    range: '45,000–70,000 DKK / month',
    typical: 'GMP QA and validation offers often screen around 50,000–62,000 DKK/month before bonus/pension differences.',
    note: 'Regulated-industry QA salaries depend heavily on GMP depth, batch release, deviation/CAPA responsibility, audits and pharma versus non-pharma context.'
  },
  '/automation-engineer-salary-denmark': {
    range: '48,000–78,000 DKK / month',
    typical: 'Automation engineers with PLC, robotics, SCADA or manufacturing IT responsibility often warrant a 55k+ scenario check.',
    note: 'Factory expansion, validated systems, travel, on-call duties and pharma/robotics exposure can push compensation above broad engineering benchmarks.'
  },
  '/mechanical-engineer-salary-denmark': {
    range: '45,000–72,000 DKK / month',
    typical: 'A mid-career mechanical engineering offer often belongs in the high-40s to low-60s before pension and bonus.',
    note: 'Specialist equipment, pharma, energy, manufacturing or project responsibility can justify testing higher scenarios.'
  },
  '/electrical-engineer-salary-denmark': {
    range: '47,000–78,000 DKK / month',
    typical: 'Energy, automation and utilities roles often need scenarios around 52,000–68,000 DKK/month.',
    note: 'Power systems, automation, commissioning, travel and regulated manufacturing can move salaries materially above junior engineer levels.'
  },
  '/civil-engineer-salary-denmark': {
    range: '45,000–72,000 DKK / month',
    typical: 'Civil engineering offers often screen from the high-40s into the low-60s depending on seniority and sector.',
    note: 'Consulting, construction management, infrastructure, project responsibility and Copenhagen market pressure can change the offer value.'
  },
  '/project-manager-salary-denmark': {
    range: '55,000–90,000 DKK / month',
    typical: 'Experienced project managers in pharma, IT, engineering or capex should often test 65,000–80,000 DKK/month scenarios.',
    note: 'Project size, budget ownership, people management, regulated delivery and bonus structure matter more than title alone.'
  },
  '/scientist-salary-denmark': {
    range: '45,000–75,000 DKK / month',
    typical: 'PhD-level scientist roles often need a separate scenario for researcher tax, bonus and pension assumptions.',
    note: 'R&D, biotech, pharma, senior scientist level and researcher/key employee scheme relevance can change both salary and net-pay interpretation.'
  },
  '/business-analyst-salary-denmark': {
    range: '42,000–70,000 DKK / month',
    typical: 'Business analyst offers often screen around 45,000–60,000 DKK/month, with higher bands for finance, pharma or senior product roles.',
    note: 'Industry, seniority, stakeholder responsibility, product ownership and bonus can matter as much as the analyst title.'
  },
};

Object.entries(salaryRangeByPath).forEach(([path, salaryRange]) => {
  if (staticPages[path]) staticPages[path].salaryRange = salaryRange;
});

function SiteHeader() {
  return <header className="nav"><a className="brand" href="/"><span>TakeHome</span><b>DK</b></a><nav><a href="/#calculator">Calculator</a><a href="/guides">Guides</a><a href="/#visa">Visa</a><a href="/#guide">Tax guide</a><a href="/#sources">Sources</a><a href="/about">About</a></nav></header>;
}

function SiteFooter() {
  return <footer><div><a className="brand" href="/"><span>TakeHome</span><b>DK</b></a><p>Built as a transparent English Denmark salary, tax, visa-threshold and relocation calculator for expats.</p><div className="footerLinks"><a href="/guides">Guides</a><a href="/about">About</a><a href="/contact">Contact</a><a href="/privacy-policy">Privacy</a><a href="/disclaimer">Disclaimer</a></div></div><p>Last updated: 2026 tax-year prototype · Estimates only · Not tax or immigration advice.</p></footer>;
}


function setOrCreateMeta(selector, tagName, attrs) {
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement(tagName);
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
}

function removeDynamicJsonLd() {
  document.querySelectorAll('script[data-dynamic-jsonld="true"]').forEach(node => node.remove());
}

function addJsonLd(data) {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.dataset.dynamicJsonld = 'true';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
}

function updateSeo({ title, description, path = '/', type = 'website', breadcrumbs = [], jsonLd = [] }) {
  const url = `https://takehomedk.com${path === '/' ? '/' : path}`;
  document.title = title;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  setOrCreateMeta('link[rel="canonical"]', 'link', { rel: 'canonical', href: url });
  setOrCreateMeta('meta[property="og:title"]', 'meta', { property: 'og:title', content: title });
  setOrCreateMeta('meta[property="og:description"]', 'meta', { property: 'og:description', content: description });
  setOrCreateMeta('meta[property="og:url"]', 'meta', { property: 'og:url', content: url });
  setOrCreateMeta('meta[property="og:type"]', 'meta', { property: 'og:type', content: type });
  setOrCreateMeta('meta[name="twitter:card"]', 'meta', { name: 'twitter:card', content: 'summary' });
  setOrCreateMeta('meta[name="twitter:title"]', 'meta', { name: 'twitter:title', content: title });
  setOrCreateMeta('meta[name="twitter:description"]', 'meta', { name: 'twitter:description', content: description });
  removeDynamicJsonLd();
  if (breadcrumbs.length) {
    addJsonLd({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: `https://takehomedk.com${crumb.path === '/' ? '/' : crumb.path}`,
      }))
    });
  }
  jsonLd.forEach(addJsonLd);
}

function Breadcrumbs({ items }) {
  return <nav className="breadcrumbs" aria-label="Breadcrumb">{items.map((item, index) => <React.Fragment key={item.path}><a href={item.path}>{item.name}</a>{index < items.length - 1 && <span>/</span>}</React.Fragment>)}</nav>;
}

function StaticPage({ page }) {
  return <main>
    <SiteHeader/>
    <section className="staticHero"><Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }, { name: page.eyebrow, path: window.location.pathname }]}/><p className="eyebrow">{page.eyebrow}</p><h1>{page.title}</h1><p className="lead">{page.description}</p></section>
    <section className="staticContent">
      {page.salaryRange && <aside className="salaryRangePanel" aria-label="Indicative salary range">
        <div><p className="eyebrow">Public salary data signal</p><h2>Indicative gross salary range</h2><strong>{page.salaryRange.range}</strong><p>{page.salaryRange.typical}</p><small>{page.salaryRange.note}</small></div>
        <div className="salarySourceLinks"><b>Source basis</b>{salaryRangeSources.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer">{label}<ChevronRight size={14}/></a>)}</div>
      </aside>}
      {page.sections.map(([heading, body], index) => <article key={heading} className={index === 0 ? 'leadArticle' : ''}><span className="articleNumber">{String(index + 1).padStart(2, '0')}</span><h2>{heading}</h2><p>{body}</p></article>)}
      {page.rentGuide && <section className="rentGuideBlock" aria-label="Indicative rent ranges and recommendations">
        <div className="rentGuideIntro"><p className="eyebrow">Rent ranges by area</p><h2>Indicative monthly rent ranges for salary planning</h2><p>Use the one-bedroom range for a single professional, the two-bedroom range for a couple or remote-work setup, and the family range when you need more space. Ranges are cold-rent planning bands in DKK per month.</p></div>
        <div className="rentTableWrap"><table className="rentTable"><thead><tr><th>Area</th><th>1-bed / small flat</th><th>2-bed flat</th><th>Family home</th><th>Best fit</th><th>Money-saving recommendation</th></tr></thead><tbody>{rentGuideAreas.map(area => <tr key={area.area}><th>{area.area}</th><td>{area.oneBed}</td><td>{area.twoBed}</td><td>{area.family}</td><td>{area.bestFor}</td><td>{area.saveTip}</td></tr>)}</tbody></table></div>
        <div className="rentDecisionGrid">
          <article><h3>If the job is in Copenhagen or Frederiksberg</h3><p>For maximum convenience, live in Copenhagen or Frederiksberg. For better savings, compare outer Copenhagen, Lyngby and Roskilde. Roskilde can be a strong compromise if the train commute is acceptable and your role is hybrid.</p></article>
          <article><h3>If the job is in Gentofte, Lyngby or Hørsholm</h3><p>Start with Lyngby and Hørsholm, then compare Gentofte only if the salary is strong or family/neighbourhood priorities justify the premium. Without a car, check door-to-door public transport before choosing a cheaper area.</p></article>
          <article><h3>If the job is in Kalundborg or Holbæk</h3><p>To save as much money as possible, live in Kalundborg, Holbæk or nearby west-Zealand towns. A Copenhagen lifestyle can cost 6,000–15,000 DKK more per month in rent and transport pressure.</p></article>
          <article><h3>If the job is in Odense</h3><p>Living in Odense is usually the best financial default. You keep city convenience while avoiding Copenhagen-level rent. Only pay Copenhagen prices if your household has a second job, family reason or hybrid split that requires it.</p></article>
        </div>
        <div className="salaryDecisionBlock"><p className="eyebrow">Salary-based recommendation</p><h2>Where to live by gross monthly salary</h2><ul><li><b>Under 45,000 DKK/month:</b> avoid central Copenhagen unless sharing. Prioritise Odense, Holbæk, Kalundborg, Roskilde or a room/shared flat.</li><li><b>45,000–60,000 DKK/month:</b> Copenhagen can work for singles, but savings improve sharply in Roskilde, Lyngby, Holbæk, Kalundborg or Odense.</li><li><b>60,000–80,000 DKK/month:</b> Copenhagen, Frederiksberg or Lyngby become realistic; choose cheaper areas if your goal is aggressive saving or home-deposit building.</li><li><b>80,000+ DKK/month:</b> you can pay for convenience in Frederiksberg, Gentofte or central Copenhagen, but still compare the monthly savings from living near the job.</li></ul></div>
        <div className="salarySourceLinks rentSources"><b>Source basis</b>{rentSourceLinks.map(([label, href]) => <a key={href} href={href} target="_blank" rel="noreferrer">{label}<ChevronRight size={14}/></a>)}</div>
      </section>}
      {page.faqs && <div className="staticFaqBlock"><p className="eyebrow">FAQ</p><h2>Common questions</h2>{page.faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>}
      {page.related && <div className="relatedBlock"><p className="eyebrow">Related guides</p><div>{page.related.map(([label, href]) => <a key={href} href={href}>{label}<ChevronRight size={15}/></a>)}</div></div>}
      {page.sourceNote && <aside className="sourceNote"><b>Source and accuracy note</b><p>{page.sourceNote}</p></aside>}
      <div className="staticCta"><a className="primary" href="/#calculator">Use the calculator <ArrowRight size={18}/></a><a className="secondary" href="/disclaimer">Read disclaimer</a></div>
    </section>
    <SiteFooter/>
  </main>;
}


function GuidesPage() {
  const description = 'Browse TakeHomeDK guides for Denmark salary calculators, job-title salary pages, tax explanations, Pay Limit Scheme checks and Copenhagen living-cost planning.';
  updateSeo({
    title: 'Denmark salary and tax guides for expats — TakeHomeDK',
    description,
    path: '/guides',
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }],
    jsonLd: [{ '@context': 'https://schema.org', '@type': 'CollectionPage', name: 'TakeHomeDK guide hub', description, url: 'https://takehomedk.com/guides' }]
  });
  const totalGuides = guideCategories.reduce((sum, category) => sum + category.links.length, 0);
  return <main>
    <SiteHeader/>
    <section className="guidesHero">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }]}/><p className="eyebrow">TakeHomeDK guide hub</p>
      <h1>Denmark salary, tax and job-offer guides for expats.</h1>
      <p className="lead">Browse every TakeHomeDK guide from one page: core salary calculators, city pages, visa-threshold checks, tax explainers and job-title salary guides for international professionals considering Denmark.</p>
      <div className="guideHubStats"><span><b>{totalGuides}</b> guides</span><span><b>4</b> categories</span><span><b>2026</b> tax year focus</span></div>
      <div className="staticCta"><a className="primary" href="/#calculator">Use the calculator <ArrowRight size={18}/></a><a className="secondary" href="/denmark-salary-calculator-2026">Start with salary guide</a></div>
    </section>
    <section className="guidesIndex" aria-label="All TakeHomeDK guides">
      {guideCategories.map(category => <article className="guideCategory" key={category.title}>
        <div className="guideCategoryIntro"><p className="eyebrow">{category.eyebrow}</p><h2><a href={category.slug}>{category.title}</a></h2><p>{category.description}</p><a className="categoryDeepLink" href={category.slug}>Open category hub <ChevronRight size={15}/></a></div>
        <div className="guideLinkList">{category.links.map(([title, description, href]) => <a key={href} href={href}><span><b>{title}</b><small>{description}</small></span><ChevronRight size={17}/></a>)}</div>
      </article>)}
    </section>
    <section className="guidesHowTo">
      <div><p className="eyebrow">How to use these guides</p><h2>Recommended order for checking a Danish job offer</h2></div>
      <ol>
        <li><b>Calculate take-home pay.</b><span>Start with the Denmark salary calculator and enter gross salary, pension, bonus and municipality.</span></li>
        <li><b>Check visa and tax risk.</b><span>If you are non-EU or highly paid, review the Pay Limit Scheme and researcher tax pages.</span></li>
        <li><b>Compare the role page.</b><span>Open the job-title guide closest to your offer and use its negotiation checklist.</span></li>
        <li><b>Stress-test living costs.</b><span>Run a conservative Copenhagen or city budget before signing or relocating.</span></li>
      </ol>
    </section>
    <SiteFooter/>
  </main>;
}


function GuideCategoryPage({ category }) {
  const title = `${category.title} — TakeHomeDK`;
  const description = `${category.description} Browse ${category.links.length} TakeHomeDK guides and calculators for expats evaluating Danish job offers.`;
  updateSeo({
    title,
    description,
    path: category.slug,
    breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }, { name: category.title, path: category.slug }],
    jsonLd: [{
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: category.title,
      description,
      url: `https://takehomedk.com${category.slug}`,
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: category.links.map(([name, itemDescription, href], index) => ({ '@type': 'ListItem', position: index + 1, name, description: itemDescription, url: `https://takehomedk.com${href}` }))
      }
    }]
  });
  return <main>
    <SiteHeader/>
    <section className="guidesHero categoryHero">
      <Breadcrumbs items={[{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }, { name: category.title, path: category.slug }]}/>
      <p className="eyebrow">{category.eyebrow}</p>
      <h1>{category.title}.</h1>
      <p className="lead">{category.description} Use this category hub to move from a broad salary question to the exact calculator or profession guide that matches your Danish offer.</p>
      <div className="guideHubStats"><span><b>{category.links.length}</b> guides</span><span><b>2026</b> salary context</span><span><b>DKK</b> gross-to-net focus</span></div>
    </section>
    <section className="categoryIndex">
      {category.links.map(([title, description, href], index) => <article key={href}>
        <span className="articleNumber">{String(index + 1).padStart(2, '0')}</span>
        <h2><a href={href}>{title}</a></h2>
        <p>{description}</p>
        <a className="categoryCardLink" href={href}>Read guide <ChevronRight size={16}/></a>
      </article>)}
    </section>
    <section className="guidesHowTo compactHowTo">
      <div><p className="eyebrow">Next step</p><h2>Turn salary ranges into a take-home estimate</h2></div>
      <ol>
        <li><b>Open the closest guide.</b><span>Start with the role, city or tax route that matches the offer.</span></li>
        <li><b>Enter the actual offer.</b><span>Use gross salary, pension, bonus and municipality in the calculator.</span></li>
        <li><b>Compare scenarios.</b><span>Test conservative rent, no bonus and different municipalities before accepting.</span></li>
        <li><b>Verify important assumptions.</b><span>Use SKAT, SIRI, employer documentation or an advisor for official decisions.</span></li>
      </ol>
    </section>
    <SiteFooter/>
  </main>;
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
      <div className="sectionIntro"><p className="eyebrow">Find the right calculator</p><h2>Popular Denmark salary questions this page answers</h2><p>These topic tiles make the site easier to scan. For the full index, open the <a href="/guides">TakeHomeDK guides hub</a>.</p></div>
      <div className="landingGrid">{searchLandingPages.map(([title, description, href]) => <a className="landingTile" key={title} href={href}><h3>{title}</h3><p>{description}</p><span>Read guide <ChevronRight size={15}/></span></a>)}</div>
    </section>

    <section className="salaryGuideSection">
      <div className="sectionIntro"><p className="eyebrow">Salary guides by role</p><h2>Popular Denmark job-title salary guides for expats</h2><p>These pages target specific job-offer searches and help international candidates compare tax, pension, visa-threshold and living-cost implications by role.</p></div>
      <div className="salaryGuideGrid">{salaryGuideLinks.map(([title, href]) => <a key={href} href={href}>{title}<ChevronRight size={15}/></a>)}</div>
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
  if (window.location.pathname === '/guides') return <GuidesPage/>;
  const category = guideCategories.find(item => item.slug === window.location.pathname);
  if (category) return <GuideCategoryPage category={category}/>;
  const page = staticPages[window.location.pathname];
  if (page) {
    const path = window.location.pathname;
    updateSeo({
      title: `${page.eyebrow} — TakeHomeDK`,
      description: page.description,
      path,
      type: 'article',
      breadcrumbs: [{ name: 'Home', path: '/' }, { name: 'Guides', path: '/guides' }, { name: page.eyebrow, path }],
      jsonLd: [{ '@context': 'https://schema.org', '@type': 'Article', headline: page.title, description: page.description, url: `https://takehomedk.com${path}`, dateModified: '2026-06-27', publisher: { '@type': 'Organization', name: 'TakeHomeDK', url: 'https://takehomedk.com' } }]
    });
    return <StaticPage page={page}/>;
  }
  updateSeo({
    title: 'TakeHomeDK — Denmark Salary Calculator 2026',
    description: 'English Denmark salary, tax, Pay Limit Scheme, researcher tax and relocation calculator for expats considering Danish job offers.',
    path: '/',
    breadcrumbs: [{ name: 'Home', path: '/' }]
  });
  return <HomePage/>;
}

createRoot(document.getElementById('root')).render(<App/>);
