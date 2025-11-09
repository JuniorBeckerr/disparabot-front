"use client"
import { useState } from "react"
import { CrudModal } from "../components/CrudModal"
import { CrudTable } from "../components/CrudTable"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"
import { useGetLinktree, type LinktreeItem } from "../hooks/linktree/useGetLinktree"
import { useCreateLinktree } from "../hooks/linktree/useCreateLinktree"
import { useUpdateLinktree } from "../hooks/linktree/useUpdateLinktree"
import { useDeleteLinktree } from "../hooks/linktree/useDeleteLinktree"

type ModalMode = "create" | "edit" | "view"

export const Linktree = () => {
    const { data: links = [], isLoading } = useGetLinktree()
    const createLink = useCreateLinktree()
    const updateLink = useUpdateLinktree()
    const deleteLink = useDeleteLinktree()

    const { toast, showToast, hideToast } = useToast()

    // Estado do modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("create")
    const [selectedItem, setSelectedItem] = useState<LinktreeItem | null>(null)
    const [formData, setFormData] = useState<Partial<LinktreeItem>>({})

    // Funções do modal
    const openModal = (mode: ModalMode, item?: LinktreeItem) => {
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
            deleteLink.mutate(id, {
                onSuccess: () => {
                    showToast("Link removido com sucesso!", "success")
                },
                onError: (error: any) => {
                    showToast(`Erro ao remover link: ${error.message || "Erro desconhecido"}`, "error")
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

    // Envio do formulário
    const handleSubmit = (data: Partial<LinktreeItem>) => {
        if (modalMode === "create") {
            const createData = {
                title: data.titulo!,
                url: data.url!,
                icon: data.icone || "",
                order: Number(data.ordem ?? 0),
                is_active: data.isActive !== false,
            }
            createLink.mutate(createData, {
                onSuccess: () => {
                    showToast("Link criado com sucesso!", "success")
                    closeModal()
                },
                onError: (error: any) => {
                    showToast(`Erro ao criar link: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        } else if (modalMode === "edit" && selectedItem) {
            const updateData = {
                title: data.titulo!,
                url: data.url!,
                icon: data.icone || "",
                order: Number(data.ordem ?? 0),
                is_active: data.isActive !== false,
            }
            updateLink.mutate(
                { id: selectedItem.id, data: updateData },
                {
                    onSuccess: () => {
                        showToast("Link atualizado com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao atualizar link: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

    // Campos do formulário
    const formFields = [
        { name: "titulo", label: "Título", type: "text" as const, required: true },
        { name: "url", label: "URL", type: "text" as const, required: true },
        {
            name: "icone",
            label: "Ícone",
            type: "text" as const,
            required: false,
            presetIcons: [
                "⭐",
                "😂",
                "💬",
                "📸",
                "🛍️",
                "🌍",
                "🎟️",
                "🤝",
                "🔥",
                "💥",
                "✨",
                "🚀",
                "🏷️",
                "🧧",
                "🎁",
                "🤑",
                "🏪",
                "📱",
                "💻",
                "🎮",
                "📦",
            ],
        },
        { name: "ordem", label: "Ordem", type: "number" as const, required: false },
        {
            name: "status",
            label: "Status",
            type: "select" as const,
            options: [
                { value: "ativo", label: "Ativo" },
                { value: "inativo", label: "Inativo" },
            ],
        },
    ]

    // Colunas da tabela
    const tableColumns = [
        {
            key: "titulo" as keyof LinktreeItem,
            label: "Título",
        },
        {
            key: "url" as keyof LinktreeItem,
            label: "URL",
            render: (item: LinktreeItem) => (
                <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>
                    {item.url}
                </a>
            ),
        },
        {
            key: "icone" as keyof LinktreeItem,
            label: "Ícone",
        },
        {
            key: "ordem" as keyof LinktreeItem,
            label: "Ordem",
        },
        {
            key: "status" as keyof LinktreeItem,
            label: "Status",
            render: (item: LinktreeItem) => (
                <span
                    style={{
                        padding: "4px 12px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "500",
                        backgroundColor: item.status === "ativo" ? "#dcfce7" : "#fef2f2",
                        color: item.status === "ativo" ? "#166534" : "#dc2626",
                    }}
                >
                    {item.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
            ),
        },
        {
            key: "atualizadoEm" as keyof LinktreeItem,
            label: "Atualizado",
            render: (item: LinktreeItem) => new Date(item.atualizadoEm).toLocaleString("pt-BR"),
        },
    ]

    // Campos para cards
    const cardFields = [
        {
            key: "titulo" as keyof LinktreeItem,
            primary: true,
        },
        {
            key: "url" as keyof LinktreeItem,
            secondary: true,
            render: (item: LinktreeItem) => (
                <a href={item.url} target="_blank" rel="noreferrer" style={{ color: "#3b82f6" }}>
                    {item.url}
                </a>
            ),
        },
        { key: "icone" as keyof LinktreeItem, label: "Ícone" },
        { key: "ordem" as keyof LinktreeItem, label: "Ordem" },
        {
            key: "status" as keyof LinktreeItem,
            label: "Status",
            render: (item: LinktreeItem) => (
                <span
                    style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "500",
                        backgroundColor: item.status === "ativo" ? "#dcfce7" : "#fef2f2",
                        color: item.status === "ativo" ? "#166534" : "#dc2626",
                    }}
                >
                    {item.status === "ativo" ? "Ativo" : "Inativo"}
                </span>
            ),
        },
    ]

    return (
        <div>
            <h1 style={{ fontSize: "20px", fontWeight: 600, marginBottom: 16 }}>Linktree</h1>

            <div style={{ marginBottom: 16 }}>
                <button
                    onClick={() => openModal("create")}
                    style={{
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                        padding: "8px 12px",
                        cursor: "pointer",
                        fontWeight: 500,
                    }}
                >
                    Novo Link
                </button>
            </div>

            <CrudTable<LinktreeItem>
                data={links.sort((a, b) => a.ordem - b.ordem)}
                columns={tableColumns}
                cardFields={cardFields}
                onView={(item) => openModal("view", item)}
                onEdit={(item) => openModal("edit", item)}
                onDelete={(item) => handleDelete(item.id, `Tem certeza que deseja excluir o link "${item.titulo}"?`)}
                defaultView="table"
                showViewToggle={true}
                isLoading={isLoading || deleteLink.isPending}
            />

            <CrudModal<LinktreeItem>
                isOpen={modalOpen}
                mode={modalMode}
                title={getModalTitle("Link")}
                fields={formFields}
                data={formData}
                onClose={closeModal}
                onSubmit={handleSubmit}
                onChange={handleFieldChange}
                isLoading={createLink.isPending || updateLink.isPending}
            />

            <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
        </div>
    )
}