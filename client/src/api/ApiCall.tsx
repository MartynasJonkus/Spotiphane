import axios from "axios"
import { LithophaneParams } from "../interfaces/LithophaneParams"

const backendURL =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_BACKEND_URL_LOCAL
    : import.meta.env.VITE_BACKEND_URL_NETWORK

export const generateLithophane = async (params: LithophaneParams) => {
  const response = await axios.post(
    `${backendURL}/generate_lithophane`,
    {
      song_url: params.songLink,
      needs_code: params.needsCode,
      max_width: params.maxWidth,
      min_thickness: params.minThickness,
      max_thickness: params.maxThickness,
      contrast_factor: params.contrastFactor,
      pixels_per_mm: params.pixelsPerMilimeter,
      frame_width: params.frameWidth,
      code_margin: params.codeMargin,
    },
    {
      responseType: "blob",
    }
  )
  return window.URL.createObjectURL(new Blob([response.data]))
}

export const generateLithophanePhoto = async (params: LithophaneParams) => {
  const response = await axios.post(
    `${backendURL}/generate_lithophane_photo`,
    {
      image_data: params.imageData,
      max_width: params.maxWidth,
      min_thickness: params.minThickness,
      max_thickness: params.maxThickness,
      contrast_factor: params.contrastFactor,
      pixels_per_mm: params.pixelsPerMilimeter,
      frame_width: params.frameWidth,
    },
    {
      responseType: "blob",
    }
  )
  return window.URL.createObjectURL(new Blob([response.data]))
}
