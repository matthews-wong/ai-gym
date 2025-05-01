"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type RadioGroupContextValue = {
  value: string
  onValueChange: (value: string) => void
  name?: string
  disabled?: boolean
}

const RadioGroupContext = React.createContext<RadioGroupContextValue | undefined>(undefined)

function useRadioGroupContext() {
  const context = React.useContext(RadioGroupContext)
  if (!context) {
    throw new Error("RadioGroup components must be used within a RadioGroup")
  }
  return context
}

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: string
  value?: string
  onValueChange?: (value: string) => void
  name?: string
  disabled?: boolean
  children?: React.ReactNode
}

export function RadioGroup({
  defaultValue,
  value,
  onValueChange,
  name,
  disabled = false,
  className,
  children,
  ...props
}: RadioGroupProps) {
  const [internalValue, setInternalValue] = React.useState(defaultValue || "")

  const contextValue = React.useMemo(() => {
    return {
      value: value !== undefined ? value : internalValue,
      onValueChange: (newValue: string) => {
        setInternalValue(newValue)
        onValueChange?.(newValue)
      },
      name,
      disabled,
    }
  }, [value, internalValue, onValueChange, name, disabled])

  return (
    <RadioGroupContext.Provider value={contextValue}>
      <div role="radiogroup" className={cn("flex flex-col gap-2", className)} {...props}>
        {children}
      </div>
    </RadioGroupContext.Provider>
  )
}

export interface RadioGroupItemProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "value" | "checked" | "onChange" | "type"> {
  value: string
  children?: React.ReactNode
}

export function RadioGroupItem({ value, id, className, children, ...props }: RadioGroupItemProps) {
  const { value: groupValue, onValueChange, name, disabled: groupDisabled } = useRadioGroupContext()
  const generatedId = React.useId()
  const itemId = id || `radio-${generatedId}`
  const isChecked = groupValue === value

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <input
        type="radio"
        id={itemId}
        name={name}
        value={value}
        checked={isChecked}
        disabled={groupDisabled || props.disabled}
        onChange={() => onValueChange(value)}
        className="sr-only"
        {...props}
      />
      <label
        htmlFor={itemId}
        className={cn(
          "relative flex h-4 w-4 cursor-pointer rounded-full border border-gray-600 bg-gray-800 ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          isChecked && "border-emerald-600",
          (groupDisabled || props.disabled) && "cursor-not-allowed opacity-50",
        )}
      >
        {isChecked && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
          </span>
        )}
      </label>
      {children && (
        <label
          htmlFor={itemId}
          className={cn(
            "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
            (groupDisabled || props.disabled) && "cursor-not-allowed opacity-70",
          )}
        >
          {children}
        </label>
      )}
    </div>
  )
}

