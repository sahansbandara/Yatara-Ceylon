# TOMS Manual QA Matrix

This matrix tracks the critical manual checks requested in the TOMS completion plan.

Status values:
- `Not run` means the case is documented but still requires manual execution.
- `Pass` / `Fail` should be filled in during QA execution.

## Auth & Account Security

| Test ID | Module | Action | Input | Expected Result | Actual Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- |
| AUTH-001 | Login | Sign in with valid verified user | Verified user email + valid password | Login succeeds, JWT cookie set, dashboard/public redirect works | Pending manual execution | Not run |
| AUTH-002 | Login | Sign in with unverified user | Unverified user email + valid password | `403` with verification prompt, no auth cookie | Pending manual execution | Not run |
| AUTH-003 | Login | Trigger lockout | Same email with 5 invalid passwords | Final attempt returns lockout message and later valid login is blocked until expiry | Pending manual execution | Not run |
| AUTH-004 | Email Verification | Verify new account | Fresh verification link from email | User becomes verified, redirected to login with success banner | Pending manual execution | Not run |
| AUTH-005 | Password Reset | Request reset link | Registered email address | Generic success message shown, reset email sent | Pending manual execution | Not run |
| AUTH-006 | Password Reset | Reset password with valid token | Reset token + strong password | Password updates, token cannot be reused, login succeeds with new password | Pending manual execution | Not run |
| AUTH-007 | CSRF | Submit mutating request without token | Any protected POST/PATCH/DELETE without matching CSRF header/cookie | Request rejected with CSRF error | Pending manual execution | Not run |

## Bookings, Vehicles, and Plans

| Test ID | Module | Action | Input | Expected Result | Actual Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- |
| BOOK-001 | Public Booking | Submit booking request | Valid booking form + valid captcha | Booking created, support ticket created, success message shown | Pending manual execution | Not run |
| BOOK-002 | Public Booking | Submit invalid booking dates | End date earlier than start date | Validation error, no booking created | Pending manual execution | Not run |
| BOOK-003 | Booking Security | Open customer bookings as logged-out user | `GET /api/bookings` or booking detail URL without auth | `401`/redirect, no data exposed | Pending manual execution | Not run |
| BOOK-004 | Booking Security | Open another customer booking | Customer A tries Customer B booking URL | `403` or filtered out, no foreign data exposed | Pending manual execution | Not run |
| VEH-001 | Vehicle Availability | Confirm overlapping booking | Two bookings overlapping same assigned vehicle dates | Second overlap is rejected | Pending manual execution | Not run |
| VEH-002 | Vehicle Availability | Confirm non-overlapping booking | Same vehicle, non-overlapping dates | Booking accepted and vehicle remains available for non-overlap | Pending manual execution | Not run |
| VEH-003 | Vehicle Availability | Cancel confirmed booking | Confirmed booking with assigned vehicle, then cancel | Vehicle block is released and availability returns | Pending manual execution | Not run |
| PLAN-001 | Build Tour | Save new custom plan | Build Tour with selected places | Plan saves and appears in My Plans | Pending manual execution | Not run |
| PLAN-002 | Build Tour | Reopen saved plan | Open `Reopen/Edit` from My Plans | Planner preloads saved places via `planId`, allows update | Pending manual execution | Not run |
| PLAN-003 | Build Tour | Delete saved plan | Delete from My Plans | Plan is soft-deleted and removed from active list | Pending manual execution | Not run |

## Finance & Partners

| Test ID | Module | Action | Input | Expected Result | Actual Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- |
| FIN-001 | Invoices | View invoice detail | Open dashboard invoice detail page | Protected invoice detail loads using `/api/invoices/[id]` | Pending manual execution | Not run |
| FIN-002 | Payments | Void payment | Void a valid payment entry from finance flow | Payment marked `VOIDED`, booking paid/remaining totals recalculate | Pending manual execution | Not run |
| FIN-003 | Reports | Export finance CSV | Date-filtered finance report export | CSV downloads with correct filtered data | Pending manual execution | Not run |
| FIN-004 | Receipt Security | Open finance receipt as logged-out user | Receipt URL without auth | Request rejected, no finance data leaked | Pending manual execution | Not run |
| PART-001 | Partner Assignment | Assign inactive partner | Staff/admin assign booking to inactive partner | Request rejected with clear error | Pending manual execution | Not run |
| PART-002 | Partner Assignment | Assign inactive partner service | Staff/admin assign inactive rate-card/service | Request rejected with clear error | Pending manual execution | Not run |
| PART-003 | Partner Dashboard | Edit hotel service | Update service name/rate/unit | Service updates persist and show in dashboard | Pending manual execution | Not run |

## Notifications, Content, and Public UX

| Test ID | Module | Action | Input | Expected Result | Actual Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- |
| NOTIF-001 | Notifications | Filter drafts/published/type | Dashboard notification filters | Table filters correctly by status and type | Pending manual execution | Not run |
| DEST-001 | Destination Detail | Load hero image | Destination with absolute URL and one with relative URL | Hero image loads in both cases, no double-domain URL | Pending manual execution | Not run |
| MAP-001 | Build Tour Map | Load on desktop Chrome | Desktop browser normal network | Map renders, districts clickable, no infinite loading | Pending manual execution | Not run |
| MAP-002 | Build Tour Map | Load on mobile width | Mobile-width responsive viewport | Map and planner remain usable, district interactions still work | Pending manual execution | Not run |
| MAP-003 | Build Tour Map | Simulate slower network or asset failure | Throttled network / temporary fetch failure | Error panel appears with retry instead of hanging on loading state | Pending manual execution | Not run |
| UX-001 | Not Found | Visit invalid route | Non-existent public slug or path | Branded 404 page appears with recovery navigation | Pending manual execution | Not run |
| UX-002 | Empty States | Visit empty dashboard lists | Empty users/plans/bookings/notifications/etc. | Empty state explains next action rather than blank screen | Pending manual execution | Not run |

## Cross-Module Flow Retest

| Test ID | Module | Action | Input | Expected Result | Actual Result | Pass/Fail |
| --- | --- | --- | --- | --- | --- | --- |
| FLOW-A | Published Content | Package publish to public visibility | Publish a package/destination from dashboard | Published content is visible on the public site | Pending manual execution | Not run |
| FLOW-B | Booking Intake | Public booking to ticket to dashboard | Submit public booking request | Booking record created, support ticket created, visible in dashboard | Pending manual execution | Not run |
| FLOW-C | Booking + Vehicle | Confirm, assign, auto-block, cancel, unblock | Confirm booking with assigned vehicle then cancel | Vehicle dates block on confirm and unblock on cancel | Pending manual execution | Not run |
| FLOW-D | Finance | Booking to invoice to payment to receipt to balance | Create invoice, record payment, generate receipt, void as needed | Totals stay consistent across booking, invoice, payment, and receipt | Pending manual execution | Not run |
| FLOW-E | Build Tour | Save, reopen, edit, delete, convert | Build and save a custom plan, reopen and update it, then delete | Plan CRUD works end to end and conversion entrypoint remains intact | Pending manual execution | Not run |
| FLOW-F | Partner Assignment | Assign partner/service to booking | Booking with active partner and active service | Booking detail shows partner, service, and agreed rate correctly | Pending manual execution | Not run |
