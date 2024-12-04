from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import spotipy
import requests
from urllib.parse import quote

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

CLIENT_ID = 'ec1895b9fcb542cdab38b014c050f097'
CLIENT_SECRET = 'de0631d3f4f849e6815a77252324e360'
user_email = None
sp = None
firebase_url = None

@app.route('/')
def home():
    return jsonify({"message": user_email})

@app.route('/save-email', methods=['POST'])
def save_email_and_make_sp():
    global user_email, sp, firebase_url
    data = request.get_json()
    user_email = data.get('email')

    if not user_email:
        return jsonify({"error": "Email is required"}), 400

    # Retrieve user Spotify access token from Firebase
    firebase_url = f"https://firestore.googleapis.com/v1/projects/musical-4eabd/databases/(default)/documents/user%20tokens"
    response = requests.get(f"{firebase_url}/{user_email}")
    
    if response.status_code != 200:
        return jsonify({"error": "Failed to retrieve access token from Firebase"}), 400

    firebase_data = response.json()
    access_token = firebase_data.get("fields", {}).get("accessToken", {}).get("stringValue")

    if not access_token:
        return jsonify({"error": "No Spotify access token found for the user"}), 400

    print(f"Retrieved access_token for {user_email}: {access_token}")

    # Initialize Spotify client
    try:
        sp = spotipy.Spotify(auth=access_token)
        print("Spotify client initialized successfully")
    except Exception as e:
        print(f"Error initializing Spotify client: {str(e)}")
        return jsonify({"error": "Failed to initialize Spotify client"}), 500

    return jsonify({"message": "Spotify client initialized successfully"})



@app.route('/listening_data')
def listening_data():
    global sp
    if sp is None:
        return jsonify({"error": "Spotify client is not initialized. Please log in again."}), 400

    try:
        # User's top tracks
        top_tracks = sp.current_user_top_tracks(limit=10, time_range='medium_term')
        top_tracks_info = [{"name": track['name'], "artist": track['artists'][0]['name']} for track in top_tracks['items']]

        # User's top artists
        top_artists = sp.current_user_top_artists(limit=10, time_range='medium_term')
        top_artists_info = [artist['name'] for artist in top_artists['items']]

        # User's genre breakdown
        genre_frequency = {}
        top_20_artists = sp.current_user_top_artists(limit=20, time_range='medium_term')
        for artist in top_20_artists['items']:
            for genre in artist['genres']:
                genre_frequency[genre] = genre_frequency.get(genre, 0) + 1

        # Convert genre data into a sorted list of dictionaries
        sorted_genres = sorted(genre_frequency.items(), key=lambda x: x[1], reverse=True)
        genre_breakdown = [{"name": genre, "count": count} for genre, count in sorted_genres]

        # Format response
        user_data = {
            "top_tracks": top_tracks_info,
            "top_artists": top_artists_info,
            "top_genres": genre_breakdown,  # Include genre breakdown with counts
        }

        return jsonify(user_data)

    except spotipy.SpotifyException as e:
        return jsonify({"error": f"Spotify API error: {str(e)}"}), 500


@app.route('/favicon.ico')
def favicon():
    return '', 204  # no content

if __name__ == '__main__':
    app.run(debug=True)
