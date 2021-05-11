from django.urls import path
from .views import TextAnalysisView


urlpatterns = [
    path('', TextAnalysisView.as_view()),
]