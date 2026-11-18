from django.db import models


class Lab(models.Model):
    title = models.CharField(max_length=100)
    icon = models.CharField(max_length=50, default="bi-terminal")  # a Bootstrap Icons class
    description = models.TextField(blank=True)
    vmid = models.PositiveIntegerField(help_text="Proxmox VM id this lab runs on")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Task(models.Model):
    lab = models.ForeignKey(Lab, on_delete=models.CASCADE, related_name="tasks")
    title = models.CharField(max_length=200)
    instructions = models.TextField(help_text="HTML is allowed")
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.title


class Question(models.Model):
    KIND_CHOICES = [("text", "Short answer"), ("textarea", "Long answer"), ("radio", "Multiple choice")]

    task = models.ForeignKey(Task, on_delete=models.CASCADE, related_name="questions")
    kind = models.CharField(max_length=10, choices=KIND_CHOICES, default="text")
    label = models.CharField(max_length=300, help_text="HTML is allowed")
    options = models.JSONField(default=list, blank=True, help_text='Multiple choice only, e.g. ["-a", "-l"]')
    order = models.PositiveIntegerField(default=0)

    class Meta:
        ordering = ["order", "id"]

    def __str__(self):
        return self.label