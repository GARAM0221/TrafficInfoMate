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

function getCurrentLocationAndTransformToTM(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;

            kakao.maps.load(function() {
                var geocoder = new kakao.maps.services.Geocoder();

                // 올바른 순서로 WGS84 좌표를 TM 좌표계로 변환
                geocoder.transCoord(currentLng, currentLat, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        var transformedTMx = result[0].x;
                        var transformedTMy = result[0].y;

                        console.log("변환된 TM 좌표:", transformedTMx, transformedTMy);
                        callback(transformedTMx, transformedTMy);
                    } else {
                        console.error("좌표 변환 실패");
                        callback(null, null);
                    }
                }, {
                    input_coord: kakao.maps.services.Coords.WGS84,
                    output_coord: kakao.maps.services.Coords.TM
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

function generateKakaoMapLink(tmX, tmY, coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car";
    let rtParam = "&rt=";

    // 변환된 TM 좌표를 링크 생성에 사용
    rtParam += `${tmX},${tmY},`;

    for (let i = 0; i < coordinates.length; i += 2) {
        rtParam += `${coordinates[i]},${coordinates[i + 1]},`;
    }

    rtParam = rtParam.slice(0, -1); // 마지막 콤마 제거

    return baseLink + rtParam;
}

function onAnalyzeClick() {
    getCurrentLocationAndTransformToTM(function(transformedTMx, transformedTMy) {
        if (transformedTMx != null && transformedTMy != null) {
            const coordinates = analyzeMapLink();
            if (coordinates && coordinates.length > 0) {
                const kakaoMapLink = generateKakaoMapLink(transformedTMx, transformedTMy, coordinates);
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
