"use client"

import type React from "react"
import { useState } from "react"
import { CrudModal } from "../components/CrudModal"
import { CrudTable } from "../components/CrudTable"
import { useGetSchedules } from "../hooks/schedules/useGetSchedules"
import { useCreateSchedule } from "../hooks/schedules/useCreateSchedule"
import { useUpdateSchedule } from "../hooks/schedules/useUpdateSchedule"
import { useDeleteSchedule } from "../hooks/schedules/useDeleteSchedule"
import { useGetGroups } from "../hooks/groups/useGetGroups"
import { useGetCategorias } from "../hooks/category/useGetCategorias"
import { useGetTemplates } from "../hooks/templates/useGetTemplates"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"

interface Agendamento {
    id: number
    nome: string
    templateId: number
    templateNome: string
    categoriaId: number
    categoriaNome: string
    grupoId: number
    grupoNome: string
    dataAgendamento: string
    horaAgendamento: string
    status: "ativo" | "inativo" | "agendado" | "enviado" | "cancelado" | "erro" | "processando"
    criadoEm: string
    atualizadoEm: string
    enviadoEm?: string
    destinatarios: number
    mensagensEnviadas: number
    mensagensFalha: number
    observacoes?: string
    isActive: boolean
}

type ModalMode = "create" | "edit" | "view"

