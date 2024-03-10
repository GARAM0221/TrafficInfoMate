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
    // 예시: 'https://map.kakao.com/?map_type=TYPE_MAP&target=car&rt=위도,경도,...' 형태의 링크 분석
    const linkParts = mapLink.split('&');
    let coordinates = [];

    linkParts.forEach(part => {
        if (part.startsWith('rt=')) {
            coordinates = part.substring(3).split(',');
        }
    });

    // 결과 표시 로직 구현
    const resultContainer = document.getElementById('linkAnalysisResult');
    resultContainer.innerHTML = `<p>추출된 좌표: ${coordinates.join(', ')}</p>`;
}

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
