document.getElementById('routeForm').addEventListener('submit', function(e) {
    e.preventDefault(); // 폼 기본 제출 동작을 방지합니다.

    var startPoint = document.getElementById('startPoint').value;
    var endPoint = document.getElementById('endPoint').value;

    // 여기에 출발지와 목적지를 사용하여 경로를 조회하는 코드를 추가합니다.
    // 예: searchRoute(startPoint, endPoint);
});

var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566535, 126.9779692), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };    

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
