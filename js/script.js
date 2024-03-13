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

function getCurrentLocationAndTransformToUTMK(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;
            console.log("현재 위치(WGS84): ", currentLat, currentLng); // 현재 위치 로그

            // Flask 앱에 좌표 변환 요청 보내기
            fetch("https://trafficinfo-9ec9b31d0db9.herokuapp.com/convert", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "longitude": currentLng,
                    "latitude": currentLat
                })
            })
            .then(response => response.json())
            .then(data => {
                console.log("변환된 UTM-K 좌표: ", data.utm_x, data.utm_y); // 변환된 UTM-K 좌표 로그
                callback(data.utm_x, data.utm_y); // 변환된 좌표를 콜백 함수로 전달
            })
            .catch(error => console.error("좌표 변환 실패: ", error));
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

function generateKakaoMapLink(transformedTMx, transformedTMy, coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=";
    // 변환된 TM 좌표를 맨 앞에 추가합니다.
    baseLink += `${transformedTMx},${transformedTMy},`;

    for (let i = 0; i < coordinates.length; i += 2) {
        baseLink += `${coordinates[i]},${coordinates[i + 1]},`;
    }

    baseLink = baseLink.slice(0, -1); // 마지막 콤마 제거

    return baseLink;
}

function onAnalyzeClick() {
    getCurrentLocationAndTransformToUTMK(function(transformedTMx, transformedTMy) {
        if (transformedTMx != null && transformedTMy != null) {
            const coordinates = analyzeMapLink();
            if (coordinates && coordinates.length > 0) {
                // 변환된 TM 좌표를 사용하여 링크를 생성합니다.
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

