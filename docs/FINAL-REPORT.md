# FINAL REPORT
## Yatara Ceylon – Tour Operator Management System (TOMS)

> **Formatting guide for Word export (from Assignment 05 PDF):**
> - Paper: A4
> - Font: Times New Roman, size 11
> - Line spacing: 1.2
> - Alignment: Justified
> - Headings: Word Heading Styles (H1 = Chapter, H2 = Section, H3 = Sub-section)
> - H1 = 16 pt, bold, centered, with lower border
> - H2 = 12 pt, bold, underlined, left-aligned
> - H3 = 11 pt, bold, underlined, left-aligned
> - Pre-body page numbers = Roman (i, ii, iii…)
> - Main-body page numbers = Arabic, restart at 1 on Chapter 1
> - Figure / Table captions = chapter-based (e.g., Figure 3.1, Table 2.1)

---

# PART A — PRE-BODY SECTION

---

## TITLE PAGE

<div align="center">

**[INSERT UNIVERSITY / CAMPUS LOGO HERE]**

# YATARA CEYLON
## Tour Operator Management System (TOMS)

**IT Project (ITP) – Final Report**

Module Code: **IT2150**
Academic Year: **Y2.S2**
Stream: **Y2.S2.WE.IT.0101 (ITP_IT_101)**
ITP Group Number: **[INSERT GROUP NUMBER]**

**Campus:** [INSERT CAMPUS NAME]
**Faculty:** Faculty of Computing
**Degree Programme:** BSc (Hons) in Information Technology

### Group Members

| Student ID   | Student Name               | Assigned Module                     |
|--------------|----------------------------|-------------------------------------|
| IT24100923   | Nawarathna K.M.G.D.I.      | Account Management                  |
| IT24100559   | Wasala W.M.S.S.B.          | Products & Content Management       |
| IT24102016   | Melisha L.R.L.             | Vehicle Fleet Management            |
| IT24100220   | Sanujan N.                 | Booking & Reservation Management    |
| IT24102586   | Luxsana S.                 | Finance Management                  |
| IT24101070   | Muthubadiwila M.W.H.A.     | Supplier / Partner Management       |

**Supervisor:** [INSERT SUPERVISOR NAME]
**Date of Submission:** [INSERT SUBMISSION DATE]

</div>

---

## DECLARATION

We hereby declare that this report titled *"Yatara Ceylon – Tour Operator Management System (TOMS)"* is the result of our own original work and has not been submitted, in whole or in part, for any other degree or diploma at any university or institution. All external sources and contributions have been duly acknowledged and referenced in accordance with academic standards. We confirm that the content presented in this report is the genuine effort of the undersigned group members.

| Student ID   | Student Name               | Signature                    | Date                     |
|--------------|----------------------------|------------------------------|--------------------------|
| IT24100923   | Nawarathna K.M.G.D.I.      | [INSERT SIGNATURE]           | [INSERT DATE]            |
| IT24100559   | Wasala W.M.S.S.B.          | [INSERT SIGNATURE]           | [INSERT DATE]            |
| IT24102016   | Melisha L.R.L.             | [INSERT SIGNATURE]           | [INSERT DATE]            |
| IT24100220   | Sanujan N.                 | [INSERT SIGNATURE]           | [INSERT DATE]            |
| IT24102586   | Luxsana S.                 | [INSERT SIGNATURE]           | [INSERT DATE]            |
| IT24101070   | Muthubadiwila M.W.H.A.     | [INSERT SIGNATURE]           | [INSERT DATE]            |

**Supervisor Endorsement**

I certify that the above-named students have carried out this project under my supervision and that the report accurately reflects the work completed.

Supervisor's Name: [INSERT SUPERVISOR NAME]
Signature: [INSERT SUPERVISOR SIGNATURE]
Date: [INSERT DATE]

---

## ABSTRACT

The tourism industry in Sri Lanka plays a significant role in the national economy, yet many small and medium-sized tour operators continue to manage their day-to-day operations manually using spreadsheets, paper logs, and unstructured messaging channels. This fragmented workflow leads to missed inquiries, double bookings, lost customer details, delayed payments, and an inability to scale effectively. Yatara Ceylon, a boutique tour operator based in Sri Lanka, faced these same operational challenges and required a unified digital platform to centralise its packages, destinations, bookings, vehicles, partners, and finance operations.

This project presents the design, development, and evaluation of the **Tour Operator Management System (TOMS)** — a full-stack web application built using Next.js 15 (App Router), TypeScript, MongoDB, and Tailwind CSS, and deployed on Vercel. The system is organised into six tightly integrated modules: Account Management, Products & Content Management, Vehicle Fleet Management, Booking & Reservation Management, Finance Management, and Supplier/Partner Management. Each module provides role-based access, validated CRUD operations, and a consistent user experience anchored in a custom "liquid glass" design system.

Key engineering outcomes include a JWT-based authentication layer with HttpOnly cookies, role-based route protection via Next.js middleware, a Zod-validated service layer, a PayHere payment integration for online bookings, and a public-facing tour planner that consumes the same data model used by the administrative dashboards. The system was evaluated through functional test cases, validation and authorisation tests, and stakeholder walkthroughs. Results indicate that the platform successfully digitises Yatara Ceylon's core workflows, reduces manual data entry, eliminates common sources of double bookings, and provides a scalable foundation for future features such as image upload pipelines, multi-language content, and analytics dashboards.

**Keywords:** Tour Operator Management System, Tourism, Next.js, MongoDB, JWT, RBAC, Booking System, Sri Lanka.

> **Length note:** Aim for 200–300 words. Trim or extend the above paragraphs to fit exactly one page.

---

## ACKNOWLEDGEMENT

We would like to express our sincere gratitude to our project supervisor, **[INSERT SUPERVISOR NAME]**, for the continuous guidance, constructive feedback, and encouragement provided throughout every stage of this project. Your insights were instrumental in shaping the direction and quality of our work.

We extend our heartfelt thanks to the panel members and lecturers of the **IT Project (IT2150)** module for establishing a clear framework, sharing industry-relevant expectations, and providing timely evaluation at each milestone.

We are deeply grateful to our client, **Yatara Ceylon**, for sharing their domain knowledge, operational pain points, and real-world data, without which this system would not have reflected an authentic tour-operator workflow. We also thank the staff members who participated in stakeholder interviews and user acceptance walkthroughs.

Our appreciation further extends to the **Faculty of Computing** and our institution for providing the learning environment, infrastructure, and academic resources that enabled this work.

Finally, we thank our families, friends, and one another as teammates for the unwavering support, collaboration, and shared commitment that carried this project from concept to delivery.

---

## TABLE OF CONTENTS

> **Action required in Word:** Replace this manual list with Word's *References → Table of Contents → Automatic Table* after you apply Heading Styles (H1/H2/H3) to every heading.

