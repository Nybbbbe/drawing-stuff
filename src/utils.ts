export type RGB = {
  r: number,
  g: number,
  b: number
}

export const extractRGB = (colorString: string): RGB => {
  const tmp = colorString.substring(4, colorString.length - 1)
    .replace(/ /g, '')
    .split(',')
    .map(s => parseInt(s));
    
  return {
    r: tmp[0],
    g: tmp[1],
    b: tmp[2],
  }
}

export const capitalizeString = (word: string) => {
  return word[0].toUpperCase() + word.substring(1);
}