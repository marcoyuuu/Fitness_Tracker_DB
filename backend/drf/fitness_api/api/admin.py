from django.contrib import admin
from . import models


@admin.register(models.User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "locale", "role", "created_at")
    search_fields = ("email", "name")


@admin.register(models.Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ("user", "date", "duration_min")
    list_filter = ("date",)


@admin.register(models.Goal)
class GoalAdmin(admin.ModelAdmin):
    list_display = ("user", "description", "due_date", "is_completed")
    list_filter = ("is_completed",)


@admin.register(models.Routine)
class RoutineAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(models.Exercise)
class ExerciseAdmin(admin.ModelAdmin):
    list_display = ("name", "sets", "reps", "weight")


@admin.register(models.Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ("name", "start_date", "end_date")


@admin.register(models.Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("session", "date", "text")


@admin.register(models.RoutineExercise)
class RoutineExerciseAdmin(admin.ModelAdmin):
    list_display = ("routine", "exercise")


@admin.register(models.ProgramRoutine)
class ProgramRoutineAdmin(admin.ModelAdmin):
    list_display = ("program", "routine")


@admin.register(models.SessionRoutine)
class SessionRoutineAdmin(admin.ModelAdmin):
    list_display = ("session", "routine")
