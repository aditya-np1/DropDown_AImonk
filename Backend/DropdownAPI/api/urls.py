from django.urls import path
from .views import TreeView

urlpatterns = [
    path('GetTrees', TreeView.as_view(), name='get-trees'),
    path('SaveTree', TreeView.as_view(), name='save-tree'),
    path('UpdateTree/<int:pk>', TreeView.as_view(), name='update-tree'),
]
