function getBase64Image(imageSrc) {
  return new Promise(function (resolve, reject) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
    img.onerror = function () {
      reject();
    };
    img.src = imageSrc;
  });
}

export default async function imageProcessingFromHTML(document) {
  const images = [];
  const documentImages = document.images;
  for (let i = 0; i < documentImages.length; ++i) {
    const imageElem = documentImages[i];
    try {
      images.push({
        base64: await getBase64Image(imageElem.src),
        src: imageElem.src
      });
    } catch (err) {}
  }

  return {
    type: 'image',
    images
  };
}
