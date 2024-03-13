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

function getCurrentLocationAndTransformToWCONGNAMUL(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;
            console.log("현재 위치(WGS84): ", currentLat, currentLng); // 현재 위치 로그

            kakao.maps.load(function() {
                var geocoder = new kakao.maps.services.Geocoder();

                geocoder.transCoord(currentLng, currentLat, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        console.log("변환된 WCONGNAMUL 좌표: ", result[0].x, result[0].y); // 변환된 WCONGNAMUL 좌표 로그
                        callback(result[0].x, result[0].y); // 순서 주의: X, Y
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
            let coordsPart = decodeURIComponent(part.substring(3)).split(',');
            coordsPart = coordsPart.map(coord => coord.replace(/ /g, ''));
            for (let i = 0; i < coordsPart.length; i += 2) {
                coordinates.push([parseFloat(coordsPart[i]), parseFloat(coordsPart[i + 1])]);
            }
        }
    });

    return coordinates.flat();
}

function generateKakaoMapLink(transformedWCONGNAMULx, transformedWCONGNAMULy, coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=";
    baseLink += `${transformedWCONGNAMULx},${transformedWCONGNAMULy},`;

    for (let i = 0; i < coordinates.length; i += 2) {
        baseLink += `${coordinates[i]},${coordinates[i + 1]},`;
    }

    baseLink = baseLink.slice(0, -1); // 마지막 콤마 제거

    return baseLink;
}

function onAnalyzeClick() {
    getCurrentLocationAndTransformToWCONGNAMUL(function(transformedWCONGNAMULx, transformedWCONGNAMULy) {
        const coordinates = analyzeMapLink();
        if (transformedWCONGNAMULx != null && transformedWCONGNAMULy != null && coordinates.length > 0) {
            const kakaoMapLink = generateKakaoMapLink(transformedWCONGNAMULx, transformedWCONGNAMULy, coordinates);
            const resultContainer = document.getElementById('linkAnalysisResult');
            resultContainer.innerHTML = `<p><a href="${kakaoMapLink}" target="_blank">카카오맵에서 경로 보기</a></p>`;
        } else {
            alert("링크에서 좌표를 추출할 수 없거나 현재 위치를 가져올 수 없습니다.");
        }
    });
}

// 로드뷰를 띄울 컨테이너와 카카오맵 API를 활용하기 위한 Roadview 객체를 초기화합니다.
var roadviewContainer = document.getElementById('roadview'); // 로드뷰를 표시할 div
var roadview = new kakao.maps.Roadview(roadviewContainer); // 로드뷰 객체
var roadviewClient = new kakao.maps.RoadviewClient(); // 좌표로부터 로드뷰 파노라마ID를 가져오기 위한 로드뷰 helper객체

function displayRoadview(lat, lng, title) {
    // 입력된 위도, 경도를 기반으로 로드뷰의 파노라마 ID를 얻어옵니다.
    roadviewClient.getNearestPanoId(new kakao.maps.LatLng(lat, lng), 50, function(panoId) {
        if (panoId) {
            // 파노라마 ID가 존재하면, 로드뷰를 해당 위치로 이동시킵니다.
            roadview.setPanoId(panoId, new kakao.maps.LatLng(lat, lng));
            // 선택된 위치의 이름을 화면에 표시합니다. (예: div에 표시)
            document.getElementById('roadviewTitle').innerText = title;
        } else {
            alert('해당 위치에 대한 로드뷰 정보가 없습니다.');
        }
    });
}

// 입력된 링크를 분석하여 로드뷰를 표시하는 함수를 호출합니다.
function onShowRoadviewClick() {
    const mapLink = document.getElementById('mapLinkInput').value;
    // 링크 분석 로직 추가(위도, 경도, 이름 추출)
    // 예시로, 간단한 분석 로직을 구현합니다. 실제로는 링크 형식에 따라 분석 로직을 구현해야 합니다.
    // 분석된 정보를 바탕으로 displayRoadview 함수를 호출합니다.
    const dummyLat = 33.450701;
    const dummyLng = 126.570667;
    const dummyTitle = "카카오 본사";
    displayRoadview(dummyLat, dummyLng, dummyTitle);
}