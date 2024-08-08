import axios from "axios"
import { LithophaneParams } from "../interfaces/LithophaneParams"

export const generateLithophane = async (params: LithophaneParams) => {
  const response = await axios.post(
    "http://localhost:5000/generate_lithophane",
    {
      song_url: params.songLink,
      needs_code: params.needsCode,
      max_width: params.maxWidth,
      min_thickness: params.minThickness,
      max_thickness: params.maxThickness,
      contrast_factor: params.contrastFactor,
      frame_width: params.frameWidth,
      code_margin: params.codeMargin,
    },
    {
      responseType: "blob",
    }
  )
  return window.URL.createObjectURL(new Blob([response.data]))
}
