"use client"

import type React from "react"
import { useState } from "react"
import { CrudModal } from "../components/CrudModal"
import { CrudTable } from "../components/CrudTable"
// @ts-ignore
import { SendMessageModal } from "../components/SendMessageModal"
import { useGetGroups } from "../hooks/groups/useGetGroups"
import { useCreateGroup } from "../hooks/groups/useCreateGroup"
import { useUpdateGroup } from "../hooks/groups/useUpdateGroup"
import { useDeleteGroup } from "../hooks/groups/useDeleteGroup"
import { useSendGroupMessage } from "../hooks/groups/useSendGroupMessage"
import { useUpdateGroupTrigger } from "../hooks/groups/useUpdateGroupTrigger"
import { useGetInstances } from "../hooks/instances/useGetInstances"
import { useGetCategorias } from "../hooks/category/useGetCategorias"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"
// @ts-ignore
import { ChangeTriggerModal } from "../components/ChangeTriggerModal"

interface Grupo {
    id: number
    nome: string
    groupId: string
    descricao: string
    inviteCode: string
    imageUrl?: string
    isActive: boolean
    categoryId?: number
    criadoEm: string
    atualizadoEm: string
    membros: number
    status: "ativo" | "inativo"
}

type ModalMode = "create" | "edit" | "view"

