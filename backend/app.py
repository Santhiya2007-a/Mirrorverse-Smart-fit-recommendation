from flask import Flask
from flask_cors import CORS
from backend.config import Config
from backend.models import db
from backend.routes.products import products_bp
from backend.routes.users import users_bp
from backend.routes.scan import scan_bp
from backend.routes.recommendations import recommendations_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    CORS(app)
    db.init_app(app)
    
    # Register blueprints with proper prefixes
    app.register_blueprint(products_bp, url_prefix='/api')
    app.register_blueprint(users_bp, url_prefix='/api')
    app.register_blueprint(scan_bp, url_prefix='/api')
    app.register_blueprint(recommendations_bp, url_prefix='/api')
    
    with app.app_context():
        db.create_all()
        
    return app

app = create_app()

if __name__ == '__main__':
    app.run(debug=True, port=5000)
