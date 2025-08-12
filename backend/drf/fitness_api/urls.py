from django.contrib import admin
from django.urls import path, include
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from django.http import JsonResponse
from django.shortcuts import redirect


def health(_):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    # Redirect root to API docs for convenience
    path("", lambda request: redirect("swagger-ui", permanent=False)),
    path("admin/", admin.site.urls),
    path("health/", health),
    path("api/", include("fitness_api.api.urls")),
    path("api/schema/", SpectacularAPIView.as_view(), name="schema"),
    path(
        "api/docs/",
        SpectacularSwaggerView.as_view(url_name="schema"),
        name="swagger-ui",
    ),
]
