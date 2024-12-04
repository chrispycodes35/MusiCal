from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
import spotipy
import requests
import numpy as np
from urllib.parse import quote
from recommendation_model import generate_user_recommendations

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    response.headers.add("Access-Control-Allow-Origin", "http://localhost:3000")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization")
    response.headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
    return response

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
        # Fetch user profile data
        user_profile = sp.me()
        username = user_profile.get("display_name", "User")
        profile_picture = user_profile["images"][0]["url"] if user_profile["images"] else None

        # User's top tracks
        top_tracks = sp.current_user_top_tracks(limit=10, time_range='medium_term')
        # Updated in your listening_data route
        top_tracks_info = [
            {
                "name": track['name'],
                "artist": track['artists'][0]['name'],
                "image": track['album']['images'][0]['url'] if track['album']['images'] else None,
                "external_url": track['external_urls']['spotify']
            }
            for track in top_tracks['items']
        ]

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
            "username": username,
            "profile_picture": profile_picture,
            "top_tracks": top_tracks_info,
            "top_artists": top_artists_info,
            "top_genres": genre_breakdown,
        }

        return jsonify(user_data)

    except spotipy.SpotifyException as e:
        return jsonify({"error": f"Spotify API error: {str(e)}"}), 500


@app.route('/model_recommendations', methods=['POST'])
def model_recommendations():
    global sp
    if not sp:
        return jsonify({"error": "Spotify client is not initialized."}), 400

    try:
        # Fetch user's top tracks
        top_tracks = sp.current_user_top_tracks(limit=20)
        track_ids = [track["id"] for track in top_tracks["items"]]

        if not track_ids:
            print("No top tracks found for the user.")
            return jsonify({"error": "No top tracks found for the user"}), 400

        # Select seed tracks
        seed_tracks = np.random.choice(track_ids, size=min(5, len(track_ids)), replace=False).tolist()
        print(f"Seed tracks selected: {seed_tracks}")

        # Ensure seed tracks are URL-encoded
        seed_tracks_encoded = [quote(track) for track in seed_tracks]

        # Fetch recommendations
        recommendations = sp.recommendations(seed_tracks=seed_tracks_encoded, limit=8)
        if not recommendations["tracks"]:
            print("No recommendations returned from Spotify.")
            return jsonify({"error": "No recommendations available"}), 400

        # Format recommended tracks
        recommended_tracks = [
            {
                "name": track["name"],
                "artist": track["artists"][0]["name"],
                "preview_url": track.get("preview_url"),
                "external_url": track["external_urls"]["spotify"],
            }
            for track in recommendations["tracks"]
        ]

        print("Recommendations successfully generated.")
        return jsonify({"recommendations": recommended_tracks})
    except spotipy.SpotifyException as e:
        print(f"Spotify API error: {e}")
        return jsonify({"error": f"Spotify API error: {e}"}), 500
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": f"Unexpected error: {e}"}), 500


@app.route('/favicon.ico')
def favicon():
    return '', 204  # no content

if __name__ == '__main__':
    app.run(debug=True)
