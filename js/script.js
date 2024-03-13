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
