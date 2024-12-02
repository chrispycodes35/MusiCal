import spotipy
from spotipy.oauth2 import SpotifyClientCredentials

# Initialize Spotify API client
client_id='bf672d78468c4fa6b8389d815d211583'
client_secret='f6e0640116b24e30bc577613d2e49f2f'

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=client_id, client_secret=client_secret))

def get_track_features(track_id):
    features = sp.audio_features(track_id)
    return features[0] if features else None

results = sp.search(q = 'Imogen Heap', limit=5)
for idx, track in enumerate(results['tracks']['items']):
    print(f"{idx+1}. {track['name']} by {', '.join([artist['name'] for artist in track['artists']])}")