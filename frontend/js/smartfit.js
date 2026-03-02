import { api } from './api.js';
import { state } from './state.js';

/* Mirrorverse Elite Smart Fit - Powered by MediaPipe */

const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const statusText = document.getElementById('scan-status');
const captureBtn = document.getElementById('capture-btn');
const resultOverlay = document.getElementById('result-overlay');

let poseResults = null;

function onResults(results) {
    if (!results.poseLandmarks) return;
    poseResults = results.poseLandmarks;

    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    // Custom Elite Drawing (Amazon Style)
    if (results.poseLandmarks) {
        drawLandmarks(results.poseLandmarks);
        statusText.innerText = "READY FOR PRECISION ANALYSIS";
        statusText.style.color = "#FF9900";
    }
    canvasCtx.restore();
}

function drawLandmarks(landmarks) {
    // MediaPipe helper (simplified)
    const connections = [
        [11, 12], // Shoulders
        [11, 23], [12, 24], // Torso
        [23, 24], // Waist/Hips
    ];

    canvasCtx.strokeStyle = '#FF9900';
    canvasCtx.lineWidth = 2;

    connections.forEach(([i, j]) => {
        const l1 = landmarks[i];
        const l2 = landmarks[j];
        canvasCtx.beginPath();
        canvasCtx.moveTo(l1.x * canvasElement.width, l1.y * canvasElement.height);
        canvasCtx.lineTo(l2.x * canvasElement.width, l2.y * canvasElement.height);
        canvasCtx.stroke();
    });
}

const pose = new Pose({
    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
});

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: false,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5,
});

pose.onResults(onResults);

const camera = new Camera(videoElement, {
    onFrame: async () => {
        await pose.send({ image: videoElement });
    },
    width: 600,
    height: 800,
});

camera.start();

// CAPTURE EVENT
captureBtn.addEventListener('click', async () => {
    if (!poseResults) {
        alert("Wait for AI to track your body posture.");
        return;
    }

    captureBtn.disabled = true;
    captureBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> CALCULATING SILHOUETTE...';

    // 1. Calculate ratios (Euclidean distance)
    const shoulders = Math.sqrt(
        Math.pow(poseResults[11].x - poseResults[12].x, 2) +
        Math.pow(poseResults[11].y - poseResults[12].y, 2)
    );

    const waist = Math.sqrt(
        Math.pow(poseResults[23].x - poseResults[24].x, 2) +
        Math.pow(poseResults[23].y - poseResults[24].y, 2)
    );

    // 2. Map to real CM based on reference (Height or pixel density)
    // Assume height = 165cm for demo, scaling proportionately
    // In a real app we'd ask for height or use a reference card
    const chestScale = 1.35; // Shoulder-to-chest factor
    const basePxlToCm = 200; // Mock pixels-to-cm conversion factor

    const chestCm = Math.floor(shoulders * basePxlToCm * chestScale);
    const waistCm = Math.floor(waist * basePxlToCm * 1.1);
    const hipCm = Math.floor(waistCm * 1.1);

    // 3. Backend Call
    const results = await api.scanBody({
        gender: state.gender,
        chest: chestCm,
        waist: waistCm,
        hip: hipCm,
        height: 170
    });

    state.setSize(results.recommendedSize);
    showResult(results);
});

function showResult(r) {
    document.getElementById('size-result').innerText = r.recommendedSize;
    document.getElementById('final-stats').innerHTML = `
        <div>CHEST: ${r.measurements.chest}cm</div>
        <div>WAIST: ${r.measurements.waist}cm</div>
        <div>HIP: ${r.measurements.hip}cm</div>
    `;

    const shopCta = document.getElementById('shop-cta');
    shopCta.href = `shop.html?gender=${state.gender}&size=${r.recommendedSize}&scan=success`;

    resultOverlay.style.display = 'block';
}
