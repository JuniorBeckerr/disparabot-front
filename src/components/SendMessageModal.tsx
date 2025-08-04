"use client"

import type React from "react"
import { useState } from "react"

interface SendMessageModalProps {
    isOpen: boolean
    groupName: string
    onClose: () => void
    onSend: (message: string) => void
    isLoading?: boolean
}

export const SendMessageModal: React.FC<SendMessageModalProps> = ({
                                                                      isOpen,
                                                                      groupName,
                                                                      onClose,
                                                                      onSend,
                                                                      isLoading = false,
                                                                  }) => {
    const [message, setMessage] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (message.trim()) {
            onSend(message.trim())
            setMessage("")
        }
    }

    const handleClose = () => {
        setMessage("")
        onClose()
    }

    if (!isOpen) return null

    const overlayStyle: React.CSSProperties = {
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
        maxHeight: "80vh",
        overflow: "auto",
    }

    const headerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px",
        paddingBottom: "12px",
        borderBottom: "1px solid #e5e7eb",
    }

    const titleStyle: React.CSSProperties = {
        fontSize: "18px",
        fontWeight: "600",
        color: "#1f2937",
        margin: 0,
    }

    const closeButtonStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        fontSize: "24px",
        cursor: "pointer",
        color: "#6b7280",
        padding: "0",
        width: "32px",
        height: "32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }

    const textareaStyle: React.CSSProperties = {
        width: "100%",
        minHeight: "120px",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        fontFamily: "inherit",
        resize: "vertical",
        marginBottom: "20px",
    }

    const buttonContainerStyle: React.CSSProperties = {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end",
    }

    const cancelButtonStyle: React.CSSProperties = {
        padding: "10px 20px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        backgroundColor: "white",
        color: "#374151",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
    }

    const sendButtonStyle: React.CSSProperties = {
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#10b981",
        color: "white",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        opacity: isLoading ? 0.7 : 1,
    }

    return (
        <div style={overlayStyle} onClick={handleClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>Enviar Mensagem - {groupName}</h2>
                    <button style={closeButtonStyle} onClick={handleClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                            Mensagem
                        </label>
                        <textarea
                            style={textareaStyle}
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="Digite sua mensagem aqui..."
                            required
                            disabled={isLoading}
                        />
                    </div>

                    <div style={buttonContainerStyle}>
                        <button type="button" style={cancelButtonStyle} onClick={handleClose} disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit" style={sendButtonStyle} disabled={isLoading || !message.trim()}>
                            {isLoading ? "Enviando..." : "📤 Enviar Mensagem"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
