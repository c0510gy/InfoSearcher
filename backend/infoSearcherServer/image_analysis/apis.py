import cv2

def load_model(weights, config):
  net = cv2.dnn.readNet(weights, config)
  return net
