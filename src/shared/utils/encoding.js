import imageType from 'image-type';

export function iconToDataURI(iconBuffer) {
  const iconInfo = imageType(iconBuffer);
  if (iconInfo) {
    const { mime } = iconInfo;
    const content = iconBuffer.toString('base64');
    return `data:${mime};base64,${content}`;
  }
  return null;
}
