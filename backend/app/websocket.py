from fastapi import WebSocket
from typing import Dict, List, Any
import json
import logging

logger = logging.getLogger("zoom_websocket")

class ConnectionManager:
    def __init__(self):
        # Room ID -> Dict[Participant ID, Dict[WebSocket, DisplayName, Role]]
        self.rooms: Dict[str, Dict[str, Dict[str, Any]]] = {}

    async def connect(self, websocket: WebSocket, meeting_id: str, participant_id: str, display_name: str, is_host: bool = False):
        await websocket.accept()
        if meeting_id not in self.rooms:
            self.rooms[meeting_id] = {}

        self.rooms[meeting_id][participant_id] = {
            "socket": websocket,
            "display_name": display_name,
            "is_host": is_host,
            "is_audio_muted": False,
            "is_video_off": False,
            "is_hand_raised": False
        }

        # Broadcast participant joined event to room
        join_event = {
            "type": "PARTICIPANT_JOINED",
            "participantId": participant_id,
            "displayName": display_name,
            "isHost": is_host,
            "participants": self.get_room_participants_list(meeting_id)
        }
        await self.broadcast(meeting_id, join_event)
        logger.info(f"Participant {display_name} ({participant_id}) joined meeting {meeting_id}")

    async def disconnect(self, meeting_id: str, participant_id: str):
        if meeting_id in self.rooms and participant_id in self.rooms[meeting_id]:
            leaving_user = self.rooms[meeting_id].pop(participant_id)
            display_name = leaving_user.get("display_name", "Participant")
            
            if not self.rooms[meeting_id]:
                del self.rooms[meeting_id]
            else:
                leave_event = {
                    "type": "PARTICIPANT_LEFT",
                    "participantId": participant_id,
                    "displayName": display_name,
                    "participants": self.get_room_participants_list(meeting_id)
                }
                await self.broadcast(meeting_id, leave_event)

    def get_room_participants_list(self, meeting_id: str) -> List[Dict[str, Any]]:
        if meeting_id not in self.rooms:
            return []
        return [
            {
                "id": p_id,
                "displayName": p_data["display_name"],
                "isHost": p_data["is_host"],
                "isAudioMuted": p_data["is_audio_muted"],
                "isVideoOff": p_data["is_video_off"],
                "isHandRaised": p_data["is_hand_raised"]
            }
            for p_id, p_data in self.rooms[meeting_id].items()
        ]

    async def send_personal_message(self, meeting_id: str, target_id: str, message: dict):
        if meeting_id in self.rooms and target_id in self.rooms[meeting_id]:
            socket = self.rooms[meeting_id][target_id]["socket"]
            await socket.send_text(json.dumps(message))

    async def broadcast(self, meeting_id: str, message: dict, sender_id: str = None):
        if meeting_id in self.rooms:
            message_str = json.dumps(message)
            for p_id, p_data in list(self.rooms[meeting_id].items()):
                if sender_id and p_id == sender_id:
                    continue
                try:
                    await p_data["socket"].send_text(message_str)
                except Exception as e:
                    logger.error(f"Error sending message to {p_id}: {e}")

manager = ConnectionManager()
