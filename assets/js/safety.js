export const riskPatterns = [
  /kill myself/i,/end my life/i,/suicide/i,/hurt myself/i,/cut myself/i,/overdose/i,/want to die/i,/already hurt myself/i,
  /আত্মহত্যা/i,/মরে যেতে চাই/i,/বাঁচতে চাই না/i,/নিজেকে আঘাত/i,/নিজেকে মেরে/i,/নিজেকে শেষ/i,
  /suicide kor/i,/more jete chai/i,/nijeke mere/i,/nijeke aghat/i,/bachte chai na/i
];

export const linkPatterns = [
  /(?:https?|hxxps?):\/\//i,
  /(?:^|\s)\/\/[^\s]+/i,
  /\bwww\./i,
  /\b(?:t\.me|wa\.me|youtu\.be|bit\.ly|tinyurl\.com)\b/i,
  /\b[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.(?:com|org|net|io|co|me|app|dev|xyz|info|bd|uk|us|ai)(?:\/\S*)?\b/i,
  /\b[a-z0-9-]+\s*(?:dot|\[\.\]|\(\.\))\s*(?:com|org|net|io|co|me|app|dev|xyz|info|bd|uk|us|ai)\b/i,
  /(?:facebook\.com|instagram\.com|youtube\.com|linkedin\.com|x\.com|twitter\.com|telegram\.me)/i,
  /(?:link|লিংক)\s*[:：-]?\s*\S+/i
];

export const privatePatterns = [
  /\b(?:\+?88)?01[3-9]\d{8}\b/i,
  /\b[\w.+-]+@[\w.-]+\.[a-z]{2,}\b/i,
  /(?:facebook|instagram|whatsapp|telegram|imo)\s*(?:id|number|নম্বর|আইডি)?/i,
  /(?:বাসা|বাড়ি|ঠিকানা|address)\s*[:：-]?\s*.{6,}/i,
  /(?:^|\s)@[a-z0-9_.-]{3,}(?:\s|$)/i,
  ...linkPatterns
];

// This project owner asked that explicit sexual and addiction/substance content
// not be posted in this community. The checks are intentionally conservative and
// are not used for advertising, analytics, or user profiling.
export const prohibitedSensitivePatterns = [
  /\b(?:sex|sexual|porn|pornography|nude|nudity|explicit|sexting|fetish|masturbat(?:e|ion)|intercourse)\b/i,
  /(?:পর্ন|অশ্লীল|নগ্ন|নুড|যৌন|সেক্স|সেক্সটিং|হস্তমৈথুন)/i,
  /\b(?:addiction|addicted|drug|drugs|substance abuse|heroin|cocaine|methamphetamine|crystal meth|opioid|recreational drugs)\b/i,
  /(?:আসক্তি|আসক্ত|মাদক|নেশা|হেরোইন|কোকেন|ইয়াবা|ইয়াবা|ফেনসিডিল)/i,
  /\b(?:yaba|ganja|weed|marijuana|hashish|phensedyl)\b/i
];

export function containsUrgentRisk(text = "") { return riskPatterns.some(pattern => pattern.test(text)); }
export function containsLink(text = "") { return linkPatterns.some(pattern => pattern.test(text)); }
export function containsPrivateInfo(text = "") { return privatePatterns.some(pattern => pattern.test(text)); }
export function containsProhibitedSensitiveContent(text = "") {
  return prohibitedSensitivePatterns.some(pattern => pattern.test(text));
}

export function validateCommunityText(text = "") {
  if (containsUrgentRisk(text)) return { ok: false, reason: "urgent-risk" };
  if (containsLink(text)) return { ok: false, reason: "link" };
  if (containsPrivateInfo(text)) return { ok: false, reason: "private-info" };
  if (containsProhibitedSensitiveContent(text)) return { ok: false, reason: "restricted-sensitive" };
  return { ok: true, reason: "" };
}
