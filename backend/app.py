from flask import Flask, send_from_directory
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from database import db
from routes.auth import auth_bp
from routes.transactions import transactions_bp
from routes.analytics import analytics_bp
from routes.budgets import budgets_bp
from routes.categories import categories_bp
import os

def create_app():
    # Serve React build from ../frontend/build
    static_folder = os.path.join(os.path.dirname(__file__), '..', 'frontend', 'build')
    app = Flask(__name__, static_folder=static_folder, static_url_path='/')

    app.config.from_object(Config)

    CORS(app, resources={r"/api/*": {"origins": "*"}}, supports_credentials=True)
    db.init_app(app)
    JWTManager(app)

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(analytics_bp, url_prefix='/api/analytics')
    app.register_blueprint(budgets_bp, url_prefix='/api/budgets')
    app.register_blueprint(categories_bp, url_prefix='/api/categories')

    # Serve React for any non-API route (React Router support)
    @app.route('/', defaults={'path': ''})
    @app.route('/<path:path>')
    def serve_react(path):
        if path.startswith('api/'):
            return {'error': 'Not found'}, 404
        full_path = os.path.join(app.static_folder, path)
        if path and os.path.exists(full_path):
            return send_from_directory(app.static_folder, path)
        return send_from_directory(app.static_folder, 'index.html')

    # Initialize database safely — won't crash if DB is temporarily unreachable
    with app.app_context():
        try:
            db.create_all()
            from utils.seed import seed_categories
            seed_categories()
            print("✅ Database initialized successfully")
        except Exception as e:
            print(f"⚠️ Database init warning: {e}")
            print("App will continue — DB will retry on first request")

    return app

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app = create_app()
    app.run(host='0.0.0.0', port=port, debug=False)
