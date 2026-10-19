// Domains reserved for documentation (RFC 2606). Mail sent there never reaches anyone,
// so a seeded placeholder like umar@example.com is treated as "no address set".
const RESERVED_EMAIL_DOMAINS = /@(?:[^@\s]+\.)?(?:example\.(?:com|net|org)|test|invalid|localhost)$/i;

export function publicContactEmail(settings: Record<string, string>) {
  const email = settings.contact_email?.trim();
  if (!email || RESERVED_EMAIL_DOMAINS.test(email)) return null;
  return email;
}
