from sqlalchemy import Column, String, Boolean, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import uuid
from .database import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False, default="Arman")
    plan_type = Column(String, default="Workplace Basic")
    personal_meeting_id = Column(String, default="6997723211")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    meetings = relationship("Meeting", back_populates="host")

class Meeting(Base):
    __tablename__ = "meetings"

    id = Column(String, primary_key=True)  # Format: 699-772-3211 or 10-digit ID
    host_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String, nullable=False, default="Instant Meeting")
    description = Column(String, nullable=True)
    status = Column(String, default="scheduled")  # scheduled, active, ended
    passcode = Column(String, nullable=True)
    scheduled_start = Column(DateTime, nullable=True)
    duration_minutes = Column(Integer, default=30)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    ended_at = Column(DateTime, nullable=True)

    host = relationship("User", back_populates="meetings")
    participants = relationship("Participant", back_populates="meeting", cascade="all, delete-orphan")
    chat_messages = relationship("ChatMessage", back_populates="meeting", cascade="all, delete-orphan")

class Participant(Base):
    __tablename__ = "participants"

    id = Column(String, primary_key=True, default=generate_uuid)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    display_name = Column(String, nullable=False)
    role = Column(String, default="participant")  # host, participant
    is_audio_muted = Column(Boolean, default=False)
    is_video_off = Column(Boolean, default=False)
    is_hand_raised = Column(Boolean, default=False)
    joined_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    left_at = Column(DateTime, nullable=True)

    meeting = relationship("Meeting", back_populates="participants")
    chat_messages = relationship("ChatMessage", back_populates="sender")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(String, primary_key=True, default=generate_uuid)
    meeting_id = Column(String, ForeignKey("meetings.id"), nullable=False)
    sender_id = Column(String, ForeignKey("participants.id"), nullable=True)
    sender_name = Column(String, nullable=False)
    message = Column(String, nullable=False)
    timestamp = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    meeting = relationship("Meeting", back_populates="chat_messages")
    sender = relationship("Participant", back_populates="chat_messages")
