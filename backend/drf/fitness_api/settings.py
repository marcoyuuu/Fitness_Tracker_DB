import os
import environ
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

env = environ.Env(
    DEBUG=(bool, False),
)

env.read_env(env_file=os.path.join(BASE_DIR, ".env"))

SECRET_KEY = env("SECRET_KEY", default="dev-secret")
DEBUG = env("DEBUG")
ALLOWED_HOSTS = env.list("ALLOWED_HOSTS", default=["*"])

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "drf_spectacular",
    "fitness_api.api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "fitness_api.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "fitness_api.wsgi.application"

DB_ENGINE = env("DB_ENGINE", default="sqlite")  # sqlite or mssql
if DB_ENGINE == "sqlite":
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": os.path.join(BASE_DIR, "db.sqlite3"),
        }
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "mssql",
            "NAME": env("DB_NAME", default="fitness_modern"),
            "USER": env("DB_USER", default="sa"),
            "PASSWORD": env("DB_PASSWORD", default="YourStrong!Passw0rd"),
            "HOST": env("DB_HOST", default="localhost"),
            "PORT": env("DB_PORT", default="1433"),
            "OPTIONS": {
                "driver": env("ODBC_DRIVER", default="ODBC Driver 18 for SQL Server"),
                "trustServerCertificate": env.bool("DB_TRUST_CERT", default=True),
            },
        }
    }

LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
    "fitness_api.api.jwt_auth.JWTAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticatedOrReadOnly",
    ],
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Fitness Tracker API",
    "DESCRIPTION": "Auto-generated schema; align with docs/openapi/openapi-v1.yaml",
    "VERSION": "1.0.0",
}

# JWT settings
JWT_SECRET = env("JWT_SECRET", default=SECRET_KEY)
JWT_ALGORITHM = env("JWT_ALGORITHM", default="HS256")
JWT_ACCESS_TTL_MIN = env.int("JWT_ACCESS_TTL_MIN", default=60)
JWT_REFRESH_TTL_MIN = env.int("JWT_REFRESH_TTL_MIN", default=60 * 24 * 7)

# CORS (for local frontend dev)
CORS_ALLOW_ALL_ORIGINS = env.bool("CORS_ALLOW_ALL_ORIGINS", default=True)
