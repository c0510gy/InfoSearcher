import torch
import torch.nn as nn
import timm
import numpy as np
import librosa
import pickle
import albumentations
import albumentations.pytorch

import json
import urllib.request

from collections import Counter
from google.cloud import speech
from torch.utils.data import Dataset, DataLoader

TEMPER = 100
SIGN = 0.01

class MuseCNN(nn.Module):
    def __init__(self, n_class, T):
        super().__init__()
        self.model = timm.create_model('efficientnet_b4', num_classes=n_class, in_chans=1, pretrained=False)
        self.T = T

    def forward(self, x):
        x = self.model(x)
        x = torch.exp(x / self.T) / torch.sum(torch.exp(x / self.T))
        return x

class GetData(Dataset):
  def __init__(self, img, augmentation):
    self.img = img
    self.augmentation = augmentation
        
  def __len__(self):
    return self.img.shape[1]//16 - 7
        
  def __getitem__(self, index):
    img = self.img[:, index*16 : index*16 + 128]
    img = img.reshape(128, 128, 1)
    
    if self.augmentation != None:
      augmented = self.augmentation(image=img)
      img = augmented['image']
    
    return img

def makeLoader(img):
    testSet = GetData(img, basic_transform)
    testLoader = DataLoader(testSet, batch_size=1, shuffle=False, num_workers=2)
    return testLoader

basic_transform = albumentations.Compose([
    albumentations.pytorch.transforms.ToTensor()
])

def stt(content):
    client = speech.SpeechClient()
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=44100,
        language_code="ko-KR",
    )
    audio = speech.RecognitionAudio(content=content)
    response = client.recognize(config=config, audio=audio)

    result = ''
    for sentence in response.results:
        result += sentence.alternatives[0].transcript + ' '
    return result

def stringToBytes(data):
    bufferarray = []
    for i in range(len(data)//2):
        bufferarray.append(int(data[i*2 : (i+1)*2], 16))
    return bytes(bufferarray)

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

def scaleMinMax(X, min=0.0, max=1.0):
    X_std = (X - X.min()) / (X.max() - X.min())
    X_scaled = X_std * (max - min) + min
    return X_scaled

def spectrogramImage(mels):

    mels = np.log(mels + 1e-9) # add small number to avoid log(0)

    # min-max scale to fit inside 8-bit range
    img = scaleMinMax(mels, 0, 255).astype(np.uint8)
    img = np.flip(img, axis=0) # put low frequencies at the bottom in image
    img = 255-img # invert. make black==more energy

    return img

import soundfile as sf
def getMelspectrogram(buffer):
    y = []
    for i in range(len(buffer)//2):
        newbuf = buffer[i*2] + 256 * buffer[i*2 + 1] - 32768
        newbuf /= 32767
        y.append(newbuf)
    y = np.array(y)
    y = librosa.resample(y, 44100, 22050)
    img = librosa.feature.melspectrogram(y=y, sr=22050)
    return spectrogramImage(img)
    
def backFgsm(img, eps, datagrad):
    signgrad = datagrad.sign()
    pimg = img - eps * signgrad
    pimg = torch.clamp(pimg, 0, 1)
    return pimg

def musicSearch(melimg):
    voting = []

    loader = makeLoader(melimg)
    for i, x in enumerate(loader):
        # x = x.cuda()
        x.requires_grad = True
        output = model(x)

        _, y_pred = torch.max(output, 1)
        loss = criterion(output, y_pred)

        model.zero_grad()
        loss.backward()

        pimg = backFgsm(x, SIGN, x.grad.data)
        poutput = model(pimg)
        _, py_pred = torch.max(poutput, 1)

        y_pred, py_pred = int(y_pred[0]), int(py_pred[0])
        if y_pred == py_pred:
            voting.append(int(y_pred[0]))

    counter = Counter(voting)
    result = counter.most_common(1)[0]
    if result[1] > len(loader)//3:
        return musicList[result[0]]
    else:
        return 'not found'

modelpath = './audio_analysis/model-audio/model-best.pth'
musicpath = './audio_analysis/model-audio/musiclist.pkl'

with open(musicpath, 'rb') as f:
    musicList = pickle.load(f)

criterion = nn.CrossEntropyLoss()
model = MuseCNN(len(musicList), TEMPER)
model.load_state_dict(torch.load(modelpath, map_location=torch.device('cpu'))['State_dict'])
model.eval()