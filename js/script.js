kakao.maps.load(function() {
    // 이벤트 리스너 설정
    document.getElementById('routeForm').addEventListener('submit', function(e) {
        e.preventDefault(); // 폼 기본 제출 동작을 방지합니다.

        var startPoint = document.getElementById('startPoint').value;
        var endPoint = document.getElementById('endPoint').value;

        // 주소-좌표 변환 객체를 생성합니다
        var geocoder = new kakao.maps.services.Geocoder();

        // 출발지 주소로 좌표를 검색합니다
        geocoder.addressSearch(startPoint, function(result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                displayMarker(map, coords, '출발지');
            }
        });

        // 목적지 주소로 좌표를 검색합니다
        geocoder.addressSearch(endPoint, function(result, status) {
            // 정상적으로 검색이 완료됐으면
            if (status === kakao.maps.services.Status.OK) {
                var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
                displayMarker(map, coords, '목적지');
            }
        });
    });

    function displayMarker(map, coords, title) {
        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });
        
        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">' + title + '</div>'
        });
        infowindow.open(map, marker);
        
        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    }
    
    // 지도 생성 코드는 여기에 추가합니다
});
