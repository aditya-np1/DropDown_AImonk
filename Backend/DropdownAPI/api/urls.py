from django.urls import path
from .views import TreeView

urlpatterns = [
    path('GetTree', TreeView.as_view(), name='get-tree'),
    path('SaveTree', TreeView.as_view(), name='save-tree'),
]
