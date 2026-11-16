import resImage from '../assets/PIELES/res.png';
import venadoImage from '../assets/PIELES/venado.png';
import pythonImage from '../assets/PIELES/python.png';
import peloVacaImage from '../assets/PIELES/pelovaca.png';
import cocodriloImage from '../assets/PIELES/cocodrilo.png';

const SKIN_IMAGE_ASSETS = {
  res: resImage,
  venado: venadoImage,
  piton: pythonImage,
  'pelo-vaca': peloVacaImage,
  'cocodrilo-panza': cocodriloImage,
};

export const resolveSkinImages = (images = []) => images.map((image) => ({
  ...image,
  src: SKIN_IMAGE_ASSETS[image.id] ?? image.src,
}));
