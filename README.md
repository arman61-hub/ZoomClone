# Zoom Web Application Clone (SDE Fullstack Assignment)

A functional, pixel-perfect video conferencing web application clone of the **Zoom Web Client**, built to replicate Zoom’s authentic user interface, design language, and core meeting workflows.

---

## 🌟 Key Features

### 1. Landing Dashboard
* **Exact Zoom Visual UI**: Features Zoom's official header bar (`#0E71EB` logo, search bar, profile avatar pill for **Arman**), left navigation rail, and dark slate navy footer (`#1A1E29`).
* **Quick Action Buttons**:
  * 📅 **Schedule** (Blue icon with number 19)
  * ➕ **Join** (Blue plus icon)
  * 🎥 **Host** (Vibrant orange `#F26D21` video camera button)
* **Personal Meeting ID (PMI)**: Interactive PMI bar (`699-772-3211`) with one-click copy-to-clipboard functionality.
* **Upcoming Meetings List**: Live list of scheduled meetings with "Start", "Copy Link", and passcode details.
* **Recent Activity Section**: Past meeting logs populated from SQLite database.

### 2. Instant Meeting Creation
* Generates a unique 10-digit Meeting ID (format: `XXX-XXX-XXXX`) and shareable invite link.
* Redirects user to the hardware test lobby before launching the meeting room.

### 3. Join Meeting Workflow
* Join via Meeting ID or direct shareable URL (`/meeting/[id]`).
* Validates meeting existence against backend REST API.
* Enter display name and pre-toggle audio/video settings before joining.

### 4. Schedule Meetings
* Form inputs for Topic, Description, Date picker, Time picker, and Duration.
* Option to auto-generate Meeting ID or use Personal Meeting ID.
* Security passcode settings.
* Automatically updates SQLite database and reflects in the Upcoming Meetings list.

### 5. WebRTC Video Conference Room (Dark Theme)
* **Dark Slate Base**: `#1A1C23` grid canvas with `#0F1015` top and bottom control bars.
* **Real-time Video/Audio**: Built using native HTML5 WebRTC (`RTCPeerConnection`) and FastAPI WebSockets signaling server.
* **Active Speaker Highlight**: Green glowing ring border around the active speaking participant.
* **Screen Sharing**: One-click screen capture (`getDisplayMedia`) with stream replacement.
* **Collapsible Side Drawers**:
  * **Participants Panel**: Shows participant count, live mic/video status badges, and host moderation tools (**Mute All**, **Remove Participant**).
  * **In-Meeting Chat**: Real-time group text messaging with timestamps.
* **Floating Control Bar**: Mic toggle (with green audio meter), Video toggle, Security, Participants badge, Chat, **Share Screen** (Bright Green `#00C853`), Reactions / Hand Raise, and **End Call** (Red button).

---

## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | Next.js 14 (App Router, Client Components, TypeScript) |
| **Styling** | Tailwind CSS (configured with exact Zoom color palette tokens) |
| **Icons** | Lucide React |
| **Backend** | Python 3.10+ with FastAPI & Uvicorn |
| **Real-time Engine** | HTML5 WebRTC API + FastAPI WebSockets Signaling Server |
| **Database** | SQLite3 managed via SQLAlchemy ORM |

---

## 📊 Database Schema Design (SQLite)

The database (`zoom_clone.db`) uses a clean relational schema:

```
+-------------------+       +--------------------+       +---------------------+
|       USERS       |       |      MEETINGS      |       |    PARTICIPANTS     |
+-------------------+       +--------------------+       +---------------------+
| id (PK)           |1     *| id (PK) [XXX-XXX]  |1     *| id (PK)             |
| email             |<------| host_id (FK)       |<------| meeting_id (FK)     |
| name ("Arman")    |       | title              |       | user_id (FK)        |
| plan_type         |       | status             |       | display_name        |
| personal_meeting_id|      | passcode           |       | role (host/guest)   |
+-------------------+       | scheduled_start    |       | is_audio_muted      |
                            | duration_minutes   |       | is_video_off        |
                            +--------------------+       +---------------------+
                                      | 1
                                      | *
                            +--------------------+
                            |   CHAT_MESSAGES    |
                            +--------------------+
                            | id (PK)            |
                            | meeting_id (FK)    |
                            | sender_name        |
                            | message            |
                            | timestamp          |
                            +--------------------+
```

---

## 🚀 Setup & Execution Instructions

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

# Seed SQLite database with sample data
python seed.py

# Start FastAPI server
uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
*Backend API will run at `http://127.0.0.1:8000`.*
*Interactive API documentation (Swagger UI): `http://127.0.0.1:8000/docs`.*

### 2. Frontend Setup (Next.js SPA)
```bash
cd frontend

# Install frontend dependencies
npm install

# Start Next.js development server
npm run dev
```
*Frontend application will run at `http://localhost:3000`.*

---

## 📌 Deployment Instructions

### Deploy Frontend (Vercel)
1. Push codebase to a GitHub repository.
2. Import project into Vercel.
3. Set `Root Directory` to `frontend`.
4. Add Environment Variable: `NEXT_PUBLIC_API_URL=https://your-backend.render.com/api/v1`.

### Deploy Backend (Render / Railway)
1. Import repository into Render or Railway.
2. Set `Root Directory` to `backend`.
3. Build Command: `pip install -r requirements.txt && python seed.py`.
4. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`.

---

## 💡 Assumptions & Implementation Notes
1. **Default User**: As specified in requirements, authentication is bypassed, assuming user **Arman** (Workplace Basic) is logged in.
2. **Strict Design Rules**: NO purple gradients, NO floating pill buttons, NO fake customer counters, NO emoji icons, NO em dashes (`—`), and NO AI slop text.
3. **Favicon**: Official Zoom camera glyph icon embedded.
