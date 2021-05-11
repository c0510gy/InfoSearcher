import json
import urllib.request


def search_in_naver(search_words, field='blog'):
    valid_fields = [
        'news',
        'blog',
        'shop',
        'movie',
        'image',
        'doc',
        'book',
        'cafearticle'
    ]

    # If requested field not in valid fields
    if field not in valid_fields:
        return 400, 'Not valid field'

    search_words = urllib.parse.quote(search_words)
    request_url = 'https://openapi.naver.com/v1/search/{}?query={}&display=100'.format(field, search_words)

    # Read id and secret
    with open('text_analysis/config.json', 'r', encoding='UTF-8') as config_file:
        config = json.loads(config_file.readline())
    id = config['id']
    secret = config['secret']

    # Request
    request = urllib.request.Request(request_url)
    request.add_header('X-Naver-Client-Id', id)
    request.add_header('X-Naver-Client-Secret', secret)
    response = urllib.request.urlopen(request)

    # Response
    rescode = response.getcode()
    if (rescode == 200):
        response_body = json.loads(response.read().decode('utf-8'))
        return 200, response_body
    else:
        return rescode, 'Error from naver'


if __name__ == '__main__':
    test_word_list = ['언어_모델', '자연어_처리', '형태소_분석', '말뭉치_구축', '언어', '기술', '모델']
    test_word_list = [i.replace('_', '') for i in test_word_list]
    test_word_list = ' '.join(test_word_list)
    rescode, result = search_in_naver(test_word_list, 'blog')
    print(rescode)
    print(result)