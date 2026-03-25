import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'wealthwise-super-secret-key-2024')

    db_url = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:password@localhost/wealthwise_db')

    # Normalize mysql:// → mysql+pymysql://
    if db_url.startswith('mysql://'):
        db_url = db_url.replace('mysql://', 'mysql+pymysql://', 1)

    # Remove ?ssl-mode=REQUIRED if present (handled via connect_args instead)
    if '?ssl-mode=' in db_url:
        db_url = db_url.split('?')[0]
    if '?ssl_mode=' in db_url:
        db_url = db_url.split('?')[0]

    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Aiven requires SSL — this works for both Aiven and non-Aiven MySQL
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 280,
        'pool_pre_ping': True,
        'pool_size': 3,
        'max_overflow': 1,
        'connect_args': {
            'ssl': {
                'ssl_disabled': False
            }
        }
    }

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'wealthwise-jwt-secret-2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
