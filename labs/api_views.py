from django.db.models import Count
from rest_framework import generics

from .models import Lab
from .serializers import LabDetailSerializer, LabListSerializer


class LabListAPIView(generics.ListAPIView):
    """GET /api/labs/ -> the list of labs for the sidebar."""

    serializer_class = LabListSerializer
    queryset = Lab.objects.annotate(task_count=Count("tasks"))


class LabDetailAPIView(generics.RetrieveAPIView):
    """GET /api/labs/<id>/ -> one lab with its tasks and questions."""

    serializer_class = LabDetailSerializer
    queryset = Lab.objects.prefetch_related("tasks__questions")