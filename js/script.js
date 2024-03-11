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
    // 출발지의 경도(longitude)와 위도(latitude) 순서를 올바르게 수정
    let sParam = `&sX=${currentLng}&sY=${currentLat}`;
    let rtParam = "&rt=";

    // 첫 번째 경유지로 현재 위치 추가 (경도, 위도 순서 주의)
    // 현재 위치가 첫 경유지가 아니라 출발지로 처리되어야 하므로, 이 부분은 제거
    // rtParam += `${currentLat},${currentLng}`;

    // 이후 경유지 및 목적지(마지막 좌표)를 rtParam에 추가 (경도, 위도 순서로 추가)
    for (let i = 0; i < coordinates.length; i += 2) {
        rtParam += `${coordinates[i]},${coordinates[i + 1]},`;
    }
    // 마지막에 추가된 콤마(,)를 제거합니다.
    rtParam = rtParam.slice(0, -1);

    return baseLink + sParam + rtParam;
}

function getCurrentLocationAndTransform(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;

            kakao.maps.load(function() {
                var geocoder = new kakao.maps.services.Geocoder();

                geocoder.transCoord(currentLng, currentLat, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        var transformedLat = result[0].y;
                        var transformedLng = result[0].x;
                        callback(transformedLat, transformedLng);
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
            console.error("Geolocation error:", error.message);
            callback(null, null);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        callback(null, null);
    }
}

function onAnalyzeClick() {
    getCurrentLocationAndTransform(function(transformedLat, transformedLng) {
        if (transformedLat != null && transformedLng != null) {
            // 변환된 현재 위치의 좌표와 링크 분석 결과를 사용하여 경로 링크 생성
            const coordinates = analyzeMapLink(); // 이전 단계와 동일
            coordinates.unshift(transformedLng, transformedLat); // 변환된 현재 위치를 경유지 목록 맨 앞에 추가
            const kakaoMapLink = generateKakaoMapLink(coordinates); // 수정된 generateKakaoMapLink 함수 사용
            const resultContainer = document.getElementById('linkAnalysisResult');
            resultContainer.innerHTML = `<p><a href="${kakaoMapLink}" target="_blank">카카오맵에서 경로 보기</a></p>`;
        } else {
            alert("현재 위치를 가져올 수 없습니다.");
        }
    });
}

// 수정된 generateKakaoMapLink 함수: 출발지 파라미터 제거, 첫 경유지가 출발지 역할을 함
function generateKakaoMapLink(coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=";
    // coordinates 배열에 첫 번째 경유지(출발지)부터 모든 경유지 및 목적지 좌표 추가
    for (let i = 0; i < coordinates.length; i += 2) {
        if (i > 0) baseLink += ",";
        baseLink += `${coordinates[i]},${coordinates[i + 1]}`;
    }
    return baseLink;
}


function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Current location:", position.coords.latitude, position.coords.longitude); // 현재 위치 로그
            callback(position.coords.latitude, position.coords.longitude);
        }, function(error) {
            console.error("Geolocation error:", error.message);
            callback(null, null);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        callback(null, null);
    }
}

function onAnalyzeClick() {
    getCurrentLocation(function(currentLat, currentLng) {
        console.log("getCurrentLocation callback - Current location:", currentLat, currentLng); // getCurrentLocation 콜백에서 현재 위치 로그

        if (currentLat != null && currentLng != null) {
            const coordinates = analyzeMapLink();
            console.log("Coordinates array:", coordinates); // 좌표 배열 로그

            if (coordinates && coordinates.length > 0) {
                const kakaoMapLink = generateKakaoMapLink(currentLat, currentLng, coordinates);
                console.log("Generated link:", kakaoMapLink); // 생성된 링크 로그

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
