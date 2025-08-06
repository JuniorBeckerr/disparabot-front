"use client"

import type React from "react"
import { useState } from "react"

interface Option {
    value: any
    label: string
}

interface MultiSelectFieldProps {
    options: Option[]
    value: any[]
    onChange: (values: any[]) => void
    placeholder?: string
    disabled?: boolean
}

export const MultiSelectField: React.FC<MultiSelectFieldProps> = ({
                                                                      options,
                                                                      value = [],
                                                                      onChange,
                                                                      placeholder = "Selecione opções...",
                                                                      disabled = false,
                                                                  }) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleToggleOption = (optionValue: any) => {
        const currentValues = Array.isArray(value) ? value : []
        const isSelected = currentValues.includes(optionValue)

        let newValues: any[]
        if (isSelected) {
            newValues = currentValues.filter((v) => v !== optionValue)
        } else {
            newValues = [...currentValues, optionValue]
        }

        onChange(newValues)
    }

    const selectedLabels = options.filter((option) => value.includes(option.value)).map((option) => option.label)

    const displayText =
        selectedLabels.length > 0
            ? selectedLabels.length > 2
                ? `${selectedLabels.slice(0, 2).join(", ")} +${selectedLabels.length - 2} mais`
                : selectedLabels.join(", ")
            : placeholder

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                style={{
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    padding: "8px 12px",
                    backgroundColor: disabled ? "#f9fafb" : "white",
                    cursor: disabled ? "not-allowed" : "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    minHeight: "40px",
                }}
            >
        <span
            style={{
                color: selectedLabels.length > 0 ? "#374151" : "#9ca3af",
                fontSize: "14px",
            }}
        >
          {displayText}
        </span>
                <span
                    style={{
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.2s",
                    }}
                >
          ▼
        </span>
            </div>

            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        top: "100%",
                        left: 0,
                        right: 0,
                        backgroundColor: "white",
                        border: "1px solid #d1d5db",
                        borderRadius: "6px",
                        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                        zIndex: 1000,
                        maxHeight: "200px",
                        overflowY: "auto",
                    }}
                >
                    {options.map((option) => {
                        const isSelected = value.includes(option.value)
                        return (
                            <div
                                key={option.value}
                                onClick={() => handleToggleOption(option.value)}
                                style={{
                                    padding: "8px 12px",
                                    cursor: "pointer",
                                    backgroundColor: isSelected ? "#eff6ff" : "transparent",
                                    borderBottom: "1px solid #f3f4f6",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    fontSize: "14px",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = "#f9fafb"
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isSelected) {
                                        e.currentTarget.style.backgroundColor = "transparent"
                                    }
                                }}
                            >
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => {}} // Controlled by parent click
                                    style={{ margin: 0 }}
                                />
                                <span>{option.label}</span>
                            </div>
                        )
                    })}
                    {options.length === 0 && (
                        <div
                            style={{
                                padding: "12px",
                                textAlign: "center",
                                color: "#9ca3af",
                                fontSize: "14px",
                            }}
                        >
                            Nenhuma opção disponível
                        </div>
                    )}
                </div>
            )}

            {/* Overlay para fechar o dropdown */}
            {isOpen && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 999,
                    }}
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    )
}
