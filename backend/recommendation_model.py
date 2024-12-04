import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import CountVectorizer
import spotipy
from spotipy.oauth2 import SpotifyOAuth
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
import numpy as np


# Initialize Spotify API
sp = spotipy.Spotify(auth_manager=SpotifyOAuth(
    client_id='YOUR_CLIENT_ID',
    client_secret='YOUR_CLIENT_SECRET',
    redirect_uri='YOUR_REDIRECT_URI',
    scope="user-library-read"
))

def fetch_user_top_tracks(user_id, time_range='medium_term', limit=20):
    """
    Fetch top tracks of a user from Spotify.
    """
    results = sp.current_user_top_tracks(time_range=time_range, limit=limit)
    tracks = [
        {
            "id": item["id"],
            "name": item["name"],
            "artist": item["artists"][0]["name"],
            "genres": fetch_artist_genres(item["artists"][0]["id"])
        }
        for item in results["items"]
    ]
    return pd.DataFrame(tracks)


def fetch_artist_genres(artist_id):
    """
    Fetch genres for a given artist.
    """
    artist = sp.artist(artist_id)
    return ", ".join(artist["genres"])


def train_recommendation_model(data):
    """
    Train a simple recommendation model using genres and artist names.
    """
    # Combine artist and genres into a single feature
    data['features'] = data['artist'] + " " + data['genres']

    # Vectorize the features
    vectorizer = CountVectorizer()
    feature_matrix = vectorizer.fit_transform(data['features'])

    # Compute cosine similarity
    similarity_matrix = cosine_similarity(feature_matrix)
    return similarity_matrix, data


def get_recommendations(track_id, similarity_matrix, data, top_n=10):
    """
    Generate recommendations based on a track.
    """
    track_index = data[data['id'] == track_id].index[0]
    similarity_scores = list(enumerate(similarity_matrix[track_index]))
    similarity_scores = sorted(similarity_scores, key=lambda x: x[1], reverse=True)
    recommendations = [data.iloc[i]["id"] for i, _ in similarity_scores[1:top_n+1]]
    return recommendations


def generate_user_recommendations(user_id):
    """
    Main function to generate recommendations for a user.
    """
    user_tracks = fetch_user_top_tracks(user_id) # top user tracks
    similarity_matrix, data = train_recommendation_model(user_tracks) # training

    # Use the first track as a seed
    seed_track_id = user_tracks.iloc[0]["id"]

    # Get recommendations
    recommended_track_ids = get_recommendations(seed_track_id, similarity_matrix, data)

    # Fetch detailed track info
    recommended_tracks = [
        sp.track(track_id) for track_id in recommended_track_ids
    ]

    return [
        {
            "name": track["name"],
            "artist": track["artists"][0]["name"],
            "preview_url": track["preview_url"],
            "external_url": track["external_urls"]["spotify"]
        }
        for track in recommended_tracks
    ]
