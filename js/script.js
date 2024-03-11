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

function generateKakaoMapLink(startLat, startLng, coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car";
    // 출발지를 현재 위치로 설정합니다.
    let sParam = `&sX=${startLng}&sY=${startLat}`;
    let rtParam = "&rt=";

    // coordinates 배열에는 경유지와 목적지의 위도와 경도가 번갈아 가며 저장되어 있음
    for (let i = 0; i < coordinates.length; i += 2) {
        if (i > 0) rtParam += ",";
        rtParam += `${coordinates[i]},${coordinates[i + 1]}`;
    }

    return baseLink + sParam + rtParam;
}

function onAnalyzeClick() {
    getCurrentLocation(function(lat, lng) {
        if (lat != null && lng != null) {
            // 현재 위치가 정상적으로 얻어진 경우
            const coordinates = analyzeMapLink(); // 이 함수는 페이지에서 입력된 링크를 분석하여 경유지와 목적지의 좌표 배열을 반환합니다.
            if(coordinates && coordinates.length > 0) {
                const kakaoMapLink = generateKakaoMapLink(lat, lng, coordinates);
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

