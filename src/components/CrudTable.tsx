"use client"

import type React from "react"
import { useState } from "react"

interface Column<T> {
    key: keyof T | string
    label: string
    render?: (item: T) => React.ReactNode
}

interface CardField<T> {
    key: keyof T | string
    label?: string
    render?: (item: T) => React.ReactNode
    primary?: boolean // Campo principal (título do card)
    secondary?: boolean // Campo secundário (subtítulo)
}

interface CrudTableProps<T> {
    data: T[]
    columns: Column<T>[]
    cardFields?: CardField<T>[] // Campos para visualização em card
    onView?: (item: T) => void
    onEdit?: (item: T) => void
    onDelete?: (item: T) => void
    actions?: {
        view?: boolean
        edit?: boolean
        delete?: boolean
    }
    defaultView?: "table" | "cards"
    showViewToggle?: boolean
    isLoading?: boolean
}

export function CrudTable<T extends { id: number }>({
                                                        data,
                                                        columns,
                                                        cardFields,
                                                        onView,
                                                        onEdit,
                                                        onDelete,
                                                        actions = { view: true, edit: true, delete: true },
                                                        defaultView = "table",
                                                        showViewToggle = true,
                                                    }: CrudTableProps<T>) {
    const [viewMode, setViewMode] = useState<"table" | "cards">(defaultView)

    const getValue = (item: T, key: keyof T | string) => {
        if (typeof key === "string" && key.includes(".")) {
            return key.split(".").reduce((obj: any, prop) => obj?.[prop], item)
        }
        return (item as any)[key]
    }

    const hasActions = actions.view || actions.edit || actions.delete

    // Styles
    const containerStyle: React.CSSProperties = {
        width: "100%",
    }

    const headerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "16px",
    }

    const toggleContainerStyle: React.CSSProperties = {
        display: "flex",
        backgroundColor: "#f1f5f9",
        borderRadius: "8px",
        padding: "4px",
        gap: "4px",
    }

    const toggleButtonStyle = (isActive: boolean): React.CSSProperties => ({
        padding: "8px 16px",
        borderRadius: "6px",
        border: "none",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        transition: "all 0.2s",
        backgroundColor: isActive ? "white" : "transparent",
        color: isActive ? "#1e293b" : "#64748b",
        boxShadow: isActive ? "0 1px 2px 0 rgba(0, 0, 0, 0.05)" : "none",
    })

    const tableStyle: React.CSSProperties = {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "white",
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }

    const thStyle: React.CSSProperties = {
        backgroundColor: "#f8fafc",
        padding: "16px",
        textAlign: "left",
        fontSize: "14px",
        fontWeight: "600",
        color: "#374151",
        borderBottom: "1px solid #e5e7eb",
    }

    const tdStyle: React.CSSProperties = {
        padding: "16px",
        borderBottom: "1px solid #f3f4f6",
        fontSize: "14px",
        color: "#374151",
    }

    const cardsGridStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "16px",
    }

    const cardStyle: React.CSSProperties = {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #e5e7eb",
        transition: "all 0.2s",
        cursor: "pointer",
    }

    const cardHeaderStyle: React.CSSProperties = {
        marginBottom: "12px",
    }

    const cardTitleStyle: React.CSSProperties = {
        fontSize: "16px",
        fontWeight: "600",
        color: "#1e293b",
        margin: "0 0 4px 0",
    }

    const cardSubtitleStyle: React.CSSProperties = {
        fontSize: "14px",
        color: "#64748b",
        margin: 0,
    }

    const cardBodyStyle: React.CSSProperties = {
        marginBottom: "16px",
    }

    const cardFieldStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "6px 0",
        borderBottom: "1px solid #f3f4f6",
    }

    const cardFieldLabelStyle: React.CSSProperties = {
        fontSize: "12px",
        color: "#6b7280",
        fontWeight: "500",
        textTransform: "uppercase",
    }

    const cardFieldValueStyle: React.CSSProperties = {
        fontSize: "14px",
        color: "#374151",
        fontWeight: "500",
    }

    const cardActionsStyle: React.CSSProperties = {
        display: "flex",
        gap: "8px",
        justifyContent: "flex-end",
    }

    const actionButtonStyle = (variant: "view" | "edit" | "delete"): React.CSSProperties => {
        const colors = {
            view: { bg: "#f1f5f9", color: "#475569" },
            edit: { bg: "#fef3c7", color: "#92400e" },
            delete: { bg: "#fef2f2", color: "#dc2626" },
        }

        return {
            backgroundColor: colors[variant].bg,
            color: colors[variant].color,
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "opacity 0.2s",
        }
    }

    const renderTableView = () => (
        <table style={tableStyle}>
            <thead>
            <tr>
                {columns.map((column) => (
                    <th key={String(column.key)} style={thStyle}>
                        {column.label}
                    </th>
                ))}
                {hasActions && <th style={thStyle}>Ações</th>}
            </tr>
            </thead>
            <tbody>
            {data.map((item) => (
                <tr key={item.id}>
                    {columns.map((column) => (
                        <td key={String(column.key)} style={tdStyle}>
                            {column.render ? column.render(item) : getValue(item, column.key)}
                        </td>
                    ))}
                    {hasActions && (
                        <td style={tdStyle}>
                            {actions.view && onView && (
                                <button
                                    style={actionButtonStyle("view")}
                                    onClick={() => onView(item)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = "0.8"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = "1"
                                    }}
                                >
                                    👁️ Ver
                                </button>
                            )}
                            {actions.edit && onEdit && (
                                <button
                                    style={actionButtonStyle("edit")}
                                    onClick={() => onEdit(item)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = "0.8"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = "1"
                                    }}
                                >
                                    ✏️ Editar
                                </button>
                            )}
                            {actions.delete && onDelete && (
                                <button
                                    style={actionButtonStyle("delete")}
                                    onClick={() => onDelete(item)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.opacity = "0.8"
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.opacity = "1"
                                    }}
                                >
                                    🗑️ Excluir
                                </button>
                            )}
                        </td>
                    )}
                </tr>
            ))}
            </tbody>
        </table>
    )

    const renderCardsView = () => (
        <div style={cardsGridStyle}>
            {data.map((item) => {
                const primaryField = cardFields?.find((f) => f.primary)
                const secondaryField = cardFields?.find((f) => f.secondary)
                const otherFields = cardFields?.filter((f) => !f.primary && !f.secondary) || []

                return (
                    <div
                        key={item.id}
                        style={cardStyle}
                        onClick={() => onView && onView(item)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-2px)"
                            e.currentTarget.style.boxShadow = "0 4px 12px 0 rgba(0, 0, 0, 0.15)"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)"
                            e.currentTarget.style.boxShadow = "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
                        }}
                    >
                        {/* Header do Card */}
                        <div style={cardHeaderStyle}>
                            {primaryField && (
                                <h3 style={cardTitleStyle}>
                                    {primaryField.render ? primaryField.render(item) : getValue(item, primaryField.key)}
                                </h3>
                            )}
                            {secondaryField && (
                                <p style={cardSubtitleStyle}>
                                    {secondaryField.render ? secondaryField.render(item) : getValue(item, secondaryField.key)}
                                </p>
                            )}
                        </div>

                        {/* Body do Card */}
                        {otherFields.length > 0 && (
                            <div style={cardBodyStyle}>
                                {otherFields.map((field, index) => (
                                    <div key={index} style={cardFieldStyle}>
                                        <span style={cardFieldLabelStyle}>{field.label || String(field.key)}</span>
                                        <span style={cardFieldValueStyle}>
                      {field.render ? field.render(item) : getValue(item, field.key)}
                    </span>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Actions do Card */}
                        {hasActions && (
                            <div style={cardActionsStyle}>
                                {actions.view && onView && (
                                    <button
                                        style={actionButtonStyle("view")}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onView(item)
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "0.8"
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "1"
                                        }}
                                    >
                                        👁️
                                    </button>
                                )}
                                {actions.edit && onEdit && (
                                    <button
                                        style={actionButtonStyle("edit")}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onEdit(item)
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "0.8"
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "1"
                                        }}
                                    >
                                        ✏️
                                    </button>
                                )}
                                {actions.delete && onDelete && (
                                    <button
                                        style={actionButtonStyle("delete")}
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onDelete(item)
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = "0.8"
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = "1"
                                        }}
                                    >
                                        🗑️
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )

    return (
        <div style={containerStyle}>
            {showViewToggle && (
                <div style={headerStyle}>
                    <div></div> {/* Spacer */}
                    <div style={toggleContainerStyle}>
                        <button style={toggleButtonStyle(viewMode === "table")} onClick={() => setViewMode("table")}>
                            📊 Tabela
                        </button>
                        <button style={toggleButtonStyle(viewMode === "cards")} onClick={() => setViewMode("cards")}>
                            🃏 Cards
                        </button>
                    </div>
                </div>
            )}

            {viewMode === "table" ? renderTableView() : renderCardsView()}
        </div>
    )
}
