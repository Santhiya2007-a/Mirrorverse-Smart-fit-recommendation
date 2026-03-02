import Component from '../base/Component.js';
import { apiService } from '../services/apiService.js';
import { store } from '../store.js';

export default class SmartFit extends Component {
    constructor(containerId, props = {}) {
        super(containerId, props);
        this.state = {
            scanning: false,
            result: null,
            videoReady: false
        };
    }

    async afterRender() {
        this.setupCamera();
        this.setupEventListeners();
    }

    async setupCamera() {
        const video = document.getElementById('scan-video');
        if (!video) return;

        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Optimizing for full-body capture on both desktop and mobile
        const constraints = {
            video: {
                width: { ideal: 1080 },
                height: { ideal: 1920 },
                aspectRatio: isMobile ? 9 / 16 : 16 / 9,
                facingMode: "user"
            }
        };

        try {
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            video.srcObject = stream;
            video.onloadedmetadata = () => {
                this.setState({ videoReady: true });
            };
        } catch (err) {
            console.error("Camera error:", err);
            // Fallback for laptops with lower res webcams
            try {
                const fallbackStream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = fallbackStream;
            } catch (fallbackErr) {
                alert("Please enable camera access for the AI Smart Scan to work.");
            }
        }
    }

    setupEventListeners() {
        const scanBtn = document.getElementById('start-scan-btn');
        if (scanBtn) {
            scanBtn.onclick = () => this.handleScan();
        }
    }

    async handleScan() {
        this.setState({ scanning: true });

        // Simulating MediaPipe analysis for now
        // In reality, we'd use MediaPipe Pose here manually
        setTimeout(async () => {
            const mockMeasurements = {
                chest: Math.floor(Math.random() * (110 - 85) + 85),
                waist: Math.floor(Math.random() * (90 - 65) + 65),
                hip: Math.floor(Math.random() * (115 - 90) + 90)
            };

            const result = await apiService.processScan(mockMeasurements);
            store.setDetectedSize(result.recommendedSize);
            this.setState({ result, scanning: false });
        }, 2000);
    }

    template() {
        return `
            <div class="smart-fit-container fade-in">
                <header class="scan-header">
                    <h1>AI Smart Body Scan</h1>
                    <p>Powered by Mirrorverse Vision™</p>
                </header>
                
                <div class="scan-area ${this.state.scanning ? 'scanning-active' : ''}">
                    <video id="scan-video" autoplay playsinline muted></video>
                    ${this.state.scanning ? `
                        <div class="scan-hud">
                            <div class="hud-line"></div>
                            <div class="hud-target"></div>
                            <div class="hud-scanner"></div>
                            <div class="hud-text">ANALYZING BODY PROPORTIONS...</div>
                        </div>
                    ` : ''}
                    ${!this.state.scanning && !this.state.result ? `
                        <div class="scan-guide">
                            <i class="fas fa-expand-arrows-alt"></i>
                            <p>Fit your whole body in the frame</p>
                        </div>
                    ` : ''}
                </div>

                <div class="controls">
                    <button id="start-scan-btn" class="btn btn-primary start-btn ${this.state.scanning ? 'btn-scanning' : ''}" ${!this.state.videoReady || this.state.scanning ? 'disabled' : ''}>
                        ${this.state.scanning ? '<i class="fas fa-spinner fa-spin"></i> Processing...' : 'START CINEMATIC SCAN'}
                    </button>
                </div>

                ${this.state.result ? `
                    <div class="scan-result-card slide-up">
                        <div class="result-header">
                            <i class="fas fa-check-circle"></i>
                            <h3>Perfect Size Detected: <span class="highlight">${this.state.result.recommendedSize}</span></h3>
                        </div>
                        <p class="advice">${this.state.result.advice}</p>
                        <div class="measurements">
                            <div class="m-box">
                                <span class="m-val">${this.state.result.measurements.chest}</span>
                                <span class="m-lbl">Chest</span>
                            </div>
                            <div class="m-box">
                                <span class="m-val">${this.state.result.measurements.waist}</span>
                                <span class="m-lbl">Waist</span>
                            </div>
                            <div class="m-box">
                                <span class="m-val">${this.state.result.measurements.hip}</span>
                                <span class="m-lbl">Hip</span>
                            </div>
                        </div>
                        <a href="/shop?size=${this.state.result.recommendedSize}&scan=success" class="btn btn-primary btn-cta" data-link>VIEW MY PERFECT DRESSES</a>
                    </div>
                ` : ''}
            </div>
        `;
    }

    render() {
        super.render();
        // Since we re-render, we need to re-setup camera if result changes or scanning starts
        if (this.state.videoReady && !this.state.result) {
            this.setupCamera();
        }
    }
}
