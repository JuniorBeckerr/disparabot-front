"use client"

import type React from "react"
import { useEffect } from "react"

interface ToastProps {
    message: string
    type: "success" | "error" | "info"
    isVisible: boolean
    onClose: () => void
    duration?: number
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose, duration = 3000 }) => {
    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                onClose()
            }, duration)
            return () => clearTimeout(timer)
        }
    }, [isVisible, duration, onClose])

    if (!isVisible) return null

    const getToastStyles = (): React.CSSProperties => {
        const baseStyles: React.CSSProperties = {
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "12px 20px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "500",
            fontSize: "14px",
            zIndex: 1000,
            minWidth: "300px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            animation: "slideIn 0.3s ease-out",
        }

        const typeStyles = {
            success: { backgroundColor: "#10b981" },
            error: { backgroundColor: "#ef4444" },
            info: { backgroundColor: "#3b82f6" },
        }

        return { ...baseStyles, ...typeStyles[type] }
    }

    const getIcon = () => {
        switch (type) {
            case "success":
                return "✅"
            case "error":
                return "❌"
            case "info":
                return "ℹ️"
            default:
                return ""
        }
    }

    return (
        <>
            <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
            <div style={getToastStyles()}>
                <span>{getIcon()}</span>
                <span>{message}</span>
                <button
                    onClick={onClose}
                    style={{
                        background: "none",
                        border: "none",
                        color: "white",
                        cursor: "pointer",
                        marginLeft: "auto",
                        fontSize: "16px",
                    }}
                >
                    ×
                </button>
            </div>
        </>
    )
}
