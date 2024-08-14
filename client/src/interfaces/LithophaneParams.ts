export interface LithophaneParams {
  songLink: string
  needsCode: boolean
  maxWidth: number
  contrastFactor: number
  pixelsPerMilimeter: number
  minThickness: number
  maxThickness: number
  frameWidth: number
  codeMargin: number
}

export const defaultLithophaneParams: LithophaneParams = {
  songLink: "",
  needsCode: true,
  maxWidth: 100.0,
  contrastFactor: 1.5,
  pixelsPerMilimeter: 6,
  minThickness: 0.6,
  maxThickness: 3.0,
  frameWidth: 10,
  codeMargin: 10,
}
