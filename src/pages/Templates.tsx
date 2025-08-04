"use client"

import type React from "react"
import { useState } from "react"
import { CrudModal } from "../components/CrudModal"
import { CrudTable } from "../components/CrudTable"
import { useGetTemplates } from "../hooks/templates/useGetTemplates"
import { useCreateTemplate } from "../hooks/templates/useCreateTemplate"
import { useUpdateTemplate } from "../hooks/templates/useUpdateTemplate"
import { useDeleteTemplate } from "../hooks/templates/useDeleteTemplate"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"

interface Template {
    id: number
    name: string
    conteudo: string
    criadoEm: string
    atualizadoEm: string
    ultimoUso?: string
    vezesUsado: number
    tamanho: number // caracteres
    categoria: string
    status: "ativo" | "inativo"
}

type ModalMode = "create" | "edit" | "view"

export const Templates = () => {
    const { data: templates = [], isLoading } = useGetTemplates()
    const createTemplate = useCreateTemplate()
    const updateTemplate = useUpdateTemplate()
    const deleteTemplate = useDeleteTemplate()

    const { toast, showToast, hideToast } = useToast()

    // Estado do modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("create")
    const [selectedItem, setSelectedItem] = useState<Template | null>(null)
    const [formData, setFormData] = useState<Partial<Template>>({})

    // Funções do modal
    const openModal = (mode: ModalMode, item?: Template) => {
        setModalMode(mode)
        setSelectedItem(item || null)
        setFormData(item || {})
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedItem(null)
        setFormData({})
    }

    const handleFieldChange = (field: string, value: any) => {
        if (field === "conteudo") {
            const tamanho = contarCaracteres(value)
            setFormData((prev) => ({ ...prev, [field]: value, tamanho }))
        } else {
            setFormData((prev) => ({ ...prev, [field]: value }))
        }
    }

    const handleDelete = (id: number, confirmMessage: string) => {
        if (window.confirm(confirmMessage)) {
            deleteTemplate.mutate(id, {
                onSuccess: () => {
                    showToast("Template deletado com sucesso!", "success")
                },
                onError: (error: any) => {
                    showToast(`Erro ao deletar template: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        }
    }

    const getModalTitle = (entityName: string) => {
        switch (modalMode) {
            case "create":
                return `Criar ${entityName}`
            case "edit":
                return `Editar ${entityName}`
            case "view":
                return `Visualizar ${entityName}`
            default:
                return entityName
        }
    }

    // Função para contar caracteres do conteúdo
    const contarCaracteres = (texto: string) => {
        return texto?.length || 0
    }

    // Função para duplicar template
    const handleDuplicate = (template: Template) => {
        const duplicateData = {
            name: `${template.name} (Cópia)`,
            content: template.conteudo,
        }

        createTemplate.mutate(duplicateData, {
            onSuccess: () => {
                showToast(`Template "${template.name}" duplicado com sucesso!`, "success")
            },
            onError: (error: any) => {
                showToast(`Erro ao duplicar template: ${error.message || "Erro desconhecido"}`, "error")
            },
        })
    }

    // Submit do formulário
    const handleTemplateSubmit = (data: Partial<Template>) => {
        if (modalMode === "create") {
            const createData = {
                name: data.name!,
                content: data.conteudo!,
            }

            createTemplate.mutate(createData, {
                onSuccess: () => {
                    showToast("Template criado com sucesso!", "success")
                    closeModal()
                },
                onError: (error: any) => {
                    showToast(`Erro ao criar template: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        } else if (modalMode === "edit" && selectedItem) {
            const updateData = {
                name: data.name!,
                content: data.conteudo!,
            }

            updateTemplate.mutate(
                {
                    id: selectedItem.id,
                    data: updateData,
                },
                {
                    onSuccess: () => {
                        showToast("Template atualizado com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao atualizar template: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

    // Configuração dos campos do formulário
    const formFields = [
        {
            name: "name",
            label: "Nome do Template",
            type: "text" as const,
            required: true,
        },
        {
            name: "conteudo",
            label: "Conteúdo do Template",
            type: "textarea" as const,
            required: true,
        },
    ]

    // Configuração das colunas da tabela
    const tableColumns = [
        {
            key: "name" as keyof Template,
            label: "Template",
            render: (template: Template) => (
                <div>
                    <strong>{template.name}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>{template.tamanho} caracteres</small>
                </div>
            ),
        },
        {
            key: "conteudo" as keyof Template,
            label: "Prévia",
            render: (template: Template) => (
                <div style={{ maxWidth: "300px", fontSize: "12px", color: "#6b7280" }}>
                    {template.conteudo.length > 100 ? `${template.conteudo.substring(0, 100)}...` : template.conteudo}
                </div>
            ),
        },
        {
            key: "tamanho" as keyof Template,
            label: "Tamanho",
            render: (template: Template) => (
                <div style={{ textAlign: "center" }}>
                    <strong style={{ color: "#059669" }}>{template.tamanho}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>chars</small>
                </div>
            ),
        },
        {
            key: "vezesUsado" as keyof Template,
            label: "Uso",
            render: (template: Template) => (
                <div style={{ textAlign: "center" }}>
                    <strong style={{ color: "#3b82f6" }}>{template.vezesUsado}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>vezes</small>
                </div>
            ),
        },
        {
            key: "atualizadoEm" as keyof Template,
            label: "Atualizado",
            render: (template: Template) => new Date(template.atualizadoEm).toLocaleDateString("pt-BR"),
        },
        {
            key: "actions" as keyof Template,
            label: "Ações",
            render: (template: Template) => (
                <div style={{ display: "flex", gap: "8px" }}>
                    <button
                        style={{
                            background: "none",
                            border: "1px solid #6b7280",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "10px",
                            cursor: "pointer",
                            color: "#6b7280",
                        }}
                        onClick={() => handleDuplicate(template)}
                        disabled={createTemplate.isPending}
                    >
                        📋 Duplicar
                    </button>
                </div>
            ),
        },
    ]

    // Configuração dos campos para visualização em cards
    const cardFields = [
        {
            key: "name" as keyof Template,
            primary: true,
            render: (template: Template) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: "#f59e0b",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                        }}
                    >
                        📄
                    </div>
                    {template.name}
                </div>
            ),
        },
        {
            key: "conteudo" as keyof Template,
            secondary: true,
            render: (template: Template) =>
                template.conteudo.length > 80 ? `${template.conteudo.substring(0, 80)}...` : template.conteudo,
        },
        {
            key: "tamanho" as keyof Template,
            label: "Tamanho",
            render: (template: Template) => `${template.tamanho} caracteres`,
        },
        {
            key: "vezesUsado" as keyof Template,
            label: "Usado",
            render: (template: Template) => `${template.vezesUsado} vezes`,
        },
        {
            key: "categoria" as keyof Template,
            label: "Categoria",
            render: (template: Template) => {
                const categoriaLabels: Record<string, string> = {
                    vendas: "Vendas",
                    promocao: "Promoção",
                    suporte: "Suporte",
                    recuperacao: "Recuperação",
                    confirmacao: "Confirmação",
                    feedback: "Feedback",
                    geral: "Geral",
                }
                return categoriaLabels[template.categoria] || template.categoria
            },
        },
        {
            key: "ultimoUso" as keyof Template,
            label: "Último Uso",
            render: (template: Template) =>
                template.ultimoUso ? new Date(template.ultimoUso).toLocaleDateString("pt-BR") : "Nunca usado",
        },
    ]

    // Campos extras para visualização
    const extraViewFields = selectedItem
        ? [
            { label: "Tamanho", value: `${selectedItem.tamanho} caracteres` },
            { label: "Vezes usado", value: selectedItem.vezesUsado.toString() },
            {
                label: "Último uso",
                value: selectedItem.ultimoUso ? new Date(selectedItem.ultimoUso).toLocaleString("pt-BR") : "Nunca usado",
            },
            { label: "Categoria", value: selectedItem.categoria },
            { label: "Status", value: selectedItem.status },
            { label: "Criado em", value: new Date(selectedItem.criadoEm).toLocaleDateString("pt-BR") },
            { label: "Atualizado em", value: new Date(selectedItem.atualizadoEm).toLocaleDateString("pt-BR") },
        ]
        : []

    // Styles
    const containerStyle: React.CSSProperties = {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }

    const headerStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "24px",
    }

    const titleStyle: React.CSSProperties = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#1e293b",
        margin: 0,
    }

    const statsStyle: React.CSSProperties = {
        display: "flex",
        gap: "20px",
        marginBottom: "24px",
    }

    const statCardStyle: React.CSSProperties = {
        backgroundColor: "#f8fafc",
        padding: "16px",
        borderRadius: "8px",
        minWidth: "120px",
        textAlign: "center",
    }

    const statValueStyle: React.CSSProperties = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#1e293b",
        marginBottom: "4px",
    }

    const statLabelStyle: React.CSSProperties = {
        fontSize: "12px",
        color: "#64748b",
        textTransform: "uppercase",
    }

    const createButtonStyle: React.CSSProperties = {
        backgroundColor: "#f59e0b",
        color: "white",
        border: "none",
        borderRadius: "8px",
        padding: "12px 20px",
        fontSize: "14px",
        fontWeight: "500",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        transition: "background-color 0.2s",
    }

    // Calcular estatísticas
    const totalTemplates = templates.length
    const templatesAtivos = templates.filter((t: any) => t.status === "ativo").length
    const totalUsos = templates.reduce((acc: any, t: any) => acc + t.vezesUsado, 0)
    const mediaCaracteres =
        totalTemplates > 0 ? Math.round(templates.reduce((acc: any, t: any) => acc + t.tamanho, 0) / totalTemplates) : 0

    if (isLoading) {
        return (
                <div style={containerStyle}>
                    <div>Carregando templates...</div>
                </div>
        )
    }

    return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Templates</h1>
                    <button
                        style={{
                            ...createButtonStyle,
                            opacity: createTemplate.isPending ? 0.7 : 1,
                            cursor: createTemplate.isPending ? "not-allowed" : "pointer",
                        }}
                        onClick={() => openModal("create")}
                        disabled={createTemplate.isPending}
                        onMouseEnter={(e) => {
                            if (!createTemplate.isPending) {
                                e.currentTarget.style.backgroundColor = "#d97706"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!createTemplate.isPending) {
                                e.currentTarget.style.backgroundColor = "#f59e0b"
                            }
                        }}
                    >
                        {createTemplate.isPending ? "⏳ Criando..." : "➕ Criar Template"}
                    </button>
                </div>

                {/* Estatísticas */}
                <div style={statsStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalTemplates}</div>
                        <div style={statLabelStyle}>Total</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{templatesAtivos}</div>
                        <div style={statLabelStyle}>Ativos</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalUsos}</div>
                        <div style={statLabelStyle}>Usos</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{mediaCaracteres}</div>
                        <div style={statLabelStyle}>Média Chars</div>
                    </div>
                </div>

                <CrudTable
                    data={templates}
                    columns={tableColumns}
                    cardFields={cardFields}
                    onView={(template) => openModal("view", template)}
                    onEdit={(template) => openModal("edit", template)}
                    onDelete={(template) =>
                        handleDelete(
                            template.id,
                            `Tem certeza que deseja excluir o template "${template.name}"? Esta ação não pode ser desfeita.`,
                        )
                    }
                    defaultView="table"
                    showViewToggle={true}
                    isLoading={deleteTemplate.isPending}
                />

                <CrudModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    title={getModalTitle("Template")}
                    fields={formFields}
                    data={formData}
                    onClose={closeModal}
                    onSubmit={handleTemplateSubmit}
                    onChange={handleFieldChange}
                    extraViewFields={extraViewFields}
                    isLoading={createTemplate.isPending || updateTemplate.isPending}
                />

                <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
            </div>
    )
}
