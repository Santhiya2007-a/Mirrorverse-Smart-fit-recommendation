import subprocess
import os
import webbrowser
import time
import sys

def run_app():
    base_dir = os.path.dirname(os.path.abspath(__file__))
    frontend_dir = os.path.join(base_dir, 'frontend')

    print("🚀 MIRRORVERSE – SMART FIT RECOMMENDATION (Amazon-Style AI)")

    # 1. Start Backend (Flask) from root
    print("📡 Starting Flask API on http://localhost:5000...")
    backend_env = os.environ.copy()
    # Add project root to PYTHONPATH so local imports work correctly
    backend_env["PYTHONPATH"] = base_dir
    backend_env["FLASK_APP"] = "backend.app"
    
    # Starting from the root directory ensures 'from backend.models' is valid
    backend_process = subprocess.Popen([sys.executable, '-m', 'flask', 'run', '--port=5000'], cwd=base_dir, env=backend_env)

    # 2. Wait a moment for server to initialize
    time.sleep(3)

    # 3. Start Frontend (Python HTTP Server)
    frontend_port = 3000
    print(f"🎨 Starting Personalization Server on http://localhost:{frontend_port}...")
    try:
        frontend_process = subprocess.Popen([sys.executable, '-m', 'http.server', str(frontend_port)], cwd=frontend_dir)
    except Exception as e:
        print(f"Error starting frontend server: {e}")
        backend_process.terminate()
        return

    # 4. Open in browser
    print(f"📱 Opening Mirrorverse Home Page...")
    webbrowser.open(f'http://localhost:{frontend_port}/index.html')

    print("\n✅ Mirrorverse ELITE MVP is LIVE!")
    print(f"Backend API (Health Check): http://localhost:5000/api/products")
    print("\nKeep this terminal open. Press Ctrl+C to stop both servers.")

    try:
        backend_process.wait()
    except KeyboardInterrupt:
        print("\n🛑 Shutting down Mirrorverse...")
        backend_process.terminate()
        frontend_process.terminate()

if __name__ == "__main__":
    run_app()