export const Agendamentos = () => {
    const { data: agendamentos = [], isLoading } = useGetSchedules()
    const { data: grupos = [] } = useGetGroups()
    const { data: categorias = [] } = useGetCategorias()
    const { data: templates = [] } = useGetTemplates()
    const createSchedule = useCreateSchedule()
    const updateSchedule = useUpdateSchedule()
    const deleteSchedule = useDeleteSchedule()

    const { toast, showToast, hideToast } = useToast()

    // Estado do modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("create")
    const [selectedItem, setSelectedItem] = useState<Agendamento | null>(null)
    const [formData, setFormData] = useState<Partial<Agendamento>>({})

    // Funções do modal
    const openModal = (mode: ModalMode, item?: Agendamento) => {
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
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleDelete = (id: number, confirmMessage: string) => {
        if (window.confirm(confirmMessage)) {
            deleteSchedule.mutate(id, {
                onSuccess: () => {
                    showToast("Agendamento deletado com sucesso!", "success")
                },
                onError: (error: any) => {
                    showToast(`Erro ao deletar agendamento: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        }
    }

    // Função para cancelar agendamento
    const handleCancel = (agendamento: Agendamento) => {
        if (agendamento.status !== "ativo" && agendamento.status !== "agendado") {
            showToast("Apenas agendamentos ativos podem ser cancelados!", "info")
            return
        }
        if (window.confirm(`Tem certeza que deseja cancelar o agendamento "${agendamento.nome}"?`)) {
            updateSchedule.mutate(
                {
                    id: agendamento.id,
                    data: {
                        group_id: agendamento.grupoId,
                        category_id: agendamento.categoriaId,
                        template_id: agendamento.templateId,
                        schedule_time: agendamento.horaAgendamento,
                        is_active: 0,
                    },
                },
                {
                    onSuccess: () => {
                        showToast(`Agendamento "${agendamento.nome}" cancelado com sucesso!`, "success")
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao cancelar agendamento: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

    // Função para reativar agendamento
    const handleReactivate = (agendamento: Agendamento) => {
        if (window.confirm(`Tem certeza que deseja reativar o agendamento "${agendamento.nome}"?`)) {
            updateSchedule.mutate(
                {
                    id: agendamento.id,
                    data: {
                        group_id: agendamento.grupoId,
                        category_id: agendamento.categoriaId,
                        template_id: agendamento.templateId,
                        schedule_time: agendamento.horaAgendamento,
                        is_active: 1,
                    },
                },
                {
                    onSuccess: () => {
                        showToast(`Agendamento "${agendamento.nome}" reativado com sucesso!`, "success")
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao reativar agendamento: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
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

    // Submit do formulário
    const handleAgendamentoSubmit = (data: Partial<Agendamento>) => {
        if (modalMode === "create") {
            const createData = {
                group_id: Number(data.grupoId!),
                category_id: Number(data.categoriaId!),
                template_id: Number(data.templateId!),
                schedule_time: data.horaAgendamento!,
                is_active: data.isActive ? 1 : 0,
            }

            createSchedule.mutate(createData, {
                onSuccess: () => {
                    showToast("Agendamento criado com sucesso!", "success")
                    closeModal()
                },
                onError: (error: any) => {
                    showToast(`Erro ao criar agendamento: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        } else if (modalMode === "edit" && selectedItem) {
            const updateData = {
                group_id: Number(data.grupoId!),
                category_id: Number(data.categoriaId!),
                template_id: Number(data.templateId!),
                schedule_time: data.horaAgendamento!,
                is_active: data.isActive ? 1 : 0,
            }

            updateSchedule.mutate(
                {
                    id: selectedItem.id,
                    data: updateData,
                },
                {
                    onSuccess: () => {
                        showToast("Agendamento atualizado com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao atualizar agendamento: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

    // Configuração dos campos do formulário
    const formFields = [
        {
            name: "templateId",
            label: "Template",
            type: "select" as const,
            required: true,
            options: templates.map((t: any) => ({ value: t.id, label: t.name })),
        },
        {
            name: "grupoId",
            label: "Grupo",
            type: "select" as const,
            required: true,
            options: grupos.map((g: any) => ({ value: g.id, label: g.nome })),
        },
        {
            name: "categoriaId",
            label: "Categoria",
            type: "select" as const,
            required: true,
            options: categorias.map((c: any) => ({ value: c.id, label: c.nome })),
        },
        {
            name: "horaAgendamento",
            label: "Horário (HH:MM)",
            type: "text" as const,
            required: true,
            placeholder: "08:00",
        },
        {
            name: "isActive",
            label: "Status",
            type: "select" as const,
            options: [
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" }
            ],
        },
    ]

    // Configuração das colunas da tabela
    const tableColumns = [
        {
            key: "nome" as keyof Agendamento,
            label: "Agendamento",
            render: (agendamento: Agendamento) => (
                <div>
                    <strong>{agendamento.templateNome}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>
                        {agendamento.grupoNome} • {agendamento.categoriaNome}
                    </small>
                </div>
            ),
        },
        {
            key: "categoriaId" as keyof Agendamento,
            label: "Categoria",
            render: (agendamento: Agendamento) => {
                const categoria = categorias.find((c: any) => c.id === agendamento.categoriaId)
                return (
                    <span
                        style={{
                            padding: "4px 12px",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "500",
                            backgroundColor: categoria ? `${categoria.cor}20` : "#f3f4f6",
                            color: categoria?.cor || "#6b7280",
                        }}
                    >
            {agendamento.categoriaNome}
          </span>
                )
            },
        },
        {
            key: "horaAgendamento" as keyof Agendamento,
            label: "Horário",
            render: (agendamento: Agendamento) => (
                <div style={{ fontSize: "14px", fontWeight: "500", textAlign: "center" }}>🕐 {agendamento.horaAgendamento}</div>
            ),
        },
        {
            key: "status" as keyof Agendamento,
            label: "Status",
            render: (agendamento: Agendamento) => {
                const status = agendamento.isActive ? "ativo" : "inativo"
                const statusConfig = {
                    ativo: { bg: "#dcfce7", color: "#166534", icon: "✅" },
                    inativo: { bg: "#fef2f2", color: "#dc2626", icon: "❌" },
                }
                const config = statusConfig[status]
                return (
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
                style={{
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor: config.bg,
                    color: config.color,
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                }}
            >
              {config.icon} {status}
            </span>
                        {agendamento.isActive ? (
                            <button
                                style={{
                                    background: "none",
                                    border: "1px solid #dc2626",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    fontSize: "10px",
                                    cursor: "pointer",
                                    color: "#dc2626",
                                }}
                                onClick={() => handleCancel(agendamento)}
                            >
                                Cancelar
                            </button>
                        ) : (
                            <button
                                style={{
                                    background: "none",
                                    border: "1px solid #059669",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    fontSize: "10px",
                                    cursor: "pointer",
                                    color: "#059669",
                                }}
                                onClick={() => handleReactivate(agendamento)}
                            >
                                Reativar
                            </button>
                        )}
                    </div>
                )
            },
        },
        {
            key: "criadoEm" as keyof Agendamento,
            label: "Criado",
            render: (agendamento: Agendamento) => new Date(agendamento.criadoEm).toLocaleDateString("pt-BR"),
        },
    ]

    // Configuração dos campos para visualização em cards
    const cardFields = [
        {
            key: "templateNome" as keyof Agendamento,
            primary: true,
            render: (agendamento: Agendamento) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: agendamento.isActive ? "#06b6d4" : "#6b7280",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                        }}
                    >
                        📅
                    </div>
                    {agendamento.templateNome}
                </div>
            ),
        },
        {
            key: "grupoNome" as keyof Agendamento,
            secondary: true,
            render: (agendamento: Agendamento) => `${agendamento.grupoNome} • ${agendamento.categoriaNome}`,
        },
        {
            key: "horaAgendamento" as keyof Agendamento,
            label: "Horário",
            render: (agendamento: Agendamento) => `🕐 ${agendamento.horaAgendamento}`,
        },
        {
            key: "status" as keyof Agendamento,
            label: "Status",
            render: (agendamento: Agendamento) => {
                const status = agendamento.isActive ? "ativo" : "inativo"
                return status === "ativo" ? "✅ Ativo" : "❌ Inativo"
            },
        },
        {
            key: "criadoEm" as keyof Agendamento,
            label: "Criado",
            render: (agendamento: Agendamento) => new Date(agendamento.criadoEm).toLocaleDateString("pt-BR"),
        },
    ]

    // Campos extras para visualização
    const extraViewFields = selectedItem
        ? [
            { label: "Template", value: selectedItem.templateNome },
            { label: "Grupo", value: selectedItem.grupoNome },
            { label: "Categoria", value: selectedItem.categoriaNome },
            { label: "Horário", value: selectedItem.horaAgendamento },
            { label: "Status", value: selectedItem.isActive ? "Ativo" : "Inativo" },
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
        backgroundColor: "#06b6d4",
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
    const totalAgendamentos = agendamentos.length
    const agendamentosAtivos = agendamentos.filter((a: any) => a.isActive).length
    const agendamentosInativos = agendamentos.filter((a: any) => !a.isActive).length
    const totalTemplates = new Set(agendamentos.map((a: any) => a.templateId)).size
    const totalGrupos = new Set(agendamentos.map((a: any) => a.grupoId)).size

    if (isLoading) {
        return (
                <div style={containerStyle}>
                    <div>Carregando agendamentos...</div>
                </div>
        )
    }

    return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Agendamentos</h1>
                    <button
                        style={{
                            ...createButtonStyle,
                            opacity: createSchedule.isPending ? 0.7 : 1,
                            cursor: createSchedule.isPending ? "not-allowed" : "pointer",
                        }}
                        onClick={() => openModal("create")}
                        disabled={createSchedule.isPending}
                        onMouseEnter={(e) => {
                            if (!createSchedule.isPending) {
                                e.currentTarget.style.backgroundColor = "#0891b2"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!createSchedule.isPending) {
                                e.currentTarget.style.backgroundColor = "#06b6d4"
                            }
                        }}
                    >
                        {createSchedule.isPending ? "⏳ Criando..." : "➕ Criar Agendamento"}
                    </button>
                </div>

                {/* Estatísticas */}
                <div style={statsStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalAgendamentos}</div>
                        <div style={statLabelStyle}>Total</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{agendamentosAtivos}</div>
                        <div style={statLabelStyle}>Ativos</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{agendamentosInativos}</div>
                        <div style={statLabelStyle}>Inativos</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalTemplates}</div>
                        <div style={statLabelStyle}>Templates</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalGrupos}</div>
                        <div style={statLabelStyle}>Grupos</div>
                    </div>
                </div>

                <CrudTable
                    data={agendamentos}
                    columns={tableColumns}
                    cardFields={cardFields}
                    onView={(agendamento) => openModal("view", agendamento)}
                    onEdit={(agendamento) => openModal("edit", agendamento)}
                    onDelete={(agendamento) =>
                        handleDelete(
                            agendamento.id,
                            `Tem certeza que deseja excluir o agendamento "${agendamento.templateNome}"? Esta ação não pode ser desfeita.`,
                        )
                    }
                    defaultView="table"
                    showViewToggle={true}
                    isLoading={deleteSchedule.isPending}
                />

                <CrudModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    title={getModalTitle("Agendamento")}
                    fields={formFields}
                    data={formData}
                    onClose={closeModal}
                    onSubmit={handleAgendamentoSubmit}
                    onChange={handleFieldChange}
                    extraViewFields={extraViewFields}
                    isLoading={createSchedule.isPending || updateSchedule.isPending}
                />

                <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
            </div>
    )
}
