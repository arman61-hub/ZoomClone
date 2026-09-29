from app.database import engine, SessionLocal, Base
from app import models, crud
from datetime import datetime, timedelta, timezone

def seed_database():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Create Default User
        user = crud.get_or_create_default_user(db)
        print(f"Seeded User: {user.name} ({user.email}) - Personal Meeting ID: {user.personal_meeting_id}")

        # Seed Upcoming Scheduled Meetings
        now = datetime.now(timezone.utc)
        
        upcoming_1 = models.Meeting(
            id="849-204-1029",
            host_id=user.id,
            title="Sprint Planning & Architecture Sync",
            description="Bi-weekly engineering sync to align on Q4 deliverables.",
            status="scheduled",
            passcode="839201",
            scheduled_start=now + timedelta(hours=2),
            duration_minutes=45
        )

        upcoming_2 = models.Meeting(
            id="912-384-5501",
            host_id=user.id,
            title="Design System & Component Review",
            description="Review Zoom web application UI components and responsive design breakdown.",
            status="scheduled",
            passcode="102938",
            scheduled_start=now + timedelta(days=1, hours=4),
            duration_minutes=60
        )

        # Seed Past Recent Meetings
        recent_1 = models.Meeting(
            id="699-772-3211",
            host_id=user.id,
            title="Arman's Personal Meeting Room",
            description="Default personal meeting space.",
            status="ended",
            passcode="699772",
            scheduled_start=now - timedelta(days=2),
            duration_minutes=30,
            ended_at=now - timedelta(days=2) + timedelta(minutes=30)
        )

        # Add meetings to DB if not already present
        for m in [upcoming_1, upcoming_2, recent_1]:
            existing = db.query(models.Meeting).filter(models.Meeting.id == m.id).first()
            if not existing:
                db.add(m)
                print(f"Seeded Meeting: {m.title} (ID: {m.id})")

        db.commit()
        print("Database seeding completed successfully.")

    except Exception as e:
        db.rollback()
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
