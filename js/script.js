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
    // 링크 분석 로직 구현
    const linkParts = mapLink.split('&');
    let coordinates = [];

    linkParts.forEach(part => {
        if (part.startsWith('rt=')) {
            // %20을 공백으로 치환합니다.
            const coordsPart = part.substring(3).replace(/%20/g, ' ');
            coordinates = coordsPart.split(',');
        }
    });

    // 결과 표시 로직 구현
    const resultContainer = document.getElementById('linkAnalysisResult');
    resultContainer.innerHTML = `<p>추출된 좌표: ${coordinates.join(', ')}</p>`;
}

function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            callback(latitude, longitude);
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
    const baseLink = "https://map.kakao.com/?sName=Current Location";
    let routeLink = `&eX=${coordinates[coordinates.length - 2]}&eY=${coordinates[coordinates.length - 1]}&eName=Destination`;

    // 경유지가 있다면 추가
    if (coordinates.length > 2) {
        for (let i = 0; i < coordinates.length - 2; i += 2) {
            routeLink += `&viaX=${coordinates[i]}&viaY=${coordinates[i + 1]}`;
        }
    }

    // 출발지 (현재 위치) 추가
    routeLink = `&sX=${startLng}&sY=${startLat}` + routeLink;
    return baseLink + routeLink;
}

function onAnalyzeClick() {
    getCurrentLocation(function(lat, lng) {
        if (lat != null && lng != null) {
            analyzeMapLink(); // 이 함수 내에서 coordinates 변수를 글로벌로 사용하거나 다른 방식으로 접근해야 할 수도 있습니다.
            const kakaoMapLink = generateKakaoMapLink(lat, lng, coordinates); // 여기서 coordinates는 analyzeMapLink 함수에서 추출된 좌표 배열입니다.
            // kakaoMapLink를 화면에 표시하는 로직 추가
            const resultContainer = document.getElementById('linkAnalysisResult');
            resultContainer.innerHTML += `<p><a href="${kakaoMapLink}" target="_blank">카카오맵에서 경로 보기</a></p>`;
        } else {
            alert("현재 위치를 가져올 수 없습니다.");
        }
    });
}