export const Grupos = () => {
    const { data: grupos = [], isLoading } = useGetGroups()
    const { data: instancias = [] } = useGetInstances()
    const { data: categorias = [] } = useGetCategorias()
    const createGroup = useCreateGroup()
    const updateGroup = useUpdateGroup()
    const deleteGroup = useDeleteGroup()
    const sendMessage = useSendGroupMessage()
    const updateTrigger = useUpdateGroupTrigger()

    const { toast, showToast, hideToast } = useToast()

    // Estado do modal principal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("create")
    const [selectedItem, setSelectedItem] = useState<Grupo | null>(null)
    const [formData, setFormData] = useState<
        Partial<
            Grupo & {
            participants: string
            selectedInstances: number[]
            triggerInstanceId: number
        }
        >
    >({})

    // Estado do modal de mensagem
    const [messageModal, setMessageModal] = useState<{
        isOpen: boolean
        group: Grupo | null
    }>({
        isOpen: false,
        group: null,
    })

    // Estado do modal de trigger
    const [triggerModal, setTriggerModal] = useState<{
        isOpen: boolean
        group: Grupo | null
    }>({
        isOpen: false,
        group: null,
    })

    // Funções do modal principal
    const openModal = (mode: ModalMode, item?: Grupo) => {
        setModalMode(mode)
        setSelectedItem(item || null)
        if (item) {
            setFormData({
                ...item,
                participants: "",
                selectedInstances: [],
                triggerInstanceId: instancias[0]?.id || 0,
            })
        } else {
            setFormData({
                participants: "",
                selectedInstances: [],
                triggerInstanceId: instancias[0]?.id || 0,
            })
        }
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
            deleteGroup.mutate(id, {
                onSuccess: () => {
                    showToast("Grupo deletado com sucesso!", "success")
                },
                onError: (error: any) => {
                    showToast(`Erro ao deletar grupo: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        }
    }

    // Função para enviar mensagem
    const handleSendMessage = (group: Grupo) => {
        setMessageModal({
            isOpen: true,
            group,
        })
    }

    // Função para alterar trigger
    const handleChangeTrigger = (group: Grupo) => {
        setTriggerModal({
            isOpen: true,
            group,
        })
    }

    const handleChangeTriggerSubmit = (instanceId: number) => {
        if (triggerModal.group) {
            updateTrigger.mutate(
                {
                    groupId: triggerModal.group.id,
                    data: { instance_id: instanceId },
                },
                {
                    onSuccess: () => {
                        showToast(`Trigger do grupo "${triggerModal.group!.nome}" alterado com sucesso!`, "success")
                        setTriggerModal({ isOpen: false, group: null })
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao alterar trigger: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

    const handleSendMessageSubmit = (message: string) => {
        if (messageModal.group) {
            sendMessage.mutate(
                {
                    groupId: messageModal.group.id,
                    data: { message },
                },
                {
                    onSuccess: () => {
                        showToast(`Mensagem enviada para o grupo "${messageModal.group!.nome}"!`, "success")
                        setMessageModal({ isOpen: false, group: null })
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao enviar mensagem: ${error.message || "Erro desconhecido"}`, "error")
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
    const handleGroupSubmit = (data: any) => {
        if (modalMode === "create") {
            const participants = data.participants
                ? data.participants
                    .split(",")
                    .map((p: string) => p.trim())
                    .filter(Boolean)
                : []

            const createData = {
                instance_id: data.triggerInstanceId,
                subject: data.nome,
                category_id: data.categoryId || undefined,
                participants,
                description: data.descricao || "",
                image_url: data.imageUrl || "",
                extra_instances: data.selectedInstances?.filter((id: number) => id !== data.triggerInstanceId) || [],
                trigger_instance_id: data.triggerInstanceId,
            }

            createGroup.mutate(createData, {
                onSuccess: () => {
                    showToast("Grupo criado com sucesso!", "success")
                    closeModal()
                },
                onError: (error: any) => {
                    showToast(`Erro ao criar grupo: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        } else if (modalMode === "edit" && selectedItem) {
            const updateData = {
                name: data.nome,
                description: data.descricao,
                category_id: data.categoryId || null,
                is_active: data.isActive,
                image_url: data.imageUrl || "",
            }

            updateGroup.mutate(
                {
                    id: selectedItem.id,
                    data: updateData,
                },
                {
                    onSuccess: () => {
                        showToast("Grupo atualizado com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao atualizar grupo: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

    // Configuração dos campos do formulário
    const getFormFields = () => {
        const baseFields = [
            {
                name: "nome",
                label: "Nome do Grupo",
                type: "text" as const,
                required: true,
            },
            {
                name: "descricao",
                label: "Descrição",
                type: "textarea" as const,
                required: false,
            },
            {
                name: "categoryId",
                label: "Categoria",
                type: "select" as const,
                required: false,
                options: [
                    { value: "", label: "Sem categoria" },
                    ...categorias.map((cat: any) => ({
                        value: cat.id,
                        label: cat.nome,
                    })),
                ],
            },
            {
                name: "imageUrl",
                label: "URL da Imagem",
                type: "text" as const,
                required: false,
            },
        ]

        if (modalMode === "create") {
            baseFields.push(
                {
                    name: "participants",
                    label: "Participantes (números separados por vírgula)",
                    type: "textarea" as const,
                    required: true,
                },
                {
                    name: "triggerInstanceId",
                    label: "Instância Disparadora",
                    type: "select" as const,
                    required: true,
                    options: instancias.map((inst: any) => ({
                        value: inst.id,
                        label: inst.nome,
                    })),
                },
                {
                    name: "selectedInstances",
                    label: "Instâncias Adicionais",
                    type: "select",
                    required: false,
                    options: instancias.map((inst: any) => ({
                        value: inst.id,
                        label: inst.nome,
                    })),
                },
            )
        } else if (modalMode === "edit") {
            baseFields.push({
                name: "isActive",
                label: "Status",
                required: true,
                type: "select" as const,
                options: [
                    { value: true, label: "Ativo" },
                    { value: false, label: "Inativo" },
                ],
            })
        }

        return baseFields
    }

    // Configuração das colunas da tabela
    const tableColumns = [
        {
            key: "nome" as keyof Grupo,
            label: "Grupo",
            render: (grupo: Grupo) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {grupo.imageUrl ? (
                        <img
                            src={grupo.imageUrl || "/placeholder.svg"}
                            alt={grupo.nome}
                            style={{
                                width: "40px",
                                height: "40px",
                                borderRadius: "8px",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "40px",
                                height: "40px",
                                backgroundColor: grupo.isActive ? "#3b82f6" : "#6b7280",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                            }}
                        >
                            👥
                        </div>
                    )}
                    <div>
                        <strong>{grupo.nome}</strong>
                        <br />
                        <small style={{ color: "#6b7280" }}>ID: {grupo.groupId.substring(0, 15)}...</small>
                    </div>
                </div>
            ),
        },
        {
            key: "descricao" as keyof Grupo,
            label: "Descrição",
            render: (grupo: Grupo) => (
                <div style={{ maxWidth: "200px" }}>
                    {grupo.descricao.length > 50 ? `${grupo.descricao.substring(0, 50)}...` : grupo.descricao}
                </div>
            ),
        },
        {
            key: "inviteCode" as keyof Grupo,
            label: "Código de Convite",
            render: (grupo: Grupo) => (
                <div style={{ fontSize: "12px", fontFamily: "monospace" }}>{grupo.inviteCode.substring(0, 10)}...</div>
            ),
        },
        {
            key: "status" as keyof Grupo,
            label: "Status",
            render: (grupo: Grupo) => {
                const statusConfig = {
                    ativo: { bg: "#dcfce7", color: "#166534", icon: "✅" },
                    inativo: { bg: "#fef2f2", color: "#dc2626", icon: "❌" },
                }
                const config = statusConfig[grupo.status]
                return (
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
                            width: "fit-content",
                        }}
                    >
            {config.icon} {grupo.status}
          </span>
                )
            },
        },
        {
            key: "criadoEm" as keyof Grupo,
            label: "Criado",
            render: (grupo: Grupo) => new Date(grupo.criadoEm).toLocaleDateString("pt-BR"),
        },
        {
            key: "actions" as keyof Grupo,
            label: "Ações",
            render: (grupo: Grupo) => (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    <button
                        style={{
                            background: "none",
                            border: "1px solid #10b981",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "10px",
                            cursor: "pointer",
                            color: "#10b981",
                        }}
                        onClick={() => handleSendMessage(grupo)}
                    >
                        📤 Mensagem
                    </button>
                    <button
                        style={{
                            background: "none",
                            border: "1px solid #f59e0b",
                            borderRadius: "4px",
                            padding: "4px 8px",
                            fontSize: "10px",
                            cursor: "pointer",
                            color: "#f59e0b",
                        }}
                        onClick={() => handleChangeTrigger(grupo)}
                    >
                        🎯 Trigger
                    </button>
                </div>
            ),
        },
    ]

    // Configuração dos campos para visualização em cards
    const cardFields = [
        {
            key: "nome" as keyof Grupo,
            primary: true,
            render: (grupo: Grupo) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {grupo.imageUrl ? (
                        <img
                            src={grupo.imageUrl || "/placeholder.svg"}
                            alt={grupo.nome}
                            style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "6px",
                                objectFit: "cover",
                            }}
                        />
                    ) : (
                        <div
                            style={{
                                width: "32px",
                                height: "32px",
                                backgroundColor: grupo.isActive ? "#3b82f6" : "#6b7280",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                            }}
                        >
                            👥
                        </div>
                    )}
                    {grupo.nome}
                </div>
            ),
        },
        {
            key: "descricao" as keyof Grupo,
            secondary: true,
        },
        {
            key: "inviteCode" as keyof Grupo,
            label: "Código",
            render: (grupo: Grupo) => `${grupo.inviteCode.substring(0, 10)}...`,
        },
        {
            key: "status" as keyof Grupo,
            label: "Status",
            render: (grupo: Grupo) => (grupo.isActive ? "✅ Ativo" : "❌ Inativo"),
        },
        {
            key: "criadoEm" as keyof Grupo,
            label: "Criado",
            render: (grupo: Grupo) => new Date(grupo.criadoEm).toLocaleDateString("pt-BR"),
        },
    ]

    // Campos extras para visualização
    const extraViewFields = selectedItem
        ? [
            { label: "Group ID", value: selectedItem.groupId },
            { label: "Código de Convite", value: selectedItem.inviteCode },
            { label: "URL da Imagem", value: selectedItem.imageUrl || "Não definida" },
            {
                label: "Categoria",
                value: categorias.find((c: any) => c.id === selectedItem.categoryId)?.nome || "Sem categoria",
            },
            { label: "Ativo", value: selectedItem.isActive ? "Sim" : "Não" },
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
        backgroundColor: "#3b82f6",
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
    const totalGrupos = grupos.length
    const gruposAtivos = grupos.filter((g: any) => g.isActive).length
    const totalMembros = grupos.reduce((acc: any, g: any) => acc + g.membros, 0)
    const mediaMembrosPorGrupo = totalGrupos > 0 ? Math.round(totalMembros / totalGrupos) : 0

    if (isLoading) {
        return (
                <div style={containerStyle}>
                    <div>Carregando grupos...</div>
                </div>
        )
    }

    return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Grupos WhatsApp</h1>
                    <button
                        style={{
                            ...createButtonStyle,
                            opacity: createGroup.isPending ? 0.7 : 1,
                            cursor: createGroup.isPending ? "not-allowed" : "pointer",
                        }}
                        onClick={() => openModal("create")}
                        disabled={createGroup.isPending}
                        onMouseEnter={(e) => {
                            if (!createGroup.isPending) {
                                e.currentTarget.style.backgroundColor = "#2563eb"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!createGroup.isPending) {
                                e.currentTarget.style.backgroundColor = "#3b82f6"
                            }
                        }}
                    >
                        {createGroup.isPending ? "⏳ Criando..." : "➕ Criar Grupo"}
                    </button>
                </div>

                {/* Estatísticas */}
                <div style={statsStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalGrupos}</div>
                        <div style={statLabelStyle}>Total</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{gruposAtivos}</div>
                        <div style={statLabelStyle}>Ativos</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalMembros}</div>
                        <div style={statLabelStyle}>Membros</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{mediaMembrosPorGrupo}</div>
                        <div style={statLabelStyle}>Média</div>
                    </div>
                </div>

                <CrudTable
                    data={grupos}
                    columns={tableColumns}
                    cardFields={cardFields}
                    onView={(grupo) => openModal("view", grupo)}
                    onEdit={(grupo) => openModal("edit", grupo)}
                    onDelete={(grupo) =>
                        handleDelete(
                            grupo.id,
                            `Tem certeza que deseja excluir o grupo "${grupo.nome}"? Esta ação não pode ser desfeita.`,
                        )
                    }
                    defaultView="table"
                    showViewToggle={true}
                    isLoading={deleteGroup.isPending}
                />

                <CrudModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    title={getModalTitle("Grupo")}
                    fields={getFormFields()}
                    data={formData}
                    onClose={closeModal}
                    onSubmit={handleGroupSubmit}
                    onChange={handleFieldChange}
                    extraViewFields={extraViewFields}
                    isLoading={createGroup.isPending || updateGroup.isPending}
                />

                <SendMessageModal
                    isOpen={messageModal.isOpen}
                    groupName={messageModal.group?.nome || ""}
                    onClose={() => setMessageModal({ isOpen: false, group: null })}
                    onSend={handleSendMessageSubmit}
                    isLoading={sendMessage.isPending}
                />

                <ChangeTriggerModal
                    isOpen={triggerModal.isOpen}
                    groupName={triggerModal.group?.nome || ""}
                    currentTrigger={triggerModal.group?.categoryId} // Assumindo que você vai mapear o trigger atual
                    instances={instancias}
                    onClose={() => setTriggerModal({ isOpen: false, group: null })}
                    onChangeTrigger={handleChangeTriggerSubmit}
                    isLoading={updateTrigger.isPending}
                />

                <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
            </div>
    )
}
