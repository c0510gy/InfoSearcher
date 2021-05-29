import json

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .apis import YOLOV3_MODEL, detect


class ImageAnalysisView(APIView):
    def get(self, request):
        data = json.loads(request.body)

        image = data['image']

        detected = detect(YOLOV3_MODEL, image)

        return Response({
                  'detected': detected
              }, status=status.HTTP_200_OK)