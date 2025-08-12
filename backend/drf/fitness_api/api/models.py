import uuid
from django.db import models
from django.contrib.auth.hashers import make_password, check_password


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class User(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    email = models.EmailField(unique=True)
    password_hash = models.CharField(max_length=255)
    name = models.CharField(max_length=100, null=True, blank=True)
    locale = models.CharField(max_length=2, default="es")
    role = models.CharField(max_length=16, default="user")

    def __str__(self) -> str:  # pragma: no cover
        return self.email

    # Minimal helpers for auth compatibility
    def set_password(self, raw_password: str) -> None:
        self.password_hash = make_password(raw_password)

    def check_password(self, raw_password: str) -> bool:
        return check_password(raw_password, self.password_hash)

    # Django auth compatibility fields/properties (not using AbstractUser)
    @property
    def is_authenticated(self) -> bool:  # pragma: no cover - DRF expects attribute
        return True

    @property
    def is_anonymous(self) -> bool:  # pragma: no cover
        return False


class Routine(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class Exercise(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    sets = models.IntegerField(null=True, blank=True)
    reps = models.IntegerField(null=True, blank=True)
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    equipment = models.CharField(max_length=255, null=True, blank=True)
    duration = models.TimeField(null=True, blank=True)
    distance = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stretch_type = models.CharField(max_length=255, null=True, blank=True)
    is_strength = models.BooleanField(null=True, blank=True)
    is_cardio = models.BooleanField(null=True, blank=True)
    is_core = models.BooleanField(null=True, blank=True)
    is_plyo = models.BooleanField(null=True, blank=True)
    is_flexibility = models.BooleanField(null=True, blank=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class Program(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)

    def __str__(self) -> str:  # pragma: no cover
        return self.name


class Session(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sessions")
    date = models.DateField()
    duration_min = models.IntegerField()

    def __str__(self) -> str:  # pragma: no cover
        return f"{self.user.email} @ {self.date}"


class Goal(TimeStampedModel):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="goals")
    description = models.TextField()
    due_date = models.DateField(null=True, blank=True)
    is_completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)


class Comment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name="comments")
    text = models.TextField()
    date = models.DateField()


class RoutineExercise(models.Model):
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("routine", "exercise")


class ProgramRoutine(models.Model):
    program = models.ForeignKey(Program, on_delete=models.CASCADE)
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("program", "routine")


class SessionRoutine(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE)
    routine = models.ForeignKey(Routine, on_delete=models.CASCADE)

    class Meta:
        unique_together = ("session", "routine")
