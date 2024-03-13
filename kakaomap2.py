# 다른 Python 파일에서 kakaomap.py 사용 예시

from kakaomap import wgs84_to_utm_k, generate_kakao_map_link

# 사용자의 현재 위치 (예시)
current_lon, current_lat = 126.9784, 37.5665  # 서울 시청

# 현재 위치를 UTM-K 좌표계로 변환
utm_x, utm_y = wgs84_to_utm_k(current_lon, current_lat)

# 추가 좌표 (경유지나 목적지 등) - 실제 사용 사례에 맞게 조정
additional_coords = [(477622.351, 1122118.604), (457929.069, 1138422.901)]

# 카카오맵 링크 생성
kakao_map_link = generate_kakao_map_link(utm_x, utm_y, additional_coords)

print("생성된 카카오맵 링크:", kakao_map_link)
