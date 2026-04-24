import DOMPurify from "dompurify";

export function sanitizeText(input: string): string {
  return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
}

const MAX_SLOGAN_LEN = 200;
const MAX_MESSAGE_LEN = 2000;

export function validSlogan(input: string): boolean {
  const clean = sanitizeText(input).trim();
  return clean.length > 0 && clean.length <= MAX_SLOGAN_LEN;
}

export function validMessage(input: string): boolean {
  const clean = sanitizeText(input).trim();
  return clean.length > 0 && clean.length <= MAX_MESSAGE_LEN;
}

export function validEmail(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.trim());
}