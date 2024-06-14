from flask import Flask, jsonify, send_from_directory
from pymongo import MongoClient
from bson import json_util
from flask_cors import CORS
import os

app = Flask(__name__, static_folder="build", template_folder='build')
CORS(app)

# MongoDB Connection
mongo_uri = "mongodb+srv://shafshafiq:agarwal@agarwal.owd7ydl.mongodb.net/"
client = MongoClient(mongo_uri)
db = client["MAUI_Transcriptions"]


@app.route('/transcriptions/<collection_name>', methods=['GET'])
def get_transcriptions(collection_name):
    collection = db[collection_name]
    transcriptions = list(collection.find())
    return jsonify(json_util.dumps(transcriptions))


@app.route('/api/meetings', methods=['GET'])
def get_meetings():
    collection = db["Meetings"]
    meetings = list(collection.find())
    return jsonify(json_util.dumps(meetings))




if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)


