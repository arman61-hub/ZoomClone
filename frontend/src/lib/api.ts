const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  plan_type: string;
  personal_meeting_id: string;
  pmi_passcode?: string;
  created_at: string;
}

export interface Meeting {
  id: string;
  host_id: string;
  title: string;
  description?: string;
  status: string;
  passcode?: string;
  scheduled_start?: string;
  duration_minutes: number;
  created_at: string;
  invite_url: string;
}

export async function fetchCurrentUser(): Promise<UserProfile> {
  const res = await fetch(`${API_BASE_URL}/users/me`);
  if (!res.ok) throw new Error('Failed to fetch user profile');
  return res.json();
}

export async function createInstantMeeting(): Promise<Meeting> {
  const res = await fetch(`${API_BASE_URL}/meetings/instant`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Instant Meeting' }),
  });
  if (!res.ok) throw new Error('Failed to create instant meeting');
  return res.json();
}

export async function scheduleMeeting(data: {
  title: string;
  description?: string;
  scheduled_start: string;
  duration_minutes: number;
  passcode?: string;
  use_personal_id?: boolean;
}): Promise<Meeting> {
  const res = await fetch(`${API_BASE_URL}/meetings/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to schedule meeting');
  }
  return res.json();
}

export async function fetchUpcomingMeetings(): Promise<Meeting[]> {
  const res = await fetch(`${API_BASE_URL}/meetings/upcoming`);
  if (!res.ok) throw new Error('Failed to fetch upcoming meetings');
  return res.json();
}

export async function fetchRecentMeetings(): Promise<Meeting[]> {
  const res = await fetch(`${API_BASE_URL}/meetings/recent`);
  if (!res.ok) throw new Error('Failed to fetch recent meetings');
  return res.json();
}

export async function fetchMeetingById(meetingId: string): Promise<Meeting> {
  const res = await fetch(`${API_BASE_URL}/meetings/${encodeURIComponent(meetingId)}`);
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error('Meeting not found. Please check your Meeting ID.');
    }
    throw new Error('Failed to load meeting details');
  }
  return res.json();
}
