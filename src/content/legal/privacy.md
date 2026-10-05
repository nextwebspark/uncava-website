---
lastUpdated: 2026-10-05
reviewedByCounsel: false
---

This policy explains how [Company legal name] ("Uncava", "we", "us") handles personal data when you visit uncava.com, use the Uncava application, connect a mailbox or calendar to it, or install the UNCAVA Capture browser extension. It also explains what we do with information about executives held in Uncava.

## Who we are

Uncava is operated by [Company legal name], a company registered in the United Arab Emirates [free zone or emirate, licence number], with its registered address at [Registered address].

- For **account, website and billing data**, and for the **company and executive data Uncava itself sources**, we are the controller.
- For the **data a search firm or hiring team puts into its workspace** — candidates, notes, documents, outreach — the firm is the controller and we process it on its behalf, under our [Data processing addendum](/dpa).

Privacy questions and requests: [Privacy email address].

## Information we collect

**Account and workspace data.** Your name, email address, job title, profile photo, time zone and language; a bcrypt hash of your password if you sign in with one; the Google or LinkedIn identity you link if you sign in with those; the workspaces you belong to and your role in them; when you accepted these terms and which version of this policy you saw.

**Security and usage records.** Sign-in times, the IP address and browser user agent of each session, and an audit log of sensitive actions such as exports and membership changes.

**Content you add.** Positions and briefs, companies and decisions about them, executive records, notes, tags, documents you upload (CVs, cover letters, references), messages you send through outreach, and questions you ask the Uncava Assistant.

**Data from connected mailboxes and calendars.** Only when you connect Google, Microsoft or Zoom, and only what is described in [Google, Microsoft and Zoom data](#google-microsoft-and-zoom-data).

**Information about executives.** Uncava holds professional information about executives so that search firms can research a market: name, current and past roles and employers, location, the public LinkedIn profile URL and profile content, and, where a firm requests it, business email and phone. This comes from licensed business data providers, from publicly available professional sources, and from what workspace members capture or enter. Where a firm uses AI assessment, Uncava may also derive gender, nationality, seniority and years of experience from that information and score fit against a role; these are marked as AI output and can be corrected.

**Website visits.** uncava.com is a static site. It sets no cookies and runs no analytics. Our hosting provider records standard server logs (IP address, requested URL, time, user agent) for security and operations.

**The Capture extension.** When you choose to capture a LinkedIn page, the extension sends the company or person on that page to your workspace. It keeps your sign-in token in the browser's extension storage and reads no other sites.

## How we use information

- To provide the service: run workspaces, store and search records, send the emails you write, book the calls you arrange, generate reports.
- To run AI features you invoke: drafting a brief from a document, proposing companies, assessing a candidate, writing an outreach opener. Client names and contact details are masked before text reaches the model.
- To keep Uncava secure: authentication, rate limits, fraud and abuse prevention, audit logs.
- To send service email: verification, invitations, password resets and security notices.
- To support you when you ask, and to meet legal obligations.

We do not sell personal data, use it for advertising, or use your workspace content or mailbox data to train AI models.

## Legal bases

Where the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021), the Saudi Personal Data Protection Law, the EU or UK GDPR, or a similar law applies, we rely on:

- **Contract** — to provide the service to you and your workspace.
- **Legitimate interests** — to keep the service secure, to improve it, and to maintain professional information about executives so firms can approach them about senior roles. We balance this against executives' interests and honour objections.
- **Consent** — when you connect a mailbox, calendar or Zoom account; you can withdraw it at any time by disconnecting.
- **Legal obligation** — where a law requires us to keep or disclose information.

## Google, Microsoft and Zoom data

Connecting a mailbox or calendar is optional and done by each user. Uncava asks only for the access the outreach and scheduling features need, and uses it only to provide those features to you.

**Google (Gmail and Google Calendar).** Uncava requests `openid`, `email`, `gmail.send`, `gmail.metadata`, `calendar.events` and `calendar.freebusy`. With them Uncava:

- reads your email address;
- sends the emails you compose in Uncava, from your mailbox;
- reads the sender and the `Message-ID` and `References` headers of threads Uncava sent, to detect replies and bounces and to thread follow-ups — it never reads message bodies or attachments, and never reads other mail;
- reads your calendar's events (title, time, attendees and organiser, join link, location — never descriptions) and keeps only those whose attendees are already people in your workspace;
- reads free/busy to offer booking times, and creates the events and Google Meet links you book.