- DECLARATION ............................................................................................ ii
- ABSTRACT ................................................................................................. iii
- ACKNOWLEDGEMENT ....................................................................................... iv
- TABLE OF CONTENTS ...................................................................................... v
- LIST OF TABLES ......................................................................................... vi
- LIST OF FIGURES ....................................................................................... vii
- LIST OF ABBREVIATIONS ................................................................................ viii

**CHAPTER 1 — INTRODUCTION** ............................................................................ 1
1.1 Background of Yatara Ceylon
1.2 Problem Statement
1.3 Motivation
1.4 Literature Review
1.5 Aim
1.6 Objectives
1.7 Scope of the Proposed System
1.8 Solution Overview
1.9 Git Repository and Deployed System

**CHAPTER 2 — REQUIREMENT ANALYSIS**
2.1 Stakeholder Analysis
2.2 Functional Requirements
2.3 Non-Functional Requirements
2.4 Feasibility Analysis
2.5 SWOT Analysis
2.6 Requirements Modelling (Use Cases & User Stories)

**CHAPTER 3 — DESIGN AND DEVELOPMENT**
3.1 System Architecture
3.2 Technology Stack
3.3 Module Breakdown
3.4 Authentication and Role-Based Access Control
3.5 Booking Workflow Design
3.6 Finance and Payment Workflow
3.7 Vehicle and Partner Management Design
3.8 Database Design (ER Diagram)
3.9 UI / Design System
3.10 Implementation of Individual Modules
3.11 Focused Module: Products & Content Management

**CHAPTER 4 — RESULTS AND EVALUATION**
4.1 Final System Overview
4.2 Implemented Features
4.3 Screens and Outputs
4.4 Test Cases and Results
4.5 Validation and Security Checks
4.6 User / Expert Feedback
4.7 Limitations
4.8 Future Improvements

**CHAPTER 5 — CONCLUSION**
5.1 Achievement of Objectives
5.2 Achievement of Project Aim
5.3 Summary of Key Contributions

**REFERENCES**
**APPENDIX A — Member Contribution Table**
**APPENDIX B — Screenshots & Extended Material**

---

## LIST OF TABLES

> **Action required in Word:** After captioning each table with *References → Insert Caption*, generate this list via *References → Insert Table of Figures → Label: Table*.

- Table 2.1: Stakeholder Analysis
- Table 2.2: Functional Requirements by Module
- Table 2.3: Non-Functional Requirements
- Table 2.4: Feasibility Summary
- Table 2.5: SWOT Analysis
- Table 3.1: Technology Stack Summary
- Table 3.2: API Endpoints (Representative Subset)
- Table 3.3: Core Database Entities
- Table 4.1: Functional Test Cases – Products & Content Management
- Table 4.2: Validation & Security Test Cases
- Table A.1: Member Contribution Summary

---

## LIST OF FIGURES

> **Action required in Word:** After captioning each figure, generate via *References → Insert Table of Figures → Label: Figure*.

- Figure 3.1: High-Level System Architecture of TOMS
- Figure 3.2: Authentication & RBAC Flow
- Figure 3.3: Booking Request Workflow
- Figure 3.4: Payment Processing Workflow (PayHere)
- Figure 3.5: Vehicle Availability & Block Workflow
- Figure 3.6: Partner Assignment Workflow
- Figure 3.7: Content Publishing Workflow
- Figure 3.8: Entity-Relationship Diagram
- Figure 3.9: UI Design System – Emerald & Gold Liquid Glass Palette
- Figure 3.10: Public Home Page
- Figure 3.11: Package Listing Page
- Figure 3.12: Package Detail Page
- Figure 3.13: Build-Your-Tour Planner
- Figure 3.14: Admin Dashboard – Packages Module
- Figure 4.1: Booking Flow End-to-End Output
- Figure 4.2: Admin Package CRUD Screens
- Figure 4.3: Publish / Unpublish Guard in Action
- Figure 4.4: Sample Payment Confirmation

---

## LIST OF ABBREVIATIONS

| Abbreviation | Meaning                                    |
|--------------|--------------------------------------------|
| API          | Application Programming Interface          |
| CRUD         | Create, Read, Update, Delete               |
| CSS          | Cascading Style Sheets                     |
| DB           | Database                                   |
| ER           | Entity-Relationship                        |
| HTTP(S)      | Hypertext Transfer Protocol (Secure)       |
| JSON         | JavaScript Object Notation                 |
| JWT          | JSON Web Token                             |
| MVC          | Model-View-Controller                      |
| NFR          | Non-Functional Requirement                 |
| ORM / ODM    | Object-Relational / Object-Document Mapper |
| RBAC         | Role-Based Access Control                  |
| REST         | Representational State Transfer            |
| SPA          | Single-Page Application                    |
| SSR          | Server-Side Rendering                      |
| SWOT         | Strengths, Weaknesses, Opportunities, Threats |
| TOMS         | Tour Operator Management System            |
| UAT          | User Acceptance Testing                    |
| UI / UX      | User Interface / User Experience           |
| URL          | Uniform Resource Locator                   |

---
---

# PART B — MAIN BODY

> **Page numbering resets here.** In Word, insert a *Next Page Section Break* before Chapter 1 and restart Arabic page numbers at 1.

---

# CHAPTER 1 — INTRODUCTION

## 1.1 Background of Yatara Ceylon

Yatara Ceylon is a boutique Sri Lankan tour operator specialising in curated travel experiences across the country's cultural, coastal, and highland regions. The business offers both standardised tour packages and custom itineraries that combine accommodation, transport, guided experiences, and regional cuisine. As traveller expectations have shifted toward instant online discovery, transparent pricing, and real-time confirmation, Yatara Ceylon's largely manual, spreadsheet-and-chat based workflow has become a bottleneck to growth, customer satisfaction, and operational control.

## 1.2 Problem Statement

The current operational model at Yatara Ceylon suffers from several interrelated problems:

1. **Fragmented data** — packages, bookings, customer details, and payment records live across spreadsheets, messaging apps, and personal notes, with no single source of truth.
2. **Missed or duplicated inquiries** — customer requests arriving via different channels are not consistently tracked, leading to lost leads and double bookings.
3. **Lack of real-time availability** — vehicle fleet and partner service availability cannot be verified instantly, forcing staff to rely on phone calls.
4. **Opaque payments** — deposits, balances, refunds, and invoices are not consistently recorded, making financial reconciliation time-consuming and error-prone.
5. **Inconsistent content presentation** — package descriptions and destination information are re-typed for every channel, causing outdated or mismatched details across platforms.
6. **No role-based control** — all staff access the same spreadsheets, increasing the risk of accidental modification and data leakage.

A centralised, role-aware, web-based system is therefore required to consolidate these workflows into a single reliable platform.

## 1.3 Motivation

The motivation for this project is threefold: **(i) commercial** — to help Yatara Ceylon scale beyond its current manual ceiling, **(ii) academic** — to apply full-stack engineering, database design, and software-engineering discipline to a real, non-trivial domain, and **(iii) social** — to demonstrate how digital transformation can strengthen locally owned tourism businesses that compete with international aggregators.

