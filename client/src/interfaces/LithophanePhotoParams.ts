export interface LithophanePhotoParams {
  image: string
  maxWidth: number
  contrastFactor: number
  minThickness: number
  maxThickness: number
  frameWidth: number
}

export const defaultLithophanePhotoParams: LithophanePhotoParams = {
  image: "",
  maxWidth: 100.0,
  contrastFactor: 1.5,
  minThickness: 0.6,
  maxThickness: 3.0,
  frameWidth: 10,
}
