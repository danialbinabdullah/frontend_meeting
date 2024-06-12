from flask import Flask, jsonify
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load meeting data from JSON file
def load_meetings():
    with open('meetings.json', 'r') as f:
        return json.load(f)

@app.route('/api/meetings', methods=['GET'])
def get_meetings():
    meeting_data = load_meetings()
    return jsonify(meeting_data)

if __name__ == '__main__':
    app.run(debug=True)
