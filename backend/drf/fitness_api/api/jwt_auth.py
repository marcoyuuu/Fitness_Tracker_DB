import datetime as dt
from typing import Optional, Tuple

import jwt
from django.conf import settings
from django.utils import timezone
from rest_framework import authentication, exceptions

from .models import User


def _now() -> dt.datetime:
    return timezone.now()


def _encode(payload: dict, ttl_min: int) -> str:
    exp = _now() + dt.timedelta(minutes=ttl_min)
    to_encode = {**payload, "exp": exp}
    token = jwt.encode(to_encode, settings.JWT_SECRET, algorithm=settings.JWT_ALGORITHM)
    return token


def generate_tokens(user: User) -> dict:
    base = {"sub": str(user.id), "email": user.email, "role": user.role}
    return {
        "access": _encode({**base, "type": "access"}, settings.JWT_ACCESS_TTL_MIN),
        "refresh": _encode({**base, "type": "refresh"}, settings.JWT_REFRESH_TTL_MIN),
        "token_type": "bearer",
        "expires_in": settings.JWT_ACCESS_TTL_MIN * 60,
    }


def decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, settings.JWT_SECRET, algorithms=[settings.JWT_ALGORITHM])
    except jwt.ExpiredSignatureError as e:
        raise exceptions.AuthenticationFailed("Token expired") from e
    except jwt.InvalidTokenError as e:
        raise exceptions.AuthenticationFailed("Invalid token") from e


class JWTAuthentication(authentication.BaseAuthentication):
    keyword = "Bearer"

    def authenticate(self, request) -> Optional[Tuple[User, None]]:
        auth = authentication.get_authorization_header(request).split()
        if not auth or auth[0].lower() != self.keyword.lower().encode():
            return None
        if len(auth) == 1:
            raise exceptions.AuthenticationFailed("Invalid Authorization header")
        token = auth[1].decode()
        payload = decode_token(token)
        if payload.get("type") != "access":
            raise exceptions.AuthenticationFailed("Invalid token type")
        try:
            user = User.objects.get(id=payload["sub"])
        except User.DoesNotExist:
            raise exceptions.AuthenticationFailed("User not found")
        return (user, None)
