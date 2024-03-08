var mapContainer = document.getElementById('map'), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.566535, 126.9779692), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };    

var map = new kakao.maps.Map(mapContainer, mapOption); // 지도를 생성합니다
