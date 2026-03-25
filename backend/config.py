import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY', 'wealthwise-super-secret-key-2024')

    # DATABASE_URL will be set in Render environment variables
    # Format: mysql+pymysql://username:password@host:port/dbname
    db_url = os.environ.get('DATABASE_URL', 'mysql+pymysql://root:password@localhost/wealthwise_db')

    # Normalize mysql:// → mysql+pymysql://
    if db_url.startswith('mysql://'):
        db_url = db_url.replace('mysql://', 'mysql+pymysql://', 1)

    SQLALCHEMY_DATABASE_URI = db_url
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_recycle': 280,       # recycle connections before MySQL's 5-min timeout
        'pool_pre_ping': True,     # test connection before using it
        'pool_size': 3,
        'max_overflow': 1,
    }

    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'wealthwise-jwt-secret-2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
