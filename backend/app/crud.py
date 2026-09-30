from sqlalchemy.orm import Session
from datetime import datetime, timedelta, timezone
from fastapi import HTTPException
import random
from . import models, schemas

DEFAULT_USER_ID = "default-user-arman"
DEFAULT_USER_EMAIL = "arman@zoomclone.local"
DEFAULT_USER_NAME = "Arman Redhu"
DEFAULT_PMI = "3527955122"

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
    elif user.name != DEFAULT_USER_NAME or user.personal_meeting_id != DEFAULT_PMI:
        user.name = DEFAULT_USER_NAME
        user.personal_meeting_id = DEFAULT_PMI
        db.commit()
        db.refresh(user)
    return user

def create_instant_meeting(db: Session, meeting_in: schemas.MeetingCreate) -> models.Meeting:
    user = get_or_create_default_user(db)
    
    # End any previously active meeting so only 1 active meeting exists
    active_meetings = db.query(models.Meeting).filter(models.Meeting.status == "active").all()
    for m in active_meetings:
        m.status = "ended"
        m.ended_at = datetime.now(timezone.utc)

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

    scheduled_end = scheduled_dt + timedelta(minutes=schedule_in.duration_minutes)

    # Check for overlapping scheduled meetings
    existing_meetings = db.query(models.Meeting).filter(
        models.Meeting.status.in_(["scheduled", "active"])
    ).all()

    for m in existing_meetings:
        m_start = m.scheduled_start or m.created_at
        if m_start.tzinfo is None:
            m_start = m_start.replace(tzinfo=timezone.utc)
        m_end = m_start + timedelta(minutes=m.duration_minutes or 30)

        # If overlapping time window
        if (m_start < scheduled_end) and (m_end > scheduled_dt):
            raise HTTPException(
                status_code=400,
                detail=f"Meeting schedule conflict! Meeting '{m.title}' is already scheduled in this time window ({m_start.strftime('%I:%M %p')} - {m_end.strftime('%I:%M %p')}). Overlapping meetings are not allowed."
            )

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

DEFAULT_PMI_PASSCODE = "0bfJhU"
DEFAULT_PMI_FORMATTED = "352-795-5122"

def get_meeting(db: Session, meeting_id: str) -> models.Meeting:
    formatted_id = format_meeting_id(meeting_id)
    raw_digits = "".join(filter(str.isdigit, meeting_id))
    
    meeting = db.query(models.Meeting).filter(
        (models.Meeting.id == meeting_id) | (models.Meeting.id == formatted_id)
    ).first()

    # Ensure Personal Meeting ID (3527955122) is always active
    if raw_digits == DEFAULT_PMI:
        if not meeting:
            user = get_or_create_default_user(db)
            meeting = models.Meeting(
                id=DEFAULT_PMI_FORMATTED,
                host_id=user.id,
                title="Arman Redhu's Personal Meeting Room",
                description="Always active personal meeting space.",
                status="active",
                passcode=DEFAULT_PMI_PASSCODE,
                scheduled_start=datetime.now(timezone.utc),
                duration_minutes=1440
            )
            db.add(meeting)
            db.commit()
            db.refresh(meeting)
        elif meeting.status == "ended":
            meeting.status = "active"
            meeting.ended_at = None
            db.commit()
            db.refresh(meeting)

    return meeting

def end_meeting_in_db(db: Session, meeting_id: str) -> models.Meeting:
    raw_digits = "".join(filter(str.isdigit, meeting_id))
    # Never end the Personal Meeting ID
    if raw_digits == DEFAULT_PMI:
        return get_meeting(db, meeting_id)

    meeting = get_meeting(db, meeting_id)
    if meeting and meeting.status != "ended":
        meeting.status = "ended"
        meeting.ended_at = datetime.now(timezone.utc)
        db.commit()
        db.refresh(meeting)
    return meeting

def get_upcoming_meetings(db: Session):
    return db.query(models.Meeting).filter(
        models.Meeting.status.in_(["scheduled", "active"])
    ).order_by(models.Meeting.created_at.desc()).all()

def get_recent_meetings(db: Session):
    return db.query(models.Meeting).filter(
        models.Meeting.status == "ended"
    ).order_by(models.Meeting.ended_at.desc()).all()


