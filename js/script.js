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

function generateKakaoMapLink(coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car";
    let rtParam = "&rt=";

    // coordinates 배열에는 위도와 경도가 번갈아 가며 저장되어 있음
    for (let i = 0; i < coordinates.length; i += 2) {
        if (i > 0) rtParam += ",";
        rtParam += `${coordinates[i]},${coordinates[i + 1]}`;
    }

    // 경유지와 목적지에 대한 추가 설명이 필요한 경우, rt1, rt2, ... 파라미터에 추가
    // 예제에서는 rt 파라미터만 사용

    return baseLink + rtParam; // 최종 생성된 링크 반환
}

function onAnalyzeClick() {
    // analyzeMapLink 함수에서 좌표 배열을 가져오는 코드 생략
    const coordinates = analyzeMapLink(); // 예시에서는 이 함수를 호출하여 좌표 배열을 가져옵니다.

    if (coordinates && coordinates.length > 0) {
        const kakaoMapLink = generateKakaoMapLink(coordinates);
        const resultContainer = document.getElementById('linkAnalysisResult');
        resultContainer.innerHTML = `<p><a href="${kakaoMapLink}" target="_blank">카카오맵에서 경로 보기</a></p>`;
    } else {
        alert("링크에서 좌표를 추출할 수 없습니다.");
    }
}

