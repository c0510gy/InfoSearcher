import json

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
import kss

from .apis import search_in_naver, get_keywords


class TextAnalysisView(APIView):
    def post(self, request):
        data = json.loads(request.body)

        # 키워드 추출
        sentences = kss.split_sentences(data['content'])
        keywords = get_keywords(data['title'], sentences, 8)
        if len(keywords) == 0:
            return Response({
                'message': 'Content is too short.'
            }, status=status.HTTP_400_BAD_REQUEST)

        # 네이버 API 호출
        query = ' '.join([keyword.replace('_', '') for keyword in keywords])
        rescode, result = search_in_naver(query, 'blog')
        if rescode != 200:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)

        ret = {'keyword': keywords, 'result': result['items'][:5]}
        return Response(ret, status=status.HTTP_200_OK)