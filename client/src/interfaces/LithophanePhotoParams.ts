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
  frameWidth: 3,
}

export const minMaxLithophanePhoto = {
  maxWidth: { min: 1, max: 500 },
  contrastFactor: { min: 1, max: 10 },
  pixelsPerMilimeter: { min: 1, max: 10 },
  minThickness: { min: 0.1, max: 10 },
  maxThickness: { min: 1, max: 10 },
  frameWidth: { min: 0, max: 100 },
}
