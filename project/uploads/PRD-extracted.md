

Revv V1 — Consolidated PRD

Shop Product + Driver Companion + Deals Marketplace

Launch Market: British Columbia, Canada

Version: 1.0

Status: Draft for team review

Owner: Bukunmi Osota, CEO

Audience: Founding team + engineering

1. Summary

Revv is a two-sided automotive platform launching in BC. The shop product is a SaaS dashboard for independent auto repair shops to manage jobs, customers, and now deals. The driver companion is a free app for car owners that helps them manage their vehicle and discover deals from Revv-registered shops nearby.

V1 ships a consolidated, end-to-end experience across both sides. The headline pull for drivers is Deals Discovery. The headline pull for shops is the lead-generation channel that Deals creates, with automatic customer matching and a closed-loop response handshake.

Three load-bearing decisions are resolved in this spec, replacing earlier ambiguity in the source PRDs:

Claim is the primary action on a deal card. Direct call and WhatsApp buttons recede behind it.

Deals ship with a 24-hour response handshake. Claims are not lead dumps; they create a tracked, time-boxed marketplace primitive.

Auto-created records from claims are leads, not customers. They promote to customers only when the shop marks the claim Converted.

2. Why this V1

Two products, one release. The shop dashboard launches first; the driver companion ships approximately one week later. Both products are required for V1 to mean anything. A driver app without shop supply is empty. A shop product without drivers is just a CRM.

Deals is the wedge feature on both sides. For drivers, it gives a reason to open the app outside of a maintenance event. For shops, it converts the SaaS from a back-office tool into a demand-generation channel. Everything else in V1 (car profile, service log, customer matching) supports the Deals loop.

Features intentionally pushed out of V1:

Paid VIN-based service history import. The licensing cost and BC coverage do not justify it before validation.

AI repair quote translator. Strong V1.5 feature but adds engineering load and is not the headline pull.

Maintenance timeline with manufacturer schedules. Built on top of the manual service log once data exists.

Smart reminders. Belongs with the timeline.

In-app booking and payment. V2, after lead-conversion data justifies a take rate.

Reviews, ratings, reputation surface for shops. V2.

3. Goals and success criteria

3.1 Goals

Onboard 50 BC shops to the dashboard within 90 days of launch.

Drive 500 driver app installs within 90 days, weighted to neighborhoods with shop density.

Land at least one deal claim per active shop per week by month two.

Hit a 50% Contacted rate on claims within 24 hours of submission.

Establish Revv as the trusted destination for car service decisions in the launch neighborhoods.

3.2 Anti-goals

Do not launch driver-side Deals in any neighborhood without supply density. Empty search is worse than no feature.

Do not optimize for weekly active use of the driver app. Monthly is the realistic cadence for a car maintenance utility.

Do not build features that depend on a paid third-party data integration in V1.

4. Launch market: British Columbia

BC shop owners do not have a "no way to reach customers" problem. They have a "lead channels are expensive and do not convert" problem. Yelp, Google Local Services, and Facebook lead ads are the alternatives. The pitch is: stop paying for leads that do not show up.

Driver-side acquisition will be neighborhood-gated. The first three launch neighborhoods are selected by shop density, not population. Candidate neighborhoods (to be confirmed by GTM):

Mount Pleasant / East Vancouver corridor

Marpole / South Vancouver

North Vancouver (Lonsdale corridor)

Minimum density to enable driver-side Deals in a neighborhood: 5 active shops with at least one live deal each. Below this, the search experience is too thin and reinforces the wrong impression of the product.

All copy, examples, and onboarding flows are written for the BC market. Nigeria framing is removed from the product. WhatsApp is retained as a communication channel because it is widely used by independent shops in BC, particularly among first- and second-generation immigrant operators.

5. Users

5.1 Shop side

Primary user: the shop owner-operator. Manages 1 to 4 bays, takes calls, writes invoices, sometimes turns wrenches. Mobile-first. Time-poor. Adopts software only if it earns its place in under a week.

Secondary users on the dashboard: service writer (creates jobs, talks to customers), technician (reads jobs, updates status). V1 ships with a single user role; multi-user permissions are V1.5.

5.2 Driver side

Primary user: an individual car owner in BC, non-technical, keeps their car 3 to 10 years, owns 1 to 3 vehicles in the household. Wants to avoid overpaying for repairs and avoid missing maintenance. Will not use an app that demands ongoing engagement.

