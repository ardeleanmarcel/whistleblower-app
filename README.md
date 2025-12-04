# Whistleblower App

A secure, confidential whistleblower reporting system for EU companies to comply with legal requirements for internal reporting of unethical, illegal, or unsafe behavior.

## 🏗️ Architecture

### Tech Stack

- **Frontend**: Next.js 16 (React 19, App Router, TypeScript)
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM (v5.22.0)
- **Authentication**: JWT with httpOnly cookies
- **Styling**: Tailwind CSS v4
- **Password Hashing**: bcryptjs
- **Deployment Ready**: Vercel/Railway/Docker

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                         │
├──────────────────────┬──────────────────────┬───────────────┤
│  Manager Dashboard   │   Public Report Form  │  Auth Pages   │
│  (Protected)         │   (Anonymous)        │  (Public)     │
└──────────────────────┴──────────────────────┴───────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      API LAYER (Next.js)                     │
├──────────────────┬─────────────────┬───────────────────────┤
│  Auth Routes     │  Magic Links    │  Reports              │
│  /api/auth/*     │  /api/magic-links│ /api/reports/*       │
└──────────────────┴─────────────────┴───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                    BUSINESS LOGIC LAYER                      │
├──────────────────┬─────────────────┬───────────────────────┤
│  Authentication  │  Authorization   │  Data Segregation     │
│  (JWT + bcrypt)  │  (requireAuth)   │  (Company-based)      │
└──────────────────┴─────────────────┴───────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     DATA LAYER (Prisma ORM)                  │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  SQLite Database                                     │   │
│  │  - Companies  - Managers  - MagicLinks  - Reports   │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Security Features

1. **Data Segregation**: All queries filter by `companyId` to ensure managers only see their company's data
2. **JWT Authentication**: Secure, httpOnly cookies prevent XSS attacks
3. **Password Hashing**: bcryptjs with salt for secure password storage
4. **Anonymous Reporting**: No authentication required for employees to submit reports
5. **Magic Links**: Unique, trackable links per company for organized report tracking

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- npm/yarn/pnpm

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/ardeleanmarcel/whistleblower-app.git
cd whistleblower-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root:

```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="temp-jwt"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# Email Configuration (SMTP)
# For Gmail: Use App Password (https://support.google.com/accounts/answer/185833)
# For Mailgun, SendGrid, or other providers: Use their SMTP credentials
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-password-or-api-key"
```

**Email Setup Options**:

- **Gmail**: Enable 2FA and create an App Password
- **Mailgun**: Use SMTP credentials from your Mailgun account
- **SendGrid**: Use API key as password with `apikey` as username
- **Local Testing**: Use [Ethereal Email](https://ethereal.email/) for testing without real emails

**Setting Up Ethereal Email for Testing** (Recommended for Development):

Ethereal is a fake SMTP service that captures emails instead of sending them. Perfect for testing!

```bash
# Generate Ethereal test credentials
node -e "
const nodemailer = require('nodemailer');
nodemailer.createTestAccount((err, account) => {
  if (err) return console.error(err);
  console.log('SMTP_HOST=\"' + account.smtp.host + '\"');
  console.log('SMTP_PORT=\"' + account.smtp.port + '\"');
  console.log('SMTP_USER=\"' + account.user + '\"');
  console.log('SMTP_PASS=\"' + account.pass + '\"');
  console.log('\\nView emails at: https://ethereal.email/messages');
  console.log('Login: ' + account.user + ' / ' + account.pass);
});
"
```

Copy the output credentials to your `.env` file. When you submit a report:

1. Check your terminal for the "📧 Preview URL" in the logs
2. Click that URL to view the email, OR
3. Login at https://ethereal.email/messages with the credentials above

**Note**: Emails are NOT sent to real addresses when using Ethereal - they're captured for testing only!

4. **Set up the database**

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed test data (optional)
npm run seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Test Credentials (if you ran the seed)

- **Email**: `admin@example.com`
- **Password**: `password`
- **Company**: Test Company

## ✨ What's Included

This application includes all core features for EU whistleblower compliance:

### ✅ Implemented Features

- **Authentication & Authorization**: Secure JWT-based login/signup with company-based data segregation
- **Magic Link System**: Create and manage unique reporting links with custom labels
- **Anonymous Reporting**: Public submission form requiring no authentication
- **Report Management**: View all reports with filtering and sorting
- **Status Updates**: Interactive dropdown to change report status (OPEN → IN_REVIEW → CLOSED)
- **Email Notifications**: Automatic alerts to managers when reports are submitted
- **Responsive UI**: Clean, accessible interface with navigation
- **Security**: Password hashing, httpOnly cookies, SQL injection protection
- **Documentation**: Comprehensive setup and usage guides

### 📚 Additional Documentation

- **[EMAIL_TESTING.md](./EMAIL_TESTING.md)**: Email configuration and troubleshooting
- **[STATUS_UPDATE_FEATURE.md](./STATUS_UPDATE_FEATURE.md)**: Implementation details for status management
- **[ARCHITECTURE.md](./ARCHITECTURE.md)**: Technical architecture and design decisions

## 📱 Features

### For Managers

1. **Sign Up**: Create an account with company name and email
2. **Log In**: Secure authentication with JWT
3. **Create Magic Links**: Generate unique reporting links with optional labels
4. **View Reports**: See all submitted reports with:
   - Report content
   - Category
   - Status (OPEN/IN_REVIEW/CLOSED)
   - Submission date
   - Contact info (if not anonymous)
   - Magic link used
5. **Update Report Status**: Change status with color-coded dropdown
   - OPEN (Blue) → IN_REVIEW (Yellow) → CLOSED (Green)
   - Updates stored in database
   - Visual feedback with color changes
6. **Email Notifications**: Receive instant email alerts when new reports are submitted
   - Professional HTML email template
   - Report preview (first 200 characters)
   - Direct link to dashboard
   - Anonymous/Named indicator

### For Employees

1. **Anonymous Reporting**: Access via magic link (`/r/[token]`)
2. **Optional Identity**: Choose to provide contact info or stay anonymous
3. **Categorization**: Select report category
4. **No Login Required**: Frictionless reporting experience
5. **Confirmation**: Instant confirmation when report is submitted

## 🗂️ Project Structure

```
whistleblower-app/
├── prisma/
│   ├── schema.prisma          # Database schema
│   ├── seed.ts                # Test data seeder
│   └── migrations/            # Database migrations
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   │   ├── login/
│   │   │   │   ├── logout/
│   │   │   │   └── signup/
│   │   │   ├── magic-links/   # Magic link management
│   │   │   └── reports/       # Report CRUD
│   │   ├── dashboard/         # Manager dashboard
│   │   ├── magic-links/       # Magic link management UI
│   │   ├── reports/           # Reports list UI
│   │   ├── r/[token]/         # Public report submission
│   │   ├── signup/            # Registration page
│   │   └── page.tsx           # Login page
│   ├── components/
│   │   ├── Navigation.tsx     # Navigation bar with logout
│   │   └── StatusDropdown.tsx # Report status update dropdown
│   └── lib/
│       ├── auth.ts            # Authentication utilities
│       ├── email.ts           # Email notification service
│       ├── prisma.ts          # Prisma client singleton
│       └── requireAuth.ts     # Auth middleware
├── .env                       # Environment variables
├── package.json
└── README.md
```

## 🔒 Security Considerations

1. **JWT Secret**: Change `JWT_SECRET` in production to a strong, random value
2. **HTTPS**: Always use HTTPS in production
3. **Rate Limiting**: Consider adding rate limiting for API endpoints
4. **Input Validation**: All inputs are validated on the server
5. **SQL Injection**: Protected by Prisma's parameterized queries
6. **XSS**: React automatically escapes content
7. **CSRF**: Consider adding CSRF tokens for state-changing operations

## 🚢 Deployment

### Option 1: Vercel (Recommended for Next.js)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables:
   - `DATABASE_URL` (use Vercel Postgres or external DB)
   - `JWT_SECRET`
   - `NEXT_PUBLIC_BASE_URL`
4. Deploy!

**Note**: For production, migrate from SQLite to PostgreSQL:

- Update `schema.prisma` provider to `postgresql`
- Update `DATABASE_URL` to PostgreSQL connection string

### Option 2: Railway/Render

1. Connect your repository
2. Add environment variables
3. Use PostgreSQL add-on for database
4. Deploy

### Option 3: Docker

```dockerfile
# Dockerfile can be added
docker build -t whistleblower-app .
docker run -p 3000:3000 whistleblower-app
```

## 📧 Email Notifications

Email notifications are sent to all company managers when a new report is submitted.

**For testing instructions and troubleshooting**, see [EMAIL_TESTING.md](./EMAIL_TESTING.md)

Quick start:

- Ethereal credentials are already configured in `.env`
- After submitting a report, check terminal for "📧 Preview URL"
- Click the Preview URL to view the email

## 🧪 Testing

Future improvements could include:

- Unit tests with Jest/Vitest
- Integration tests for API routes
- E2E tests with Playwright
- Security scanning with OWASP ZAP

## 🔄 Future Enhancements

Possible improvements for the future:

1. **File Uploads**: Allow attachment of evidence (documents, images, audio)
2. **Two-Factor Authentication**: Enhanced security for manager accounts
3. **Advanced Filtering**: Filter reports by date range, category, status
4. **Audit Log**: Track all actions and changes for compliance
5. **Multi-language Support**: i18n for international companies
6. **Report Threading**: Allow follow-up communication on reports
7. **Dashboard Analytics**: Visual charts and statistics
8. **Bulk Actions**: Update multiple report statuses at once
9. **Export Reports**: Download reports as PDF or CSV
10. **Status Change Notifications**: Email managers when status changes

## 🙏 Acknowledgments

- Next.js team for the excellent framework
- Prisma for the fantastic ORM
- The EU for mandating ethical workplace practices
