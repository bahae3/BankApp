"""
Socket.IO event handlers.
Clients join a private room keyed by their client_id so the
transfer route can push balance updates directly to them.
"""
from flask_socketio import join_room, leave_room
from app.extensions import socketio


@socketio.on("connect")
def handle_connect():
    """Client connected — they will call join_room next."""
    pass


@socketio.on("join")
def handle_join(data):
    """
    Frontend emits: socket.emit('join', { client_id: <id> })
    We add the socket to a room named after the client's ID
    so we can target them precisely during transfers.
    """
    client_id = data.get("client_id")
    if client_id:
        join_room(str(client_id))


@socketio.on("leave")
def handle_leave(data):
    client_id = data.get("client_id")
    if client_id:
        leave_room(str(client_id))


@socketio.on("disconnect")
def handle_disconnect():
    pass
