"use client"

import type React from "react"

interface Field {
    name: string
    label: string
    type: "text" | "textarea" | "select" | "number" | "email" | "password" | "date"
    required?: boolean
    options?: { value: string; label: string }[]
    readOnly?: boolean
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
                    <input
                        type={field.type}
                        style={baseInputStyle}
                        value={value}
                        onChange={(e) => onChange(field.name, e.target.value)}
                        required={field.required}
                        readOnly={isReadOnly || field.readOnly}
                    />
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