## 1.4 Literature Review

A focused review of the existing landscape was conducted to position TOMS against both commercial platforms and academic work.

1. **Online Travel Aggregators (e.g., Booking.com, Agoda, TripAdvisor).** These platforms provide strong package discovery and payment flows but charge high commissions and do not give small operators control over branding, content, or customer relationships. TOMS intentionally positions the operator as the owner of the customer experience rather than an upstream supplier.

2. **Tour-operator SaaS products (e.g., Bookeo, TrekkSoft, Rezdy).** These provide booking engines and inventory management but are generic, expensive for small operators, and often poorly localised for Sri Lankan constructs such as districts, regional cuisines, and multi-vehicle itineraries. TOMS embeds these local concepts directly into the data model.

3. **Open-source Content Management Systems (e.g., WordPress + WooCommerce travel themes).** These are flexible but require multiple plugins for bookings, vehicle management, and finance — each maintained by different authors — producing fragile, inconsistent systems. TOMS integrates these concerns into one coherent codebase.

4. **Academic literature on e-tourism platforms.** Prior studies emphasise the importance of real-time availability, transparent pricing, and role-based workflows for converting online traffic into confirmed bookings. TOMS applies these findings by exposing real availability checks, validated pricing rules, and strict RBAC boundaries between public, staff, and administrator users.

5. **Studies on usability in booking systems.** Research highlights that drop-off rates rise sharply when users encounter more than three confusing steps in a booking flow. TOMS therefore compresses the customer journey into *Browse → Plan → Confirm → Pay*, with validation and feedback at each step.

> **Action required:** Replace the in-text examples above with properly cited references (APA or Harvard). Add 3–5 academic / credible industry sources to the *References* section at the end.

## 1.5 Aim

To design, develop, and deploy a web-based **Tour Operator Management System (TOMS)** that centralises Yatara Ceylon's packages, destinations, bookings, vehicles, partners, payments, and customer interactions into a single, role-aware, production-ready platform.

## 1.6 Objectives

1. To analyse Yatara Ceylon's current manual workflows and identify critical functional and non-functional requirements.
2. To design a scalable system architecture based on Next.js (App Router), TypeScript, and MongoDB.
3. To implement six integrated modules: Account, Products & Content, Vehicle Fleet, Booking, Finance, and Partner Management.
4. To implement secure authentication with JWT + HttpOnly cookies and enforce role-based access control across all protected routes.
5. To integrate an online payment gateway (PayHere) for deposit and balance collection.
6. To deliver a consistent, accessible, and branded user experience through a custom "liquid glass" design system.
7. To validate system correctness via functional, validation, and security test cases.
8. To deploy the system on Vercel and publish the source to a public Git repository.

## 1.7 Scope of the Proposed System

**In scope:**
- Public-facing website with tour packages, destinations, planner, and contact.
- Role-based dashboards for Admin, Staff, Vehicle Owner, Hotel Owner, and Customer.
- CRUD for packages, destinations, districts, places, vehicles, vehicle-blocks, partners, partner-services, bookings, invoices, and payments.
- Online payments via PayHere for deposit and balance.
- Notifications (in-app / email) for booking confirmations and status changes.
- Soft-delete and publish/unpublish workflows for content integrity.

**Out of scope (for this phase):**
- Native mobile applications.
- Multi-language (i18n) content translation.
- Rich-text editor and direct image-upload pipeline (images are referenced by URL in v1).
- Complex BI dashboards and forecasting.

## 1.8 Solution Overview

TOMS is a full-stack web application built on **Next.js 15** with the App Router, **TypeScript** end-to-end, and **MongoDB** via Mongoose. Authentication is handled by JWT tokens stored in HttpOnly cookies and validated through Next.js middleware. Zod schemas provide request-level validation, and a service layer separates business rules from HTTP handlers. The frontend is styled with Tailwind CSS using a custom "liquid glass" design language featuring an emerald + gold palette. Payments are handled via PayHere, and the production instance is deployed on Vercel.

## 1.9 Git Repository and Deployed System

- **GitHub Repository:** [INSERT CLICKABLE GIT REPOSITORY URL]
- **Deployed Production URL:** [INSERT CLICKABLE DEPLOYED URL]
- **Demo Credentials (read-only):**
  - Admin: [INSERT DEMO ADMIN EMAIL / PASSWORD]
  - Staff: [INSERT DEMO STAFF EMAIL / PASSWORD]
  - Customer: [INSERT DEMO CUSTOMER EMAIL / PASSWORD]

---

# CHAPTER 2 — REQUIREMENT ANALYSIS

## 2.1 Stakeholder Analysis

*Table 2.1 – Stakeholder Analysis*

| Stakeholder          | Role                                                | Primary Needs from the System                                                                  |
|----------------------|-----------------------------------------------------|------------------------------------------------------------------------------------------------|
| Admin                | System owner, full control                          | Manage all entities, enforce policies, view reports, manage users and roles                    |
| Staff / Concierge    | Day-to-day operator                                 | Handle bookings, assign vehicles/partners, confirm payments, respond to customers              |
| Customer / Traveller | End user booking tours                              | Browse packages, plan custom tours, make bookings, pay online, view status                     |
| Vehicle Owner        | External supplier of vehicles                       | Manage own vehicles, view assignments, block unavailable dates                                 |
| Hotel / Partner Owner| External accommodation / activity provider          | Manage own services, view bookings assigned, confirm/decline                                   |
| Client (Yatara Ceylon)| Business owner                                     | Operational efficiency, accurate reporting, brand-controlled customer experience               |
| Supervisor / Faculty | Academic evaluators                                 | Evidence of sound engineering, requirement coverage, and evaluation                            |

## 2.2 Functional Requirements

*Table 2.2 – Functional Requirements by Module (representative subset)*

| #   | Module                          | Requirement                                                                          |
|-----|----------------------------------|---------------------------------------------------------------------------------------|
| FR1 | Account Management               | Register, login, logout, profile, password reset, role assignment, RBAC enforcement   |
| FR2 | Account Management               | Email verification and session management via HttpOnly cookies                        |
| FR3 | Products & Content Management    | CRUD on Packages, Destinations, Districts, Places, FAQs                              |
| FR4 | Products & Content Management    | Draft / Publish / Unpublish workflow; soft delete preserving historical bookings      |
| FR5 | Products & Content Management    | Related packages and planner data feed                                               |
| FR6 | Vehicle Fleet Management         | CRUD on Vehicles; availability check; date-range VehicleBlocks                        |
| FR7 | Booking & Reservation Management | Create booking, modify, cancel, ticketing, status lifecycle transitions              |
| FR8 | Booking & Reservation Management | Assign vehicle and partner services to a booking                                     |
| FR9 | Finance Management               | Invoice generation, deposit & balance payments via PayHere, refund recording         |
| FR10| Finance Management               | Export invoices and basic financial reports                                          |
| FR11| Supplier / Partner Management    | CRUD on Partners and PartnerServices; assignment to bookings                         |
| FR12| Cross-cutting                    | Notifications for booking confirmation, payment, and status changes                  |

