import json

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .apis import search_in_naver, get_keywords


class TextAnalysisView(APIView):
    def post(self, request):
        data = json.loads(request.body)

        print(data)

        # 키워드 추출
        keywords = get_keywords(data['content'])
        if len(keywords) == 0:
            return Response({
                'message': 'Content is too short.'
            }, status=status.HTTP_400_BAD_REQUEST)

        keywords = ' '.join([keyword.replace('_', '') for keyword in keywords])

        # 네이버 API 호출
        rescode, result = search_in_naver(keywords, 'blog')

        # 키워드를 추출하고, 네이버에 검색한 다음에, 결과에서 몇개 뽑아서 링크 제공
        if rescode != 200:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)