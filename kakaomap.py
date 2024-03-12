from pyproj import Transformer

# WGS84 좌표계에서 UTM-K(Bessel 1841) 좌표계 (EPSG:5179)로 변환
transformer = Transformer.from_crs("epsg:4326", "epsg:5179", always_xy=True)

def wgs84_to_utm_k(lon, lat):
    # WGS84 좌표계에서 UTM-K 좌표계로 변환
    utm_x, utm_y = transformer.transform(lon, lat)
    return utm_x, utm_y

# 사용 예시: 현재 위치의 경도와 위도
current_lon, current_lat = 126.9784, 37.5665  # 서울 시청
utm_x, utm_y = wgs84_to_utm_k(current_lon, current_lat)

print("UTM-K 좌표계로 변환된 현재 위치: X={}, Y={}".format(utm_x, utm_y))

def generate_kakao_map_link(utm_x, utm_y, additional_coords):
    base_link = "https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt="
    # 변환된 UTM-K 좌표를 맨 앞에 추가합니다.
    coords_str = ",".join(["{:.6f},{:.6f}".format(x, y) for x, y in additional_coords])
    # 첫 번째 좌표로 변환된 현재 위치의 좌표를 추가합니다.
    kakao_map_link = f"{base_link}{utm_y:.6f},{utm_x:.6f},{coords_str}"
    return kakao_map_link

# 추가 좌표 (경유지나 목적지 등) - 예시
additional_coords = [(477622.351, 1122118.604), (457929.069, 1138422.901)]

# 링크 생성
kakao_map_link = generate_kakao_map_link(953936.4903427484, 1952031.8848331417, additional_coords)
print("생성된 카카오맵 링크:", kakao_map_link)
