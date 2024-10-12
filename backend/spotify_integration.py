import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Initialize Spotify API client
client_credentials_manager = SpotifyClientCredentials(
    client_id='your_spotify_client_id',
    client_secret='your_spotify_client_secret'
)
sp = spotipy.Spotify(client_credentials_manager=client_credentials_manager)

def get_track_features(track_id):
    features = sp.audio_features(track_id)
    return features[0] if features else None
