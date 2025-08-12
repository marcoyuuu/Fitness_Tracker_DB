from rest_framework import serializers, views, status
from rest_framework.response import Response
from drf_spectacular.utils import extend_schema, OpenApiResponse

from .models import User
from .jwt_auth import generate_tokens, decode_token


# Serializers and Views
class RegisterSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(min_length=6, write_only=True)
    name = serializers.CharField(max_length=100, required=False, allow_blank=True)
    locale = serializers.CharField(max_length=2, required=False)


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class RefreshSerializer(serializers.Serializer):
    refresh = serializers.CharField()


class PublicUserLiteSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    email = serializers.EmailField()
    name = serializers.CharField(allow_blank=True, required=False)


class TokensSerializer(serializers.Serializer):
    access = serializers.CharField()
    refresh = serializers.CharField()
    token_type = serializers.CharField()
    expires_in = serializers.IntegerField()


class RegisterResponseSerializer(TokensSerializer):
    user = PublicUserLiteSerializer()


class RegisterView(views.APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(
        tags=["Auth"],
        request=RegisterSerializer,
        responses={201: RegisterResponseSerializer, 400: OpenApiResponse(description="Email already registered")},
        auth=[],
    )
    def post(self, request):
        ser = RegisterSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        if User.objects.filter(email=ser.validated_data["email"]).exists():
            return Response({"detail": "Email already registered"}, status=status.HTTP_400_BAD_REQUEST)
        user = User(email=ser.validated_data["email"], name=ser.validated_data.get("name"))
        if locale := ser.validated_data.get("locale"):
            user.locale = locale
        user.set_password(ser.validated_data["password"])
        user.save()
        tokens = generate_tokens(user)
        return Response({"user": {"id": str(user.id), "email": user.email, "name": user.name}, **tokens}, status=status.HTTP_201_CREATED)


class LoginView(views.APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(
        tags=["Auth"],
        request=LoginSerializer,
        responses={200: TokensSerializer, 400: OpenApiResponse(description="Invalid credentials")},
        auth=[],
    )
    def post(self, request):
        ser = LoginSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        try:
            user = User.objects.get(email=ser.validated_data["email"])
        except User.DoesNotExist:
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        if not user.check_password(ser.validated_data["password"]):
            return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
        tokens = generate_tokens(user)
        return Response(tokens)


class RefreshView(views.APIView):
    authentication_classes: list = []
    permission_classes: list = []

    @extend_schema(
        tags=["Auth"],
        request=RefreshSerializer,
        responses={200: TokensSerializer, 400: OpenApiResponse(description="Invalid token or user")},
        auth=[],
    )
    def post(self, request):
        ser = RefreshSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        payload = decode_token(ser.validated_data["refresh"])
        if payload.get("type") != "refresh":
            return Response({"detail": "Invalid token type"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            user = User.objects.get(id=payload["sub"])
        except User.DoesNotExist:
            return Response({"detail": "User not found"}, status=status.HTTP_400_BAD_REQUEST)
        tokens = generate_tokens(user)
        return Response(tokens)
