from flask_socketio import SocketIO
from global_vars import global_vars


class ProgressEmitter:
    def __init__(self):
        self.socketio = global_vars["SOCKETIO"]

    def emit_progress(self, progress, progress_update: str):
        self.socketio.emit('progress_update', {'progress': progress, 'update_txt': progress_update})

    def emit_complete(self):
        self.socketio.emit('process-complete', {'progress': 10, 'update_txt': "Chain has finished!"})