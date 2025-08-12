import uuid
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('email', models.EmailField(max_length=254, unique=True)),
                ('password_hash', models.CharField(max_length=255)),
                ('name', models.CharField(max_length=100, null=True, blank=True)),
                ('locale', models.CharField(max_length=2, default='es')),
                ('role', models.CharField(max_length=16, default='user')),
            ],
        ),
        migrations.CreateModel(
            name='Routine',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Exercise',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(null=True, blank=True)),
                ('sets', models.IntegerField(null=True, blank=True)),
                ('reps', models.IntegerField(null=True, blank=True)),
                ('weight', models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)),
                ('equipment', models.CharField(max_length=255, null=True, blank=True)),
                ('duration', models.TimeField(null=True, blank=True)),
                ('distance', models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)),
                ('stretch_type', models.CharField(max_length=255, null=True, blank=True)),
                ('is_strength', models.BooleanField(null=True, blank=True)),
                ('is_cardio', models.BooleanField(null=True, blank=True)),
                ('is_core', models.BooleanField(null=True, blank=True)),
                ('is_plyo', models.BooleanField(null=True, blank=True)),
                ('is_flexibility', models.BooleanField(null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Program',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ('name', models.CharField(max_length=255)),
                ('description', models.TextField(null=True, blank=True)),
                ('start_date', models.DateField()),
                ('end_date', models.DateField(null=True, blank=True)),
            ],
        ),
        migrations.CreateModel(
            name='Session',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('date', models.DateField()),
                ('duration_min', models.IntegerField()),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sessions', to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='Goal',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('description', models.TextField()),
                ('due_date', models.DateField(null=True, blank=True)),
                ('is_completed', models.BooleanField(default=False)),
                ('completed_at', models.DateTimeField(null=True, blank=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='goals', to='api.user')),
            ],
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False, serialize=False)),
                ('text', models.TextField()),
                ('date', models.DateField()),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='comments', to='api.session')),
            ],
        ),
        migrations.CreateModel(
            name='RoutineExercise',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('routine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.routine')),
                ('exercise', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.exercise')),
            ],
        ),
        migrations.CreateModel(
            name='ProgramRoutine',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('program', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.program')),
                ('routine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.routine')),
            ],
        ),
        migrations.CreateModel(
            name='SessionRoutine',
            fields=[
                ('id', models.BigAutoField(primary_key=True, serialize=False)),
                ('session', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.session')),
                ('routine', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.routine')),
            ],
        ),
        migrations.AlterUniqueTogether(
            name='routineexercise',
            unique_together={("routine", "exercise")},
        ),
        migrations.AlterUniqueTogether(
            name='programroutine',
            unique_together={("program", "routine")},
        ),
        migrations.AlterUniqueTogether(
            name='sessionroutine',
            unique_together={("session", "routine")},
        ),
    ]
