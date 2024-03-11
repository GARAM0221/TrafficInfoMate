function showSection(sectionId) {
    var sections = document.querySelectorAll('.feature-section');
    sections.forEach(function(section) {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

window.onload = function() {
    showSection('link-analysis');
};

// 현재 위치를 얻어와서 카카오맵의 좌표계로 변환 후, 결과를 지도 상에 마커로 표시하는 함수
function getCurrentLocationAndShowOnMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            // 현재 위치의 WGS84 좌표
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;

            // 카카오맵 API 로드
            kakao.maps.load(function() {
                // 지도 옵션 설정
                var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
                    mapOption = {
                        center: new kakao.maps.LatLng(currentLat, currentLng), // 지도의 중심좌표
                        level: 3 // 지도의 확대 레벨
                    };
                
                // 지도 생성
                var map = new kakao.maps.Map(mapContainer, mapOption);

                // 좌표계 변환 객체 생성
                var geocoder = new kakao.maps.services.Geocoder();

                // WGS84 좌표를 카카오맵 좌표계로 변환
                geocoder.transCoord(currentLng, currentLat, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        // 변환된 좌표로 마커 생성
                        var marker = new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(result[0].y, result[0].x),
                            map: map
                        });

                        // 지도 중심을 변환된 좌표로 이동
                        map.setCenter(new kakao.maps.LatLng(result[0].y, result[0].x));
                    } else {
                        console.error("좌표 변환 실패");
                    }
                }, {
                    input_coord: kakao.maps.services.Coords.WGS84,
                    output_coord: kakao.maps.services.Coords.WCONGNAMUL
                });
            });
        }, function(error) {
            console.error("Geolocation error: ", error.message);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}


function analyzeMapLink() {
    const mapLink = document.getElementById('mapLinkInput').value;
    const linkParts = mapLink.split('&');
    let coordinates = [];

    linkParts.forEach(part => {
        if (part.startsWith('rt=')) {
            const coordsPart = part.substring(3).replace(/%20/g, ' ').split(',');
            for (let i = 0; i < coordsPart.length; i += 2) {
                coordinates.push([parseFloat(coordsPart[i]), parseFloat(coordsPart[i + 1])]);
            }
        }
    });

    return coordinates.flat();
}

function getCurrentLocationAndTransform(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;

            // 카카오맵 API 로드
            kakao.maps.load(function() {
                var geocoder = new kakao.maps.services.Geocoder();

                // WGS84 좌표를 카카오맵 좌표계로 변환
                geocoder.transCoord(currentLng, currentLat, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        // 변환된 좌표로 콜백 함수 호출
                        callback(result[0].y, result[0].x);
                    } else {
                        console.error("좌표 변환 실패");
                        callback(null, null);
                    }
                }, {
                    input_coord: kakao.maps.services.Coords.WGS84,
                    output_coord: kakao.maps.services.Coords.WCONGNAMUL
                });
            });
        }, function(error) {
            console.error("Geolocation error: " + error.message);
            callback(null, null);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        callback(null, null);
    }
}


function generateKakaoMapLink(currentLat, currentLng, coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car";
    let rtParam = "&rt=";

    // 현재 위치를 rt 파라미터의 맨 앞에 추가
    rtParam += `${currentLat},${currentLng},`;

    for (let i = 0; i < coordinates.length; i += 2) {
        rtParam += `${coordinates[i]},${coordinates[i + 1]},`;
    }

    // 마지막 콤마 제거
    rtParam = rtParam.slice(0, -1);

    return baseLink + rtParam;
}

function onAnalyzeClick() {
    getCurrentLocationAndTransform(function(currentLat, currentLng) {
        if (currentLat != null && currentLng != null) {
            const coordinates = analyzeMapLink();
            if (coordinates && coordinates.length > 0) {
                const kakaoMapLink = generateKakaoMapLink(currentLat, currentLng, coordinates);
                const resultContainer = document.getElementById('linkAnalysisResult');
                resultContainer.innerHTML = `<p><a href="${kakaoMapLink}" target="_blank">카카오맵에서 경로 보기</a></p>`;
            } else {
                alert("링크에서 좌표를 추출할 수 없습니다.");
            }
        } else {
            alert("현재 위치를 가져올 수 없습니다.");
        }
    });
}

function showSection(sectionId) {
    var sections = document.querySelectorAll('.feature-section');
    sections.forEach(function(section) {
        if (section.id === sectionId) {
            section.classList.add('active');
        } else {
            section.classList.remove('active');
        }
    });
}

window.onload = function() {
    showSection('link-analysis');
};

function getCurrentLocationAndShowOnMap() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;

            console.log("현재 위치: ", currentLat, currentLng); // 현재 위치 로그 출력

            kakao.maps.load(function() {
                var mapContainer = document.getElementById('map'), 
                    mapOption = {
                        center: new kakao.maps.LatLng(currentLat, currentLng), 
                        level: 3 
                    };
                
                var map = new kakao.maps.Map(mapContainer, mapOption);

                var geocoder = new kakao.maps.services.Geocoder();

                geocoder.transCoord(currentLng, currentLat, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        console.log("좌표 변환 결과: ", result[0].y, result[0].x); // 좌표 변환 결과 로그 출력
                        var marker = new kakao.maps.Marker({
                            position: new kakao.maps.LatLng(result[0].y, result[0].x),
                            map: map
                        });

                        map.setCenter(new kakao.maps.LatLng(result[0].y, result[0].x));
                    } else {
                        console.error("좌표 변환 실패");
                    }
                }, {
                    input_coord: kakao.maps.services.Coords.WGS84,
                    output_coord: kakao.maps.services.Coords.WCONGNAMUL
                });
            });
        }, function(error) {
            console.error("Geolocation error: ", error.message);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
    }
}

function analyzeMapLink() {
    const mapLink = document.getElementById('mapLinkInput').value;
    const linkParts = mapLink.split('&');
    let coordinates = [];

    linkParts.forEach(part => {
        if (part.startsWith('rt=')) {
            const coordsPart = part.substring(3).replace(/%20/g, ' ').split(',');
            for (let i = 0; i < coordsPart.length; i += 2) {
                coordinates.push([parseFloat(coordsPart[i]), parseFloat(coordsPart[i + 1])]);
            }
        }
    });

    console.log("분석된 링크 좌표: ", coordinates); // 분석된 링크 좌표 로그 출력
    return coordinates.flat();
}

function onAnalyzeClick() {
    getCurrentLocationAndTransform(function(transformedLat, transformedLng) {
        if (transformedLat != null && transformedLng != null) {
            console.log("변환된 현재 위치 좌표: ", transformedLat, transformedLng); // 변환된 현재 위치 좌표 로그 출력

            const coordinates = analyzeMapLink();
            if (coordinates && coordinates.length > 0) {
                const kakaoMapLink = generateKakaoMapLink(transformedLat, transformedLng, coordinates);
                console.log("생성된 카카오맵 링크: ", kakaoMapLink); // 생성된 카카오맵 링크 로그 출력

                const resultContainer = document.getElementById('linkAnalysisResult');
                resultContainer.innerHTML = `<p><a href="${kakaoMapLink}" target="_blank">카카오맵에서 경로 보기</a></p>`;
            } else {
                alert("링크에서 좌표를 추출할 수 없습니다.");
            }
        } else {
            alert("현재 위치를 가져올 수 없습니다.");
        }
    });
}
