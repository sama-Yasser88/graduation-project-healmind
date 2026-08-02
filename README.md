# HealMind — Admin Frontend

A production-ready **Admin Dashboard** frontend for HealMind, a mental health support platform.
---

## Features

- **Authentication** — Admin login (JWT-ready, mocked for now)
- **Dashboard** — Platform-wide stats, revenue chart, mini calendar, quick actions, recent activity
- **Doctor Verification** — Review, approve, or reject pending doctor applications
- **Doctors Management** — List, search, filter, sort, view, create, edit, disable, delete
- **Patients Management** — List, search, filter, view, create, edit, suspend, delete
- **Community Access Logic** — Patient Details clearly shows community status, approval history,
  responsible doctor, and decision dates. **Only a doctor can approve/reject/request another
  session** — the Admin can monitor but never override this decision.
- **Tickets** — Full ticket monitoring with payment/session status and doctor decision
- **Sessions Management** — List + Calendar (daily/weekly/monthly), reschedule, cancel, mark
  completed, session type/status, payment status, follow-up flag
- **Payments** — Transaction list, revenue split (doctor vs. platform), payment details
- **Community Moderation** — Posts, Comments, and Reports tabs with hide/delete/resolve actions
- **Reports & Analytics** — Export UI for CSV / Excel / PDF (mocked)
- **Notifications** — Read/unread admin notifications
- **Settings** — General platform settings + notification preferences
- **Admin Profile** — Profile info + change password

