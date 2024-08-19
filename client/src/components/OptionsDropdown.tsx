import React from "react"
import {
  defaultLithophaneParams,
  LithophaneParams,
  minMaxLithophane,
} from "../interfaces/LithophaneParams"
import { dropdownConfig } from "../interfaces/LithophaneParams"

interface OptionsDropdownProps {
  type: "spotify" | "photo"
  params: LithophaneParams
  setParams: React.Dispatch<React.SetStateAction<LithophaneParams>>
}

const OptionsDropdown: React.FC<OptionsDropdownProps> = ({
  type,
  params,
  setParams,
}) => {
  const handleInputChange = (key: keyof LithophaneParams, value: number) => {
    const min = minMaxLithophane[key as keyof typeof minMaxLithophane]?.min || 0
    const max =
      minMaxLithophane[key as keyof typeof minMaxLithophane]?.max || 100

    const clampedValue = isNaN(value)
      ? defaultLithophaneParams[key]
      : Math.max(min, Math.min(max, value))

    setParams((prevParams: LithophaneParams) => ({
      ...prevParams,
      [key]: clampedValue,
    }))
  }

  return (
    <div className="max-h-80 overflow-y-auto p-4 border flex flex-col gap-4">
      {dropdownConfig[type]?.map((key) => {
        const min =
          minMaxLithophane[key as keyof typeof minMaxLithophane]?.min || 0
        const max =
          minMaxLithophane[key as keyof typeof minMaxLithophane]?.max || 100
        const value = params[key as keyof LithophaneParams]

        return (
          <div key={key} className="flex items-center mb-4">
            <label className="w-40 sm:text-left pr-2">
              {key.charAt(0).toUpperCase() + key.slice(1)}
            </label>
            <input
              type="range"
              step="0.1"
              min={min}
              max={max}
              value={value as number}
              onChange={(e) =>
                handleInputChange(
                  key as keyof LithophaneParams,
                  parseFloat(e.target.value)
                )
              }
              className="flex-grow"
            />
            <input
              type="number"
              step="0.1"
              min={min}
              max={max}
              value={value as number}
              onChange={(e) =>
                handleInputChange(
                  key as keyof LithophaneParams,
                  parseFloat(e.target.value)
                )
              }
              className={`ml-2 w-16 text-center bg-transparent 
                border-none 
                hover:border-gray-300 `}
            />
            <label
              className={`sm:text-left ${key === "contrastFactor" || key === "pixelsPerMilimeter" ? "invisible" : ""}`}
            >
              mm
            </label>
          </div>
        )
      })}
    </div>
  )
}

export default OptionsDropdown
