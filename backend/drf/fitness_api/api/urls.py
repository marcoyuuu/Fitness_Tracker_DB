from rest_framework.routers import DefaultRouter
from django.urls import path, include
from . import views
from .auth import RegisterView, LoginView, RefreshView
from .views import UsersMeView

router = DefaultRouter()
router.register(r"sessions", views.SessionViewSet, basename="session")
router.register(r"comments", views.CommentViewSet, basename="comment")
router.register(r"goals", views.GoalViewSet, basename="goal")
router.register(r"routines", views.RoutineViewSet, basename="routine")
router.register(r"exercises", views.ExerciseViewSet, basename="exercise")
router.register(r"programs", views.ProgramViewSet, basename="program")

urlpatterns = [
    path("", include(router.urls)),
    path("auth/register", RegisterView.as_view(), name="auth-register"),
    path("auth/login", LoginView.as_view(), name="auth-login"),
    path("auth/refresh", RefreshView.as_view(), name="auth-refresh"),
    path("users/me", UsersMeView.as_view(), name="users-me"),
]
