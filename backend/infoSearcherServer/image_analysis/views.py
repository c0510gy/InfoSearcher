import json

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .apis import YOLOV3_MODEL, COCO_LABELS, detect, readb64


class ImageAnalysisView(APIView):
    def get(self, request):
        data = json.loads(request.body)

        image = readb64(data['image'])

        detected = detect(YOLOV3_MODEL, image)
        
        detected_names = [COCO_LABELS[i[0]] for i in detected]

        return Response({
                  'detected': detected_names
              }, status=status.HTTP_200_OK)
