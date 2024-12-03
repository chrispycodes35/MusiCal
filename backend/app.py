from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import spotipy
import requests
from urllib.parse import quote

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)
CLIENT_ID='ec1895b9fcb542cdab38b014c050f097'
CLIENT_SECRET='de0631d3f4f849e6815a77252324e360'
user_email = None #defined when user's email is collected from frontend
sp = None #defined when user's email is collected from frontend
firebase_url = None #defined when user's email is collected from frontend

@app.route('/')
def home():
    return jsonify({"message": user_email})

@app.route('/save-email', methods=['POST'])
def save_email_and_make_sp():
    #retrieve user email from frontend
    global user_email, sp, firebase_url
    data = request.get_json()
    user_email = data.get('email') 

    #retrieve user spotify access token
    firebase_url = f"https://firestore.googleapis.com/v1/projects/musical-4eabd/databases/(default)/documents/user%20tokens"
    response = requests.get(f"{firebase_url}/{user_email}")
    firebase_data = response.json()
    access_token = firebase_data.get("fields", {}).get("accessToken", {}).get("stringValue")
    print("access_token: " + str(access_token)) #do not remove or code will break

    #initialize sp client
    sp = spotipy.Spotify(auth=access_token)  
    print("spotify authenticator: " + str(sp)) #do not remove or code will break

    return jsonify({"message": "saved email and created sp client"})


@app.route('/listening_data')
def listening_data():
    #user's top tracks
    top_tracks = sp.current_user_top_tracks(limit = 10, time_range = 'medium_term')
    top_tracks_info = [(track['name'], track['artists'][0]['name']) for track in top_tracks['items']]

    #user's top artists
    top_artists = sp.current_user_top_artists(limit = 10, time_range = 'medium_term')
    top_artists_info = [artist['name'] for artist in top_artists['items']]

    #user's top genres
    genre_frequency = {}
    top_20_artists = sp.current_user_top_artists(limit = 20, time_range = 'medium_term')
    for artist in top_20_artists['items']:
        for genre in artist['genres']:
            if genre not in genre_frequency:
                genre_frequency[genre] = 1
            genre_frequency[genre] += 1
    top_genres = sorted(genre_frequency, key = lambda x : genre_frequency[x], reverse = True)[:5]
    
    #user data formatted for firebase
    user_data = {
        "top_tracks": {"arrayValue": {"values": [{"mapValue": {"fields": {
            "name": {"stringValue": track[0]},
            "artist": {"stringValue": track[1]}
        }}} for track in top_tracks_info]}},
        "top_artists": {"arrayValue": {"values": [{"stringValue": artist} for artist in top_artists_info]}},
        "top_genres": {"arrayValue": {"values": [{"stringValue": genre} for genre in top_genres]}},
    }

    document_url = f"https://firestore.googleapis.com/v1/projects/musical-4eabd/databases/(default)/documents/listening_data/{quote(user_email)}"
    requests.patch(document_url, json={"fields": user_data}) #store user data in Firebase
    return user_data #returns user data which is the Promise recieved by the fetch request in HomePage.js

@app.route('/favicon.ico')
def favicon():
    return '', 204  # no content

if __name__ == '__main__':
    app.run(debug=True)