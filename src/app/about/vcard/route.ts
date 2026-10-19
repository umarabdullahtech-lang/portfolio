import { getSiteSettings } from "@/lib/data";
import { buildProfile } from "@/lib/profile";

export const dynamic = "force-dynamic";

// vCard 3.0: the version iOS Contacts and Android both import without prompting.
function escape(value: string) {
  return value.replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/([,;])/g, "\\$1");
}

export async function GET() {
  const profile = buildProfile(await getSiteSettings());
  const parts = profile.name.trim().split(/\s+/);
  const family = parts.length > 1 ? parts[parts.length - 1] : "";
  const given = parts.length > 1 ? parts.slice(0, -1).join(" ") : parts[0];

  const lines = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `N:${escape(family)};${escape(given)};;;`,
    `FN:${escape(profile.name)}`,
    `TITLE:${escape(profile.title)}`,
    profile.phone && `TEL;TYPE=CELL,VOICE:${profile.phone.href.replace("tel:", "")}`,
    profile.whatsapp && profile.whatsapp.display !== profile.phone?.display &&
      `TEL;TYPE=CELL:+${profile.whatsapp.href.replace("https://wa.me/", "").split("?")[0]}`,
    profile.email && `EMAIL;TYPE=INTERNET:${profile.email.display}`,
    "URL:https://umar-abdullah.com",
    profile.location && `ADR;TYPE=WORK:;;;${escape(profile.location)};;;`,
    ...profile.socials.map((social) => `X-SOCIALPROFILE;TYPE=${social.network}:${social.url}`),
    "END:VCARD",
  ].filter(Boolean);

  return new Response(`${lines.join("\r\n")}\r\n`, {
    headers: {
      "Content-Type": "text/vcard; charset=utf-8",
      "Content-Disposition": 'attachment; filename="umar-abdullah.vcf"',
      "Cache-Control": "no-store",
    },
  });
}
