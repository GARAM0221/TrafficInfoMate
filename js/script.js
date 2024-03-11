function showSection(sectionId) {
    var sections = document.querySelectorAll('.feature-section');
    sections.forEach(function(section) {
        section.style.display = section.id === sectionId ? 'block' : 'none';
    });
}

window.onload = function() {
    showSection('link-analysis');
};

function analyzeMapLink() {
    const mapLink = document.getElementById('mapLinkInput').value;
    let coordinates = mapLink.match(/rt=([^&]+)/)[1].split(',').map(coord => parseFloat(coord));
    return coordinates; // 경도와 위도의 배열을 반환
}

function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                resolve({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                });
            }, error => {
                reject("Geolocation error: " + error.message);
            });
        } else {
            reject("Geolocation is not supported by this browser.");
        }
    });
}

async function onAnalyzeClick() {
    try {
        const {lat, lng} = await getCurrentLocation();
        const coordinates = analyzeMapLink();

        if (coordinates.length > 0) {
            const kakaoMapLink = generateKakaoMapLink(lat, lng, coordinates);
            document.getElementById('linkAnalysisResult').innerHTML = `<p><a href="${kakaoMapLink}" target="_blank">카카오맵에서 경로 보기</a></p>`;
        } else {
            alert("링크에서 좌표를 추출할 수 없습니다.");
        }
    } catch (error) {
        alert(error);
    }
}

function generateKakaoMapLink(lat, lng, coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car";
    let rtParam = `&rt=${coordinates.join(',')}`;
    let sParam = `&sX=${lng}&sY=${lat}`; // 현재 위치를 출발지로 설정

    return `${baseLink}${sParam}${rtParam}`;
}
