---
lastUpdated: 2026-11-26
reviewedByCounsel: false
---

These are the third parties that process personal data for Uncava. Each is bound by a contract to protect the data and use it only to provide its service to us. Transfers outside the country of the data are covered by the mechanism shown and described in the [Data processing addendum](/dpa).

## Infrastructure

| Provider     | What it does for Uncava                                                                    | Data it receives                                                                                | Location                      | Transfer mechanism |
| ------------ | ------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- | ----------------------------- | ------------------ |
| Google Cloud | Cloud Run and Cloud SQL: hosts the application and its database                            | everything in the service                                                                       | United States (`us-central1`) | [mechanism]        |
| Google Cloud | Cloud Storage: stores documents, photos, attachments and workspace exports                 | the files you upload or export                                                                  | United States (`us-central1`) | [mechanism]        |
| Google Cloud | Secret Manager: holds the encryption keys                                                  | no personal data                                                                                | [region to confirm]           | —                  |
| Google Cloud | Cloud Logging: keeps application logs for 30 days                                          | logs with email addresses, profile links and phone numbers masked                               | [region to confirm]           | [mechanism]        |
| Google Cloud | Vertex AI (Gemini): drafts briefs, proposes companies, assesses candidates, writes openers | the record or text the feature reads, with contact details removed; never compensation          | [region to confirm]           | [mechanism]        |
| Resend       | Sends account and notification email, and delivers website enquiries to our inbox          | users' names and email addresses; candidate names in notification emails; enquiry form contents | [Region]                      | [mechanism]        |
| Stripe       | Takes payment for subscriptions                                                            | the workspace name; the payer's card, billing address and tax id                                | [Region]                      | [mechanism]        |
| Google Fonts | Serves the application's fonts                                                             | each user's IP address and browser                                                              | Global                        | [mechanism]        |
| Firebase     | Hosts the uncava.com website                                                               | visitors' IP address, requested page and browser                                                | Global CDN                    | [mechanism]        |
| Cloudflare   | DNS for uncava.com                                                                         | no personal data                                                                                | Global                        | —                  |
| Google Cloud | Cloud Functions: receives the website's enquiry form and passes it to Resend               | what you type into the form                                                                     | United States (`us-central1`) | [mechanism]        |

## Email, calendar and meetings

These act only when a user connects the matching account or a workspace turns the feature on.

| Provider  | What it does for Uncava                                                                 | Data it receives                                                             | Location                                        | Transfer mechanism |
| --------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ----------------------------------------------- | ------------------ |
| Nylas     | Connects mailboxes and calendars to send outreach and show replies                      | the mailbox connection, emails sent and the replies to them, calendar events | United States [or EU, to confirm]               | [mechanism]        |
| Recall.ai | Optional calendar sync, and the Notetaker that records calls a consultant sends it into | calendar access; the call's audio and video, to transcribe it                | United States (`us-east-1`) [or EU, to confirm] | [mechanism]        |
| Zoom      | Creates the Zoom meetings users book                                                    | the meeting's title and time                                                 | United States                                   | [mechanism]        |

When a user connects their own Google or Microsoft mailbox directly, Uncava sends email and reads replies through that user's own account. [Whether Google, Microsoft and Zoom act as the customer's own providers or as Uncava's sub-processors is to be confirmed.]

## Company and executive data

These supply professional information about companies and executives, and receive the company names or profile addresses a search looks up.

| Provider    | What it does for Uncava                             | Data it receives                                     | Location      | Transfer mechanism |
| ----------- | --------------------------------------------------- | ---------------------------------------------------- | ------------- | ------------------ |
| Apollo      | Company database                                    | nothing about people                                 | United States | —                  |
| Bright Data | Professional profile data                           | profile addresses; company and role searches         | [Region]      | [mechanism]        |
| HarvestAPI  | Refreshes a public professional profile on request  | a profile address                                    | [Region]      | [mechanism]        |
| ContactOut  | People search and business email and phone look-ups | profile addresses; company, title and name searches  | [Region]      | [mechanism]        |
| Mapbox      | Maps and place look-ups for the talent map          | a company's city and country; users' IP from the map | United States | [mechanism]        |

## Changes to this list

We update this page before a new sub-processor starts processing customer data, and tell customers at least 30 days before it starts, by email to each workspace's admins. The email names the provider, the data it will receive, why, where it is, the day it starts and this page. An admin can object inside Uncava, in Settings → Data & retention, until that day, as the [Data processing addendum](/dpa) describes.
