import cv2
import numpy as np
import pathlib
from io import StringIO
import base64
from PIL import Image

myPath = str(pathlib.Path(__file__).parent.absolute())

CONFIG_PATH = myPath + '/yolov3.cfg'
YOLOV3_WEIGHTS_PATH = myPath + '/yolov3.weights'

def load_model(weights, config):
  net = cv2.dnn.readNet(weights, config)
  return net

def detect(model, image):
  Width = image.shape[1]
  Height = image.shape[0]
  scale = 0.00392

  blob = cv2.dnn.blobFromImage(image, scale, (608,608), (0,0,0), True, crop=False)

  model.setInput(blob)

  def get_output_layers(net):
      
      layer_names = net.getLayerNames()
      
      output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]

      return output_layers

  outs = model.forward(get_output_layers(model))

  class_ids = []
  confidences = []
  boxes = []
  conf_threshold = 0.5
  nms_threshold = 0.4

  for out in outs:
      for detection in out:
          scores = detection[5:]
          class_id = np.argmax(scores)
          confidence = scores[class_id]
          if confidence > 0.5:
              center_x = int(detection[0] * Width)
              center_y = int(detection[1] * Height)
              w = int(detection[2] * Width)
              h = int(detection[3] * Height)
              x = center_x - w / 2
              y = center_y - h / 2
              class_ids.append(class_id)
              confidences.append(float(confidence))
              boxes.append([x, y, w, h])

  indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)

  result = []


  for i in indices:
      i = i[0]
      box = boxes[i]
      x = box[0]
      y = box[1]
      w = box[2]
      h = box[3]

      result.append([class_ids[i], confidences[i], round(x), round(y), round(x+w), round(y+h)])

  return result

def readb64(base64_string):
  base64_string = base64_string if base64_string.find(',') == -1 else base64_string.split(',')[1]
  im_bytes = base64.b64decode(base64_string)
  im_arr = np.frombuffer(im_bytes, dtype=np.uint8)  # im_arr is one-dim Numpy array
  img = cv2.imdecode(im_arr, flags=cv2.IMREAD_COLOR)
  return img

YOLOV3_MODEL = load_model(YOLOV3_WEIGHTS_PATH, CONFIG_PATH)
