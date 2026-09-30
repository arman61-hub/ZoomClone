from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    email: str
    name: str = "Arman Redhu"
    plan_type: str = "Workplace Basic"
    personal_meeting_id: str = "3527955122"
    pmi_passcode: str = "0bfJhU"

class UserResponse(UserBase):
    id: str
    created_at: datetime

    class Config:
        from_attributes = True

class MeetingCreate(BaseModel):
    title: str = "Instant Meeting"
    description: Optional[str] = None
    passcode: Optional[str] = None

class ScheduleMeetingCreate(BaseModel):
    title: str
    description: Optional[str] = None
    scheduled_start: str  # ISO string or datetime format
    duration_minutes: int = 30
    passcode: Optional[str] = None
    use_personal_id: bool = False

class MeetingResponse(BaseModel):
    id: str
    host_id: str
    title: str
    description: Optional[str] = None
    status: str
    passcode: Optional[str] = None
    scheduled_start: Optional[datetime] = None
    duration_minutes: int
    created_at: datetime
    invite_url: str

    class Config:
        from_attributes = True

