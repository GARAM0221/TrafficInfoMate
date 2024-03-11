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
            var currentLat = position.coords.latitude;
            var currentLng = position.coords.longitude;
            // 변환 작업은 여기서 진행하거나, 현재 위치를 바로 반환할 수도 있습니다.
            // 변환 작업이 필요한 경우 여기에 추가하세요.
            callback(currentLat, currentLng);
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
    let rtParam = "&rt=";

    // 현재 위치를 rt 파라미터의 맨 앞에 추가
    rtParam += `${currentLat},${currentLng},`;

    for (let i = 0; i < coordinates.length; i += 2) {
        rtParam += `${coordinates[i]},${coordinates[i + 1]},`;
    }

    // 마지막 콤마 제거
    rtParam = rtParam.slice(0, -1);

    return baseLink + rtParam;
}

function onAnalyzeClick() {
    getCurrentLocationAndTransform(function(currentLat, currentLng) {
        if (currentLat != null && currentLng != null) {
            const coordinates = analyzeMapLink();
            if (coordinates && coordinates.length > 0) {
                const kakaoMapLink = generateKakaoMapLink(currentLat, currentLng, coordinates);
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
