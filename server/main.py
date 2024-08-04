from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
import io
from SpotifyApi import get_cover_art_and_code
from Converter import combine_images_with_frame, image_to_heightmap, create_3d_model

app = Flask(__name__)
CORS(app)

@app.route('/generate_lithophane', methods=['POST'])
def generate_lithophane():
    try:
        data = request.json
        song_url = data['song_url']
        min_thickness = float(data.get('min_thickness', 0.6))
        max_thickness = float(data.get('max_thickness', 3.0))
        max_width = float(data.get('max_width', 100.0))
        frame_width = int(data['frame_width'])

        cover_art_image, spotify_code_image = get_cover_art_and_code(song_url)
        framed_image = combine_images_with_frame(cover_art_image, spotify_code_image, frame_width)
        heightmap = image_to_heightmap(framed_image, min_thickness, max_thickness)
        mesh = create_3d_model(heightmap, max_width)

        stl_io = io.BytesIO()
        mesh.export(stl_io, file_type='stl')
        stl_io.seek(0)

        return send_file(stl_io, mimetype='application/octet-stream', as_attachment=True, download_name='lithophane.stl')
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)
