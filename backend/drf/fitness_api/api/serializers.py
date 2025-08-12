from rest_framework import serializers
from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ["id", "email", "name", "locale", "role", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at", "role"]


class UserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ["name", "locale"]


class SessionSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="user.id", read_only=True)

    class Meta:
        model = models.Session
        fields = ["id", "user_id", "date", "duration_min", "created_at", "updated_at"]
        read_only_fields = ["id", "created_at", "updated_at", "user_id"]


class SessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Session
        fields = ["date", "duration_min"]


class GoalSerializer(serializers.ModelSerializer):
    user_id = serializers.UUIDField(source="user.id", read_only=True)

    class Meta:
        model = models.Goal
        fields = [
            "id",
            "user_id",
            "description",
            "due_date",
            "is_completed",
            "completed_at",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at", "user_id"]


class GoalCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Goal
        fields = ["description", "due_date"]


class RoutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Routine
        fields = ["id", "name", "description"]


class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Exercise
        fields = [
            "id",
            "name",
            "description",
            "sets",
            "reps",
            "weight",
            "equipment",
            "duration",
            "distance",
            "stretch_type",
            "is_strength",
            "is_cardio",
            "is_core",
            "is_plyo",
            "is_flexibility",
        ]


class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Program
        fields = ["id", "name", "description", "start_date", "end_date"]


class CommentSerializer(serializers.ModelSerializer):
    session_id = serializers.UUIDField(source="session.id", read_only=True)

    class Meta:
        model = models.Comment
        fields = ["id", "session_id", "text", "date"]


class RoutineExerciseLinkSerializer(serializers.Serializer):
    exercise_id = serializers.UUIDField()


class ProgramRoutineLinkSerializer(serializers.Serializer):
    routine_id = serializers.UUIDField()


class SessionRoutineLinkSerializer(serializers.Serializer):
    routine_id = serializers.UUIDField()