## 2.3 Non-Functional Requirements

*Table 2.3 – Non-Functional Requirements*

| #    | Category        | Requirement                                                                                 |
|------|-----------------|---------------------------------------------------------------------------------------------|
| NFR1 | Security        | JWT in HttpOnly cookies; RBAC via middleware; input validated by Zod; no secrets in client. |
| NFR2 | Performance     | First meaningful paint on package pages under perceived-instant latency on a typical link.  |
| NFR3 | Usability       | Consistent design system; no flow exceeding 4 primary steps for customer booking.           |
| NFR4 | Maintainability | Strict TypeScript; service-layer separation; conventional folder structure.                 |
| NFR5 | Scalability     | Stateless request handlers on Vercel Fluid Compute; horizontal scale supported.             |
| NFR6 | Availability    | Deployed on Vercel with managed uptime; database on managed MongoDB provider.               |
| NFR7 | Reliability     | Soft delete preserves historical booking data; publish guards protect public data.          |
| NFR8 | Accessibility   | Semantic HTML, readable contrast, keyboard-navigable forms.                                 |

## 2.4 Feasibility Analysis

**Technical feasibility** — The chosen stack (Next.js 15, TypeScript, MongoDB, Tailwind, Vercel) is mature, well-documented, and within team expertise. All external integrations (PayHere, SMTP) have public documentation and free/test tiers.

**Operational feasibility** — The system is accessible via any modern browser, requires no installation for end users, and uses familiar dashboard patterns. Staff training is minimal because workflows mirror existing manual steps.

**Economic feasibility** — Development uses free/open-source tooling; hosting on Vercel + managed MongoDB falls within hobby/low-tier plans sufficient for launch. Payment gateway fees are percentage-based, aligning cost with revenue.

**Schedule feasibility** — The 6-module scope was partitioned across 6 members, enabling parallel development within the academic semester timeline.

*Table 2.4 – Feasibility Summary*

| Dimension     | Verdict    | Reasoning                                                      |
|---------------|------------|----------------------------------------------------------------|
| Technical     | Feasible   | Mature stack; team skill coverage confirmed                    |
| Operational   | Feasible   | Browser-based; low training overhead                           |
| Economic      | Feasible   | Free/low-tier hosting; PayHere fees revenue-proportional       |
| Schedule      | Feasible   | Parallel module ownership; clear milestones                    |

## 2.5 SWOT Analysis

*Table 2.5 – SWOT Analysis*

| Strengths                                                      | Weaknesses                                                    |
|----------------------------------------------------------------|----------------------------------------------------------------|
| Unified data model across 6 modules                             | No rich-text editor or image upload pipeline in v1            |
| Strict RBAC from day one                                        | No multi-language content                                     |
| Brand-controlled customer experience                            | Limited analytics/BI in current scope                         |
| Modern, scalable stack (Next.js + MongoDB + Vercel)             | Small test-data set for stress evaluation                     |

| Opportunities                                                  | Threats                                                        |
|----------------------------------------------------------------|----------------------------------------------------------------|
| Expand to mobile PWA / native app                               | Dependence on third-party payment gateway availability         |
| Add AI-assisted itinerary generation                            | Competition from large global aggregators                      |
| Integrate WhatsApp / chatbot channels                           | Tourism demand volatility (seasonality, external shocks)       |
| Multi-operator/white-label expansion                            | Data-privacy regulation changes                                |

## 2.6 Requirements Modelling

**Use Case Diagram (conceptual):**
[INSERT USE CASE DIAGRAM — exported from Lucidchart / draw.io, caption as Figure 2.1]

**Representative User Stories:**

1. *As a customer*, I can browse published tour packages by district so that I can choose a trip relevant to my preferred region.
2. *As a customer*, I can build a custom tour by selecting destinations and travel dates so that the operator can price and confirm my plan.
3. *As staff*, I can assign an available vehicle to a confirmed booking so that transportation is locked in before the trip date.
4. *As an admin*, I can unpublish a package without deleting it so that historical bookings referring to that package remain valid.
5. *As a vehicle owner*, I can block specific date ranges so that staff cannot accidentally double-book my vehicle.
6. *As a partner*, I can view and confirm services assigned to me so that I have explicit acceptance of my workload.
7. *As finance*, I can record deposits, balances, and refunds against an invoice so that reconciliation is unambiguous.

---

# CHAPTER 3 — DESIGN AND DEVELOPMENT

## 3.1 System Architecture

TOMS follows a clean layered architecture:

1. **Client layer** — React Server Components and Client Components rendered by Next.js, styled with Tailwind and the custom liquid-glass tokens.
2. **Application layer** — Next.js App Router routes (pages and Route Handlers) acting as HTTP controllers.
3. **Service layer** — Pure TypeScript modules encapsulating business rules (validation, authorisation, workflows).
4. **Data access layer** — Mongoose models and repository helpers.
5. **External services** — MongoDB (database), PayHere (payments), SMTP (mail), Vercel (hosting + edge/compute), captcha provider (bot protection).

[INSERT Figure 3.1 — High-Level System Architecture Diagram (exported from draw.io or similar)]

*Figure 3.1 explanation:* The client interacts only with Next.js routes; all database and third-party access is server-side, keeping secrets off the browser. Middleware enforces authentication and role checks before the route handler runs, which means unauthorised requests never reach business logic.

## 3.2 Technology Stack

*Table 3.1 – Technology Stack Summary*

| Concern                 | Technology                              | Justification                                                                 |
|--------------------------|------------------------------------------|-------------------------------------------------------------------------------|
| Runtime / Framework      | Next.js 15 (App Router) + Node.js        | Unified SSR/CSR, Route Handlers, first-class Vercel deployment                |
| Language                 | TypeScript (strict)                      | Type safety across client and server                                          |
| Styling                  | Tailwind CSS + custom design tokens      | Rapid, consistent UI with design-system enforcement                           |
| Database                 | MongoDB + Mongoose                       | Flexible document model fits heterogeneous package/partner data               |
| Authentication           | JWT in HttpOnly cookies                  | Stateless, XSS-resistant session management                                   |
| Validation               | Zod                                      | Single schema source for request validation and TypeScript types              |
| Payments                 | PayHere (Sri Lanka-focused gateway)      | Local currency (LKR), locally trusted, supports recurring and one-off         |
| Email                    | SMTP (transactional)                     | Standard, provider-agnostic                                                   |
| Deployment               | Vercel (Fluid Compute)                   | Zero-config Next.js hosting, previews, managed scaling                        |
| Version Control          | Git + GitHub                             | Branch-based collaboration, PR review, traceable history                      |

## 3.3 Module Breakdown

