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

// 페이지 로드 시 첫 번째 섹션을 기본적으로 활성화합니다.
window.onload = function() {
    showSection('link-analysis'); // 기본적으로 첫 번째 기능을 보여줍니다.
};

function analyzeMapLink() {
    const mapLink = document.getElementById('mapLinkInput').value;
    const linkParts = mapLink.split('&');
    let coordinates = [];

    linkParts.forEach(part => {
        if (part.startsWith('rt=')) {
            // %20을 공백으로 치환합니다.
            const coordsPart = part.substring(3).replace(/%20/g, ' ').split(',');
            // 좌표를 배열에 추가합니다.
            for (let i = 0; i < coordsPart.length; i += 2) {
                coordinates.push([parseFloat(coordsPart[i]), parseFloat(coordsPart[i + 1])]);
            }
        }
    });

    // 함수가 좌표 배열을 반환하도록 수정합니다.
    return coordinates.flat(); // 평탄화하여 반환
}

function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            callback(position.coords.latitude, position.coords.longitude);
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
    let routeParam = "&rt=";

    // 첫 번째 경유지로 현재 위치 추가
    routeParam += `${currentLat},${currentLng}`;

    // 이후 경유지 및 목적지(마지막 좌표)를 rtParam에 추가
    for (let i = 0; i < coordinates.length; i += 2) {
        routeParam += `,${coordinates[i]},${coordinates[i + 1]}`;
    }

    return baseLink + routeParam;
}

function onAnalyzeClick() {
    getCurrentLocation(function(currentLat, currentLng) {
        if (currentLat != null && currentLng != null) {
            // 현재 위치의 좌표를 카카오맵의 좌표계로 변환하는 과정을 추가
            kakao.maps.load(function() {
                var geocoder = new kakao.maps.services.Geocoder();

                var coord = new kakao.maps.LatLng(currentLat, currentLng);
                var callback = function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        const transformedCurrentLat = result[0].y;
                        const transformedCurrentLng = result[0].x;

                        // 좌표 변환 성공 후 나머지 로직 처리
                        const coordinates = analyzeMapLink();
                        if (coordinates && coordinates.length > 0) {
                            const kakaoMapLink = generateKakaoMapLink(transformedCurrentLat, transformedCurrentLng, coordinates);
                            const resultContainer = document.getElementById('linkAnalysisResult');
                            resultContainer.innerHTML = `<p><a href="${kakaoMapLink}" target="_blank">카카오맵에서 경로 보기</a></p>`;
                        } else {
                            alert("링크에서 좌표를 추출할 수 없습니다.");
                        }
                    } else {
                        alert("현재 위치의 좌표 변환에 실패했습니다.");
                    }
                };

                // 현재 위치의 WGS84 좌표를 카카오맵 좌표계로 변환
                geocoder.coord2Address(coord.getLng(), coord.getLat(), callback);
            });
        } else {
            alert("현재 위치를 가져올 수 없습니다.");
        }
    });
}
