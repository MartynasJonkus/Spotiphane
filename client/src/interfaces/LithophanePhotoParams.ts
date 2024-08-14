export interface LithophanePhotoParams {
  imageData: string
  maxWidth: number
  contrastFactor: number
  pixelsPerMilimeter: number
  minThickness: number
  maxThickness: number
  frameWidth: number
}

export const defaultLithophanePhotoParams: LithophanePhotoParams = {
  imageData: "",
  maxWidth: 100.0,
  contrastFactor: 1.5,
  pixelsPerMilimeter: 6,
  minThickness: 0.6,
  maxThickness: 3.0,
  frameWidth: 10,
}
