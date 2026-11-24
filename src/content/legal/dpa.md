---
lastUpdated: 2026-11-13
reviewedByCounsel: false
---

This addendum forms part of the agreement between Uncava ("Uncava") and the customer that uses Uncava ("you"). It applies when Uncava processes personal data on your behalf. A countersigned copy is available on request from [legal@uncava.com](mailto:legal@uncava.com).

## Roles

You are the controller of the personal data your workspace puts into Uncava ("customer personal data"). Uncava is your processor. Uncava is a separate controller for its own account, billing and security data, and for the company and executive data it sources itself, as described in the [Privacy policy](/privacy).

## Scope of processing

- **Subject matter:** providing the Uncava executive search service.
- **Duration:** the term of the agreement, plus the deletion period below.
- **Data subjects:** executives and candidates, client contacts, people named in notes, emails and call recordings, and your users.
- **Data:** names, contact details, professional history, compensation and notice period, documents, notes, outreach emails and replies, meeting details and call transcripts, AI assessments, and attributes the AI proposes where you turn the features on: gender, nationality, seniority and years of experience. A nationality group can reveal ethnic origin, which some laws treat as a special category of data; you decide whether nationality inference runs in your workspace.
- **Nature:** storage, search, analysis (including AI), transmission of email and calendar invitations you initiate, call transcription you initiate, and reporting.
- **Purpose:** to provide the service to you under the agreement.

## Instructions

Uncava processes customer personal data only on your documented instructions — the agreement, this addendum, the settings you choose and your use of the service — including for transfers to a third country, unless the law requires otherwise, in which case Uncava tells you first unless the law forbids it.

**Uncava tells you at once if, in its opinion, an instruction would infringe the GDPR or another data protection law**, and may suspend that processing until you confirm or change the instruction.

## Confidentiality and security

Everyone at Uncava with access to customer personal data is bound by confidentiality. Uncava keeps the technical and organisational measures in [Annex 1](#annex-1-technical-and-organisational-measures), and may improve them but not reduce the overall protection they give.

## Sub-processors

You authorise the sub-processors listed on the [Sub-processors](/subprocessors) page. Uncava binds each by written contract to data protection obligations no less protective than these and remains fully responsible to you for them. Uncava gives you [30] days' notice, by [notification mechanism], before adding or replacing one; you may object on reasonable data protection grounds within that period, and if we cannot resolve it you may end the affected service.

## International transfers

Customer personal data is hosted in the United States. Uncava transfers it, and lets its sub-processors transfer it, only under a mechanism the applicable law allows, including under the UAE Personal Data Protection Law, the Saudi Personal Data Protection Law and the GDPR, as set out in [Annex 2](#annex-2-transfer-mechanisms).

## Assistance

Taking into account the nature of the processing and the information available to it, Uncava helps you:

- respond to data subject requests, through the tools in the service — export, correction, restriction, suppression and erasure of a person — and, where those are not enough, directly;
- meet your obligations on security of processing, breach notification, data protection impact assessments and prior consultation with a supervisory authority (Articles 32 to 36 GDPR).

Uncava passes on any request it receives directly from a data subject about your data, without answering it on your behalf unless you ask.

## Personal data breaches

Uncava notifies you without undue delay, and within [24–48] hours, after becoming aware of a breach affecting customer personal data. The notice describes, as far as then known, the nature of the breach, the categories and approximate number of people and records affected, the likely consequences, the measures taken or proposed, and a contact. Uncava sends further information as it learns it, so that you can meet your own deadline to notify a supervisory authority.

## Deletion and return

You can export your workspace at any time, as a complete archive. When you delete your workspace, or at the end of the agreement, its members lose access at once and Uncava deletes all customer personal data [30] days later, including stored files, unless the law requires it to be kept. You may restore the workspace until deletion starts. Uncava then issues a certificate of deletion. Copies in Uncava's backups are never restored to bring the data back and age out within [21] days. The audit log of the workspace, which records actions by id and holds no names or contact details, and billing records are kept as the law requires.

## Audits

Uncava makes available all information reasonably needed to demonstrate compliance with Article 28 GDPR and this addendum, and answers your reasonable security questionnaires. Uncava allows for and contributes to **audits and inspections** by you or an independent auditor you mandate, bound by confidentiality, on [notice period] notice, no more than [frequency] unless after a breach or at a regulator's request, and at [cost terms].

## Contact

Uncava, [Registered address]. Email [legal@uncava.com](mailto:legal@uncava.com).

## Annex 1: Technical and organisational measures

- **Isolation between customers.** Every read and write is scoped to your workspace on the server, and the database enforces the same boundary again with row-level security, so a missed check returns nothing.
- **Access inside your firm.** Membership is invitation-only. Permissions are checked by action on every request and read from the database, never from the session. Client representatives read only the positions they are attached to, and never notes, documents, tasks, assessments, AI readings or contact details.
- **Authentication.** Passwords stored as bcrypt hashes; optional two-factor sign-in; account lockout after repeated failures; rate limits; short-lived access tokens held in memory, and refresh tokens that rotate on every use.
- **Encryption.** In transit over TLS. At rest by Google Cloud (AES-256). Mailbox, calendar and Zoom refresh tokens, and two-factor secrets, are additionally encrypted by the application with keys held in Google Cloud Secret Manager. Stored tokens are kept only as hashes.
- **Documents.** In private storage with public access prevented, streamed through the application, never by public link.
- **AI.** Contact details are removed from what a model reads; compensation and your own columns are never sent; model output is a draft a consultant reviews. Google does not train its models on the data.
- **Logging and accountability.** An append-only audit log of sensitive actions (exports, downloads, API and AI-app reads, permission changes), recording people by id only. Application logs mask email addresses, profile links and phone numbers.
- **Data subject rights.** Tools in the service to export, correct, restrict, suppress and erase a person, and a retention review for candidates nobody is working with.
- **Resilience.** [Daily backups kept 21 days and point-in-time recovery over 7 days, with a yearly restore test — to confirm once enabled.]
- **Organisation.** [Staff access to production data: named, time-limited and approved — to confirm.] [Security training, vendor review and incident response — to confirm.]

## Annex 2: Transfer mechanisms

- **EU and EEA:** [the European Commission's standard contractual clauses, module 2 (controller to processor) between you and Uncava, and module 3 (processor to processor) between Uncava and each sub-processor; or the EU-US Data Privacy Framework where the recipient is certified — to confirm].
- **United Kingdom:** [the UK International Data Transfer Addendum to the standard contractual clauses — to confirm].
- **UAE and Saudi Arabia:** [the mechanism each law provides — to confirm].
- **Supplementary measures:** encryption in transit and at rest, application-level encryption of credentials, removal of contact details before AI processing, and the access controls in Annex 1.