Uncava does not use Google Drive.

**Uncava's use and transfer of information received from Google APIs to any other app will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.** Specifically, we use Google user data only to provide and improve the user-facing features described here; we do not transfer it except as needed to provide those features, for security, to comply with law, or as part of a merger or acquisition with notice; we do not use it for advertising; we do not use it to develop, improve or train generalised AI or machine-learning models; and no person reads it except with your consent, for security, or to comply with law.

**Microsoft (Outlook and Microsoft 365 calendars).** Uncava requests the delegated permissions `offline_access`, `User.Read`, `Mail.ReadWrite`, `Mail.Send` and `Calendars.ReadWrite`, for work or school accounts. It uses them exactly as for Google: it reads your email address, creates and sends the emails you compose (as a draft first, so they thread correctly), reads only the sender, time and folder of messages to detect replies, reads calendar availability and events as above, and creates the events and Teams meetings you book. It does not read message bodies.

**Zoom.** Uncava creates, updates and deletes the Zoom meetings you book, and reads your Zoom user profile to do so.

**What is stored.** The emails you send through Uncava (subject, body, message and thread ids, time sent); your mailbox address and connection status; and, for matched calendar events, the title, time, join link and conferencing provider. Refresh tokens are encrypted with AES-256-GCM using keys held in Google Cloud Secret Manager, bound to your user and workspace; access tokens are held only in memory. Disconnecting a mailbox revokes the token with the provider.

**Calendar sync through Recall.ai.** If your workspace chooses calendar sync through Recall.ai, the connection keys and your calendar refresh token are shared with Recall.ai to keep the calendar in sync. See [Sub-processors](/subprocessors).

## Sharing and sub-processors

We share personal data only with:

- **Your workspace.** Members of a workspace see its records. A client representative sees only the positions they are attached to, read-only.
- **Sub-processors** who host, process or deliver the service for us, under contracts that bind them to protect the data. The current list, and what each one does, is on the [Sub-processors](/subprocessors) page.
- **Authorities**, where the law requires it.
- **A successor**, if Uncava is merged or acquired, with notice to you.

## International transfers

Uncava is hosted on Google Cloud in the United States (`us-central1`), and some sub-processors operate in the United States. Personal data from the UAE, Saudi Arabia, the EU, the UK and elsewhere is therefore transferred to the United States. We rely on the transfer mechanisms the applicable law provides, such as contractual safeguards with each provider [standard contractual clauses / other mechanism to confirm].

## Retention

- **Account data** — while your account exists, then deleted within [30] days of a deletion request, except what we must keep by law.
- **Workspace content** — for as long as the workspace exists, under the firm's control; deleted within [90] days of the end of the subscription unless the firm asks earlier.
- **Data from third-party data providers** — cached for up to 30 days unless a workspace saves it to a record.
- **Security logs** — [retention period].
- **Mailbox and calendar access** — until you disconnect, which revokes it.

## Your rights

Depending on where you are, you may have the right to know what we hold about you, get a copy, correct it, delete it, restrict or object to its use, withdraw consent, and not be subject to decisions based solely on automated processing.

- **Users** can update their profile in the application, disconnect mailboxes and revoke sessions at any time.
- **Anyone, including an executive held in Uncava,** can email [Privacy email address] to exercise these rights or to ask not to be contacted. We will verify the request and reply within [30] days. Where a firm is the controller of the record, we pass the request to that firm and help it respond.

You may also complain to your data protection authority — in the UAE, the UAE Data Office; in Saudi Arabia, the Saudi Data & AI Authority (SDAIA); in the EU or UK, your local supervisory authority.

## Cookies and similar technologies

uncava.com sets no cookies. The application uses only strictly necessary cookies and browser storage for preferences. Details are in the [Cookie notice](/cookies).

## Security

We protect personal data with encryption in transit (HTTPS), encryption of stored credentials, workspace isolation checked on every request, invitation-only membership and audit logs. More on the [Security](/security) page.

## Children

Uncava is a professional tool and is not directed at anyone under 18.

## Contact

[Company legal name], [Registered address]. Email [Privacy email address]. [Data protection officer, if appointed.]

## Changes to this policy

When we change this policy we update the date at the top. If a change is material, we tell account owners by email or in the application before it takes effect.
