import json

from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .apis import search_in_naver


class TextAnalysisView(APIView):
    def post(self, request):
        data = json.loads(request.body)

        print(data)

        # 키워드 추출
        test_word_list = ['언어_모델', '자연어_처리', '형태소_분석', '말뭉치_구축', '언어', '기술', '모델']
        test_word_list = [i.replace('_', '') for i in test_word_list]
        test_word_list = ' '.join(test_word_list)

        # 네이버 API 호출
        rescode, result = search_in_naver(test_word_list, 'blog')

        # 키워드를 추출하고, 네이버에 검색한 다음에, 결과에서 몇개 뽑아서 링크 제공
        if rescode != 200:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        return Response(result, status=status.HTTP_200_OK)