from rest_framework import viewsets, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from drf_spectacular.utils import extend_schema

from . import models, serializers


class SessionViewSet(viewsets.ModelViewSet):
    queryset = models.Session.objects.select_related("user").all().order_by("-date")
    serializer_class = serializers.SessionSerializer

    def get_serializer_class(self):
        if self.action in ["create"]:
            return serializers.SessionCreateSerializer
        return super().get_serializer_class()

    def perform_create(self, serializer):
        # Associate session to the authenticated user
        user = self.request.user
        if not isinstance(user, models.User):
            return super().perform_create(serializer)  # fallback (e.g., tests without auth)
        models.Session.objects.create(user=user, **serializer.validated_data)

    @action(detail=True, methods=["get", "post"], url_path="comments")
    def comments(self, request, pk=None):
        session = self.get_object()
        if request.method == "GET":
            ser = serializers.CommentSerializer(session.comments.all(), many=True)
            return Response(ser.data)
        ser = serializers.CommentSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        comment = models.Comment.objects.create(session=session, **ser.validated_data)
        return Response(serializers.CommentSerializer(comment).data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["get", "post"], url_path="routines")
    def routines(self, request, pk=None):
        session = self.get_object()
        if request.method == "GET":
            routines = models.Routine.objects.filter(sessionroutine__session=session)
            return Response(serializers.RoutineSerializer(routines, many=True).data)
        link_ser = serializers.SessionRoutineLinkSerializer(data=request.data)
        link_ser.is_valid(raise_exception=True)
        routine = get_object_or_404(models.Routine, id=link_ser.validated_data["routine_id"])
        models.SessionRoutine.objects.get_or_create(session=session, routine=routine)
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentViewSet(mixins.RetrieveModelMixin, mixins.UpdateModelMixin, mixins.DestroyModelMixin, viewsets.GenericViewSet):
    queryset = models.Comment.objects.all()
    serializer_class = serializers.CommentSerializer


class GoalViewSet(mixins.ListModelMixin, mixins.CreateModelMixin, mixins.UpdateModelMixin, viewsets.GenericViewSet):
    queryset = models.Goal.objects.select_related("user").all().order_by("-created_at")
    serializer_class = serializers.GoalSerializer

    def create(self, request, *args, **kwargs):
        ser = serializers.GoalCreateSerializer(data=request.data)
        ser.is_valid(raise_exception=True)
        user = request.user if isinstance(request.user, models.User) else models.User.objects.first()
        goal = models.Goal.objects.create(user=user, **ser.validated_data)
        return Response(self.get_serializer(goal).data, status=status.HTTP_201_CREATED)


class RoutineViewSet(viewsets.ModelViewSet):
    queryset = models.Routine.objects.all().order_by("name")
    serializer_class = serializers.RoutineSerializer

    @action(detail=True, methods=["get", "post"], url_path="exercises")
    def exercises(self, request, pk=None):
        routine = self.get_object()
        if request.method == "GET":
            qs = models.Exercise.objects.filter(routineexercise__routine=routine)
            return Response(serializers.ExerciseSerializer(qs, many=True).data)
        link_ser = serializers.RoutineExerciseLinkSerializer(data=request.data)
        link_ser.is_valid(raise_exception=True)
        ex = get_object_or_404(models.Exercise, id=link_ser.validated_data["exercise_id"])
        models.RoutineExercise.objects.get_or_create(routine=routine, exercise=ex)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = models.Exercise.objects.all().order_by("name")
    serializer_class = serializers.ExerciseSerializer


class ProgramViewSet(viewsets.ModelViewSet):
    queryset = models.Program.objects.all().order_by("-start_date")
    serializer_class = serializers.ProgramSerializer

    @action(detail=True, methods=["get", "post"], url_path="routines")
    def routines(self, request, pk=None):
        program = self.get_object()
        if request.method == "GET":
            qs = models.Routine.objects.filter(programroutine__program=program)
            return Response(serializers.RoutineSerializer(qs, many=True).data)
        link_ser = serializers.ProgramRoutineLinkSerializer(data=request.data)
        link_ser.is_valid(raise_exception=True)
        rt = get_object_or_404(models.Routine, id=link_ser.validated_data["routine_id"])
        models.ProgramRoutine.objects.get_or_create(program=program, routine=rt)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UsersMeView(APIView):
    permission_classes = [IsAuthenticated]

    @extend_schema(responses=serializers.UserSerializer)
    def get(self, request):
        return Response(serializers.UserSerializer(request.user).data)

    @extend_schema(request=serializers.UserUpdateSerializer, responses=serializers.UserSerializer)
    def patch(self, request):
        ser = serializers.UserUpdateSerializer(instance=request.user, data=request.data, partial=True)
        ser.is_valid(raise_exception=True)
        ser.save()
        return Response(serializers.UserSerializer(request.user).data)
