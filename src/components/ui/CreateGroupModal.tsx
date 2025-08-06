"use client"

import type React from "react"
import { MultiSelectField } from "./MultiSelectField"

interface CreateGroupModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: any) => void
    formData: any
    onChange: (field: string, value: any) => void
    instancias: any[]
    categorias: any[]
    isLoading?: boolean
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
                                                                      isOpen,
                                                                      onClose,
                                                                      onSubmit,
                                                                      formData,
                                                                      onChange,
                                                                      instancias,
                                                                      categorias,
                                                                      isLoading = false,
                                                                  }) => {
    if (!isOpen) return null

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
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
        maxWidth: "600px",
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

    const inputStyle: React.CSSProperties = {
        width: "100%",
        padding: "12px",
        border: "1px solid #d1d5db",
        borderRadius: "6px",
        fontSize: "14px",
        color: "#374151",
        outline: "none",
        transition: "border-color 0.2s",
        boxSizing: "border-box",
        backgroundColor: "white",
    }

    const textareaStyle: React.CSSProperties = {
        ...inputStyle,
        minHeight: "80px",
        resize: "vertical",
    }

    const selectStyle: React.CSSProperties = {
        ...inputStyle,
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
        cursor: isLoading ? "not-allowed" : "pointer",
        opacity: isLoading ? 0.7 : 1,
    }

    const descriptionStyle: React.CSSProperties = {
        fontSize: "12px",
        color: "#6b7280",
        marginTop: "4px",
    }

    return (
        <div style={modalOverlayStyle} onClick={onClose}>
            <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div style={modalHeaderStyle}>
                    <h2 style={modalTitleStyle}>Criar Novo Grupo</h2>
                    <button style={closeButtonStyle} onClick={onClose}>
                        ×
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Nome do Grupo */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>
                            Nome do Grupo <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <input
                            type="text"
                            style={inputStyle}
                            value={formData.nome || ""}
                            onChange={(e) => onChange("nome", e.target.value)}
                            required
                            placeholder="Digite o nome do grupo"
                        />
                    </div>

                    {/* Descrição */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Descrição</label>
                        <textarea
                            style={textareaStyle}
                            value={formData.descricao || ""}
                            onChange={(e) => onChange("descricao", e.target.value)}
                            placeholder="Digite uma descrição para o grupo"
                        />
                    </div>

                    {/* Categoria */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Categoria</label>
                        <select
                            style={selectStyle}
                            value={formData.categoryId || ""}
                            onChange={(e) => onChange("categoryId", e.target.value)}
                        >
                            <option value="">Sem categoria</option>
                            {categorias.map((cat: any) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.nome}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* URL da Imagem */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>URL da Imagem</label>
                        <input
                            type="text"
                            style={inputStyle}
                            value={formData.imageUrl || ""}
                            onChange={(e) => onChange("imageUrl", e.target.value)}
                            placeholder="https://exemplo.com/imagem.jpg"
                        />
                    </div>

                    {/* Participantes */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>
                            Participantes <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <textarea
                            style={textareaStyle}
                            value={formData.participants || ""}
                            onChange={(e) => onChange("participants", e.target.value)}
                            required
                            placeholder="Digite os números dos participantes separados por vírgula&#10;Exemplo: 5511999999999, 5511888888888"
                        />
                        <div style={descriptionStyle}>
                            Digite os números dos participantes separados por vírgula (com código do país)
                        </div>
                    </div>

                    {/* Instância Disparadora */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>
                            Instância Disparadora <span style={{ color: "#ef4444" }}>*</span>
                        </label>
                        <select
                            style={selectStyle}
                            value={formData.triggerInstanceId || ""}
                            onChange={(e) => onChange("triggerInstanceId", Number.parseInt(e.target.value))}
                            required
                        >
                            <option value="">Selecione a instância disparadora</option>
                            {instancias.map((inst: any) => (
                                <option key={inst.id} value={inst.id}>
                                    {inst.nome}
                                </option>
                            ))}
                        </select>
                        <div style={descriptionStyle}>Esta instância será responsável por disparar as mensagens do grupo</div>
                    </div>

                    {/* Instâncias Adicionais - MultiSelect */}
                    <div style={formGroupStyle}>
                        <label style={labelStyle}>Instâncias Adicionais</label>
                        <MultiSelectField
                            options={instancias.map((inst: any) => ({
                                value: inst.id,
                                label: inst.nome,
                            }))}
                            value={formData.selectedInstances || []}
                            onChange={(values) => onChange("selectedInstances", values)}
                            placeholder="Selecione instâncias adicionais..."
                            disabled={isLoading}
                        />
                        <div style={descriptionStyle}>
                            Selecione instâncias adicionais que também farão parte do grupo. A instância disparadora será
                            automaticamente excluída desta lista.
                        </div>
                    </div>

                    <div style={modalButtonsStyle}>
                        <button type="button" style={cancelButtonStyle} onClick={onClose} disabled={isLoading}>
                            Cancelar
                        </button>
                        <button type="submit" style={submitButtonStyle} disabled={isLoading}>
                            {isLoading ? "Criando..." : "Criar Grupo"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}
