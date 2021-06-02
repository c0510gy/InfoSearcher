from django.urls import path
from .views import AudioAnalysisView


urlpatterns = [
    path('', AudioAnalysisView.as_view()),
]