Two acquisition paths into the driver app:

Organic / direct. A driver searches for service deals or hears about Revv socially. They sign up fresh.

Shop-invited. A Revv-registered shop has the customer in their database with a VIN. The customer receives an SMS or email invite with a deep link to claim their car in the app.

V1 must serve both paths cleanly. The shop-invited path is essentially free supply and feeds the flywheel.

6. Product architecture

V1 has three connected surfaces. Each is described in detail in Section 7.
Surface
User
Primary V1 capabilities
Shop dashboard
Shop owner-operator
Job management, customer database, Deals creation, Claims Inbox, automatic matching
Driver app
Car owner
Car profile, manual service log, Deals discovery, claim deals, claimed deals timeline
Marketplace layer
Both sides + Revv ops
Claim handshake, response SLA, matching engine, moderation queue, geographic scoping

 

7. Feature specification

7.1 Shop dashboard — Deals creation

The Deals creation flow must publish a deal in under 60 seconds on a phone. The earlier 7-field form is collapsed to 3 required fields. Everything else is optional or auto-derived.

7.1.1 Required fields

Service type. Single-select from a fixed list aligned with driver search categories: oil change, brake service, tire service, AC service, full inspection, diagnostic, transmission, alignment, detailing, carwash, other.

Offer line. Free-text, one line, up to 80 characters. Examples: "$79 oil change includes filter and 25-point inspection", "20% off all brake jobs through May".

Expiry date. Required. Maximum duration 90 days. Defaults to 30 days from today.

7.1.2 Optional fields

Original price and deal price (numeric). If both are entered, Revv calculates and displays the discount percentage on the card. If left blank, the offer line stands alone.

Start date. Defaults to today.

Internal note (not visible to drivers).

7.1.3 Card preview

Before publishing, the shop sees the card exactly as it will appear to a driver. No surprises post-publish. The preview pulls the shop name, neighborhood, and operating hours from the existing shop profile — none of these are re-entered per deal.

7.1.4 Deal status

Draft. Created but not published.

Active. Live and visible to drivers in scope.

Paused. Hidden from drivers, can be reactivated.

Expired. Read-only, removed from driver search automatically.

Active and Paused deals count toward the 5-deal limit. Expired deals do not. Open claims survive deactivation and pausing — the shop must still resolve them. Drivers receive no notification when a deal they claimed is paused; their existing claim is the contract.

7.1.5 Deal limits

Maximum 5 active or paused deals per shop in V1.

Hitting the limit prompts the shop to pause or expire an existing deal first.

7.2 Shop dashboard — Claims Inbox

Each active deal has a Claims tab. The Claims Inbox is the shop-side surface where the marketplace primitive lives. It is not a notification feed — it is a pipeline.

7.2.1 Claim record

Each claim entry shows:

Driver name (from Revv profile)

Phone number

VIN of the vehicle on the claim

Date and time of claim

Match status (see 7.4)

Time remaining on the 24-hour response window

Current pipeline status

7.2.2 Pipeline statuses

New. Default on submission. Counts against the 24-hour response SLA.

Contacted. Shop has reached out. Stops the SLA timer.

Converted. Driver came in for service. Promotes the lead to a customer record. Counts toward shop honor rate.

No Response. Driver did not respond after the shop contacted them. Neutral outcome.

Expired. Shop did not contact within 24 hours. Counts against shop honor rate.

7.2.3 Quick actions on a claim

Call. Tel link, pre-filled with driver number.

WhatsApp template. Opens WhatsApp with a pre-written, editable message: "Hi {name}, thanks for claiming our {deal_title} at {shop_name}. We have availability {time_options}. Reply to book." Sending the template auto-marks the claim Contacted.

Mark Converted. One tap. Promotes the lead to a customer record (see 7.4.4).

Mark No Response. One tap, available after Contacted.

7.2.4 Notifications to the shop

In-app notification on every new claim, with badge count on the Claims tab.

Optional WhatsApp notification to the shop owner — opt-in during onboarding.

Reminder notification at the 18-hour mark if a claim is still New.

7.3 Matching engine

When a claim is submitted, the matching engine runs in this order:

VIN match. Search the shop's customer database for a vehicle with the same VIN. If found, link the claim to that customer record. The shop sees full prior service history alongside the claim.

