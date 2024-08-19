from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
import base64
import re
from PIL import Image, UnidentifiedImageError
from SpotifyApi import get_cover_art_and_code
from Converter import combine_images, adjust_image, image_to_heightmap, create_3d_model
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)

@app.route('/generate_lithophane', methods=['POST'])
def generate_lithophane():
    try:
        data = request.json
        print("data", data)

        song_url = data.get('song_url')
        needs_code = data.get('needs_code')
        min_thickness = data.get('min_thickness')
        max_thickness = data.get('max_thickness')
        max_width = data.get('max_width')
        contrast_factor = data.get('contrast_factor')
        pixels_per_mm = data.get('pixels_per_mm')
        frame_width = data.get('frame_width')
        code_margin = data.get('code_margin')

        parsed_url = urlparse(song_url)
        if parsed_url.scheme not in ('http', 'https'):
            raise ValueError("Invalid URL scheme")
        
        cover_art_image, spotify_code_image = get_cover_art_and_code(song_url, needs_code)
        print("Images acquired")
        
        if needs_code:
            combined_image = combine_images(cover_art_image, spotify_code_image, code_margin)
        else:
            combined_image = cover_art_image
        print("Images combined")

        adjusted_image = adjust_image(combined_image, contrast_factor, frame_width, max_width, pixels_per_mm)
        print("Image adjusted")

        heightmap = image_to_heightmap(adjusted_image, min_thickness, max_thickness)
        print("Image converted to heightmap")

        mesh = create_3d_model(heightmap, max_width)
        print("3D model created")

        stl_io = io.BytesIO()
        mesh.export(stl_io, file_type='stl')
        stl_io.seek(0)

        return send_file(stl_io, mimetype='application/octet-stream', as_attachment=True, download_name='lithophane.stl')
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/generate_lithophane_photo', methods=['POST'])
def generate_lithophane_photo():
    try:
        data = request.json
        print("data", data)

        image_data = data.get('image_data')
        min_thickness = data.get('min_thickness')
        max_thickness = data.get('max_thickness')
        max_width = data.get('max_width')
        contrast_factor = data.get('contrast_factor')
        pixels_per_mm = data.get('pixels_per_mm')
        frame_width = data.get('frame_width')

        if image_data.startswith('data:image/'):
            image_data = re.sub(r'data:image/.+;base64,', '', image_data)
        print("Removed image prefix")

        image_bytes = base64.b64decode(image_data)
        if len(image_bytes) == 0:
            raise ValueError("Decoded image bytes are empty.")
        print("Image bytes decoded")

        try:
            image = Image.open(io.BytesIO(image_bytes))
            image.verify()
            image = Image.open(io.BytesIO(image_bytes))
        except UnidentifiedImageError:
            raise ValueError("The image cannot be identified.")
        except Exception as e:
            raise ValueError(f"Error opening image: {e}")
        print("Image opened")

        adjusted_image = adjust_image(image, contrast_factor, frame_width, max_width, pixels_per_mm)
        print("Image adjusted")

        heightmap = image_to_heightmap(adjusted_image, min_thickness, max_thickness)
        print("Image converted to heightmap")

        mesh = create_3d_model(heightmap, max_width)
        print("3D model created")

        stl_io = io.BytesIO()
        mesh.export(stl_io, file_type='stl')
        stl_io.seek(0)

        return send_file(stl_io, mimetype='application/octet-stream', as_attachment=True, download_name='lithophane.stl')
    
    except Exception as e:
        print('error', str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
