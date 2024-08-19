export interface LithophaneParams {
  imageData: string
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
  imageData: "",
  songLink: "",
  needsCode: true,
  maxWidth: 100.0,
  contrastFactor: 1.5,
  pixelsPerMilimeter: 6,
  minThickness: 0.6,
  maxThickness: 3.0,
  frameWidth: 3,
  codeMargin: 10,
}

export const dropdownConfig: Record<string, (keyof LithophaneParams)[]> = {
  spotify: [
    "maxWidth",
    "contrastFactor",
    "pixelsPerMilimeter",
    "minThickness",
    "maxThickness",
    "frameWidth",
    "codeMargin",
  ],
  photo: [
    "maxWidth",
    "contrastFactor",
    "pixelsPerMilimeter",
    "minThickness",
    "maxThickness",
    "frameWidth",
  ],
}

export const minMaxLithophane = {
  maxWidth: { min: 1, max: 500 },
  contrastFactor: { min: 1, max: 10 },
  pixelsPerMilimeter: { min: 1, max: 10 },
  minThickness: { min: 0.1, max: 10 },
  maxThickness: { min: 1, max: 10 },
  frameWidth: { min: 0, max: 100 },
  codeMargin: { min: 0, max: 100 },
}