Phone + VIN delta. If no VIN match but the phone number matches an existing customer, the engine flags this as "Phone matched, different vehicle." This is a new car for an existing customer (common in multi-car households or when a customer replaces a vehicle). The shop sees the existing customer alongside the claim and can add the new VIN to that customer with one tap.

Phone match only. Phone matches but VIN is not on file at all. Flagged "Phone matched, VIN not yet on file." Shop can add the VIN to the existing record.

No match. A new lead record is created. Tagged "Added via Deal Claim." It is not a customer record. It only promotes to a customer when the claim is marked Converted.

7.3.1 Conflict handling

If a Revv-registered driver has a different phone number on file with the shop than on their Revv profile, the system never overwrites. The shop sees both numbers with a prompt: "This customer has a different number in your database. Update it?" The shop owner decides.

7.3.2 Lead vs customer (privacy posture)

A lead is a temporary record visible only inside the Claims Inbox and the shop's leads list. It contains name, phone, VIN, and source. Leads are not part of the shop's customer CRM and do not appear in customer search, marketing exports, or analytics. A lead promotes to a full customer record only when the shop marks the associated claim Converted.

This posture serves two purposes: it is consistent with PIPEDA and BC PIPA notice obligations (the driver consents to lead-stage data sharing at claim time, and to customer-stage retention only when they have actually transacted), and it keeps the shop's customer list clean of unconverted lead noise.

7.3.3 Driver-side privacy notice

Before a driver submits their first claim, they see a one-time notice: "When you claim a deal, your name, phone, and VIN are shared with the shop. They will contact you within 24 hours. If you complete the service, the shop adds you to their customer records. You can request deletion anytime from your profile."

7.4 Driver app — Deals discovery

The Deals tab is the headline surface of the driver app. It is search-first. There is no browse feed and no curated home page. A driver opens the tab, types or taps a service category, and sees relevant deal cards within their geographic scope.

7.4.1 Search

Search bar is the primary input on the Deals tab.

Suggested terms below the search bar match the fixed service categories in 7.1.1.

Free-text search maps to categories with light fuzzy matching ("brakes" → brake service).

Search returns deal cards only — never shop profiles or generic listings.

7.4.2 Geographic scope

A deal is published to drivers within a 10 km radius of the shop's registered address. This radius is not shop-configurable in V1.

Driver location is detected on the device. Drivers can override with a manually entered postal code or city in their profile.

If a driver is outside any neighborhood with active deals, the empty state explains: "No deals near you yet. Revv is launching neighborhood by neighborhood — we'll let you know when shops near you join."

7.4.3 Filters

Filters appear as chips above results after a search is run.

Available filters: service category, distance (3 km, 5 km, 10 km), deal validity (any, ending soon).

Maximum 3 active filters at once.

7.4.4 Deal card

Two-column gallery on mobile when 4 or more results. Single column when fewer. Every card identical in structure — only the content differs.

Card displays:

Shop name

Service type

Offer line (one line)

Original price and deal price, or percentage off, if provided

Distance from driver

Expiry date, with "Ending soon" label if within 48 hours

Single primary action: Claim Deal

Tapping the card expands it to show the full offer line, shop address, operating hours, and a fallback Call button. WhatsApp is not surfaced as a primary contact path on the driver side — the WhatsApp message comes from the shop after claim, not the other way around. This protects the handshake.

7.4.5 Claim Deal — primary action

Tapping Claim Deal submits the driver's Revv profile data — name, phone, VIN — to the shop. The driver sees a confirmation screen: "Your claim has been sent to {Shop Name}. They'll be in touch within 24 hours. We'll let you know when they respond."

A claim creates a tracked record on both sides. The driver sees their claim in a Claimed Deals section of their profile with status: Awaiting response, Shop contacted, Confirmed, Expired.

The button changes to "Claimed" after submission. A driver cannot claim the same deal twice. A driver can have one open claim per shop at a time. After Converted or No Response, they can claim again.

7.4.6 The 24-hour handshake

This is the marketplace primitive. The flow:

Driver claims a deal at hour 0.

Shop receives in-app notification, sees claim in Claims Inbox.

Shop has 24 hours to mark the claim Contacted (typically by sending the WhatsApp template).

Driver receives a confirmation push when the shop marks Contacted: "{Shop Name} has reached out. Check your WhatsApp or phone."

