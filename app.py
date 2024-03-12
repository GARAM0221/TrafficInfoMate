from flask import Flask, request, jsonify
from pyproj import Transformer

app = Flask(__name__)

# WGS84 좌표계에서 UTM-K(Bessel 1841) 좌표계 (EPSG:5179)로 변환
transformer = Transformer.from_crs("epsg:4326", "epsg:5179", always_xy=True)

@app.route('/convert', methods=['POST'])
def convert_coords():
    data = request.get_json()
    lon = data.get('longitude')
    lat = data.get('latitude')
    
    if lon is None or lat is None:
        return jsonify({"error": "Invalid input, missing 'longitude' or 'latitude'."}), 400
    
    # 좌표 변환 실행
    utm_x, utm_y = transformer.transform(lon, lat)
    
    # 변환된 좌표 반환
    return jsonify({"utm_x": utm_x, "utm_y": utm_y})

if __name__ == '__main__':
    app.run(debug=True)
