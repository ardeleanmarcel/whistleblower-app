# Email Testing Guide

## How Email Notifications Work

When a report is submitted, the system automatically sends email notifications to all managers of the company.

## Viewing Test Emails (Ethereal)

If you're using Ethereal Email for testing (recommended for development), emails are **NOT sent to real email addresses**. Instead, they're captured by Ethereal's test SMTP server.

### Method 1: Check Terminal Logs (Easiest)

After submitting a report, check your terminal where `npm run dev` is running. You'll see:

```
📧 Sending emails to 1 manager(s)
📧 Attempting to send email to: your-email@example.com
✅ Email sent successfully!
📧 Preview URL: https://ethereal.email/message/XXXXXX
```

**Click the Preview URL** to view the email in your browser.

### Method 2: Login to Ethereal

Your current Ethereal credentials are in the `.env` file:

```env
SMTP_USER="om26rp5tpnebhgxq@ethereal.email"
SMTP_PASS="RSkH7bXAcgfJtfcK1E"
```

1. Go to: https://ethereal.email/messages
2. Login with the SMTP_USER and SMTP_PASS from your `.env`
3. View all captured emails

## Email Content

Each notification email includes:

- Company name
- Report category
- Submission timestamp
- Anonymous/Named indicator
- First 200 characters of the report
- Direct link to view full report in dashboard

## Switching to Real Email (Gmail)

To send actual emails to your Gmail inbox:

1. **Enable 2FA** on your Google account

2. **Create App Password**:

   - Go to: https://myaccount.google.com/apppasswords
   - Generate an app password for "Mail"
   - Copy the 16-character password

3. **Update `.env`**:

   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-real-email@gmail.com"
   SMTP_PASS="your-16-char-app-password"
   ```

4. **Restart dev server**: `npm run dev`

## Troubleshooting

### "Email not configured"

- Check that `SMTP_USER` and `SMTP_PASS` are set in `.env`
- Restart the dev server after changing `.env`

### "Failed to send email"

- Check terminal logs for specific error
- Verify SMTP credentials are correct
- For Gmail: Ensure App Password is used (not your regular password)

### Not receiving emails in real Gmail

- Make sure you updated `.env` with Gmail SMTP settings
- Restart the dev server
- Check spam folder
- Verify App Password is correct

## Testing Checklist

- [ ] SMTP credentials configured in `.env`
- [ ] Dev server restarted
- [ ] Manager account created with valid email
- [ ] Magic link created
- [ ] Report submitted via magic link
- [ ] Terminal shows "✅ Email sent successfully!"
- [ ] Preview URL clicked or Ethereal inbox checked
