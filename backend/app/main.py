from fastapi import FastAPI, Depends, HTTPException, WebSocket, WebSocketDisconnect, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
import json
import logging

from .database import engine, Base, get_db
from . import models, schemas, crud
from .websocket import manager

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Zoom Clone API",
    description="Backend service for Zoom Clone web platform",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows Next.js frontend on localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logger = logging.getLogger("zoom_app")

@app.on_event("startup")
def startup_event():
    db = next(get_db())
    crud.get_or_create_default_user(db)
    logger.info("Database initialized and default user created.")

@app.get("/api/v1/health")
def health_check():
    return {"status": "healthy", "service": "Zoom Clone API"}

@app.get("/api/v1/users/me", response_model=schemas.UserResponse)
def get_current_user(db: Session = Depends(get_db)):
    user = crud.get_or_create_default_user(db)
    return user

@app.post("/api/v1/meetings/instant", response_model=schemas.MeetingResponse)
def create_instant_meeting(meeting_in: schemas.MeetingCreate, request: Request, db: Session = Depends(get_db)):
    meeting = crud.create_instant_meeting(db, meeting_in)
    base_url = str(request.base_url).rstrip("/")
    # Build shareable invite URL
    invite_url = f"{base_url}/meeting/{meeting.id}"
    
    return schemas.MeetingResponse(
        id=meeting.id,
        host_id=meeting.host_id,
        title=meeting.title,
        description=meeting.description,
        status=meeting.status,
        passcode=meeting.passcode,
        scheduled_start=meeting.scheduled_start,
        duration_minutes=meeting.duration_minutes,
        created_at=meeting.created_at,
        invite_url=invite_url
    )

@app.post("/api/v1/meetings/schedule", response_model=schemas.MeetingResponse)
def schedule_meeting(schedule_in: schemas.ScheduleMeetingCreate, request: Request, db: Session = Depends(get_db)):
    meeting = crud.create_scheduled_meeting(db, schedule_in)
    base_url = str(request.base_url).rstrip("/")
    invite_url = f"{base_url}/meeting/{meeting.id}"
    
    return schemas.MeetingResponse(
        id=meeting.id,
        host_id=meeting.host_id,
        title=meeting.title,
        description=meeting.description,
        status=meeting.status,
        passcode=meeting.passcode,
        scheduled_start=meeting.scheduled_start,
        duration_minutes=meeting.duration_minutes,
        created_at=meeting.created_at,
        invite_url=invite_url
    )

@app.get("/api/v1/meetings/upcoming", response_model=List[schemas.MeetingResponse])
def list_upcoming_meetings(request: Request, db: Session = Depends(get_db)):
    meetings = crud.get_upcoming_meetings(db)
    base_url = str(request.base_url).rstrip("/")
    
    return [
        schemas.MeetingResponse(
            id=m.id,
            host_id=m.host_id,
            title=m.title,
            description=m.description,
            status=m.status,
            passcode=m.passcode,
            scheduled_start=m.scheduled_start,
            duration_minutes=m.duration_minutes,
            created_at=m.created_at,
            invite_url=f"{base_url}/meeting/{m.id}"
        )
        for m in meetings
    ]

@app.get("/api/v1/meetings/recent", response_model=List[schemas.MeetingResponse])
def list_recent_meetings(request: Request, db: Session = Depends(get_db)):
    meetings = crud.get_recent_meetings(db)
    base_url = str(request.base_url).rstrip("/")
    
    return [
        schemas.MeetingResponse(
            id=m.id,
            host_id=m.host_id,
            title=m.title,
            description=m.description,
            status=m.status,
            passcode=m.passcode,
            scheduled_start=m.scheduled_start,
            duration_minutes=m.duration_minutes,
            created_at=m.created_at,
            invite_url=f"{base_url}/meeting/{m.id}"
        )
        for m in meetings
    ]

@app.get("/api/v1/meetings/{meeting_id}", response_model=schemas.MeetingResponse)
def get_meeting_by_id(meeting_id: str, request: Request, db: Session = Depends(get_db)):
    meeting = crud.get_meeting(db, meeting_id)
    if not meeting:
        raise HTTPException(status_code=404, detail="Meeting not found or invalid Meeting ID.")
    
    base_url = str(request.base_url).rstrip("/")
    return schemas.MeetingResponse(
        id=meeting.id,
        host_id=meeting.host_id,
        title=meeting.title,
        description=meeting.description,
        status=meeting.status,
        passcode=meeting.passcode,
        scheduled_start=meeting.scheduled_start,
        duration_minutes=meeting.duration_minutes,
        created_at=meeting.created_at,
        invite_url=f"{base_url}/meeting/{meeting.id}"
    )

# WebSocket Endpoint for WebRTC Signaling & Real-time Meeting State
@app.websocket("/ws/meeting/{meeting_id}/{participant_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    meeting_id: str,
    participant_id: str,
    display_name: str = "Guest User",
    is_host: bool = False,
    db: Session = Depends(get_db)
):
    await manager.connect(websocket, meeting_id, participant_id, display_name, is_host)
    try:
        while True:
            data_str = await websocket.receive_text()
            data = json.loads(data_str)
            msg_type = data.get("type")

            if msg_type in ["OFFER", "ANSWER", "ICE_CANDIDATE"]:
                target_id = data.get("targetId")
                if target_id:
                    data["senderId"] = participant_id
                    await manager.send_personal_message(meeting_id, target_id, data)

            elif msg_type == "CHAT_MESSAGE":
                text = data.get("message", "")
                if text.strip():
                    crud.save_chat_message(db, meeting_id, display_name, text)
                    chat_event = {
                        "type": "CHAT_MESSAGE",
                        "senderId": participant_id,
                        "senderName": display_name,
                        "message": text,
                        "timestamp": data.get("timestamp")
                    }
                    await manager.broadcast(meeting_id, chat_event)

            elif msg_type == "MEDIA_STATE_CHANGE":
                # Handle audio mute / camera toggle / hand raise
                if meeting_id in manager.rooms and participant_id in manager.rooms[meeting_id]:
                    p_info = manager.rooms[meeting_id][participant_id]
                    if "isAudioMuted" in data:
                        p_info["is_audio_muted"] = data["isAudioMuted"]
                    if "isVideoOff" in data:
                        p_info["is_video_off"] = data["isVideoOff"]
                    if "isHandRaised" in data:
                        p_info["is_hand_raised"] = data["isHandRaised"]
                
                await manager.broadcast(meeting_id, {
                    "type": "PARTICIPANTS_UPDATED",
                    "participants": manager.get_room_participants_list(meeting_id)
                })

            elif msg_type == "HOST_ACTION":
                action = data.get("action")
                target_participant_id = data.get("targetParticipantId")
                
                if action == "MUTE_ALL":
                    await manager.broadcast(meeting_id, {
                        "type": "FORCE_MUTE_AUDIO"
                    })
                elif action == "END_MEETING_FOR_ALL":
                    await manager.broadcast(meeting_id, {
                        "type": "MEETING_ENDED_BY_HOST"
                    })
                elif action == "REMOVE_PARTICIPANT" and target_participant_id:
                    await manager.send_personal_message(meeting_id, target_participant_id, {
                        "type": "REMOVED_BY_HOST"
                    })

    except WebSocketDisconnect:
        await manager.disconnect(meeting_id, participant_id)
    except Exception as e:
        logger.error(f"WebSocket error: {e}")
        await manager.disconnect(meeting_id, participant_id)