1. **Account Management** — user lifecycle, login, RBAC, profile, notifications hooks.
2. **Products & Content Management** — packages, destinations, districts, places, FAQs, planner feed.
3. **Vehicle Fleet Management** — vehicles, vehicle blocks, availability lookup.
4. **Booking & Reservation Management** — bookings, ticketing, status lifecycle, assignments.
5. **Finance Management** — invoices, payments, refunds, exports.
6. **Supplier / Partner Management** — partners, partner services, booking-partner assignments.

Each module follows the same internal structure: `routes → controllers → services → models`, with Zod schemas colocated beside the service.

## 3.4 Authentication and Role-Based Access Control

[INSERT Figure 3.2 — Auth & RBAC Flow Diagram]

*Figure 3.2 explanation:* On login, credentials are verified and a JWT is issued as an HttpOnly, SameSite cookie. For every protected request, Next.js middleware reads the cookie, verifies the signature, resolves the role (Admin, Staff, VehicleOwner, HotelOwner, Customer), and either allows the request through or redirects to an appropriate page. Route handlers additionally assert role-specific rules before any data is mutated.

## 3.5 Booking Workflow Design

[INSERT Figure 3.3 — Booking Request Workflow Diagram]

*Figure 3.3 explanation:* A customer's booking moves through states `pending → confirmed → inProgress → completed` (with branches to `cancelled` and `refunded`). Each transition is gated by a service method that validates the allowed predecessor state, so invalid jumps (e.g., `completed → pending`) are impossible.

## 3.6 Finance and Payment Workflow

[INSERT Figure 3.4 — Payment Workflow Diagram (PayHere)]

*Figure 3.4 explanation:* When a booking is confirmed, an invoice is generated with deposit and balance components. PayHere handles the redirect + server-to-server notification; the notification endpoint validates the signature, marks the payment as `succeeded`, and advances booking status. Manual payments (bank transfer) are also supported and recorded via the staff dashboard.

## 3.7 Vehicle and Partner Management Design

[INSERT Figure 3.5 — Vehicle Availability & Block Workflow]

[INSERT Figure 3.6 — Partner Assignment Workflow]

*Explanation:* Vehicle availability is the *absence* of any overlapping `VehicleBlock` or confirmed `Booking` for the queried date range. Partner assignment creates a `BookingPartner` record that both staff and the partner owner can see, ensuring explicit acceptance.

## 3.8 Database Design

*Table 3.3 – Core Database Entities*

| Entity          | Purpose                                              |
|-----------------|-------------------------------------------------------|
| User            | Accounts, roles, hashed passwords, profile            |
| Package         | Tour package content, pricing, status                 |
| Destination     | Destination profile within a district                 |
| District        | Administrative region grouping destinations           |
| Place           | Points of interest referenced by destinations         |
| Booking         | Customer booking with lifecycle status                |
| Payment         | Individual payment transaction                        |
| Invoice         | Aggregated billing record for a booking               |
| Vehicle         | Fleet vehicle with capacity and category              |
| VehicleBlock    | Date-range unavailability for a vehicle               |
| Partner         | External supplier organisation                        |
| PartnerService  | Service offered by a partner                          |
| BookingPartner  | Assignment of a partner service to a booking          |
| Notification    | Outbound notification record (in-app / email)         |
| CustomPlan      | Customer-submitted custom itinerary request           |
| FAQ             | Published question/answer for content pages           |

[INSERT Figure 3.8 — Entity-Relationship Diagram (exported full-page)]

*Figure 3.8 explanation:* The schema is intentionally normalised around *Booking* as the central aggregate, with Package, Vehicle, and PartnerService attached via assignment documents. This keeps Package and PartnerService independent of any single booking, so unpublishing or editing them never corrupts historical records.

## 3.9 UI / Design System

The UI uses a custom design system nicknamed **"liquid glass"**:

- **Palette:** emerald primary, warm gold accent, near-black text on off-white backgrounds.
- **Typography:** a display serif for hero headings paired with a clean geometric sans for body.
- **Components:** glass cards with subtle blur, gradient borders, and consistent radius tokens.
- **Motion:** restrained, accessibility-friendly transitions (no auto-playing motion that can trigger vestibular issues).

[INSERT Figure 3.9 — Design System Palette & Components]

## 3.10 Implementation of Individual Modules

Each member owns one module, but all modules share the same conventions: Zod request schemas, service-layer authorisation checks, Mongoose models with indices on foreign keys, and standard HTTP status codes.

| Module                            | Owner                   | Key Implementation Notes                                                                                                   |
|-----------------------------------|-------------------------|----------------------------------------------------------------------------------------------------------------------------|
| Account Management                | Nawarathna (IT24100923) | JWT + HttpOnly cookie, password hashing, RBAC middleware, profile, notifications                                           |
| Products & Content Management     | Wasala (IT24100559)     | Package / Destination / District / Place / FAQ CRUD, draft-publish workflow, soft delete, planner feed                      |
| Vehicle Fleet Management          | Melisha (IT24102016)    | Vehicle CRUD, VehicleBlock date ranges, availability API                                                                   |
| Booking & Reservation Management  | Sanujan (IT24100220)    | Booking lifecycle state machine, ticketing, assignment to vehicles/partners                                                |
| Finance Management                | Luxsana (IT24102586)    | Invoice generation, PayHere integration, deposit/balance/refund recording, exports                                         |
| Supplier / Partner Management     | Muthubadiwila (IT24101070) | Partner and PartnerService CRUD, BookingPartner assignment, partner-side confirmation                                   |

## 3.11 Focused Module: Products & Content Management

*(Authored by Wasala W.M.S.S.B. – IT24100559)*

**Scope.** This module is the source of truth for everything a customer sees on the public site: tour packages, destinations, districts, places, and FAQs. It also feeds the tour planner and the related-packages component.

**Key Entities.** `Package`, `Destination`, `District`, `Place`, `FAQ`.

**Business Rules.**
1. Packages have three content states — `draft`, `published`, `unpublished` — and only `published` is visible publicly.
2. Delete is a *soft* delete: a deleted package is hidden from lists but still referenced by historical bookings.
3. Related packages are computed by shared districts and overlapping places, capped at a configurable limit.
4. The planner feed exposes only published data and strips internal-only fields.
5. All content writes are validated by Zod schemas and authorised for Admin/Staff only.

**Representative APIs (subset).**

*Table 3.2 – API Endpoints (representative subset for Products & Content Management)*

| Method | Path                                | Purpose                                       | Auth         |
|--------|--------------------------------------|-----------------------------------------------|--------------|
| GET    | `/api/packages`                      | List published packages (public)              | Public       |
| GET    | `/api/packages/:id`                  | Get package detail                            | Public       |
| POST   | `/api/packages`                      | Create package (draft)                        | Admin/Staff  |
| PATCH  | `/api/packages/:id`                  | Update package                                | Admin/Staff  |
| POST   | `/api/packages/:id/publish`          | Publish a package                             | Admin/Staff  |
| POST   | `/api/packages/:id/unpublish`        | Unpublish a package                           | Admin/Staff  |
| DELETE | `/api/packages/:id`                  | Soft-delete a package                         | Admin        |
| GET    | `/api/destinations`                  | List destinations                             | Public       |
| GET    | `/api/districts`                     | List districts with destination counts        | Public       |
| GET    | `/api/planner/feed`                  | Combined planner feed                         | Public       |
| GET    | `/api/faqs`                          | Published FAQs                                | Public       |

