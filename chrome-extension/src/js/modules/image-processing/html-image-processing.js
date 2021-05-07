function getBase64Image(imageSrc) {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    const img = new Image();
    img.src = imageSrc;
    img.crossOrigin = 'Anonymous';
    img.onload = function () {
      canvas.width = this.width;
      canvas.height = this.height;
      ctx.drawImage(img, 0, 0);
      resolve(canvas.toDataURL());
    };
  });
}

export default async function imageProcessingFromHTML(document) {
  const images = [];
  Array.from(document.images).forEach(async function (imageElem) {
    try {
      images.push({
        base64: await getBase64Image(imageElem.src),
        src: imageElem.src
      });
    } catch (err) {}
  });

  return {
    type: 'image',
    images
  };
}
