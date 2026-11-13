---
lastUpdated: 2026-11-13
reviewedByCounsel: false
---

This policy explains how [Company legal name] ("Uncava", "we", "us") handles personal data when you visit uncava.com, use the Uncava application, connect a mailbox or calendar to it, or install the UNCAVA Capture browser extension. It also explains what we do with information about executives held in Uncava, and how an executive can find out what is held and object to it.

## Who we are

Uncava is operated by [Company legal name], a company registered in the United Arab Emirates [free zone or emirate, licence number], with its registered address at [Registered address].

- For **account, website and billing data**, and for the **company and executive data Uncava itself sources**, we are the controller.
- For the **data a search firm or hiring team puts into its workspace** — candidates, notes, documents, outreach — the firm is the controller and we process it on its behalf, under our [Data processing addendum](/dpa).

Privacy questions and requests: [Privacy email address].

## Data protection officer

[Name and contact of our data protection officer, or: We have not appointed a data protection officer because [reason]. Privacy questions go to [Privacy email address].]

## Our EU and UK representatives

We are not established in the European Union or the United Kingdom. Our representatives there, whom you or a supervisory authority may contact on any data protection matter, are:

- **European Union:** [EU representative name, address and email].
- **United Kingdom:** [UK representative name, address and email].

## Information we collect

**Account and workspace data.** Your name, email address, job title, profile photo, time zone and language; a bcrypt hash of your password if you sign in with one; the Google or LinkedIn identity you link if you sign in with those; your second sign-in factor if you turn one on; the workspaces you belong to and your role in them; when you accepted these terms and which version of this policy you saw.

**Security and usage records.** Sign-in times, the IP address and browser user agent of each session, and an audit log of sensitive actions such as exports and membership changes. The audit log records who did what by id, never by name or contact details.

**Content you add.** Positions and briefs, companies and decisions about them, executive records, notes, tags, documents you upload (CVs, cover letters, references), messages you send through outreach and the replies to them, call recordings and transcripts if your workspace uses the Notetaker, and questions you ask the Uncava Assistant.

