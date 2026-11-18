from django.contrib import admin

from .models import Lab, Question, Task


class TaskInline(admin.TabularInline):
    model = Task
    fields = ["order", "title"]
    show_change_link = True  # link to the full task page, where questions are edited
    extra = 0


class QuestionInline(admin.StackedInline):
    model = Question
    extra = 0


@admin.register(Lab)
class LabAdmin(admin.ModelAdmin):
    list_display = ["title", "vmid", "order"]
    inlines = [TaskInline]


@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ["title", "lab", "order"]
    list_filter = ["lab"]
    inlines = [QuestionInline]