If the shop does not respond within 24 hours, the claim auto-Expires. Driver receives a notification: "We didn't hear back from {Shop Name}. Want to look at other deals?" The expiry counts against the shop's honor rate.

The handshake is the difference between Deals being a feature and Deals being a marketplace. Shipping V1 without it produces a lead-gen tool that gets complaints. Shipping V1 with it produces a primitive Revv can build everything else on.

7.5 Driver app — supporting features

7.5.1 Sign-up and onboarding

Sign-up via email + password, Google, or Apple. Passkey support is V1.5.

After sign-up, the driver enters or scans their VIN.

VIN decodes via free public API (e.g., NHTSA vPIC) into year, make, model, engine. No paid history provider in V1.

Drivers can add multiple vehicles. Each vehicle has its own VIN.

If the driver was invited by a shop (deep link with VIN pre-filled), the onboarding skips VIN entry and shows: "Is this your car? {Year Make Model}." Yes adds the vehicle to their profile and links the existing shop record.

7.5.2 Car profile

Displays year, make, model, engine, current mileage (manual entry).

Shows linked shops — any Revv-registered shop where this VIN appears in the customer database.

Shows service log entries for this vehicle (see 7.5.3).

7.5.3 Manual service log

A driver can add a service record with three required fields:

Date

Mileage

What was done (free text or category)

Optional fields: shop name (free text or pick from linked Revv shops), notes, receipt photo upload.

Service log entries are the foundation for V1.5 reminders and the V2 maintenance timeline. Even if the driver never opens this feature, the log is auto-populated for any service done at a Revv shop with their VIN on file — those entries appear automatically.

7.5.4 Claimed Deals

A list view in the driver profile showing all deals the driver has claimed, with status (Awaiting response, Shop contacted, Confirmed, Expired) and timestamps. Tapping a claim shows the original deal card and a contact link to the shop if the claim is active.

7.6 Shop dashboard — supporting features

Most of the shop dashboard already exists in the current product (job management, customer database, invoicing). The V1 additions specific to this spec:

New top-level navigation: Deals.

New top-level navigation: Leads (separate from Customers).

Customer detail page now shows a "Linked Revv Driver" badge when the customer has claimed Revv via the driver app.

Customer invite flow: from any customer record, the shop can send an invite via SMS or email — a deep link with the VIN pre-filled that takes the driver into Revv onboarding.

7.7 Moderation and trust

Trust is the hidden currency of a marketplace. Three V1 mechanisms:

7.7.1 Driver-side flag

A "Report this deal" link on the expanded deal card. Two flags from different drivers auto-pause the deal pending Revv ops review. One flag triggers internal queue review.

7.7.2 Honor rate

Computed per shop as: (Contacted + Converted) / (Contacted + Converted + Expired + No Response from shop side). Not surfaced to drivers in V1. Used internally for shop quality monitoring. Shops below 60% honor rate after 10 claims receive a warning. Shops below 40% after 20 claims are suspended from Deals (not from the shop SaaS — they continue using the dashboard for jobs and customers).

7.7.3 No pre-publish review

Deals publish instantly. Pre-review would kill the under-60-second creation goal. Moderation is reactive (flags) plus internal random sampling by Revv ops in the first 90 days.

8. Out of scope for V1

AI repair quote translator (V1.5).

Smart reminders, maintenance timeline (V1.5 / V2).

Paid VIN history integration (V2 if validated).

In-app booking and payment for claimed deals (V2 — the moment Revv earns a take rate).

Reviews, ratings, public shop reputation surface (V2).

Push notifications for new deals matching a driver's car or interests (V1.5).

Saved or favorited deals (V1.5).

Featured or paid placement of any kind. Not on the roadmap.

Multi-user roles on the shop dashboard (V1.5).

Bulk deal creation, deal templates, image uploads on deal cards (V1.5).

VIN ownership transfer mechanics. Hard problem, deferred.

9. Success metrics

9.1 Marketplace health (the metrics that matter)

24-hour response rate: % of claims marked Contacted within 24 hours. Target 70% by month 3.

Claim conversion rate: % of Contacted claims that reach Converted. Target 30% by month 3.

Shop honor rate (defined in 7.7.2). Target average 75%+ across active shops.

Deal supply density: average active deals per shop. Target 2+ by month 3.

9.2 Adoption (driver side)

Driver activation: % of installs that complete VIN onboarding. Target 60%.

First claim: % of activated drivers who claim at least one deal in their first 30 days. Target 25%.

