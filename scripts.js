const loadingCircle = document.getElementById('loadingCircle');
const videoPopup = document.getElementById('videoPopup');
const popupVideo = document.getElementById('popupVideo');
const closeButton = document.getElementById('closeButton');
const tapHint = document.getElementById('tapHint');
const markerStatus = document.getElementById('markerStatus');
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

// 動画のパスを指定
const videoPaths = {
    city1: ['city_human.mp4', 'human_s.mp4'],
    city2: ['dog_tb.mp4', 'dog_t.mp4'],
    city3: ['cat_tb.mp4', 'cat_t.mp4'],
    city4: ['crow_tb.mp4', 'crow_t.mp4'],
    grass1: ['giraffe_tb.mp4', 'giraffe_t.mp4'],
    grass2: ['meerkat_tb.mp4', 'meerkat_t.mp4'],
    grass3: ['horse_tb.mp4', 'horse_t.mp4'],
    grass4: ['kangaroo_tb.mp4', 'kangaroo_t.mp4'],
    jungle1: ['gibbon_tb.mp4', 'gibbon_t.mp4'],
    jungle2: ['bear_tb.mp4', 'bear_t.mp4'],
    jungle3: ['ezorisu_tb.mp4', 'ezorisu_t.mp4'],
    jungle4: ['deer_tb.mp4', 'deer_t.mp4'],
    ocean1: ['penguin_tb.mp4', 'penguin_t.mp4'],
    ocean2: ['seal_tb.mp4', 'seal_t.mp4'],
    ocean3: ['seaotter_tb.mp4', 'seaotter_t.mp4'],
    ocean4: ['seaturtle_tb.mp4', 'seaturtle_t.mp4']    
};


// 再生中のフラグと現在の動画インデックス
let isPlaying = false;
let currentVideoIndex = 0;

// 動画を事前に読み込む関数
const preloadVideos = () => {
    Object.values(videoPaths).forEach(paths => {
        paths.forEach(path => {
            const video = document.createElement('video');
            video.src = path;
            video.preload = 'auto';
            video.load();
            video.muted = true;
        });
    });
};

// マーカー検出ステータスを更新する関数
function updateMarkerStatus(show, isMarkerFound = false) {
    if (isPlaying) return; // 映像再生中は表示しない

    if (show) {
        if (isMarkerFound) {
            markerStatus.innerText = "マーカーを検出中...";
            markerStatus.style.color = "green";
        } else {
            markerStatus.innerText = "マーカーが見つかりません";
            markerStatus.style.color = "red";
        }
        markerStatus.style.display = "block";
    } else {
        markerStatus.style.display = "none";
    }
}

// UIヒントを表示する関数
function showTapHint() {
    tapHint.style.display = 'block';
    tapHint.classList.add('show');
}

// 動画を再生する関数
function showPopupVideo(videoPathsArray) {
    if (isPlaying) return;

    isPlaying = true;
    currentVideoIndex = 0;
    const video = popupVideo;

    function playVideo(index) {
        video.src = videoPathsArray[index];
        video.load();
        video.loop = true;
        video.play();
        showTapHint();
    }

    loadingCircle.style.display = 'block';
    videoPopup.style.display = 'none';

    video.oncanplaythrough = () => {
        loadingCircle.style.display = 'none';
        videoPopup.style.display = 'block';
        updateMarkerStatus(true, true); // 動画再生中はステータスを表示
        video.play();
    };

    video.onerror = () => {
        setTimeout(() => {
            playVideo(currentVideoIndex);
        }, 500);
    };

    playVideo(currentVideoIndex);

    video.addEventListener('click', () => {
        currentVideoIndex = (currentVideoIndex + 1) % videoPathsArray.length;
        playVideo(currentVideoIndex);
    });

    closeButton.addEventListener('click', () => {
        video.pause();
        video.currentTime = 0;
        videoPopup.style.display = 'none';
        isPlaying = false;
        updateMarkerStatus(false); // ×ボタンを押したらステータス非表示
    });
}

// マーカーイベントを処理
document.querySelectorAll('a-marker').forEach(marker => {
    marker.addEventListener('markerFound', () => {
        if (isPlaying) return;

        const markerId = marker.id;
        if (videoPaths[markerId]) {
            setTimeout(() => {
                showPopupVideo(videoPaths[markerId]);
            }, 1000);
        }

        updateMarkerStatus(true, true);  // マーカーが見つかった時に緑色で表示
    });

    marker.addEventListener('markerLost', () => {
        if (!isPlaying) {
            updateMarkerStatus(true, false);  // マーカーが見つからない場合は赤色で表示
        }
    });
});

// ページロード時に動画を事前ロード
window.addEventListener('load', () => {
    preloadVideos();
    updateMarkerStatus(false); // 初期状態は非表示
});