**Data from connected mailboxes and calendars.** Only when you connect Google, Microsoft or Zoom, and only what is described in [Google, Microsoft and Zoom data](#google-microsoft-and-zoom-data).

**Information about executives.** Uncava holds professional information about executives so that search firms can research a market: name, current and past roles and employers, location, education, the public LinkedIn profile URL and profile content, and, where a firm requests it, business email and phone. Firms may add notes, documents, compensation and notice period they learn from the executive. Where a firm turns the features on, Uncava's AI may propose gender, nationality, seniority and years of experience, and draft an assessment against a role; see [AI, profiling and automated decisions](#ai-profiling-and-automated-decisions). Where this information comes from is in [Executives: where your data comes from](#executives-where-your-data-comes-from).

**Website visits.** uncava.com is a static site. It sets no cookies and runs no analytics. Our hosting provider records standard server logs (IP address, requested URL, time, user agent) for security and operations.

**Website forms.** If you book a demo or subscribe to the newsletter, we receive what you type into the form: your name, work email, company and message, or your email address alone for the newsletter. The forms are delivered by [form processor].

## Executives: where your data comes from

If you are an executive and have never used Uncava, your information reached it in one or more of these ways:

- **Licensed business data providers.** Bright Data and ContactOut (professional profiles, and business email and phone look-ups when a firm asks), and HarvestAPI (a refresh of a public professional profile when a firm asks). Apollo supplies company information only, not information about people.
- **Publicly available professional sources.** Your public LinkedIn profile.
- **Members of a firm using Uncava.** A consultant may capture your LinkedIn page with the UNCAVA Capture extension, which sends only your name and profile address; type in what they know; or upload a spreadsheet their firm already holds.
- **Your own contact with a firm.** Emails you exchange with a consultant through Uncava, and calls with you that a consultant records with the Notetaker, if that firm uses those features.

Uncava keeps the professional profiles it fetches from providers for up to [30] days so that it does not fetch the same profile twice. A firm that saves you to one of its records becomes the controller of that record.

**When you are told.** The firm that holds your record is responsible for telling you, at the latest when it first contacts you or within one month of obtaining your data. [Whether and where Uncava relies on the exception for disproportionate effort, Art. 14(5)(b) GDPR, is to be confirmed with counsel.]

## How we use information and why we may

| Purpose                                                               | Whose data                        | Legal basis                                                                                                         | How long                                                        |
| --------------------------------------------------------------------- | --------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Providing the service: workspaces, records, search, reports           | users; executives (for each firm) | contract with you; for executives, the firm's legitimate interests                                                  | while the account or workspace exists                           |
| Mapping executives, sourcing and enrichment, so firms can find talent | executives                        | legitimate interests: researching a market and approaching people about senior roles                                | the firm's chosen period; our provider cache [30 days]          |
| Outreach the consultant writes, and reading the replies               | executives; users                 | the firm's legitimate interests; contract with the user                                                             | with the executive's record                                     |
| AI features the firm turns on                                         | executives; users                 | the firm's legitimate interests; see [AI, profiling and automated decisions](#ai-profiling-and-automated-decisions) | with the record; a consultant can change or remove any AI value |
| Connecting a mailbox, calendar or Zoom                                | users                             | consent, withdrawn by disconnecting                                                                                 | until you disconnect                                            |
| Security: sign-in protection, rate limits, audit log                  | users                             | legitimate interests: keeping the service and its data safe                                                         | sessions [30 days] after expiry; audit log [period]             |
| Service email: verification, invitations, resets, security notices    | users and invitees                | contract                                                                                                            | links [30 days] after expiry; invitations [90 days]             |
| Billing                                                               | the paying admin                  | contract; legal obligation for tax records                                                                          | [statutory period]                                              |
| Demo requests                                                         | website visitors                  | steps at your request before a contract                                                                             | [period]                                                        |
| Newsletter                                                            | subscribers                       | consent [confirmed by double opt-in]; withdrawn by unsubscribing                                                    | until you unsubscribe                                           |
| Answering legal requests and meeting legal duties                     | anyone                            | legal obligation                                                                                                    | as the law requires                                             |

Where we rely on legitimate interests we have weighed them against your interests and rights; the assessment is available on request from [Privacy email address].

We do not sell personal data, use it for advertising, or use your workspace content or mailbox data to train AI models.

**Whether you must give us data.** Users must give a name and work email to have an account, because we cannot provide the service without them. Nothing else is required. Executives are under no obligation to give anything.

## AI, profiling and automated decisions

Uncava uses Google's Vertex AI. Contact details are removed from what the model reads, and it is never given compensation or a firm's own columns. Every AI output is marked as the AI's on screen until a consultant confirms or changes it.

- **Gender, years of experience and seniority.** When one is missing, the model proposes the most probable value from the profile: gender from the first name and any pronouns in the profile; years of experience from the earliest dated role or graduation year; seniority from the current title, employer size and career. A value already on the record is never replaced.
- **Nationality.** The model places a person in one of eleven groups — the six Gulf states by name, Western expat, South Asian, Asian, Arab expat (non-GCC) and Other expat — or answers Unknown, with its confidence and the evidence for and against. Appearance, photos, religion and inferred ethnicity are never used as evidence. Only a high-confidence reading fills the field. [How nationality is handled for people in the EU, EEA and UK is to be confirmed.]
- **Assessment drafts.** When a consultant asks, the model drafts the consultant's assessment against a position's brief: evidence and a 0–10 score per competency, and a report. The weighted total is calculated by the software. The consultant edits and submits it.
- **Finding executives.** Which search results are suggested to a consultant is decided by fixed rules about the role, the company and the person's seniority, not by a model.

Each firm decides whether these features run in its workspace. Gender inference, nationality inference, AI assessment drafts and automatic enrichment after capture are separate switches, and they start switched off in every new workspace. Turning gender or nationality inference off removes every value the AI proposed that no consultant confirmed.

**No decision about you is made by automated means alone.** A consultant decides what to keep, what to change and whether to approach you. You can ask for a human to review anything, give your view, and contest it, through [Privacy email address] or the firm that holds your record.

## Your right to object

**You can object at any time to the use of your data based on legitimate interests**, including to being mapped, enriched or approached about roles. Where the use is for direct marketing, we and the firms stop without needing a reason.

Tell the firm that contacted you, or write to [Privacy email address]. A firm can stop all contact with you, restrict its use of your record, or delete it and add you to its suppression list so that you are not added again. See [Requests about you](#requests-about-you).

## Google, Microsoft and Zoom data

Connecting a mailbox or calendar is optional and done by each user. Uncava asks only for the access the outreach and scheduling features need, and uses it only to provide those features to you.

**Google (Gmail and Google Calendar).** Uncava requests `openid`, `email`, `gmail.send`, `gmail.readonly`, `calendar.events` and `calendar.freebusy`. With them Uncava:

- reads your email address;
- sends the emails you compose in Uncava, from your mailbox;
- reads the threads Uncava sent: the sender and the `Message-ID` and `References` headers, to detect replies and bounces and to thread follow-ups, and the text of the replies, so the conversation shows in Uncava. It never reads other mail. If you untick the read permission when you connect, Uncava reads only who replied;
- reads your calendar's events (title, time, attendees and organiser, join link, location — never descriptions) and keeps only those whose attendees are already people in your workspace;
- reads free/busy to offer booking times, and creates the events and Google Meet links you book.

Uncava does not use Google Drive.

**Uncava's use and transfer of information received from Google APIs to any other app will adhere to the [Google API Services User Data Policy](https://developers.google.com/terms/api-services-user-data-policy), including the Limited Use requirements.** Specifically, we use Google user data only to provide and improve the user-facing features described here; we do not transfer it except as needed to provide those features, for security, to comply with law, or as part of a merger or acquisition with notice; we do not use it for advertising; we do not use it to develop, improve or train generalised AI or machine-learning models; and no person reads it except with your consent, for security, or to comply with law.

**Microsoft (Outlook and Microsoft 365 calendars).** Uncava requests the delegated permissions `offline_access`, `User.Read`, `Mail.ReadWrite`, `Mail.Send` and `Calendars.ReadWrite`, for work or school accounts. It uses them as for Google: it reads your email address, creates and sends the emails you compose (as a draft first, so they thread correctly), reads the sender, time and text of replies in threads Uncava sent, reads calendar availability and events as above, and creates the events and Teams meetings you book. It never reads other mail.

**Zoom.** Uncava creates, updates and deletes the Zoom meetings you book, and reads your Zoom user profile to do so.

**What is stored.** The emails you send through Uncava and the replies to them (subject, body, message and thread ids, time); your mailbox address and connection status; and, for matched calendar events, the title, time, join link and conferencing provider. Refresh tokens are encrypted with AES-256-GCM using keys held in Google Cloud Secret Manager, bound to your user and workspace; access tokens are held only in memory. Disconnecting a mailbox revokes the token with the provider.

**Calendar sync and the Notetaker through Recall.ai.** If your workspace chooses calendar sync through Recall.ai, the connection keys and your calendar refresh token are shared with Recall.ai to keep the calendar in sync. If a consultant sends the Notetaker into a call, Recall.ai receives the call's audio to produce its transcript. See [Sub-processors](/subprocessors).

## The Capture extension

When you choose to capture a LinkedIn page, the UNCAVA Capture extension reads that page and sends the person's name and profile address, or the company on the page, to your workspace. It does nothing on pages you do not capture, and reads no other sites. It keeps your sign-in token in the browser's extension storage.

## Sharing and sub-processors

We share personal data only with:

- **Your workspace.** Members of a workspace see its records. A client representative sees only the positions they are attached to, read-only, and never the team's notes, documents, tasks, assessments, AI readings or contact details.
- **Apps the firm connects.** An API key or AI app a firm's admin connects reads only what its permissions allow. Gender and nationality need a separate permission.
- **Sub-processors** who host, process or deliver the service for us, under contracts that bind them to protect the data. The current list, what each one receives and where, is on the [Sub-processors](/subprocessors) page.
- **Authorities**, where the law requires it.
- **A successor**, if Uncava is merged or acquired, with notice to you.

## International transfers

Uncava is hosted on Google Cloud in the United States (`us-central1`). Its AI processing on Vertex AI runs in [region to confirm], and some sub-processors operate in the United States. Personal data from the UAE, Saudi Arabia, the EU, the UK and elsewhere is therefore transferred to the United States. We rely on [the EU-US Data Privacy Framework where the recipient is certified / the European Commission's standard contractual clauses / the UK International Data Transfer Addendum — mechanism per recipient to confirm], and on the equivalent mechanisms under the UAE and Saudi laws. A copy of the safeguards is available on request from [Privacy email address].

## Retention

- **Account data** — while your account exists. When you delete your account, your name, email, sessions, sign-in methods and second factor are deleted at once; what you did for a workspace stays the workspace's, recorded against an anonymous former member.
- **Workspace content** — for as long as the workspace exists, under the firm's control. A firm chooses how long a candidate nobody is working with is kept (12 to 60 months, or until it deletes them) and reviews them before deletion. When a workspace is deleted, everything in it is deleted [30] days later and the firm receives a deletion certificate.
- **Executive profiles from data providers** — cached for up to [30] days unless a firm saves them to a record.
- **AI assessments and readings** — with the record they belong to; a consultant can change or remove them at any time.
- **Security and server logs** — application logs 30 days; the audit log [retention period].
- **Backups** — a deleted record remains in our backups until they age out, within [21] days. Backups are never restored to bring deleted data back.
- **Website forms** — demo requests [period]; newsletter until you unsubscribe.
- **Mailbox and calendar access** — until you disconnect, which revokes it.

## Your rights

Depending on where you are, you may have the right to:

- know what we hold about you and get a copy;
- correct it;
- have it deleted;
- restrict its use;
- receive it in a machine-readable form and have it sent to another provider (portability);
- object to its use (see [Your right to object](#your-right-to-object));
- withdraw consent at any time, without affecting what was done before;
- not be subject to a decision based solely on automated processing.

**Users** can update their profile, download their account data, delete their account, disconnect mailboxes and revoke sessions in the application at any time.

We reply **within one month** of receiving a request, and may extend that by two further months for complex or numerous requests, telling you why within the first month. Where a firm is the controller of the record, we pass the request to that firm and help it respond.

You may also complain to a data protection authority — in the UAE, the UAE Data Office; in Saudi Arabia, the Saudi Data & AI Authority (SDAIA); in the EU or UK, the supervisory authority where you live or work, or where you believe the problem happened.

## Requests about you

If you are an executive and want to know whether a firm using Uncava holds information about you, or want it corrected, deleted or no longer used:

1. **Email [Privacy email address]** with your full name, your LinkedIn profile address, and any email addresses or phone numbers you think may be held. We ask for nothing else, and only enough to be sure the request is yours — usually a reply from one of those addresses.
2. **We find each firm whose workspace holds you** and pass your request to it, because each firm is the controller of its own records and answers you itself, within one month.
3. **We act on what Uncava holds itself**: the professional profiles in our provider cache.

You can also write to a firm directly if you know which one contacted you.

## Cookies and similar technologies

uncava.com sets no cookies. The application uses only strictly necessary cookies and browser storage for preferences. Details are in the [Cookie notice](/cookies).

## Security

We protect personal data with encryption in transit (HTTPS) and at rest, encryption of stored credentials, workspace isolation checked on every request and enforced again in the database, invitation-only membership and audit logs. More on the [Security](/security) page.

## Children

Uncava is a professional tool and is not directed at anyone under 18.

## Contact

[Company legal name], [Registered address]. Email [Privacy email address].

## Changes to this policy

When we change this policy we update the date at the top. If a change is material, we tell account owners by email or in the application before it takes effect.