**Design decisions.**
- *Soft delete over hard delete* so historical bookings and invoices never orphan.
- *Explicit publish guard* rather than a boolean flag, to make state transitions auditable.
- *Separate planner feed* endpoint so the public planner does not over-fetch admin-only fields.

---

# CHAPTER 4 — RESULTS AND EVALUATION

## 4.1 Final System Overview

The delivered TOMS instance provides:

- A public site with home, packages, destinations, districts, places, FAQs, contact, and a *Build Your Tour* planner.
- Role-aware dashboards for Admin, Staff, Vehicle Owner, Hotel Owner, and Customer.
- Full CRUD coverage for all six modules.
- Integrated PayHere online payment for deposit and balance collection.
- Notifications for booking confirmation and status changes.
- Soft-delete and publish/unpublish workflows protecting historical integrity.

## 4.2 Implemented Features

| Module                            | Status                               | Notes                                                                                |
|-----------------------------------|--------------------------------------|--------------------------------------------------------------------------------------|
| Account Management                | Implemented                          | Login, register, role assignment, session cookies, profile                           |
| Products & Content Management     | Implemented                          | CRUD + publish + soft delete + planner feed                                          |
| Vehicle Fleet Management          | Implemented                          | CRUD + blocks + availability check                                                    |
| Booking & Reservation Management  | Implemented                          | Lifecycle states + ticketing + assignments                                           |
| Finance Management                | Implemented                          | Invoices + PayHere + refund recording + basic exports                                |
| Supplier / Partner Management     | Implemented                          | CRUD + assignment + partner-side confirmation                                        |
| Rich-text editor for packages     | Not in this phase                    | Planned for v2                                                                       |
| Image upload pipeline             | Not in this phase                    | Images referenced by URL in v1; Vercel Blob planned for v2                           |
| Multi-language content            | Not in this phase                    | Planned for v2                                                                       |

## 4.3 Screens and Outputs

- [INSERT Figure 3.10 — Home Page Screenshot]
- [INSERT Figure 3.11 — Packages Listing Screenshot]
- [INSERT Figure 3.12 — Package Detail Screenshot]
- [INSERT Figure 3.13 — Build-Your-Tour Planner Screenshot]
- [INSERT Figure 3.14 — Admin Packages Dashboard Screenshot]
- [INSERT Figure 4.1 — Booking End-to-End Flow Screenshot(s)]
- [INSERT Figure 4.2 — Admin Package CRUD Screens (Create, Edit, Publish)]
- [INSERT Figure 4.3 — Publish/Unpublish Guard in Action (Screenshot)]
- [INSERT Figure 4.4 — PayHere Payment Confirmation Screenshot]
- [INSERT ADDITIONAL SCREENSHOTS: Vehicle list, Vehicle Block calendar, Partner list, Invoice detail, Refund modal, Notifications panel]

## 4.4 Test Cases and Results

*Table 4.1 – Functional Test Cases (Products & Content Management – representative subset)*

| ID   | Test Case                                                  | Input                                          | Expected                              | Actual                              | Status |
|------|------------------------------------------------------------|------------------------------------------------|---------------------------------------|--------------------------------------|--------|
| TC01 | Create package with valid data                             | Valid title, price, district, places           | 201 Created; package in draft         | [INSERT ACTUAL RESULT]               | [P/F]  |
| TC02 | Create package with missing title                          | title = ""                                     | 400 with Zod error on `title`         | [INSERT ACTUAL RESULT]               | [P/F]  |
| TC03 | Publish a valid draft                                      | Valid draft id                                 | 200; status = published                | [INSERT ACTUAL RESULT]               | [P/F]  |
| TC04 | Unpublish a published package                              | Published id                                   | 200; status = unpublished              | [INSERT ACTUAL RESULT]               | [P/F]  |
| TC05 | Soft-delete a package                                      | Valid id                                       | 200; hidden from public; booking keeps reference | [INSERT ACTUAL RESULT]      | [P/F]  |
| TC06 | Public list excludes drafts                                | GET /api/packages                              | Only `published` returned              | [INSERT ACTUAL RESULT]               | [P/F]  |
| TC07 | Related packages cap respected                             | Package with many matches                      | Returns ≤ configured limit             | [INSERT ACTUAL RESULT]               | [P/F]  |
| TC08 | Planner feed strips admin-only fields                      | GET /api/planner/feed                          | No `internalNotes`, `status`, etc.     | [INSERT ACTUAL RESULT]               | [P/F]  |
| TC09 | FAQ creation by Customer denied                            | Customer token                                 | 403                                    | [INSERT ACTUAL RESULT]               | [P/F]  |
| TC10 | FAQ creation by Admin succeeds                             | Admin token                                    | 201                                    | [INSERT ACTUAL RESULT]               | [P/F]  |

[INSERT FULL TEST CASE TABLE FOR ALL 6 MODULES IN APPENDIX B — one sub-section per module owner]

## 4.5 Validation and Security Checks

*Table 4.2 – Validation & Security Test Cases (representative)*

| ID  | Check                                                              | Expected                                      | Status |
|-----|--------------------------------------------------------------------|-----------------------------------------------|--------|
| SC1 | JWT cookie is HttpOnly + SameSite                                   | Cookie flags present in response              | [P/F]  |
| SC2 | Unauthenticated access to admin route                                | 401/redirect to login                         | [P/F]  |
| SC3 | Customer accessing admin API                                         | 403 Forbidden                                 | [P/F]  |
| SC4 | Zod rejects oversized payloads                                       | 400 with clear message                        | [P/F]  |
| SC5 | Password stored hashed (never plaintext)                             | DB inspection shows hash only                  | [P/F]  |
| SC6 | PayHere notification signature verification                          | Invalid signature → rejected                  | [P/F]  |
| SC7 | Email input sanitisation                                             | Injection vectors rejected                     | [P/F]  |
| SC8 | Rate-limit / captcha on auth endpoints                               | Excess attempts blocked                        | [P/F]  |

## 4.6 User / Expert Feedback

A walkthrough was conducted with [INSERT NUMBER] participants representing [INSERT ROLES — e.g., the client, two staff members, and two sample customers]. Feedback was collected via a structured form covering clarity of navigation, booking-flow friction, dashboard usability, and overall impression.

**Summary of feedback:**
- [INSERT POSITIVE FEEDBACK POINT 1]
- [INSERT POSITIVE FEEDBACK POINT 2]
- [INSERT CONSTRUCTIVE CRITICISM POINT 1]
- [INSERT CONSTRUCTIVE CRITICISM POINT 2]
- [INSERT ANY NUMERIC RATINGS — e.g., average usability score / 5]

