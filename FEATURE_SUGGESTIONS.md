# Feature Suggestions for `doctor_appointment_system`

## Current Product Snapshot
- Patients can register/login and create doctor requests.
- Admins can assign doctors, reassign appointments, and approve payments.
- Doctors can view assigned appointments and mark completion.

## High-Impact Features to Implement

### 1) Real-time appointment slot booking (calendar + availability)
**Why now:** Current flow is request-first and assignment is manual, which can delay conversion.

**Implement:**
- Add `doctor_availability` table (doctor_id, weekday/date, start_time, end_time, is_booked).
- Patient flow: choose specialty → doctor → available slot.
- Admin override for manual assignment when needed.

**Business impact:** Faster booking completion, fewer admin bottlenecks.

---

### 2) Appointment reminders (email/SMS)
**Why now:** No automated reminder path exists; no-shows likely remain high.

**Implement:**
- Cron/worker script to send reminders at T-24h and T-2h.
- Notification log table (`notifications`) for status/audit.
- Trigger messages on booking, reassignment, cancellation.

**Business impact:** Lower no-show rate; better patient retention.

---

### 3) Patient self-service cancellation/reschedule
**Why now:** Appointment state transitions exist, but patients lack direct reschedule/cancel UX.

**Implement:**
- Add statuses: `cancelled_by_patient`, `rescheduled`.
- Enforce time window rules (e.g., no reschedule within 2h).
- Auto-release doctor slot when cancelled.

**Business impact:** Reduced support load; better user trust.

---

### 4) In-app consultation notes + prescription upload
**Why now:** There is no visit record model for post-appointment clinical outputs.

**Implement:**
- Add `consultations` table linked to appointment (`diagnosis`, `notes`, `follow_up_date`).
- Add `prescriptions` upload with secure file access rules.
- Patient dashboard section: visit history and downloadable files.

**Business impact:** Increases platform stickiness and medical continuity.

---

### 5) Ratings and feedback loop
**Why now:** No quality signal to improve doctor assignment and marketplace trust.

**Implement:**
- `reviews` table (appointment_id, patient_id, doctor_id, rating, feedback).
- Only allow review after completed appointment.
- Display doctor avg rating in doctor list/admin assignment view.

**Business impact:** Trust, transparency, and better provider quality control.

---

### 6) Payment gateway integration + invoices
**Why now:** Payment approval is present but appears admin-driven rather than automated.

**Implement:**
- Integrate Stripe/Paystack/Flutterwave.
- Store transaction refs, webhook status, failure reason.
- Auto-generate downloadable invoice/receipt PDF.

**Business impact:** Faster revenue capture and reduced manual operations.

---

### 7) Admin analytics dashboard
**Why now:** No KPI layer for growth/ops decisions.

**Implement:**
- KPIs: bookings/day, completion rate, cancellation rate, revenue, active patients.
- Filters by date range, specialty, doctor.
- Export CSV for reporting.

**Business impact:** Better founder-level visibility and faster iteration.

---

### 8) Role-based access hardening + audit logs
**Why now:** Authentication exists, but CSRF/session hardening and auditability are limited.

**Implement:**
- Add CSRF tokens on all forms.
- Add rate limiting/lockout for login attempts.
- Add `audit_logs` table for sensitive actions (assignment, approval, profile edits).

**Business impact:** Better security posture and easier incident traceability.

## Technical Debt Features (should be treated as product features)

### 9) API layer (`/api/v1`) for mobile + frontend modernization
- Expose booking, request, doctor, patient, payment endpoints.
- Keep existing PHP views while progressively decoupling into React frontend.
- Add OpenAPI docs for partner integrations.

### 10) Queue-based background jobs
- Offload reminders, email, invoices, and heavy admin reports.
- Use Redis + worker pattern for retries and reliability.

## Prioritized 30-60-90 Execution Plan

### Next 30 days (quick wins)
1. Reminder system.
2. Cancellation/reschedule flow.
3. Payment gateway integration (basic webhook).

### 31-60 days (core product lift)
4. Slot-based booking calendar.
5. Consultation notes + prescription uploads.
6. Ratings and feedback.

### 61-90 days (scale layer)
7. Analytics dashboard.
8. Access hardening + audit logs.
9. API v1 + queue workers.

## Suggested Data Model Additions
- `doctor_availability`
- `consultations`
- `prescriptions`
- `reviews`
- `notifications`
- `audit_logs`
- `transactions` (expand existing usage with gateway fields)

## Recommended Success Metrics
- Booking conversion rate.
- Appointment no-show rate.
- Average time from request to confirmed appointment.
- Payment success rate.
- Monthly active patients.
- Repeat booking rate.
