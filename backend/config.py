import os
from dotenv import load_dotenv

load_dotenv()

basedir = os.path.abspath(os.path.dirname(__file__))

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'mirrorverse-elite-secret'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'sqlite:///' + os.path.join(basedir, 'instance', 'mirrorverse.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY", "AIzaSyCJESz0_BYUgQKeIzfJg10TafXEIEl058g")
