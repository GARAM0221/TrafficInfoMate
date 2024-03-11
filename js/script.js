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
function getCurrentLocationAndTransformToTM(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var tmX = position.coords.latitude;
            var tmY = position.coords.longitude;

            kakao.maps.load(function() {
                var geocoder = new kakao.maps.services.Geocoder();

                // WGS84 좌표를 TM 좌표계로 변환
                geocoder.transCoord(tmY, tmX, function(result, status) {
                    if (status === kakao.maps.services.Status.OK) {
                        // 변환된 TM 좌표
                        var transformedTMx = result[0].x;
                        var transformedTMy = result[0].y;

                        // 변환된 TM 좌표를 사용하는 로직 (예: 콜백 함수 호출)
                        console.log("변환된 TM 좌표:", transformedTMx, transformedTMy);
                        callback(transformedTMy, transformedTMx);
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
            console.error("Geolocation error: ", error.message);
            callback(null, null);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        callback(null, null);
    }
}

// 함수 사용 예
getCurrentLocationAndTransformToTM(function(tmX, tmY) {
    if (tmX != null && tmY != null) {
        // 변환된 TM 좌표를 활용한 추가 작업
        console.log("현재 위치의 TM 좌표계 좌표: ", tmX, tmY);
    } else {
        console.log("TM 좌표 변환에 실패했습니다.");
    }
});



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
            var tmX = position.coords.latitude;
            var tmY = position.coords.longitude;
            // 변환 작업은 여기서 진행하거나, 현재 위치를 바로 반환할 수도 있습니다.
            // 변환 작업이 필요한 경우 여기에 추가하세요.
            callback(tmX, tmY);
        }, function(error) {
            console.error("Geolocation error: " + error.message);
            callback(null, null);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        callback(null, null);
    }
}

function generateKakaoMapLink(tmX, tmY, coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car";
    let rtParam = "&rt=";

    // 현재 위치를 rt 파라미터의 맨 앞에 추가
    rtParam += `${tmX},${tmY},`;

    for (let i = 0; i < coordinates.length; i += 2) {
        rtParam += `${coordinates[i]},${coordinates[i + 1]},`;
    }

    // 마지막 콤마 제거
    rtParam = rtParam.slice(0, -1);

    return baseLink + rtParam;
}

function onAnalyzeClick() {
    getCurrentLocationAndTransformToTM(function(tmX, tmY) {
        if (tmX != null && tmY != null) {
            // 현재 위치가 TM 좌표계로 변환되었습니다.
            // 변환된 좌표를 사용하여 링크를 생성해야 합니다.
            // analyzeMapLink 함수에서 반환된 나머지 좌표들과 함께 링크를 생성합니다.
            const coordinates = analyzeMapLink();
            if (coordinates && coordinates.length > 0) {
                // TM 좌표계로 변환된 현재 위치 좌표를 링크 생성 함수에 전달합니다.
                const kakaoMapLink = generateKakaoMapLink(tmX, tmY, coordinates);
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
