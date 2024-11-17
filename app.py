from flask import Flask, request, jsonify, send_file
import os
from rembg import remove
from PIL import Image
from io import BytesIO
from flask_cors import CORS
from waitress import serve

app = Flask(__name__)
CORS(app)


@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return jsonify({'error': 'No image uploaded'}), 400
    
    image_file = request.files['image']
    if image_file.filename == '':
        return jsonify({'error': 'No image file selected'}), 400
    
    # Open and process the image
    input_image = Image.open(image_file).convert("RGBA")
    output_image = remove(input_image)

    # Save output image to a BytesIO stream
    output_stream = BytesIO()
    output_image.save(output_stream, format="PNG")
    output_stream.seek(0)

    return send_file(output_stream, mimetype='image/png', as_attachment=True, download_name="output.png")

if __name__ == "__main__":
    serve(app, host='0.0.0.0', port=5000)

