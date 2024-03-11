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
            const coordinates = analyzeMapLink(); // analyzeMapLink 함수에서 좌표 배열을 받음
            if(coordinates && coordinates.length > 0) { // 좌표가 정상적으로 추출된 경우에만 처리
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
