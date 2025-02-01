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
city2: ['city_dog.mp4', 'dog_s.mp4'],
city3: ['city_cat.mp4', 'cat_s.mp4'],
city4: ['city_crow.mp4', 'crow_s.mp4'],
grass1: ['grass_giraffe.mp4', 'giraffe_s.mp4'],
grass2: ['grass_meerkat.mp4', 'meerkat_s.mp4'],
grass3: ['grass_horse.mp4', 'horse_s.mp4'],
grass4: ['grass_kangaroo.mp4', 'kangaroo_s.mp4'],
jungle1: ['jungle_gibbon.mp4', 'gibbon_s.mp4'],
jungle2: ['jungle_bear.mp4', 'bear_s.mp4'],
jungle3: ['jungle_ezorisu.mp4', 'ezorisu_s.mp4'],
jungle4: ['jungle_deer.mp4', 'deer_s.mp4'],
ocean1: ['ocean_penguin.mp4', 'penguin_s.mp4'],
ocean2: ['ocean_seal.mp4', 'seal_s.mp4'],
ocean3: ['ocean_seaotter.mp4', 'seaotter_s.mp4'],
ocean4: ['ocean_seaturtle.mp4', 'seaturtle_s.mp4']
   
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
