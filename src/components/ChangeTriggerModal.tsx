"use client"

import type React from "react"
import { useState } from "react"

interface ChangeTriggerModalProps {
    isOpen: boolean
    groupName: string
    currentTrigger?: number
    instances: Array<{ id: number; nome: string }>
    onClose: () => void
    onChangeTrigger: (instanceId: number) => void
    isLoading?: boolean
}

export const ChangeTriggerModal: React.FC<ChangeTriggerModalProps> = ({
                                                                          isOpen,
                                                                          groupName,
                                                                          currentTrigger,
                                                                          instances,
                                                                          onClose,
                                                                          onChangeTrigger,
                                                                          isLoading = false,
                                                                      }) => {
    const [selectedInstanceId, setSelectedInstanceId] = useState<number>(currentTrigger || instances[0]?.id || 0)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (selectedInstanceId && selectedInstanceId !== currentTrigger) {
            onChangeTrigger(selectedInstanceId)
        }
    }

    const handleClose = () => {
        setSelectedInstanceId(currentTrigger || instances[0]?.id || 0)
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
        maxWidth: "450px",
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

    const selectStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "8px",
        fontSize: "14px",
        fontFamily: "inherit",
        marginBottom: "20px",
        backgroundColor: "white",
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

    const changeButtonStyle: React.CSSProperties = {
        padding: "10px 20px",
        border: "none",
        borderRadius: "8px",
        backgroundColor: "#f59e0b",
        color: "white",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        opacity: isLoading ? 0.7 : 1,
    }

    const currentTriggerInstance = instances.find((inst) => inst.id === currentTrigger)
    const isChanged = selectedInstanceId !== currentTrigger

    return (
        <div style={overlayStyle} onClick={handleClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={headerStyle}>
                    <h2 style={titleStyle}>Alterar Trigger - {groupName}</h2>
                    <button style={closeButtonStyle} onClick={handleClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {currentTriggerInstance && (
                        <div
                            style={{
                                backgroundColor: "#f0f9ff",
                                border: "1px solid #0ea5e9",
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "16px",
                                fontSize: "14px",
                                color: "#0369a1",
                            }}
                        >
                            <strong>🎯 Trigger atual:</strong> {currentTriggerInstance.nome}
                        </div>
                    )}

                    <div style={{ marginBottom: "16px" }}>
                        <label style={{ display: "block", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
                            Nova Instância Disparadora
                        </label>
                        <select
                            style={selectStyle}
                            value={selectedInstanceId}
                            onChange={(e) => setSelectedInstanceId(Number(e.target.value))}
                            required
                            disabled={isLoading}
                        >
                            <option value="">Selecione uma instância</option>
                            {instances.map((instance) => (
                                <option key={instance.id} value={instance.id}>
                                    {instance.nome} {instance.id === currentTrigger ? "(atual)" : ""}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div
                        style={{
                            backgroundColor: "#fef3c7",
                            border: "1px solid #f59e0b",
                            borderRadius: "8px",
                            padding: "12px",
                            marginBottom: "20px",
                            fontSize: "13px",
                            color: "#92400e",
                        }}
                    >
                        <strong>⚠️ Atenção:</strong> A instância disparadora é responsável por enviar as mensagens para este grupo.
                        Certifique-se de que a nova instância esteja conectada.
                    </div>

                    <div style={buttonContainerStyle}>
                        <button type="button" style={cancelButtonStyle} onClick={handleClose} disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit" style={changeButtonStyle} disabled={isLoading || !selectedInstanceId || !isChanged}>
                            {isLoading ? "Alterando..." : "🔄 Alterar Trigger"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
