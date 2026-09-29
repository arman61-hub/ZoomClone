from sqlalchemy.orm import Session
from datetime import datetime, timezone
import random
from . import models, schemas

DEFAULT_USER_ID = "default-user-arman"
DEFAULT_USER_EMAIL = "arman@zoomclone.local"
DEFAULT_USER_NAME = "Arman"
DEFAULT_PMI = "6997723211"

def generate_meeting_id() -> str:
    # Generates 10-digit meeting ID formatted as XXX-XXX-XXXX
    p1 = random.randint(100, 999)
    p2 = random.randint(100, 999)
    p3 = random.randint(1000, 9999)
    return f"{p1}-{p2}-{p3}"

def format_meeting_id(raw_id: str) -> str:
    cleaned = "".join(filter(str.isdigit, raw_id))
    if len(cleaned) == 10:
        return f"{cleaned[:3]}-{cleaned[3:6]}-{cleaned[6:]}"
    return raw_id

def get_or_create_default_user(db: Session) -> models.User:
    user = db.query(models.User).filter(models.User.id == DEFAULT_USER_ID).first()
    if not user:
        user = models.User(
            id=DEFAULT_USER_ID,
            email=DEFAULT_USER_EMAIL,
            name=DEFAULT_USER_NAME,
            plan_type="Workplace Basic",
            personal_meeting_id=DEFAULT_PMI
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user

def create_instant_meeting(db: Session, meeting_in: schemas.MeetingCreate) -> models.Meeting:
    user = get_or_create_default_user(db)
    meeting_id = generate_meeting_id()
    
    db_meeting = models.Meeting(
        id=meeting_id,
        host_id=user.id,
        title=meeting_in.title or "Instant Meeting",
        description=meeting_in.description,
        status="active",
        passcode=meeting_in.passcode or str(random.randint(100000, 999999)),
        scheduled_start=datetime.now(timezone.utc),
        duration_minutes=30
    )
    db.add(db_meeting)
    
    # Add host as participant
    host_participant = models.Participant(
        meeting_id=meeting_id,
        user_id=user.id,
        display_name=user.name,
        role="host"
    )
    db.add(host_participant)
    
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

def create_scheduled_meeting(db: Session, schedule_in: schemas.ScheduleMeetingCreate) -> models.Meeting:
    user = get_or_create_default_user(db)
    meeting_id = f"{DEFAULT_PMI[:3]}-{DEFAULT_PMI[3:6]}-{DEFAULT_PMI[6:]}" if schedule_in.use_personal_id else generate_meeting_id()
    
    # Parse date string
    try:
        scheduled_dt = datetime.fromisoformat(schedule_in.scheduled_start.replace('Z', '+00:00'))
    except Exception:
        scheduled_dt = datetime.now(timezone.utc)

    db_meeting = models.Meeting(
        id=meeting_id,
        host_id=user.id,
        title=schedule_in.title,
        description=schedule_in.description,
        status="scheduled",
        passcode=schedule_in.passcode or str(random.randint(100000, 999999)),
        scheduled_start=scheduled_dt,
        duration_minutes=schedule_in.duration_minutes
    )
    db.add(db_meeting)
    db.commit()
    db.refresh(db_meeting)
    return db_meeting

def get_meeting(db: Session, meeting_id: str) -> models.Meeting:
    # Try raw string or cleaned/formatted string
    formatted_id = format_meeting_id(meeting_id)
    meeting = db.query(models.Meeting).filter(
        (models.Meeting.id == meeting_id) | (models.Meeting.id == formatted_id)
    ).first()
    return meeting

def get_upcoming_meetings(db: Session):
    return db.query(models.Meeting).filter(
        models.Meeting.status.in_(["scheduled", "active"])
    ).order_by(models.Meeting.created_at.desc()).all()

def get_recent_meetings(db: Session):
    return db.query(models.Meeting).filter(
        models.Meeting.status == "ended"
    ).order_by(models.Meeting.ended_at.desc()).all()

def save_chat_message(db: Session, meeting_id: str, sender_name: str, message: str) -> models.ChatMessage:
    msg = models.ChatMessage(
        meeting_id=meeting_id,
        sender_name=sender_name,
        message=message
    )
    db.add(msg)
    db.commit()
    db.refresh(msg)
    return msg
