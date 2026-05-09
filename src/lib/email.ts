import { Resend } from "resend";
import type { ScoreResult } from "./scoring";
import { resultContent, seatContent, type ResultContent, type SeatRecommendationContent } from "./results";

export async function sendLeadNotification({ name, email, phone }: { name: string; email: string; phone?: string }) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) return;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from,
    to: "hello@davitchkotua.com",
    subject: "მარკეტინგის კურსის ქვიზის ახალი ლიდი",
    text: `ახალი ლიდი:\n\nსახელი: ${name}\nელფოსტა: ${email}\nტელეფონი: ${phone ?? "—"}`,
  });
}

interface SendArgs {
  to: string;
  name: string;
  result: ScoreResult;
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function sendQuizResultEmail({ to, name, result }: SendArgs) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  if (!apiKey || !from) throw new Error("Resend is not configured");

  const resend = new Resend(apiKey);

  const courseUrl = "https://www.davitchkotua.com/course";
  const marketingMriUrl = process.env.MARKETING_MRI_URL || "https://www.davitchkotua.com/mri";
  const diagnosticCallUrl = process.env.DIAGNOSTIC_CALL_URL || "#";

  const content = resultContent[result.resultType];
  const seat = seatContent[result.seatRecommendation];

  const subject = "შენი Marketing Architecture Quiz შედეგი";

  return resend.emails.send({
    from,
    to,
    subject,
    html: buildHtml({ name, result, content, seat, courseUrl, marketingMriUrl, diagnosticCallUrl }),
    text: buildText({ name, result, content, seat, courseUrl, diagnosticCallUrl }),
  });
}

interface BuildArgs {
  name: string;
  result: ScoreResult;
  content: ResultContent;
  seat: SeatRecommendationContent;
  courseUrl: string;
  marketingMriUrl?: string;
  diagnosticCallUrl: string;
}

function buildText(a: BuildArgs): string {
  const { name, result, content, seat, courseUrl } = a; // eslint-disable-line @typescript-eslint/no-unused-vars
  return `გამარჯობა, ${name}

მადლობა Marketing Architecture Quiz-ის შევსებისთვის. ქვემოთ არის შენი საწყისი შეფასება: რამდენად სისტემურად იხარჯება მარკეტინგის ბიუჯეტი შენს ბიზნესში და რა უნდა დალაგდეს პირველ რიგში.

ეს არ არის სრული Marketing MRI ან ინდივიდუალური კონსულტაცია. ეს არის საწყისი შეფასება, რომელიც გეხმარება სწორი შემდეგი ნაბიჯის დანახვაში.

— ბიუჯეტის გამოყენება: ${result.budgetUseScore}% — ${result.budgetUseLabel}
— სისტემის სიცხადე: ${result.systemClarityScore}% — ${result.systemClarityLabel}
— კურსის შესაბამისობა: ${result.courseFitScore}% — ${result.courseFitLabel}

პირველი დასალაგებელი ზონა: ${content.primaryGapTitle}

${content.explanation}

7-დღიანი მოქმედებები:
${content.sevenDayActions.map((a, i) => `${i + 1}. ${a}`).join("\n")}

რეკომენდებული შემდეგი ნაბიჯი: ${seat.label}
${seat.text}

შემდეგი ნაბიჯი: მარკეტინგის არქიტექტურა — ქაოსიდან მართვად სისტემამდე

თუ გინდა ეს ყველაფერი ერთ სამუშაო სისტემად ააწყო, კურსი სწორედ ამისთვის არის შექმნილი: რომ მარკეტინგი აღარ იყოს პოსტების, რეკლამისა და სოციალური მედიის ცალკეული აქტივობები, არამედ გახდეს სამუშაო რუკა — ვის ელაპარაკები, რას სთავაზობ, როგორ ქმნი ნდობას, როგორ მიჰყავს ადამიანი ყიდვამდე და როგორ კითხულობ შედეგს.

კურსის პროგრამა:
• 7 კვირიანი live სამუშაო პროგრამა
• Marketing Architecture Blueprint / მარკეტინგის სამუშაო რუკა
• ერთი არჩეული გაყიდვამდე გზა
• ერთი გაყიდვის აქტივი
• Weekly Marketing Control Sheet
• Launch Checklist

დარეგისტრირდი კურსზე: ${courseUrl}

Davit Chkotua / Marketing Architect Studio`;
}