Monthly active drivers in launched neighborhoods. No weekly target — monthly is the realistic cadence.

9.3 Adoption (shop side)

% of onboarded shops that publish at least one deal in their first 30 days. Target 60%.

Average time to publish a deal. Target under 60 seconds median.

Deal renewal rate: % of shops that recreate or replace a deal after expiry. Target 50%.

9.4 Metrics not used in V1

Weekly active driver users. Wrong cadence for the use case.

Self-reported "helpfulness" scores. No reliable collection mechanism.

Total claims. Vanity metric without conversion context.

10. Sequencing
Phase
Timing
Scope
V1.0 — Shop launch
Week 0
Shop dashboard with Deals creation, Claims Inbox, matching engine, customer invite flow. No driver app yet — Revv ops manually onboards 50 BC shops and helps them publish first deals to seed supply.
V1.0 — Driver launch
Week 1
Driver app launches in 2-3 BC neighborhoods that hit the density threshold. Sign-up, VIN car profile, manual service log, Deals discovery, claim with handshake. Soft launch — no paid acquisition yet.
V1.1
Weeks 2-4
Stabilization. Bug fixes, response-rate tuning, honor-rate enforcement, neighborhood expansion as supply density allows.
V1.5
Weeks 4-12
AI repair quote translator. Push notifications for new deals matching a driver's car. Saved deals. Smart reminders from manual log. Multi-user roles on shop side. Light shop-side analytics.
V2
Post pre-seed
Maintenance timeline, paid VIN history integration (if validated), in-app booking and payment, public shop reputation surface, VIN transfer.

 

11. Open questions for the team

These are the calls that still need to be made before engineering kickoff. Each has a recommended default in this spec but is worth a 15-minute conversation.

Density threshold: is 5 active shops with at least one live deal each the right floor for enabling driver-side Deals in a neighborhood, or higher?

SLA timer: 24 hours, or shorter (12 hours) given that BC shops are mostly daytime-hours operators? A claim submitted Friday at 6pm under a 24-hour rule expires at 6pm Saturday — most shops are closed.

Honor rate thresholds: 60% / 40% are placeholders. Confirm or adjust after first 30 days of real data.

Customer invite copy: SMS vs email vs both. What is the channel that BC shops will actually use?

Driver-side privacy notice: confirm exact wording with whatever counsel Revv is using on data residency and PIPA compliance.

12. Risks and mitigations
Risk
Likelihood
Mitigation
Supply density too low at launch — empty driver searches
High
Neighborhood-gated launch with hard 5-shop floor. Manually seed deals with first cohort. Do not launch driver app in any neighborhood that does not clear the floor.
Shops do not respond to claims, drivers churn
High
24-hour SLA with auto-expiry and honor rate enforcement. WhatsApp template lowers friction to under 30 seconds.
Privacy / PIPA exposure on auto-created customer records
Medium
Lead/customer split. Driver-side disclosure at first claim. Customer record only on Converted.
Shops post deals they do not honor (bait-and-switch)
Medium
Driver flag, honor rate monitoring, suspension thresholds. Random sampling by Revv ops in first 90 days.
Engineering scope underestimated — V1 slips
Medium
Aggressive de-scoping (5 features cut to V1.5/V2). All paid integrations deferred.
Driver acquisition cost too high outside seeded neighborhoods
Medium
Soft launch with no paid spend. Rely on shop-invited path and local social channels (Reddit, Facebook groups) before scaling acquisition.

 

13. Appendix — three load-bearing decisions

Recording the three decisions that resolved earlier ambiguity. If we revisit any of these, this whole spec needs reworking.

13.1 Claim is the primary action

Direct call and WhatsApp from a deal card recede. The Claim button creates a tracked record on both sides; raw call/text actions disappear into phone logs and break the metrics. Drivers who want to bypass the claim flow can still see the shop's phone number in the expanded card view, but the primary path is Claim.

13.2 24-hour response handshake ships in V1

Without the handshake, Deals is a lead-gen feature with no quality control. With it, Deals is a marketplace primitive Revv can build everything else on (booking, payments, reputation). The engineering cost is meaningful but justified.

13.3 Lead vs customer split

Auto-created records from claims are leads. They live in a separate table from customers. They promote to customers only on Converted. This protects driver privacy, keeps the shop's CRM clean, and aligns with PIPEDA/PIPA notice posture.

