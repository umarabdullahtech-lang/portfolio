import { publicContactEmail } from "./contact";

// Everything the About page, the vCard, and the footer know about the owner. All of it
// comes from site settings (editable in /admin); a value that is empty or malformed is
// simply left out rather than rendered as a dead link.

export type SocialNetwork = "linkedin" | "github" | "instagram" | "facebook" | "snapchat" | "x";

export type ContactLink = { display: string; href: string };

export type SocialProfile = {
  network: SocialNetwork;
  label: string;
  url: string;
  handle: string;
};

export type Profile = {
  name: string;
  title: string;
  bio: string[];
  location: string | null;
  timeZone: string;
  photo: string | null;
  email: ContactLink | null;
  phone: ContactLink | null;
  whatsapp: ContactLink | null;
  socials: SocialProfile[];
};

const SOCIALS: Array<{ network: SocialNetwork; key: string; label: string; base: string }> = [
  { network: "linkedin", key: "social_linkedin", label: "LinkedIn", base: "https://www.linkedin.com/in/" },
  { network: "github", key: "social_github", label: "GitHub", base: "https://github.com/" },
  { network: "instagram", key: "social_instagram", label: "Instagram", base: "https://www.instagram.com/" },
  { network: "facebook", key: "social_facebook", label: "Facebook", base: "https://www.facebook.com/" },
  { network: "snapchat", key: "social_snapchat", label: "Snapchat", base: "https://www.snapchat.com/add/" },
  { network: "x", key: "social_x", label: "X", base: "https://x.com/" },
];

// The site presents the owner as based in Pakistan (PK / UTC+05), so local numbers
// written as 03XX XXXXXXX are read with the +92 country code.
const DEFAULT_TIME_ZONE = "Asia/Karachi";
const DEFAULT_COUNTRY_CODE = "92";
const WHATSAPP_GREETING = "Hi Umar, I found you through umar-abdullah.com.";
const TRACKING_PARAMS = ["isSelfProfile", "utm_source", "utm_medium", "utm_campaign"];

function clean(value: string | undefined) {
  return value?.trim() || "";
}

// International digits without the plus: "+92 302 4182875", "0092…", and "0302…" all
// become "923024182875".
function phoneDigits(value: string) {
  let digits = value.replace(/\D/g, "");
  if (digits.startsWith("00")) digits = digits.slice(2);
  else if (!value.startsWith("+") && digits.startsWith("0")) digits = DEFAULT_COUNTRY_CODE + digits.slice(1);
  return digits.length >= 8 && digits.length <= 15 ? digits : null;
}

// Pakistani mobiles read as +92 3XX XXXXXXX; other numbers keep the owner's formatting.
function displayNumber(value: string, digits: string) {
  const mobile = digits.match(/^92(3\d{2})(\d{7})$/);
  return mobile ? `+92 ${mobile[1]} ${mobile[2]}` : value;
}

function phoneLink(value: string): ContactLink | null {
  const digits = phoneDigits(value);
  return digits ? { display: displayNumber(value, digits), href: `tel:+${digits}` } : null;
}

function whatsappLink(value: string): ContactLink | null {
  const digits = phoneDigits(value);
  if (!digits) return null;
  return {
    display: displayNumber(value, digits),
    href: `https://wa.me/${digits}?text=${encodeURIComponent(WHATSAPP_GREETING)}`,
  };
}

function socialProfile(value: string, network: SocialNetwork, label: string, base: string): SocialProfile | null {
  if (!value) return null;
  let url: URL;
  try {
    url = new URL(/^https?:\/\//i.test(value) ? value : `${base}${value.replace(/^@/, "")}`);
  } catch {
    return null;
  }
  if (url.protocol !== "https:" && url.protocol !== "http:") return null;
  url.protocol = "https:";
  url.hash = "";
  TRACKING_PARAMS.forEach((param) => url.searchParams.delete(param));

  // /in/handle (LinkedIn) and /add/handle (Snapchat) carry the handle in the second segment;
  // share links (/t/…) and profile.php?id=… have no readable handle.
  const segments = url.pathname.split("/").filter(Boolean);
  const name = ["in", "company", "add"].includes(segments[0]) ? segments[1] : segments[0] === "t" ? undefined : segments[0];
  const handle = name && !name.endsWith(".php") ? `@${decodeURIComponent(name)}` : `Add me on ${label}`;
  return { network, label, url: url.toString(), handle };
}

function validTimeZone(value: string) {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return value;
  } catch {
    return DEFAULT_TIME_ZONE;
  }
}

// Only files served from /public, so next/image can optimise them without remote config.
function localPhoto(value: string) {
  return value.startsWith("/") && !value.startsWith("//") ? value : null;
}

export function buildProfile(settings: Record<string, string>): Profile {
  const email = publicContactEmail(settings);
  const phone = clean(settings.contact_phone);
  const whatsapp = clean(settings.contact_whatsapp);

  return {
    name: clean(settings.hero_name) || "Umar Abdullah",
    title: clean(settings.hero_title) || "Senior Software Engineer & AI Engineer",
    bio: [settings.about_bio_1, settings.about_bio_2, settings.about_bio_3].map(clean).filter(Boolean),
    location: clean(settings.contact_location) || null,
    timeZone: validTimeZone(clean(settings.contact_timezone) || DEFAULT_TIME_ZONE),
    photo: localPhoto(clean(settings.profile_photo)),
    email: email ? { display: email, href: `mailto:${email}?subject=${encodeURIComponent("Hello Umar")}` } : null,
    phone: phone ? phoneLink(phone) : null,
    whatsapp: whatsapp ? whatsappLink(whatsapp) : null,
    socials: SOCIALS
      .map(({ network, key, label, base }) => socialProfile(clean(settings[key]), network, label, base))
      .filter((profile): profile is SocialProfile => Boolean(profile)),
  };
}