[INSERT FEEDBACK FORM SCREENSHOT OR SUMMARY TABLE IN APPENDIX B]

## 4.7 Limitations

1. Package content is plain text + URLs; no rich-text editor in v1.
2. Image management is URL-based; no direct upload pipeline or CDN transforms in v1.
3. Only English content — no i18n in v1.
4. Analytics are limited to basic invoice exports; no BI dashboards.
5. Test data set is modest; stress / load testing was not a primary focus.

## 4.8 Future Improvements

1. Integrate Vercel Blob (or Cloudinary) for direct image uploads with variants.
2. Add a rich-text editor with sanitisation for package descriptions.
3. Multi-language content via i18n routing and translation workflow.
4. Analytics dashboard for bookings, revenue, occupancy, and partner performance.
5. WhatsApp / chatbot channel for inquiry capture.
6. AI-assisted itinerary generation seeded from the planner feed.
7. PWA / native wrapper for offline-tolerant staff usage in the field.

---

# CHAPTER 5 — CONCLUSION

## 5.1 Achievement of Objectives

Each objective listed in §1.6 was met:

1. *Requirement analysis* — captured and documented in Chapter 2.
2. *Architecture design* — detailed in §3.1, with layered separation.
3. *Six modules implemented* — summarised in §3.10 and evidenced in §4.2.
4. *Secure authentication & RBAC* — implemented via JWT + HttpOnly cookies and middleware (§3.4, §4.5).
5. *Online payments* — PayHere integrated for deposit/balance (§3.6).
6. *Consistent UX via design system* — delivered (§3.9).
7. *Validation via test cases* — executed and recorded (§4.4, §4.5).
8. *Deployed and public Git repo* — see §1.9.

## 5.2 Achievement of Project Aim

The overall aim — to deliver a production-ready, role-aware Tour Operator Management System for Yatara Ceylon — has been achieved. The platform centralises all operational data, exposes a coherent public experience, and provides explicit workflows for the behaviours previously handled informally by the business.

## 5.3 Summary of Key Contributions

- A production-quality Next.js 15 / TypeScript / MongoDB application deployed on Vercel.
- Six integrated modules sharing a single data model and a single design system.
- Secure, role-based workflows with explicit state machines.
- Real online-payment integration (PayHere) end-to-end.
- A clean evaluation path (functional, validation, security, feedback).
- A documented foundation for v2 features (images, i18n, analytics, AI planning).

---

# REFERENCES

> **Action required:** Pick a single style — APA *or* Harvard — and apply it consistently. Use Zotero or Mendeley if possible. Add 3–5 reviewed sources. The entries below are placeholders in APA-7 style; replace with real citations that you actually read and cite in the text.

1. [INSERT REFERENCE — academic paper on e-tourism platforms]
2. [INSERT REFERENCE — paper / report on booking-system usability]
3. [INSERT REFERENCE — industry report on tour-operator SaaS landscape]
4. Next.js Documentation. (n.d.). *App Router*. Vercel. https://nextjs.org/docs/app
5. MongoDB, Inc. (n.d.). *MongoDB Manual*. https://www.mongodb.com/docs/manual/
6. PayHere. (n.d.). *Merchant Integration Guide*. https://support.payhere.lk/
7. Vercel. (n.d.). *Vercel Platform Documentation*. https://vercel.com/docs
8. [INSERT ANY ADDITIONAL REFERENCE YOU CITE IN THE BODY]

---
---

# PART C — POST-BODY SECTION

---

# APPENDIX A — MEMBER CONTRIBUTION TABLE

> **Instruction:** All members must *agree* on the percentages before submission. Do not default to equal splits if effort was unequal — the rubric explicitly rewards honest, evidence-based contribution accounting.

*Table A.1 – Member Contribution Summary*

| Student ID   | Member                   | Module                            | Key Work Delivered                                                                                                                   | Evidence (Git commits, diagrams, tests, docs)                                 | Contribution % |
|--------------|--------------------------|-----------------------------------|--------------------------------------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|----------------|
| IT24100923   | Nawarathna K.M.G.D.I.    | Account Management                | Auth, JWT + HttpOnly cookies, RBAC middleware, profile, notifications hooks                                                          | [INSERT COMMITS LINK / DIAGRAMS / TEST EVIDENCE]                              | [INSERT %]     |
| IT24100559   | Wasala W.M.S.S.B.        | Products & Content Management     | Package/Destination/District/Place/FAQ CRUD, draft-publish workflow, soft delete, planner feed, related packages                     | [INSERT COMMITS LINK / DIAGRAMS / TEST EVIDENCE / UI SCREENSHOTS]             | [INSERT %]     |
| IT24102016   | Melisha L.R.L.           | Vehicle Fleet Management          | Vehicle CRUD, VehicleBlock, availability API, staff dashboard for fleet                                                              | [INSERT COMMITS LINK / DIAGRAMS / TEST EVIDENCE]                              | [INSERT %]     |
| IT24100220   | Sanujan N.               | Booking & Reservation Management  | Booking lifecycle state machine, ticketing, assignments to vehicles/partners                                                         | [INSERT COMMITS LINK / DIAGRAMS / TEST EVIDENCE]                              | [INSERT %]     |
| IT24102586   | Luxsana S.               | Finance Management                | Invoice generation, PayHere integration, deposits/balance/refund records, exports                                                    | [INSERT COMMITS LINK / DIAGRAMS / TEST EVIDENCE / PAYMENT SCREENSHOTS]        | [INSERT %]     |
| IT24101070   | Muthubadiwila M.W.H.A.   | Supplier / Partner Management     | Partner and PartnerService CRUD, BookingPartner assignment, partner-side confirmation                                                | [INSERT COMMITS LINK / DIAGRAMS / TEST EVIDENCE]                              | [INSERT %]     |
|              | **Total**                |                                   |                                                                                                                                      |                                                                                | **100%**       |

**Agreement statement:**
All group members have reviewed the above contribution percentages and confirm them as an honest reflection of the work delivered.

