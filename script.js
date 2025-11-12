const templateEl = document.getElementById('template');
const dateEl = document.getElementById('date');
const toEl = document.getElementById('toName');
const fromEl = document.getElementById('fromName');
const subjectEl = document.getElementById('subject');
const bodyEl = document.getElementById('body');
const signEl = document.getElementById('signature');

const pDate = document.getElementById('pDate');
const pTo = document.getElementById('pTo');
const pSubject = document.getElementById('pSubject');
const pBody = document.getElementById('pBody');
const pFrom = document.getElementById('pFrom');

const TEMPLATES = {
  formal: {
    subject: 'Business Proposal / Request',
    body: `Dear [Recipient],\n\nI hope this message finds you well. I am writing to bring to your attention an important matter regarding our ongoing collaboration. [Write the reason: e.g., propose a meeting, request information, submit a proposal].\n\nI would appreciate your consideration and look forward to your response. Please let me know a suitable time for further discussion.\n\nThank you for your time and support.`,
  },
  leave: {
    subject: 'Leave Application',
    body: `Respected [Manager Name],\n\nI am writing to request leave for [number] days from [start date] to [end date] due to [reason]. I have ensured that my ongoing tasks are handed over to [colleague name] and relevant documents are available.\n\nI kindly request you to approve my leave.\n\nThank you.`,
  },
  recommend: {
    subject: 'Letter of Recommendation',
    body: `To Whom It May Concern,\n\nI am pleased to recommend [Name] for [position/course]. During [his/her/their] time at [organization/institution], [Name] demonstrated exceptional skills in [areas]. I am confident that [Name] will be an asset to your organization.\n\nSincerely,`,
  },
  informal: {
    subject: 'Just Saying Hi',
    body: `Hey [Friend],\n\nI hope you're doing great! It's been a while since we last caught up. I wanted to check in and see how things are going with you. Let's plan to meet soon.\n\nTake care,`,
  }
};

function setToday(){
  const now = new Date();
  const opts = { year: 'numeric', month: 'long', day: 'numeric'};
  dateEl.value = now.toLocaleDateString(undefined, opts);
}

function applyTemplate(key){
  const tpl = TEMPLATES[key];
  if(!tpl) return;
  subjectEl.value = tpl.subject;
  bodyEl.value = tpl.body.replace(/\[([^\]]+)\]/g, (m, p)=> p);
  updatePreview();
}

function updatePreview(){
  pDate.textContent = dateEl.value || '--';
  pTo.innerHTML = 'To: <strong>' + (toEl.value || 'Recipient Name') + '</strong>';
  pSubject.innerHTML = 'Subject: ' + (subjectEl.value || '');
  pBody.textContent = bodyEl.value || 'Start writing your letter or click a template to load sample text.';
  pFrom.textContent = signEl.value || (fromEl.value || 'Your Name');
}

document.getElementById('apply').addEventListener('click', updatePreview);
[dateEl,toEl,fromEl,subjectEl,bodyEl,signEl].forEach(el=>el.addEventListener('input', updatePreview));

document.querySelectorAll('.chip').forEach(btn=>btn.addEventListener('click', e=>{
  const key = e.currentTarget.dataset.tpl;
  templateEl.value = key;
  applyTemplate(key);
}));

templateEl.addEventListener('change', ()=>applyTemplate(templateEl.value));

document.getElementById('copy').addEventListener('click', async ()=>{
  const text = buildPlainText();
  try{
    await navigator.clipboard.writeText(text);
    alert('Letter copied to clipboard');
  }catch(err){
    console.warn(err);
    const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    alert('Letter copied (fallback)');
  }
});

document.getElementById('exportTxt').addEventListener('click', ()=>{
  const blob = new Blob([buildPlainText()], {type:'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'letter.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
});

document.getElementById('download').addEventListener('click', ()=>{
  window.print();
});

function buildPlainText(){
  return `${dateEl.value || ''}\n\nTo: ${toEl.value || ''}\nSubject: ${subjectEl.value || ''}\n\n${bodyEl.value || ''}\n\nSincerely,\n${signEl.value || fromEl.value || ''}`;
}

setToday();
applyTemplate('formal');
updatePreview();