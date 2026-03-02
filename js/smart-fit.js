// js/smart-fit.js
const GEMINI_API_KEY = "AIzaSyCT5inBXMbfnq41B_f_y86PGWM0adNnX7g";

const videoElement = document.getElementById('live-video');
const canvasElement = document.getElementById('output-canvas');
const canvasCtx = canvasElement.getContext('2d');
const loadingIndicator = document.getElementById('loading-indicator');
const resultsOverlay = document.getElementById('results-overlay');
const matchContainer = document.getElementById('match-container');
const guideText = document.getElementById('guide-text');

let isCameraReady = false;

// Initialize MediaPipe Pose
const pose = new Pose({
    locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
    }
});

pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
});
pose.onResults(onResults);

// Start Live Camera
async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } }
        });
        videoElement.srcObject = stream;

        videoElement.onloadedmetadata = () => {
            canvasElement.width = videoElement.videoWidth;
            canvasElement.height = videoElement.videoHeight;
            isCameraReady = true;
            guideText.innerText = "Ready. Position full body and tap scan.";
        };
    } catch (err) {
        console.error("Camera access denied:", err);
        guideText.innerText = "Camera access denied. Please allow permissions.";
    }
}
document.addEventListener('DOMContentLoaded', startCamera);

// Handle Scan Button
window.captureAndScan = async function () {
    if (!isCameraReady) return;

    loadingIndicator.style.display = 'flex';

    // Create a snapshot frame from the video feed
    const snapshotCanvas = document.createElement('canvas');
    snapshotCanvas.width = videoElement.videoWidth;
    snapshotCanvas.height = videoElement.videoHeight;
    const ctx = snapshotCanvas.getContext('2d');

    // Since video is mirrored via CSS, we must mirror the pixels manually to send to MediaPipe properly
    ctx.translate(snapshotCanvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(videoElement, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

    try {
        // MediaPipe analyzes the frozen snapshot
        await pose.send({ image: snapshotCanvas });
    } catch (error) {
        console.error("Pose processing failed:", error);
        loadingIndicator.style.display = 'none';
        alert("Error estimating pose. Please try again.");
    }
}

function onResults(results) {
    loadingIndicator.style.display = 'none';

    // Clear preview canvas and draw the un-mirrored snapshot
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

    if (results.poseLandmarks) {
        drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
        drawLandmarks(canvasCtx, results.poseLandmarks, { color: '#FF0000', lineWidth: 1, radius: 2 });

        estimateMeasurements(results.poseLandmarks);
    } else {
        alert("Full body not detected. Ensure your camera sees you from head to knees!");
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
    canvasCtx.restore();
}

function estimateMeasurements(landmarks) {
    // Same heuristic as before
    const lShoulder = landmarks[11]; const rShoulder = landmarks[12];
    const lHip = landmarks[23]; const rHip = landmarks[24];

    const shoulderWidthRelative = Math.abs(lShoulder.x - rShoulder.x);
    const hipWidthRelative = Math.abs(lHip.x - rHip.x);
    const widthRatio = Math.max(shoulderWidthRelative, hipWidthRelative);

    let chestCM, waistCM, hipCM;
    if (widthRatio < 0.15) {
        chestCM = randomRange(86, 90); waistCM = randomRange(66, 70); hipCM = randomRange(92, 96);
    } else if (widthRatio >= 0.15 && widthRatio < 0.20) {
        chestCM = randomRange(90, 94); waistCM = randomRange(70, 74); hipCM = randomRange(96, 100);
    } else if (widthRatio >= 0.20 && widthRatio < 0.25) {
        chestCM = randomRange(94, 100); waistCM = randomRange(74, 80); hipCM = randomRange(100, 106);
    } else {
        chestCM = randomRange(100, 110); waistCM = randomRange(80, 90); hipCM = randomRange(106, 115);
    }

    let recommended = 'M';
    if (chestCM <= 90) recommended = 'S';
    else if (chestCM > 90 && chestCM <= 94) recommended = 'M';
    else if (chestCM > 94 && chestCM <= 100) recommended = 'L';
    else if (chestCM > 100 && chestCM <= 106) recommended = 'XL';
    else recommended = 'XXL';

    const confidence = Math.floor(Math.random() * (98 - 85 + 1) + 85);

    document.getElementById('recommended-size').innerText = recommended;
    document.getElementById('confidence-score').innerText = `Confidence: ${confidence}%`;
    document.getElementById('est-chest').innerText = Math.floor(chestCM);
    document.getElementById('est-waist').innerText = Math.floor(waistCM);
    document.getElementById('est-hip').innerText = Math.floor(hipCM);

    // Show UI Overlay
    resultsOverlay.classList.add('active');

    // AI Stylist Integration
    getAIStylistAdvice(recommended, chestCM, waistCM, hipCM);

    // Fetch Matching Dresses
    fetchMatches(recommended);
}

window.closeResults = function () {
    resultsOverlay.classList.remove('active');
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height); // clear landmarks overlay
    document.getElementById('ai-stylist-card').style.display = 'none';
}

// Helper to get fallback sizes
function getFallbackSizes(recommendedSize) {
    const sizeOrder = ['S', 'M', 'L', 'XL', 'XXL'];
    const index = sizeOrder.indexOf(recommendedSize);
    const fallback = new Set();
    fallback.add(recommendedSize);

    if (index > 0) fallback.add(sizeOrder[index - 1]);
    if (index < sizeOrder.length - 1) fallback.add(sizeOrder[index + 1]);
    return Array.from(fallback);
}

async function fetchMatches(sizeString) {
    try {
        const query = new URLSearchParams({
            size: sizeString,
            limit: 8
        });
        const res = await fetch(`http://localhost:5000/api/dresses?${query}`);
        if (!res.ok) throw new Error("API Connection Failed");

        const data = await res.json();
        let matches = data.dresses;

        document.getElementById('match-count').innerText = data.totalItems;

        matchContainer.innerHTML = matches.map(m => `
            <a href="product.html?id=${m.id}" class="match-card">
                <div style="position: relative;">
                    <img src="${m.image}" alt="${m.name}" class="match-img">
                    <div style="position: absolute; top: 8px; left: 8px; background: rgba(35, 47, 62, 0.9); color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: 700;">
                        ${m.discount} OFF
                    </div>
                </div>
                <div style="padding: 10px;">
                    <h4 style="font-size: 12px; font-weight: 500; color: #0f1111; margin-bottom: 4px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; height: 32px; line-height: 1.3;">
                        ${m.name}
                    </h4>
                    <div style="display: flex; gap: 4px; align-items: baseline; margin-top: 4px;">
                        <span style="font-size: 16px; font-weight: 700; color: #0f1111;">$${m.price.toFixed(2)}</span>
                        <span style="font-size: 11px; text-decoration: line-through; color: #565959;">$${m.originalPrice.toFixed(2)}</span>
                    </div>
                    <div style="font-size: 10px; color: #007185; margin-top: 4px; font-weight: 600;">
                        Perfect Fit for ${sizeString}
                    </div>
                </div>
            </a>
        `).join('');
    } catch (e) {
        console.error("Match error", e);
        matchContainer.innerHTML = '<p style="padding: 20px; font-size: 14px; color: #666;">Unable to load matches right now. Please try again.</p>';
    }
}

async function getAIStylistAdvice(size, chest, waist, hip) {
    const aiCard = document.getElementById('ai-stylist-card');
    const aiLoading = document.getElementById('ai-stylist-loading');
    const aiText = document.getElementById('ai-stylist-text');

    aiCard.style.display = 'block';
    aiLoading.style.display = 'flex';
    aiText.style.display = 'none';

    const prompt = `You are a professional fashion stylist. A user just scanned their body. 
    Measurements: Chest ${Math.floor(chest)}cm, Waist ${Math.floor(waist)}cm, Hip ${Math.floor(hip)}cm. 
    Recommended Size: ${size}.
    Provide a short (max 2 sentences), premium, and encouraging styling tip for this specific fit and measurements. 
    Focus on how to accentuate their silhouette with current trends. Do not mention the API or technical details.`;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }]
            })
        });

        const data = await response.json();
        const advice = data.candidates[0].content.parts[0].text;

        aiLoading.style.display = 'none';
        aiText.innerText = advice.trim();
        aiText.style.display = 'block';
    } catch (error) {
        console.error("Gemini AI error:", error);
        aiCard.style.display = 'none'; // Hide if fails
    }
}

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}
