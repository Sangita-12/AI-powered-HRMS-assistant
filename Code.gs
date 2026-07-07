
// ============================================================
//  KAVIA HRMS - Google Apps Script Backend (Code.gs)
//  Developed by SANGITA → Anyone can access
// ============================================================

const ANTHROPIC_API_KEY = 'YOUR_API_KEY'; // Replace with your key

// ── Entry point ──────────────────────────────────────────────
function doGet(e) {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Kavia HRMS')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

// ── AI Agent ─────────────────────────────────────────────────
function askAI(userMessage, context) {
  const systemPrompt = `You are KaviaHR Assistant, an intelligent HR agent for Kavia Engineering Pvt. Ltd., Bangalore.
You help HR teams with:
- Recruitment SOPs and checklists
- Onboarding steps and document requirements
- Performance review guidance
- Payroll queries
- Policy clarifications
- Exit process steps
- Learning & training recommendations
- DISC personality analysis guidance
- Offer letter drafting help

Company address: 86-I, Phase 1, Jigani Industrial Area, Anekal Taluk, Bangalore 560105

Always respond in a professional, helpful tone. If asked for a checklist or SOP, provide a numbered/bulleted list.
Current context: ${context || 'General HR query'}`;

  const payload = {
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 1500,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }]
  };

  const options = {
    method: 'post',
    contentType: 'application/json',
    headers: { 'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01' },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/messages', options);
    const json = JSON.parse(response.getContentText());
    if (json.content && json.content[0]) return json.content[0].text;
    return 'Sorry, I could not process your request. Please try again.';
  } catch (err) {
    return 'Error: ' + err.message;
  }
}

// ── Recruitment Checklist ────────────────────────────────────
function getRecruitmentChecklist() {
  return {
    title: 'Recruitment SOP Checklist',
    steps: [
      { phase: 'Requisition', items: ['Raise Recruitment Requisition Form (F-Recruitment Requisition)', 'Get HOD approval', 'Define JD & KRA/KPI from JD/Timeplan sheet', 'Post job on portals / internal referral'] },
      { phase: 'Screening', items: ['Screen CVs against JD', 'Schedule telephonic / video interview', 'Administer relevant test paper (10th/12th/ITI/DME/BE Mech/BE Electrical/HR)', 'Record scores in Response Sheet'] },
      { phase: 'Interview', items: ['Schedule panel interview', 'Fill Interview Feedback Form', 'DISC Personality Analysis (optional)', 'HOD final decision'] },
      { phase: 'Offer', items: ['Generate Offer Letter via Create Offer Letter sheet', 'Share with candidate via email (use mail template)', 'Collect document submission as per checklist', 'Update Recruitment Tracker'] },
      { phase: 'Pre-Joining', items: ['Send joining instructions', 'Collect: ID proof, PAN, graduation docs, prev offer letter, 3-month salary slips, 2 passport photos', 'Intimate IT/Admin for laptop/access setup'] }
    ]
  };
}

// ── Onboarding Checklist ─────────────────────────────────────
function getOnboardingChecklist() {
  return {
    title: 'Onboarding Checklist',
    steps: [
      { phase: 'Day 0 (Pre-Joining)', items: ['Send welcome email with joining details', 'Prepare workstation / laptop', 'Create email ID & system access', 'Assign buddy / mentor', 'Prepare onboarding kit'] },
      { phase: 'Day 1', items: ['Welcome & office tour', 'Introduction to team', 'Submit physical documents', 'Sign appointment letter', 'ID card issuance', 'Policy briefing (HR Manual)'] },
      { phase: 'Week 1', items: ['Induction training schedule', 'Complete Induction Test online', 'Meet department HOD', 'Review JD & KRA/KPIs', 'Set up tools & software access'] },
      { phase: 'Month 1', items: ['30-day check-in with HR', 'Training plan confirmation', 'Assign first project/task', 'Payroll enrollment confirmation', 'Any open issues resolved'] }
    ]
  };
}

