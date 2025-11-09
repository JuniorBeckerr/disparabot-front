"use client"

import type React from "react"
import { useState } from "react"

interface Field {
    name: string
    label: string
    type: "text" | "textarea" | "select" | "number" | "email" | "password" | "date"
    required?: boolean
    options?: { value: string; label: string }[]
    readOnly?: boolean
    presetIcons?: string[]
}

interface CrudModalProps<T> {
    isOpen: boolean
    mode: "create" | "edit" | "view"
    title: string
    fields: Field[]
    data: Partial<T>
    onClose: () => void
    onSubmit: (data: Partial<T>) => void
    onChange: (field: string, value: any) => void
    extraViewFields?: { label: string; value: any }[]
    isLoading?: boolean
}

export function CrudModal<T>({
                                 isOpen,
                                 mode,
                                 title,
                                 fields,
                                 data,
                                 onClose,
                                 onSubmit,
                                 onChange,
                                 extraViewFields = [],
                             }: CrudModalProps<T>) {
    if (!isOpen) return null

    const isReadOnly = mode === "view"

    const [openPickers, setOpenPickers] = useState<Record<string, boolean>>({})

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!isReadOnly) {
            onSubmit(data)
        }
    }

    const renderField = (field: Field) => {
        const value = (data as any)[field.name] || ""

        const baseInputStyle: React.CSSProperties = {
            width: "100%",
            padding: "12px",
            border: "1px solid #d1d5db",
            borderRadius: "6px",
            fontSize: "14px",
            color: "#374151",
            outline: "none",
            transition: "border-color 0.2s",
            boxSizing: "border-box",
            backgroundColor: isReadOnly || field.readOnly ? "#f9fafb" : "white",
        }

        switch (field.type) {
            case "textarea":
                return (
                    <textarea
                        style={{ ...baseInputStyle, minHeight: "80px", resize: "vertical" }}
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        required={field.required}
                        readOnly={isReadOnly || field.readOnly}
                    />
                )

            case "select":
                return (
                    <select
                        style={baseInputStyle}
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        required={field.required}
                        disabled={isReadOnly || field.readOnly}
                    >
                        <option value="">Selecione...</option>
                        {field.options?.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )

            default:
                return (
                    <div style={{ display: "flex", gap: 8, alignItems: "center", position: "relative", overflow: "visible" }}>
                        <input
                            type={field.type}
                            style={{ ...baseInputStyle, flex: 1 }}
                            value={value}
                            onChange={(e) => onChange(field.name, e.target.value)}
                            required={field.required}
                            readOnly={isReadOnly || field.readOnly}
                        />
                        {field.presetIcons && !isReadOnly && (
                            <button
                                type="button"
                                onClick={() =>
                                    setOpenPickers((prev) => ({ ...prev, [field.name]: !prev[field.name] }))
                                }
                                style={{
                                    backgroundColor: "#f3f4f6",
                                    color: "#374151",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 6,
                                    padding: "8px 10px",
                                    fontSize: 14,
                                    cursor: "pointer",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Ícones
                            </button>
                        )}
                        {field.presetIcons && openPickers[field.name] && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: "105%",
                                    left: 0,
                                    right: 0,
                                    backgroundColor: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: 8,
                                    padding: 8,
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                                    zIndex: 2000,
                                }}
                            >
                                <div
                                    style={{
                                        display: "grid",
                                        gridTemplateColumns: "repeat(8, 1fr)",
                                        gap: 8,
                                    }}
                                >
                                    {field.presetIcons.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => {
                                                onChange(field.name, emoji)
                                                setOpenPickers((prev) => ({ ...prev, [field.name]: false }))
                                            }}
                                            title={emoji}
                                            style={{
                                                fontSize: 20,
                                                lineHeight: "32px",
                                                height: 32,
                                                width: "100%",
                                                cursor: "pointer",
                                                border: "1px solid #e5e7eb",
                                                backgroundColor: "#ffffff",
                                                borderRadius: 6,
                                            }}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )
        }
    }

    // Styles
    const modalOverlayStyle: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    }

    const modalStyle: React.CSSProperties = {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        width: "90%",
        maxWidth: "500px",
        maxHeight: "90vh",
        overflow: "auto",
    }

    const modalHeaderStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
    }

    const modalTitleStyle: React.CSSProperties = {
        fontSize: "20px",
        fontWeight: "bold",
        color: "#1e293b",
        margin: 0,
    }

    const closeButtonStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
        color: "#6b7280",
    }

    const formGroupStyle: React.CSSProperties = {
        marginBottom: "16px",
    }

    const labelStyle: React.CSSProperties = {
        display: "block",
        fontSize: "14px",
        fontWeight: "500",
        color: "#374151",
        marginBottom: "6px",
    }

    const modalButtonsStyle: React.CSSProperties = {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end",
        marginTop: "24px",
    }

    const cancelButtonStyle: React.CSSProperties = {
        backgroundColor: "#f3f4f6",
        color: "#374151",
        border: "none",
        borderRadius: "6px",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    }

    const submitButtonStyle: React.CSSProperties = {
        backgroundColor: "#3b82f6",
        color: "white",
        border: "none",
        borderRadius: "6px",
        padding: "10px 20px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    }

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={modalHeaderStyle}>
                    <h2 style={modalTitleStyle}>{title}</h2>
                    <button style={closeButtonStyle} onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {fields.map((field) => (
                        <div key={field.name} style={formGroupStyle}>
                            <label style={labelStyle}>{field.label}</label>
                            {renderField(field)}
                        </div>
                    ))}

                    {/* Campos extras apenas no modo visualização */}
                    {mode === "view" &&
                        extraViewFields.map((field, index) => (
                            <div key={index} style={formGroupStyle}>
                                <label style={labelStyle}>{field.label}</label>
                                <input
                                    type="text"
                                    style={{
                                        width: "100%",
                                        padding: "12px",
                                        border: "1px solid #d1d5db",
                                        borderRadius: "6px",
                                        fontSize: "14px",
                                        color: "#374151",
                                        backgroundColor: "#f9fafb",
                                        boxSizing: "border-box",
                                    }}
                                    value={field.value}
                                    readOnly
                                />
                            </div>
                        ))}

                    <div style={modalButtonsStyle}>
                        <button type="button" style={cancelButtonStyle} onClick={onClose}>
                            {isReadOnly ? "Fechar" : "Cancelar"}
                        </button>
                        {!isReadOnly && (
                            <button type="submit" style={submitButtonStyle}>
                                {mode === "create" ? "Criar" : "Salvar"}
                            </button>
                        )}
                    </div>
                </form>
            </div>
        </div>
    )
}
