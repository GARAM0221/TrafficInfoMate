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
    
    // Initialize the route parameter with the start location
    let rtParam = `&sX=${startLng}&sY=${startLat}`;

    // Append each waypoint to the route parameter
    coordinates.forEach((coord, index) => {
        rtParam += `,${coord[0]},${coord[1]}`; // Add each coordinate pair to the route
    });

    // Finalize the link by combining the base URL with the route parameter
    const finalLink = baseLink + rtParam;
    
    console.log("Generated link:", finalLink); // Log the generated link for debugging
    return finalLink;
}




function onAnalyzeClick() {
    getCurrentLocation(function(lat, lng) {
        if (lat != null && lng != null) {
            const coordinates = analyzeMapLink(); // This function analyzes the input link and returns coordinates array
            if(coordinates && coordinates.length > 0) {
                const kakaoMapLink = generateKakaoMapLink(lat, lng, coordinates);
                const resultContainer = document.getElementById('linkAnalysisResult');
                resultContainer.innerHTML = `<p><a href="${kakaoMapLink}" target="_blank">View route on KakaoMap</a></p>`;
            } else {
                alert("Unable to extract coordinates from the link.");
            }
        } else {
            alert("Unable to access current location.");
        }
    });
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

    console.log("Coordinates array:", coordinates); // 배열 확인 로그
    return coordinates.flat(); // 평탄화하여 반환
}

function getCurrentLocation(callback) {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            console.log("Current location:", position.coords.latitude, position.coords.longitude); // 현재 위치 로그
            callback(position.coords.latitude, position.coords.longitude);
        }, function(error) {
            console.error("Geolocation error:", error.message);
            callback(null, null);
        });
    } else {
        console.error("Geolocation is not supported by this browser.");
        callback(null, null);
    }
}

function generateKakaoMapLink(startLat, startLng, coordinates) {
    let baseLink = "https://map.kakao.com/?map_type=TYPE_MAP&target=car";
    let routeLink = "&rt=";
    // 출발지와 경유지, 목적지 좌표를 rt 파라미터로 추가
    // 여기서 좌표 추가 로직 구현
    // 예시 로그
    const finalLink = baseLink + routeLink;
    console.log("Generated link:", finalLink); // 생성된 링크 로그
    return finalLink;
}
