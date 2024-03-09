document.getElementById('routeForm').addEventListener('submit', function(e) {
    e.preventDefault(); // 폼 기본 제출 동작을 방지합니다.

    var mapLink = document.getElementById('mapLink').value;
    // 링크 분석 로직을 여기에 구현합니다.
    // 예를 들어, URL에서 query parameter를 파싱하여 필요한 정보를 추출합니다.

    var startPoint = document.getElementById('startPoint').value;
    var endPoint = document.getElementById('endPoint').value;

    // 추출한 정보를 바탕으로 경로를 조회하는 로직을 추가합니다.
    // 예: searchRoute(startPoint, endPoint);
});

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566535, 126.9779692), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };    

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다

// 주소-좌표 변환 객체를 생성합니다
var geocoder = new kakao.maps.services.Geocoder();

// 출발지 주소로 좌표를 검색합니다
geocoder.addressSearch(startPoint, function(result, status) {
    // 정상적으로 검색이 완료됐으면 
    if (status === kakao.maps.services.Status.OK) {
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
        
        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });
        
        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;">출발지</div>'
        });
        infowindow.open(map, marker);
        
        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    }
});

// 동일한 방식으로 목적지에 대해서도 마커와 인포윈도우를 생성할 수 있습니다.
