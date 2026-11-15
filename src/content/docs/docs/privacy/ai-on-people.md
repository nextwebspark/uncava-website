---
title: AI on people
description: The four workspace switches that decide what Uncava’s AI may work out about the people you hold, and what turning gender or nationality off clears.
sidebar:
  order: 6
lastUpdated: 2026-11-15
---

**Settings → Data & retention → AI on people** decides what the AI may work out about the people your workspace holds. The switches belong to the workspace, not to a member: only an **Admin** can change them, and every change is recorded in the audit log.

| Switch                        | When it is on                                                                                           |
| ----------------------------- | ------------------------------------------------------------------------------------------------------- |
| **Infer gender**              | Suggest a gender from a candidate’s first name and pronouns when none is recorded.                      |
| **Infer nationality**         | Suggest a nationality group from a candidate’s profile, with the evidence for and against.              |
| **Draft assessments with AI** | **Assess with AI** drafts scores and a report against the position’s brief, for a consultant to review. |
| **AI-enrich on capture**      | Suggest missing background as soon as a candidate is captured or sourced, without anyone asking.        |

A consultant reviews every suggestion and decides. The AI never makes a decision about a person on its own.

## Turning a switch on or off

Turning a switch on takes effect at once.

Turning **Infer gender** or **Infer nationality** off also **clears** that suggestion from every candidate in the workspace where nobody has confirmed it. Before it does, Uncava asks you, and says how many candidates will be cleared. Choose **Turn off and clear** to go ahead. Values your team typed, imported or confirmed are never touched. The clear cannot be undone.

Turning **Draft assessments with AI** off hides **Assess with AI**. Drafts already started stay as they are, and every value the AI drafted stays marked as the AI’s.

Turning **Infer gender** off does not stop Uncava proposing years of experience or seniority. Neither is special-category data.

## Defaults

- A workspace founded after this release starts with all four switches **off**.
- A workspace that existed before it keeps all four **on**, so nothing changed for existing customers.

## Gender and nationality over the API

The public API and AI apps connected over MCP receive gender and nationality only when their key or connection holds the **demographics** scope. Reading candidates does not include it. Without it, both fields are empty. A value the AI suggested and nobody confirmed is never sent.
