import os
from dotenv import load_dotenv
from flask import Flask, jsonify, redirect, request, session, url_for
import spotipy
from spotipy.oauth2 import SpotifyOAuth
from spotipy.cache_handler import FlaskSessionCacheHandler
import logging
load_dotenv()

app = Flask(__name__)

app.config["SECRET_KEY"] = os.urandom(64)
CLIENT_ID='af91c51284094efe9e831c521628aa0f'
CLIENT_SECRET='c8d8a61fb40c423dbd6f81121a868238'
redirect_uri = 'http://localhost:8000/callback'
scope = 'user-library-read playlist-read-private user-read-recently-played user-top-read'
cache_handler = FlaskSessionCacheHandler(session)

sp_oauth = SpotifyOAuth(client_id=os.getenv("CLIENT_ID"), 
                        client_secret=os.getenv("CLIENT_SECRET"),
                        redirect_uri=redirect_uri,
                        cache_handler=cache_handler,
                        scope=scope,
                        show_dialog=True)

sp = spotipy.Spotify(auth_manager=sp_oauth)

def not_authorized():
    if not sp_oauth.validate_token(cache_handler.get_cached_token()):
        auth_url = sp_oauth.get_authorize_url()
        return redirect(auth_url)

@app.route("/")
def home():
    return '<h1>Welcome to the Spotify Login App</h1><a href="/login">Login with Spotify</a>'

@app.route("/login")
def login():
    not_authorized()
    return redirect(url_for('profile'))

@app.route('/callback')
def callback():
    sp_oauth.get_access_token(request.args.get('code'))
    return redirect(url_for('profile'))


@app.route('/profile')
def profile():
    not_authorized()
    user_info = sp.current_user() 
    playlists = sp.current_user_playlists()
    playlist_info = [(pl['name'], pl['external_urls']['spotify']) for pl in playlists['items']]
    playlists_display = "<br>".join([f'{name}: {url}' for name, url in playlist_info])
    # Fetch user's top tracks
    top_tracks = sp.current_user_top_tracks(limit = 10, time_range = 'medium_term')
    top_tracks_info = [(track['name'], track['artists'][0]['name']) for track in top_tracks['items']]
    top_tracks_display = "<br>".join([f'{track} by {artist}' for track, artist in top_tracks_info])
    # Fetch user's top artists
    top_artists = sp.current_user_top_artists(limit = 10, time_range = 'medium_term')
    top_artists_info = [artist['name'] for artist in top_artists['items']]
    top_artists_display = "<br>".join(top_artists_info)

    # Fetch user's top genres
    genre_frequency = {}
    top_20_artists = sp.current_user_top_artists(limit = 20, time_range = 'medium_term')
    
    for artist in top_20_artists['items']:
        for genre in artist['genres']:
            if genre not in genre_frequency:
                genre_frequency[genre] = 1
            genre_frequency[genre] += 1
                
    top_genres = sorted(genre_frequency, key = lambda x : genre_frequency[x], reverse = True)[:5]
    genre_display = "<br>".join(top_genres)
    
    return (f"<h1>Hello, {user_info['display_name']}</h1><br>"
            f"<h2>Your Playlists:</h2>{playlists_display}<br><br>"  
            f"<h2>Your Top Tracks:</h2>{top_tracks_display}<br><br>"
            f"<h2>Your Top Artists:</h2>{top_artists_display}<br><br>"
            f"<h2>Your Top Genres:</h2>{genre_display}")

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('home'))

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


