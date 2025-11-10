import * as React from "react"
import { Input } from "./input"

interface InputNumberProps extends Omit<React.ComponentProps<"input">, "type" | "onChange"> {
  value?: string | number
  onChange?: (value: string) => void
  maxDecimals?: number
}

function InputNumber({ 
  value = "", 
  onChange, 
  maxDecimals = 0,
  ...props 
}: InputNumberProps) {
  const [displayValue, setDisplayValue] = React.useState("")

  // Format number with dot separators
  const formatNumber = (num: string): string => {
    // Remove all non-numeric characters
    const cleanNum = num.replace(/\D/g, "")
    if (!cleanNum) return ""

    // Add dot separators (thousands)
    return cleanNum.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Initialize display value
  React.useEffect(() => {
    const numValue = typeof value === "number" ? value.toString() : value
    const cleanValue = numValue.replace(/\D/g, "")
    setDisplayValue(formatNumber(cleanValue))
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value

    // Allow only numbers and dots
    if (inputValue && !/^[\d.]*$/.test(inputValue)) {
      return
    }

    // Remove dots to get raw number
    const rawValue = inputValue.replace(/\./g, "")

    // Format with dots
    const formatted = formatNumber(rawValue)
    setDisplayValue(formatted)

    // Pass raw numeric value to parent
    onChange?.(rawValue)
  }

  return (
    <Input
      type="text"
      inputMode="numeric"
      value={displayValue}
      onChange={handleChange}
      {...props}
    />
  )
}

export { InputNumber }
