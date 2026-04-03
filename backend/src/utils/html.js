export const getOtpHtml = ({ email, otp }) => {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<meta name="x-apple-disable-message-reformatting" />
<title>{{APP_NAME}} Verification Code</title>
<style>
/* Base reset */
html, body { margin: 0; padding: 0; }
body {
  background: #f6f7fb;
  color: #111;
  -webkit-text-size-adjust: 100%;
  -ms-text-size-adjust: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, 'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol', sans-serif;
}
table { border-collapse: collapse; }
img {
  border: 0;
  line-height: 100%;
  outline: none;
  text-decoration: none;
  display: block;
  max-width: 100%;
  height: auto;
}
/* Layout */
.wrapper { width: 100%; background: #f6f7fb; }
.outer { width: 100%; }
.container {
  width: 600px;
  max-width: 600px;
  background: #ffffff;
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid #e9ecf3;
}
.p-24 { padding: 24px; }
.p-32 { padding: 32px; }
.header {
  background: #111827;
  padding: 18px 24px;
  text-align: center;
}
.brand {
  display: inline-block;
  color: #ffffff;
  font-weight: 700;
  font-size: 16px;
  letter-spacing: 0.3px;
  text-decoration: none;
}
.title {
  margin: 0 0 12px 0;
  font-size: 22px;
  line-height: 1.3;
  color: #111;
  font-weight: 700;
}
.text {
  margin: 0 0 16px 0;
  font-size: 15px;
  line-height: 1.6;
  color: #444;
}
.muted {
  color: #555;
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 12px 0;
}
/* OTP badge */
.otp-wrap { margin: 20px 0; width: 100%; }
.otp {
  display: inline-block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  padding: 14px 18px;
  font-size: 32px;
  letter-spacing: 10px;
  font-weight: 700;
  color: #111;
  font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
}
/* Button (optional) */
.btn {
  display: inline-block;
  background: #111827;
  color: #ffffff !important;
  text-decoration: none;
  padding: 12px 18px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
}
/* Footer */
.footer {
  text-align: center;
  color: #6b7280;
  font-size: 12px;
  line-height: 1.6;
  padding: 16px 24px 0 24px;
}
/* Responsive */
@media only screen and (max-width: 600px) {
  .container { width: 100% !important; }
  .p-32 { padding: 24px !important; }
  .otp {
    font-size: 28px !important;
    letter-spacing: 6px !important;
  }
}
</style>
</head>
<body>
<table role="presentation" class="wrapper" width="100%" border="0" cellspacing="0" cellpadding="0">
<tr>
<td align="center" class="p-24">
<table role="presentation" class="container" border="0" cellspacing="0" cellpadding="0">
<!-- Header -->
<tr>
<td class="header">
<span class="brand">Authentication App</span>
</td>
</tr>
<!-- Body -->
<tr>
<td class="p-32">
<h1 class="title">Verify your email - ${email}</h1>
<p class="text">
Use the verification code below to complete your sign-in to Authentication App.
</p>
<!-- OTP -->
<table role="presentation" class="otp-wrap" border="0" cellspacing="0" cellpadding="0">
<tr>
<td align="center">
<div class="otp">${otp}</div>
</td>
</tr>
</table>
<p class="muted">This code will expire in <strong>5 minutes</strong>.</p>
<p class="muted">If this wasn’t initiated, this email can be safely ignored.</p>
</td>
</tr>
<!-- Footer -->
<tr>
<td class="footer">
 2026 Finance App. All rights reserved.
</td>
</tr>
<tr>
<td height="16" aria-hidden="true"></td>
</tr>
</table>
</td>
</tr>
</table>
</body>
</html>`;
  return html;
};
