from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response

from .apis import stringToBytes, stt, getMelspectrogram, musicSearch, search_in_naver

class AudioAnalysisView(APIView):
    def post(self, request):
        data = request.data['buffer']
        
        buffer = stringToBytes(data)
        resultStt = stt(buffer)
        print('STT 결과:', resultStt)
        if len(resultStt.replace(' ', '')) != 0:
            rescode, resultSearch = search_in_naver(resultStt, 'blog')
        else:
            rescode, resultSearch = 200, 'not found'

        melimg = getMelspectrogram(buffer)
        resultMusic = musicSearch(melimg)
        print('음악 검색 결과:', resultMusic)

        result = {
            'resultSearch': resultSearch,
            'resultMusic': resultMusic
        }

        if rescode != 200:
            return Response(result, status=status.HTTP_400_BAD_REQUEST)
        result['resultSearch'] = resultSearch['items'][:5]
        return Response(result, status=status.HTTP_200_OK)