// ── Exit Checklist ───────────────────────────────────────────
function getExitChecklist() {
  return {
    title: 'Exit Process Checklist',
    steps: [
      { phase: 'Resignation', items: ['Receive resignation letter', 'Acknowledge & confirm notice period', 'Inform HOD & management', 'Update HRMS / tracker'] },
      { phase: 'Notice Period', items: ['Knowledge transfer plan', 'Handover documents', 'Replacement hiring if needed', 'Exit interview scheduling'] },
      { phase: 'Last Day', items: ['Exit interview conducted', 'Collect company assets (laptop, ID card, etc.)', 'Revoke system access & email', 'Full & final settlement calculation', 'Issue Experience/Relieving Letter'] }
    ]
  };
}

// ── Performance Checklist ────────────────────────────────────
function getPerformanceChecklist() {
  return {
    title: 'Performance Management Checklist',
    steps: [
      { phase: 'Goal Setting', items: ['Define KRA & KPI with employee (from KPI & KRA Sheet)', 'Align with company objectives', 'Document & get sign-off', 'Set review frequency (monthly/quarterly)'] },
      { phase: 'Mid-Year Review', items: ['Review KPI achievement %', 'Identify gaps & support needed', '360° feedback collection', 'Document review outcomes'] },
      { phase: 'Annual Review', items: ['Final KPI scoring', 'Overall performance rating', 'Salary revision recommendation', 'Promotion / role change discussion', 'Individual Development Plan for next year'] }
    ]
  };
}

// ── Mail Templates ───────────────────────────────────────────
function getMailTemplates() {
  return [
    {
      name: 'Document Submission Request',
      subject: 'Documents Required - Candidature at Kavia Engineering',
      body: `Hello,

Subsequent to the interview rounds, we would like to take your candidature ahead.

With respect to this, requesting you to share the following documents at the earliest:
• Identity proof (excluding Aadhar)
• PAN card
• Graduation documents
• Last company appointment letter / offer letter
• Last 3 months salary slip
• 2 Passport size photographs

Regards,
HR Team
Kavia Engineering Pvt. Ltd.`
    },
    {
      name: 'Employment Offer',
      subject: 'Offer of Employment – [Designation] – Kavia Engineering Pvt. Ltd.',
      body: `Dear [Candidate Name],

We are pleased to offer you an appointment in our organisation as [Designation] with effect from [Date] on an annual package of Rs. __________.

We look forward to seeing you in our office on [Date] at 10:00 AM at:
Kavia Engineering Pvt. Ltd., 86-I, Phase 1, Jigani Industrial Area, Anekal Taluk, Bangalore 560105.

Please bring the following scanned documents:
1. 4 passport size photographs
2. ID & residence proof (Aadhar / Driving License / Passport)
3. PAN Card
4. Educational documents (mark sheets, diploma, certificates)
5. Last employment offer/appointment letter, relieving letters, salary revision letter, last 3 months salary slips

Please acknowledge this email as acceptance of the offer.

Thanks & Regards
Human Resources
Kavia Engineering Pvt. Ltd.`
    },
    {
      name: 'Interview Call Letter',
      subject: 'Interview Invitation – [Position] – Kavia Engineering Pvt. Ltd.',
      body: `Dear [Candidate Name],

Thank you for your interest in the [Position] role at Kavia Engineering Pvt. Ltd.

We are pleased to invite you for an interview on:
Date: [Date]
Time: [Time]
Venue: Kavia Engineering Pvt. Ltd., 86-I, Phase 1, Jigani Industrial Area, Anekal Taluk, Bangalore 560105
/ Video Call: https://meet.jit.si/cbx

Please carry your updated resume and ID proof.

Regards,
HR Team`
    }
  ];
}
function testAI() {
  const result = askAI('Hello, are you working?', 'Test');
  Logger.log(result);
}
function testURL() {
  const response = UrlFetchApp.fetch('https://api.anthropic.com/v1/models', {
    headers: {'x-api-key': ANTHROPIC_API_KEY, 'anthropic-version': '2023-06-01'},
    muteHttpExceptions: true
  });
  Logger.log(response.getContentText());
}
