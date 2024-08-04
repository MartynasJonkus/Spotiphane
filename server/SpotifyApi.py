from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json
from urllib.parse import urlparse
from PIL import Image
from io import BytesIO

load_dotenv()
client_id = os.getenv('CLIENT_ID')
client_secret = os.getenv('CLIENT_SECRET')

def get_spotify_token(client_id, client_secret):
    auth_url = 'https://accounts.spotify.com/api/token'
    auth_header = base64.b64encode((client_id + ':' + client_secret).encode('ascii')).decode('ascii')
    headers = {
        'Authorization': 'Basic ' + auth_header,
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    data = {
        'grant_type': 'client_credentials'
    }
    response = post(auth_url, headers=headers, data=data)
    return response.json()['access_token']

def get_spotify_id(spotify_url):
    parsed_url = urlparse(spotify_url)
    if 'open.spotify.com' in parsed_url.netloc:
        path_segments = parsed_url.path.split('/')
        return path_segments[-1]
    else:
        raise ValueError("Invalid Spotify URL")
    
def download_image(url):
    response = get(url)
    img = Image.open(BytesIO(response.content))
    return img



def get_cover_art_and_code(spotify_url):
    token = get_spotify_token(client_id, client_secret)
    spotify_id = get_spotify_id(spotify_url)
    type = 'track'
    headers = {
        'Authorization': 'Bearer ' + token
    }
    if 'track' in spotify_url:
        endpoint = f'https://api.spotify.com/v1/tracks/{spotify_id}'
    elif 'album' in spotify_url:
        endpoint = f'https://api.spotify.com/v1/albums/{spotify_id}'
        type = 'album'
    elif 'playlist' in spotify_url:
        endpoint = f'https://api.spotify.com/v1/playlists/{spotify_id}'
        type = 'playlist'
    else:
        raise ValueError("Unsupported Spotify URL")

    response = get(endpoint, headers=headers)
    data = response.json()
    
    if 'album' in data:
        cover_art_url = data['album']['images'][0]['url']
    elif 'images' in data:
        cover_art_url = data['images'][0]['url']
    else:
        raise ValueError("Cover art not found")

    spotify_code_url = f'https://scannables.scdn.co/uri/plain/jpeg/000000/white/640/spotify:{type}:{spotify_id}'

    cover_art_image = download_image(cover_art_url)
    spotify_code_image = download_image(spotify_code_url)
    
    return cover_art_image, spotify_code_image
