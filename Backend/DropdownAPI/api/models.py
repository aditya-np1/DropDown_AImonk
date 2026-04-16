from django.db import models

class TreeHierarchy(models.Model):
    name = models.CharField(max_length=255)
    data = models.JSONField() # Stores the nested tree structure
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
