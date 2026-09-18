const PROPERTY_TERMS = /\b(property|home|house|listing|address|mls|comp|comparable|price|valuation|dossier|audit|bluff|drainage|permit|title|escrow|contingency|deposit)\b/i;
const AFFIRMATIVE = /^(yes|yes please|please do|sure|okay|ok|absolutely|correct|that works)[.!]?$/i;

export function getPreviousAssistant(messages = []) {
  return [...messages].reverse().find((message) => message.sender === 'charlie' || message.sender === 'bob') || null;
}

export function isAffirmativeFollowUp(question = '') {
  return AFFIRMATIVE.test(question.trim());
}

export function buildRecentConversation(messages = []) {
  return messages.slice(-8).map((message) => {
    const role = message.sender === 'user' || message.sender === 'consumer' ? 'CLIENT' : message.sender === 'bob' ? 'BOB' : 'CHARLIE';
    return `${role}: ${message.text || ''}`;
  }).join('\n');
}

export function isPropertyConversation(question = '', messages = []) {
  const relevantText = isAffirmativeFollowUp(question)
    ? `${question}\n${buildRecentConversation(messages.slice(-4))}`
    : question;
  return PROPERTY_TERMS.test(relevantText);
}