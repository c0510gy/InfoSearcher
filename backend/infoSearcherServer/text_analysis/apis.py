import json
import urllib.request

from soynlp.utils import DoublespaceLineCorpus
from soynlp.noun import LRNounExtractor_v2
from soynlp.word import WordExtractor
from soynlp.tokenizer import LTokenizer
from krwordrank.word import KRWordRank


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


def get_tokenizer(sentences):
    word_extractor = WordExtractor()

    word_extractor.train(sentences)
    words = word_extractor.extract()
    cohesion_score = {word:score.cohesion_forward for word, score in words.items()}

    noun_extractor = LRNounExtractor_v2()
    nouns = noun_extractor.train_extract(sentences) # list of str like

    noun_scores = {noun:score.score for noun, score in nouns.items()}
    combined_scores = {noun:score + cohesion_score.get(noun, 0)
        for noun, score in noun_scores.items()}

    tokenizer = LTokenizer(scores=combined_scores)

    return noun_extractor, nouns, tokenizer


def get_tokenized_nouns(sentences, noun_extractor, nouns, tokenizer):
    tokenized_sentences = []
    for sent in sentences:
        tokenized_sentences.append(tokenizer.tokenize(sent))
    compound_nouns = {}
    for compound_noun, sub_nouns in noun_extractor._compounds_components.items():
        compound_nouns[compound_noun] = list(sub_nouns)

    tokenized_nouns = []
    for sent in tokenized_sentences:
        temp_sents = []
        for word in sent:
            if (word in nouns) and (word not in compound_nouns) and (len(word) > 1):
                temp_sents.append(word)
            elif word in compound_nouns:
                temp_sents.extend(compound_nouns[word])
        tokenized_nouns.append(temp_sents)

    tokenized_nouns = [nouns for nouns in tokenized_nouns if len(nouns) > 3]

    return tokenized_nouns


def get_2gram(sentences):
    ngram_sentences = []

    for sentence in sentences:
        ngrams = []
        for idx in range(len(sentence) - 1):
            ngrams.append('{}_{}'.format(sentence[idx], sentence[idx + 1]))
        ngram_sentences.append(ngrams)

    return ngram_sentences


def wordrank(words):
    min_count = 5  # 단어의 최소 출현 빈도수 (그래프 생성 시)
    max_length = 12  # 단어의 최대 길이
    wordrank_extractor = KRWordRank(min_count=min_count, max_length=max_length)

    beta = 0.85  # PageRank의 decaying factor beta
    max_iter = 30
    keywords, rank, graph = wordrank_extractor.extract(words, beta, max_iter)
    return keywords


def filter_two_gram(keywords, n):
    ret = []
    for keyword, score in keywords.items():
        if keyword[-1] != '_' and keyword.find('_') != -1:
            ret.append((keyword, score))
    return ret[:n]


def filter_one_gram(keywords, n):
    ret = [(keyword, score) for keyword, score in keywords.items()]
    return ret[:n]


def get_keywords(sentences):
    # Get nouns and tokenizer
    noun_extractor, nouns, tokenizer = get_tokenizer(sentences)

    # Get nouns
    tokenized_nouns = get_tokenized_nouns(sentences, noun_extractor, nouns, tokenizer)
    one_gram_nouns = [' '.join(nouns) for nouns in tokenized_nouns]
    two_gram_nouns = get_2gram(tokenized_nouns)
    two_gram_nouns = [' '.join(nouns) for nouns in two_gram_nouns]

    # Get keywords
    one_gram_keywords = filter_one_gram(wordrank(one_gram_nouns), 2)
    two_gram_keywords = filter_two_gram(wordrank(two_gram_nouns), 3)

    return [keywordInfo[0] for keywordInfo in one_gram_keywords + two_gram_keywords]
