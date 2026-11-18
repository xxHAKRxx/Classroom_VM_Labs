from django.core.management.base import BaseCommand

from labs.models import Lab
from labs.sample_data import LABS


class Command(BaseCommand):
    help = "Copy the hard-coded labs in labs/sample_data.py into the database."

    def handle(self, *args, **options):
        Lab.objects.all().delete()  # start fresh, so running it twice doesn't duplicate
        for lab_order, lab_data in enumerate(LABS):
            lab = Lab.objects.create(
                title=lab_data["title"],
                icon=lab_data["icon"],
                description=lab_data["description"],
                vmid=lab_data["vmid"],
                order=lab_order,
            )
            for task_order, task_data in enumerate(lab_data["tasks"]):
                task = lab.tasks.create(
                    title=task_data["title"],
                    instructions=task_data["instructions"],
                    order=task_order,
                )
                for q_order, q in enumerate(task_data["questions"]):
                    task.questions.create(
                        kind=q["type"],
                        label=q["label"],
                        options=q.get("options", []),
                        order=q_order,
                    )
        self.stdout.write(self.style.SUCCESS(f"Loaded {len(LABS)} labs."))