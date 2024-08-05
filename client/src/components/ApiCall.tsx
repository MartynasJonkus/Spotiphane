import axios from "axios"
import { LithophaneParams } from "../interfaces/LithophaneParams"

export const generateLithophane = async (params: LithophaneParams) => {
  const response = await axios.post(
    "http://localhost:5000/generate_lithophane",
    {
      song_url: params.songLink,
      frame_width: params.frameWidth,
      min_thickness: params.minThickness,
      max_thickness: params.maxThickness,
      max_width: params.maxWidth,
    },
    {
      responseType: "blob",
    }
  )
  return window.URL.createObjectURL(new Blob([response.data]))
}
