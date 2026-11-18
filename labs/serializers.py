from rest_framework import serializers

from .models import Lab, Question, Task


class LabListSerializer(serializers.ModelSerializer):
    """Just enough to draw the Labs sidebar."""

    task_count = serializers.IntegerField(read_only=True)  # added by .annotate() in the view

    class Meta:
        model = Lab
        fields = ["id", "title", "icon", "task_count"]


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = ["id", "kind", "label", "options"]


class TaskSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Task
        fields = ["id", "title", "instructions", "questions"]


class LabDetailSerializer(serializers.ModelSerializer):
    """Everything about one lab, loaded when the student clicks it."""

    tasks = TaskSerializer(many=True, read_only=True)

    class Meta:
        model = Lab
        fields = ["id", "title", "description", "vmid", "tasks"]