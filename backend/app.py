from flask import Flask, jsonify
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import logging

# Initialize Flask app and Spotify client
app = Flask(__name__)

client_credentials_manager = SpotifyClientCredentials(
    client_id='your_spotify_client_id', # We still need to gain access to the Spotify credentials to use API
    client_secret='your_spotify_client_secret'
)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

@app.route('/track/<track_id>', methods=['GET'])
def get_track(track_id):
    # Add logging to see if the route is hit
    print(f"Received request for track: {track_id}")
    features = get_track_features(track_id)
    if features:
        print("Track features found!")
        return jsonify(features)
    else:
        print("No features found for this track.")
        return jsonify({"error": "No features found"}), 404

def get_track_features(track_id):
    try:
        features = sp.audio_features(track_id)
        return features[0] if features else None
    except Exception as e:
        print(f"Error fetching track features: {e}")
        return None

if __name__ == '__main__':
    app.run(debug=True)
