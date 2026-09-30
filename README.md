# Zoom Web Application Clone (SDE Fullstack Assignment)

A high-performance, feature-complete video conferencing web application clone of the **Zoom Web Client**, built to replicate Zoom’s authentic user interface, design language, and core meeting workflows.

---

## Key Features

### 1. Landing Dashboard & Personal Meeting Room
* **Authentic Zoom Visual UI**: Matches Zoom's official header bar (`#0E71EB` logo, search bar, profile avatar pill for **Arman Redhu**), left navigation rail, and dark slate navy footer (`#1A1E29`).
* **Quick Action Buttons**:
  * 📅 **Schedule** (Blue icon with date 19)
  * ➕ **Join** (Blue plus icon)
  * 🎥 **Host** (Vibrant orange `#F26D21` video camera button for instant meetings)
* **Personal Meeting ID (PMI) & Passcode Section**:
  * **PMI**: `352 795 5122` (`352-795-5122`) always active in database.
  * **Passcode**: `352795` (fetched dynamically from backend database).
  * **1-Click Copy Buttons**: One-click clipboard copy for both PMI invitation URL and Passcode with green checkmark feedback animations.
* **Upcoming Meetings Section**: Live paginated list of scheduled meetings with "Start", "Copy Invitation", and passcode details (2 per page).
* **Recent Activity Section**: Past meeting history logs with pagination (5 per page) and 3D Isometric Blue Box empty state graphics matching Zoom web client.

---

### 2. Instant & Scheduled Meeting Workflows

* **Instant Meeting Creation**:
  * Generates 10-digit Meeting ID (`XXX-XXX-XXXX`) or utilizes Personal Meeting ID.
  * Auto-generates 6-digit security passcode (`352795` for PMI).
  * Host bypasses ID/passcode prompts and enters directly into the meeting room.

* **Schedule Meetings with Conflict Prevention**:
  * Topic, Description, Date, Time, and Duration inputs.
  * **Overlapping Time Window Check**: Rejects double-booking or scheduling overlapping meetings in the same time window.
  * Formatted shareable invitation URLs (`/join?meetingId=352-795-5122&passcode=352795`).

---

### 3. Join Meeting & Security Validation

* Dedicated `/join` page with real-time validation:
  * Validates Meeting ID existence and active status against SQLite database via REST API.
  * Validates meeting passcode before entry.
  * Auto-populates Meeting ID and Passcode when joining via direct invite link.
  * Ensures guest users join with `isHost=false` role isolation.

---

### 4. WebRTC Video Conference Room (Dark Theme)

* **Dark Slate Canvas**: `#1A1C23` video grid container with `#0F1015` top header and bottom control bars.
* **Multi-Participant Video Grid**: Displays self view and remote participant tiles dynamically with audio/video status badges.
* **Active Speaker Highlight**: Glowing green ring border around active speaking participants.
* **Real-time WebSockets Moderation**:
  * **Mute All**: Host can mute all non-host participants across all connected client sockets in real time.
  * **End Meeting for All**: Host ending the call broadcasts termination to all connected peers and ends the session in SQLite DB.
* **Screen Sharing**: One-click screen capture via HTML5 `getDisplayMedia`.
* **Side Drawers**:
  * **Participants Drawer**: Live participant counts, mute indicators, and host control actions.
  * **In-Meeting Chat**: Real-time group text messaging with sender names and timestamps.

---

### 5. Copy Invitation Modal

* Zoom-styled Copy Invitation modal displaying formatted meeting details:
  ```text
  Arman Redhu is inviting you to a scheduled Zoom meeting.

  Topic: Arman Redhu's Personal Meeting Room
  Time: Sep 30, 2026 01:00 AM Pacific Time (US and Canada)

  Join Zoom Meeting
  http://localhost:3000/join?meetingId=352-795-5122&passcode=352795

  Meeting ID: 352 795 5122
  Passcode: 352795
  ```

---

## Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router, Client Components, TypeScript) |
| **Styling** | Vanilla CSS + Tailwind CSS (Zoom design system tokens) |
| **Icons** | Lucide React |
| **Backend** | Python 3.10+ with FastAPI & Uvicorn |
| **Real-time Engine** | HTML5 WebRTC API + FastAPI WebSockets Signaling Server |
| **Database** | SQLite3 managed via SQLAlchemy ORM |

---

## Database Schema Design (SQLite)

The database (`zoom_clone.db`) uses SQLAlchemy ORM:

```
+-----------------------------------+       +------------------------------------+
|               USERS               |       |              MEETINGS              |
+-----------------------------------+       +------------------------------------+
| id (PK) ["default-user-arman"]    |1     *| id (PK) ["352-795-5122"]           |
| email ["arman@zoomclone.local"]   |<------| host_id (FK)                       |
| name ["Arman Redhu"]              |       | title                              |
| plan_type ["Workplace Basic"]     |       | description                        |
| personal_meeting_id ["3527955122"]|       | status ["scheduled/active/ended"]  |
| pmi_passcode ["352795"]           |       | passcode ["352795"]                |
+-----------------------------------+       | scheduled_start                    |
                                            | duration_minutes                   |
                                            | created_at                         |
                                            | ended_at                           |
                                            +------------------------------------+
```

---

## Setup & Execution Instructions

### Prerequisites
* **Node.js**: v18+ and `npm`
* **Python**: v3.10+

### 1. Backend Setup (FastAPI & SQLite)
```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment (Windows PowerShell)
.\venv\Scripts\Activate.ps1

# Install backend dependencies
pip install -r requirements.txt

# Seed SQLite database with default user & PMI
python seed.py

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
* Backend REST API: `http://127.0.0.1:8000`
* Interactive API Documentation (Swagger UI): `http://127.0.0.1:8000/docs`

### 2. Frontend Setup (Next.js App)
```bash
cd frontend

# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
```
* Frontend Application: `http://localhost:3000`

---

## Main API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/users/me` | Fetch active user profile and PMI details |
| `POST` | `/api/v1/meetings/instant` | Create instant meeting |
| `POST` | `/api/v1/meetings/schedule` | Schedule meeting with time conflict validation |
| `GET` | `/api/v1/meetings/upcoming` | List upcoming scheduled meetings |
| `GET` | `/api/v1/meetings/recent` | List ended meeting history |
| `GET` | `/api/v1/meetings/{id}` | Validate and fetch meeting by Meeting ID |
| `WS` | `/ws/meeting/{id}/{participant_id}` | WebSocket connection for WebRTC signaling & moderation |

---

## Key Design & Implementation Rules
1. **Default Account**: Automatically authenticates user **Arman Redhu** (`arman@zoomclone.local`, Plan: `Workplace Basic`).
2. **Personal Meeting ID (PMI)**: Standardized to `352 795 5122` (`352-795-5122`) with passcode `352795`.
3. **Strict Visual Fidelity**: Exact Zoom color tokens (`#0E71EB` primary blue, `#F26D21` orange host button, `#1A1C23` dark room, `#1A1E29` footer).
4. **No Build Overhead**: Developed and optimized for real-time Next.js dev server execution.