Signatures: [INSERT EACH MEMBER'S SIGNATURE]
Date: [INSERT DATE]

---

# APPENDIX B — SCREENSHOTS AND EXTENDED MATERIAL

Place supporting content here — material that is useful but not essential to the main discussion.

### B.1 Full Test-Case Tables (Per Module)

- B.1.1 Account Management — [INSERT FULL TEST CASE TABLE]
- B.1.2 Products & Content Management — [INSERT FULL TEST CASE TABLE]
- B.1.3 Vehicle Fleet Management — [INSERT FULL TEST CASE TABLE]
- B.1.4 Booking & Reservation Management — [INSERT FULL TEST CASE TABLE]
- B.1.5 Finance Management — [INSERT FULL TEST CASE TABLE]
- B.1.6 Supplier / Partner Management — [INSERT FULL TEST CASE TABLE]

### B.2 Additional Screenshots

- [INSERT SCREENSHOT: Login page]
- [INSERT SCREENSHOT: Register page]
- [INSERT SCREENSHOT: Admin dashboard home]
- [INSERT SCREENSHOT: Package create form]
- [INSERT SCREENSHOT: Package edit form]
- [INSERT SCREENSHOT: Destination detail (admin)]
- [INSERT SCREENSHOT: Vehicle list]
- [INSERT SCREENSHOT: Vehicle block calendar]
- [INSERT SCREENSHOT: Booking list]
- [INSERT SCREENSHOT: Booking detail + assignment]
- [INSERT SCREENSHOT: Invoice detail]
- [INSERT SCREENSHOT: PayHere success redirect]
- [INSERT SCREENSHOT: Partner list]
- [INSERT SCREENSHOT: Partner service assignment]
- [INSERT SCREENSHOT: Notifications panel]
- [INSERT SCREENSHOT: Mobile responsive views]

### B.3 Extended Diagrams

- [INSERT FULL-SIZE ER DIAGRAM]
- [INSERT FULL-SIZE USE CASE DIAGRAM]
- [INSERT SEQUENCE DIAGRAM — Booking flow]
- [INSERT SEQUENCE DIAGRAM — Payment flow]
- [INSERT SEQUENCE DIAGRAM — Publish/Unpublish flow]
- [INSERT DEPLOYMENT DIAGRAM]

### B.4 Meeting / Progress Evidence (optional)

- [INSERT LINK OR SCREENSHOT: Weekly meeting log / supervisor sign-offs]
- [INSERT LINK OR SCREENSHOT: Sprint board / Kanban / issue tracker]
- [INSERT LINK OR SCREENSHOT: Pull-request / code-review samples]

### B.5 Configuration and Setup (optional)

- [INSERT `.env.example` FILE CONTENTS — remove all real secrets first]
- [INSERT BUILD / DEPLOY COMMANDS USED]
- [INSERT ANY DEPLOYMENT CONFIGURATION SCREENSHOTS (Vercel dashboard)]

---

# END OF REPORT

---

## WHAT YOU NEED TO EDIT — CHECKLIST

Below is the complete list of everything you must personally fill in, replace, or produce before exporting the Word / PDF version. Work through this top to bottom.

### 1. Pre-Body Section
- [ ] **Title Page** — group number, campus, supervisor name, submission date, university/campus logo.
- [ ] **Declaration** — every member's signature and date; supervisor's name, signature, date.
- [ ] **Abstract** — trim/expand so it fits exactly one page; update the word count if needed (target 200–300 words).
- [ ] **Acknowledgement** — replace `[INSERT SUPERVISOR NAME]` with the real name.
- [ ] **Table of Contents** — after applying Heading styles in Word, regenerate via *References → Table of Contents → Automatic Table*.
- [ ] **List of Tables / Figures** — regenerate via *References → Insert Table of Figures* after all captions are added.

### 2. Chapter 1 — Introduction
- [ ] §1.4 Literature Review — replace the 5 example paragraphs with real, properly cited references (add them to the References section too).
- [ ] §1.9 — insert clickable **GitHub repository URL** and **deployed production URL**. Optionally insert demo credentials (non-production, read-only).

### 3. Chapter 2 — Requirement Analysis
- [ ] §2.6 — insert the **Use Case Diagram** (export from draw.io / Lucidchart as PNG). Add caption "Figure 2.1".
- [ ] Review the functional / non-functional tables against your final system and add or remove rows if needed.

### 4. Chapter 3 — Design and Development
Insert each of these diagrams (exported as images) and caption them exactly as shown:
- [ ] **Figure 3.1** — High-Level System Architecture
- [ ] **Figure 3.2** — Auth & RBAC Flow
- [ ] **Figure 3.3** — Booking Request Workflow
- [ ] **Figure 3.4** — Payment Workflow (PayHere)
- [ ] **Figure 3.5** — Vehicle Availability & Block Workflow
- [ ] **Figure 3.6** — Partner Assignment Workflow
- [ ] **Figure 3.7** — Content Publishing Workflow
- [ ] **Figure 3.8** — Entity-Relationship Diagram (full page)
- [ ] **Figure 3.9** — Design System Palette & Components

### 5. Chapter 4 — Results and Evaluation
- [ ] Insert every Figure 3.10–3.14 and 4.1–4.4 (screenshots of the real running system).
- [ ] §4.4 — fill in the **Actual Result** and **Status (Pass/Fail)** columns in Table 4.1 from your real testing.
- [ ] §4.5 — fill in **Status** for each security check based on real observation.
- [ ] §4.6 — insert number of participants, their roles, positive feedback, constructive criticism, and any ratings. Attach the feedback form screenshot in Appendix B.

### 6. Chapter 5 — Conclusion
- [ ] No fill-ins needed. Re-read and make sure every objective statement matches what you actually delivered.

### 7. References
- [ ] Replace the 3 `[INSERT REFERENCE …]` placeholders with real academic / industry references that you actually cite in the body.
- [ ] Apply a single citation style (APA-7 or Harvard) consistently everywhere.

### 8. Appendix A — Contribution Table
- [ ] Fill in the **Evidence** column (commit ranges or links, diagram files, test artefacts).
- [ ] Agree on the **% Contribution** per member. Do not default to 16.67% each unless that is genuinely accurate.
- [ ] All six members sign under the agreement statement.

### 9. Appendix B — Extended Material
- [ ] Paste the **full test case tables** for all 6 modules.
- [ ] Paste the additional screenshots listed in §B.2.
- [ ] Paste the extended diagrams listed in §B.3.
- [ ] (Optional) Add meeting logs, sprint board snapshots, PR review samples.
- [ ] (Optional) Paste sanitised `.env.example` (NO real secrets).

### 10. Formatting Pass (do this last, in Word)
- [ ] Apply **Heading 1 / 2 / 3** styles to every heading.
- [ ] Set font **Times New Roman 11**, line spacing **1.2**, alignment **Justify**.
- [ ] Insert **Next Page Section Breaks** before Chapter 1 and before Appendix A.
- [ ] Page numbers — Roman for pre-body, restart Arabic at Chapter 1.
- [ ] Caption every figure with *References → Insert Caption → Label: Figure* (chapter-based numbering).
- [ ] Caption every table with *References → Insert Caption → Label: Table*.
- [ ] Regenerate TOC, List of Tables, List of Figures.
- [ ] Confirm main body page count is between **20 and 30** pages.
- [ ] **Export as PDF** via *File → Save As → PDF*.

### 11. Final Sanity Check Before Submission
- [ ] Every `[INSERT …]` placeholder has been removed.
- [ ] All figures and tables are referred to by number at least once in the body text (e.g., "as shown in Figure 3.1").
- [ ] No screenshots contain real passwords, real API keys, real customer PII, or real payment-card data.
- [ ] Git repository is public (or the evaluators have access).
- [ ] Deployed URL is live and the demo account works.
- [ ] File name follows the module's naming convention (e.g., `ITP_Group_<NUMBER>_FinalReport.pdf`).
