from django.urls import path
from .views import ImageAnalysisView


urlpatterns = [
    path('', ImageAnalysisView.as_view()),
]