export interface LithophaneParams {
  songLink: string
  frameWidth: number
  minThickness: number
  maxThickness: number
  maxWidth: number
}

export const defaultLithophaneParams: LithophaneParams = {
  songLink: "",
  frameWidth: 10,
  minThickness: 0.6,
  maxThickness: 3.0,
  maxWidth: 100.0,
}