function buildHtml(a: BuildArgs): string {
  const { name, result, content, seat, courseUrl, marketingMriUrl, diagnosticCallUrl } = a;

  const actions = content.sevenDayActions
    .map(
      (step, i) =>
        `<tr><td style="padding:8px 16px;border-bottom:1px solid #2A2D35;font-size:14px;color:#D9D4C8;">
          <strong style="color:#D98A24;">${i + 1}.</strong>&nbsp;${esc(step)}
        </td></tr>`
    )
    .join("");

  const showCourseSection = result.courseFitScore >= 35;

  return `<!doctype html>
<html lang="ka">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Marketing Architecture Quiz</title>
</head>
<body style="margin:0;padding:0;background:#0F1115;background-color:#0F1115;font-family:'Noto Sans Georgian','Helvetica Neue',Arial,sans-serif;color:#F9FAFB;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0F1115;padding:32px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="background:#171A21;border:1px solid #2A2D35;border-radius:12px;max-width:600px;width:100%;">
        <tr><td style="padding:32px;">

          <!-- Header -->
          <p style="margin:0 0 6px 0;font-size:11px;color:#6B7280;letter-spacing:.18em;text-transform:uppercase;">Marketing Architecture Quiz · საწყისი შეფასება</p>
          <h1 style="margin:0 0 16px 0;font-size:22px;line-height:1.3;color:#F9FAFB;font-weight:600;">გამარჯობა, ${esc(name)}</h1>
          <p style="margin:0 0 12px 0;font-size:14px;line-height:1.6;color:#D9D4C8;">მადლობა Marketing Architecture Quiz-ის შევსებისთვის. ქვემოთ არის შენი საწყისი შეფასება: რამდენად სისტემურად იხარჯება მარკეტინგის ბიუჯეტი შენს ბიზნესში და რა უნდა დალაგდეს პირველ რიგში.</p>
          <p style="margin:0 0 24px 0;font-size:12px;line-height:1.5;color:#6B7280;border-left:3px solid #2A2D35;padding-left:12px;">ეს არ არის სრული Marketing MRI ან ინდივიდუალური კონსულტაცია. ეს არის საწყისი შეფასება, რომელიც გეხმარება სწორი შემდეგი ნაბიჯის დანახვაში.</p>

          <!-- Scores -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #2A2D35;border-radius:10px;margin:0 0 24px 0;">
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2A2D35;">
              <div style="font-size:12px;color:#6B7280;margin-bottom:4px;">ბიუჯეტის გამოყენება</div>
              <div style="font-size:18px;font-weight:600;color:#D98A24;">${result.budgetUseScore}% · ${esc(result.budgetUseLabel)}</div>
            </td></tr>
            <tr><td style="padding:14px 16px;border-bottom:1px solid #2A2D35;">
              <div style="font-size:12px;color:#6B7280;margin-bottom:4px;">სისტემის სიცხადე</div>
              <div style="font-size:18px;font-weight:600;color:#F9FAFB;">${result.systemClarityScore}% · ${esc(result.systemClarityLabel)}</div>
            </td></tr>
            <tr><td style="padding:14px 16px;">
              <div style="font-size:12px;color:#6B7280;margin-bottom:4px;">კურსის შესაბამისობა</div>
              <div style="font-size:18px;font-weight:600;color:#F9FAFB;">${result.courseFitScore}% · ${esc(result.courseFitLabel)}</div>
            </td></tr>
          </table>

          <!-- Primary gap -->
          <p style="margin:0 0 6px 0;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:.14em;">პირველი დასალაგებელი ზონა</p>
          <h2 style="margin:0 0 10px 0;font-size:18px;color:#F9FAFB;font-weight:600;">${esc(content.primaryGapTitle)}</h2>
          <p style="margin:0 0 24px 0;font-size:14px;line-height:1.7;color:#D9D4C8;">${esc(content.explanation)}</p>

          <!-- 7-day actions -->
          <p style="margin:0 0 8px 0;font-size:11px;color:#6B7280;text-transform:uppercase;letter-spacing:.14em;">7-დღიანი მოქმედებები</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #2A2D35;border-radius:10px;margin:0 0 24px 0;">
            ${actions}
          </table>

          <!-- Seat recommendation -->
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1E2028;border:1px solid #D98A24;border-radius:10px;margin:0 0 24px 0;">
            <tr><td style="padding:16px;">
              <div style="font-size:11px;color:#D98A24;text-transform:uppercase;letter-spacing:.14em;margin-bottom:6px;">რეკომენდებული შემდეგი ნაბიჯი: ${esc(seat.label)}</div>
              <div style="font-size:14px;line-height:1.6;color:#F9FAFB;">${esc(seat.text)}</div>
            </td></tr>
          </table>

          ${showCourseSection ? `
          <!-- Course offer -->
          <h2 style="margin:0 0 10px 0;font-size:16px;color:#F9FAFB;font-weight:600;">შემდეგი ნაბიჯი: მარკეტინგის არქიტექტურა — ქაოსიდან მართვად სისტემამდე</h2>
          <p style="margin:0 0 14px 0;font-size:14px;line-height:1.7;color:#D9D4C8;">თუ გინდა ეს ყველაფერი ერთ სამუშაო სისტემად ააწყო, კურსი სწორედ ამისთვის არის შექმნილი: რომ მარკეტინგი აღარ იყოს პოსტების, რეკლამისა და სოციალური მედიის ცალკეული აქტივობები, არამედ გახდეს სამუშაო რუკა.</p>
          <ul style="margin:0 0 20px 16px;padding:0;font-size:13px;line-height:1.8;color:#D9D4C8;">
            <li style="margin-bottom:4px;">7 კვირიანი live სამუშაო პროგრამა</li>
            <li style="margin-bottom:4px;">Marketing Architecture Blueprint / მარკეტინგის სამუშაო რუკა</li>
            <li style="margin-bottom:4px;">ერთი არჩეული გაყიდვამდე გზა</li>
            <li style="margin-bottom:4px;">ერთი გაყიდვის აქტივი</li>
            <li style="margin-bottom:4px;">Weekly Marketing Control Sheet</li>
            <li style="margin-bottom:4px;">Launch Checklist</li>
          </ul>

          <!-- CTAs -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:12px;">
            <tr>
              <td style="background:#D98A24;border-radius:8px;">
                <a href="${courseUrl}" style="display:inline-block;background:#D98A24;color:#0F1115;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:700;">დარეგისტრირდი კურსზე</a>
              </td>
            </tr>
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;">
            <tr>
              <td style="border:1px solid #2A2D35;border-radius:8px;">
                <a href="${marketingMriUrl}" style="display:inline-block;color:#D9D4C8;text-decoration:none;padding:11px 20px;border-radius:8px;font-size:13px;">დაჯავშნე Marketing MRI</a>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 12px 0;font-size:11px;line-height:1.5;color:#6B7280;padding-left:4px;">ეს არის სერვისი, სადაც შენი ბიზნესის სრული მარკეტინგული დიაგნოსტიკა და აღსრულების გეგმა შენს მაგივრად გამოცდილი გუნდი გააკეთებს.</p>
          ` : `
          <!-- Low fit — recommend diagnostic call -->
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;">
            <tr>
              <td style="background:#D98A24;border-radius:8px;">
                <a href="${diagnosticCallUrl}" style="display:inline-block;background:#D98A24;color:#0F1115;text-decoration:none;padding:12px 22px;border-radius:8px;font-size:14px;font-weight:700;">მინდა დიაგნოსტიკური ზარი</a>
              </td>
            </tr>
          </table>

          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-bottom:6px;">
            <tr>
              <td style="border:1px solid #2A2D35;border-radius:8px;">
                <a href="${marketingMriUrl}" style="display:inline-block;color:#D9D4C8;text-decoration:none;padding:11px 20px;border-radius:8px;font-size:13px;">დაჯავშნე Marketing MRI</a>
              </td>
            </tr>
          </table>
          <p style="margin:0 0 12px 0;font-size:11px;line-height:1.5;color:#6B7280;padding-left:4px;">ეს არის სერვისი, სადაც შენი ბიზნესის სრული მარკეტინგული დიაგნოსტიკა და აღსრულების გეგმა შენს მაგივრად გამოცდილი გუნდი გააკეთებს.</p>
          `}

          <!-- Footer -->
          <p style="margin:24px 0 0 0;font-size:12px;color:#6B7280;line-height:1.6;border-top:1px solid #2A2D35;padding-top:20px;">ეს არის საწყისი შეფასება და არა სრული Marketing MRI ან ინდივიდუალური კონსულტაცია. ზუსტი მიზეზების დასადგენად საჭიროა უფრო ღრმა ანალიზი.</p>
          <p style="margin:10px 0 0 0;font-size:13px;color:#6B7280;">Davit Chkotua / Marketing Architect Studio</p>

        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}
