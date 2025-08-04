"use client"

import type React from "react"
import { useState } from "react"
import { CrudModal } from "../components/CrudModal"
import { CrudTable } from "../components/CrudTable"
import { useGetScrappings } from "../hooks/scrapping/useGetScrapping"
import { useCreateScrapping } from "../hooks/scrapping/useCreateScrapping"
import { useUpdateScrapping } from "../hooks/scrapping/useUpdateScrapping"
import { useDeleteScrapping } from "../hooks/scrapping/useDeleteScrapping"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"

interface Scrapping {
    id: number
    name: string
    type: "scrapping" | "api"
    name_type: string
    url: string
    login: string
    password: string
    key1?: string | number
    key2?: string
    is_active: boolean
    criadoEm: string
    atualizadoEm: string
    ultimaExecucao?: string
    produtosColetados: number
    status: "stop" | "erro" | "executando"
}

type ModalMode = "create" | "edit" | "view"

export const Scrappings = () => {
    const { data: scrappings = [], isLoading } = useGetScrappings()
    const createScrapping = useCreateScrapping()
    const updateScrapping = useUpdateScrapping()
    const deleteScrapping = useDeleteScrapping()

    const { toast, showToast, hideToast } = useToast()

    // Estado do modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("create")
    const [selectedItem, setSelectedItem] = useState<Scrapping | null>(null)
    const [formData, setFormData] = useState<Partial<Scrapping>>({})

    // Funções do modal
    const openModal = (mode: ModalMode, item?: Scrapping) => {
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

    const handleScrappingFieldChange = (field: string, value: any) => {
        if (field === "type") {
            // Se mudou para API, limpar as keys
            if (value === "api") {
                setFormData((prev) => ({ ...prev, [field]: value, key1: "", key2: "" }))
                return
            }
        }
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleDelete = (id: number, confirmMessage: string) => {
        if (window.confirm(confirmMessage)) {
            deleteScrapping.mutate(id, {
                onSuccess: () => {
                    showToast("Scrapping deletado com sucesso!", "success")
                },
                onError: (error: any) => {
                    showToast(`Erro ao deletar scrapping: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        }
    }

    // Função para executar scrapping
    const handleExecute = (scrapping: Scrapping) => {
        if (scrapping.status === "executando") {
            showToast("Este scrapping já está sendo executado!", "info")
            return
        }
        if (!scrapping.is_active) {
            showToast("Este scrapping está inativo. Ative-o primeiro!", "info")
            return
        }
        // Simular execução - em produção seria uma chamada à API
        showToast(`Iniciando execução do scrapping "${scrapping.name}"...`, "info")
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

    // Configuração dos campos do formulário
    const getFormFields = () => {
        const currentType = (formData as Partial<Scrapping>).type
        const baseFields = [
            {
                name: "name",
                label: "Nome do Scrapping",
                type: "text" as const,
                required: true,
            },
            {
                name: "type",
                label: "Tipo",
                type: "select" as const,
                required: true,
                options: [
                    { value: "scrapping", label: "Scrapping (Web)" },
                    { value: "api", label: "API" },
                ],
            },
            {
                name: "name_type",
                label: "Código/Sigla",
                type: "text" as const,
                required: true,
            },
            {
                name: "url",
                label: "URL",
                type: "text" as const,
                required: true,
            },
            {
                name: "login",
                label: "Login/Email",
                type: "email" as const,
                required: false,
            },
            {
                name: "password",
                label: "Senha",
                type: "password" as const,
                required: false,
            },
        ]

        // Adicionar campos de keys para ambos os tipos
        if (currentType === "scrapping") {
            baseFields.push(
                {
                    name: "key1",
                    label: "Key 1 (Proxy/Config)",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "key2",
                    label: "Key 2 (User-Agent/Token)",
                    type: "text" as const,
                    required: false
                },
            )
        } else if (currentType === "api") {
            baseFields.push(
                {
                    name: "key1",
                    label: "API Key 1",
                    type: "text" as const,
                    required: false
                },
                {
                    name: "key2",
                    label: "API Key 2",
                    type: "text" as const,
                    required: false
                },
            )
        }

        baseFields.push({
            name: "is_active",
            label: "Ativo/Inativo",
            type: "select" as const,
            required: true,
            options: [
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" },
            ],
        })

        return baseFields
    }

    // Função para validar status de execução
    const getValidExecutionStatus = (status: string): "stop" | "erro" | "executando" => {
        const validStatuses = ["stop", "erro", "executando"]
        return validStatuses.includes(status) ? (status as any) : "stop"
    }

    // Configuração das colunas da tabela
    const tableColumns = [
        {
            key: "name" as keyof Scrapping,
            label: "Scrapping",
            render: (scrapping: Scrapping) => (
                <div>
                    <strong>{scrapping.name}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>
                        {scrapping.name_type} • {scrapping.type === "api" ? "API" : "Web Scrapping"}
                    </small>
                </div>
            ),
        },
        {
            key: "type" as keyof Scrapping,
            label: "Tipo",
            render: (scrapping: Scrapping) => {
                const typeConfig = {
                    api: { bg: "#e0f2fe", color: "#0369a1", icon: "🔗" },
                    scrapping: { bg: "#f0fdf4", color: "#166534", icon: "🕷️" },
                }
                const config = typeConfig[scrapping.type as keyof typeof typeConfig]
                if (!config) return <span>Tipo inválido</span>
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
            {config.icon} {scrapping.type === "api" ? "API" : "Scrapping"}
          </span>
                )
            },
        },
        {
            key: "url" as keyof Scrapping,
            label: "URL",
            render: (scrapping: Scrapping) => (
                <div style={{ maxWidth: "200px" }}>
                    <a
                        href={scrapping.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "#3b82f6", textDecoration: "none", fontSize: "12px" }}
                    >
                        {scrapping.url.length > 30 ? `${scrapping.url.substring(0, 30)}...` : scrapping.url}
                    </a>
                </div>
            ),
        },
        {
            key: "produtosColetados" as keyof Scrapping,
            label: "Produtos",
            render: (scrapping: Scrapping) => (
                <div style={{ textAlign: "center" }}>
                    <strong style={{ color: "#059669" }}>{scrapping.produtosColetados}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>coletados</small>
                </div>
            ),
        },
        {
            key: "is_active" as keyof Scrapping,
            label: "Ativo",
            render: (scrapping: Scrapping) => {
                const activeConfig = {
                    true: { bg: "#dcfce7", color: "#166534", icon: "✅" },
                    false: { bg: "#f3f4f6", color: "#6b7280", icon: "❌" },
                }
                const config = activeConfig[scrapping.is_active.toString() as keyof typeof activeConfig]
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
            {config.icon} {scrapping.is_active ? "Ativo" : "Inativo"}
          </span>
                )
            },
        },
        {
            key: "status" as keyof Scrapping,
            label: "Status Execução",
            render: (scrapping: Scrapping) => {
                const validStatus = getValidExecutionStatus(scrapping.status)
                const statusConfig = {
                    stop: { bg: "#f3f4f6", color: "#6b7280", icon: "⚫" },
                    erro: { bg: "#fef2f2", color: "#dc2626", icon: "🔴" },
                    executando: { bg: "#fef3c7", color: "#92400e", icon: "🟡" },
                }
                const config = statusConfig[validStatus]
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
              {config.icon} {validStatus}
            </span>
                        {scrapping.is_active && validStatus !== "executando" && (
                            <button
                                style={{
                                    background: "none",
                                    border: "1px solid #d1d5db",
                                    borderRadius: "4px",
                                    padding: "2px 6px",
                                    fontSize: "10px",
                                    cursor: "pointer",
                                    color: "#6b7280",
                                }}
                                onClick={() => handleExecute(scrapping)}
                            >
                                ▶️ Executar
                            </button>
                        )}
                    </div>
                )
            },
        },
        {
            key: "ultimaExecucao" as keyof Scrapping,
            label: "Última Execução",
            render: (scrapping: Scrapping) =>
                scrapping.ultimaExecucao ? new Date(scrapping.ultimaExecucao).toLocaleString("pt-BR") : "Nunca executado",
        },
    ]

    // Configuração dos campos para visualização em cards
    const cardFields = [
        {
            key: "name" as keyof Scrapping,
            primary: true,
            render: (scrapping: Scrapping) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: scrapping.type === "api" ? "#3b82f6" : "#10b981",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                        }}
                    >
                        {scrapping.type === "api" ? "🔗" : "🕷️"}
                    </div>
                    {scrapping.name}
                </div>
            ),
        },
        {
            key: "name_type" as keyof Scrapping,
            secondary: true,
            render: (scrapping: Scrapping) =>
                `${scrapping.name_type} • ${scrapping.type === "api" ? "API" : "Web Scrapping"}`,
        },
        {
            key: "url" as keyof Scrapping,
            label: "URL",
            render: (scrapping: Scrapping) =>
                scrapping.url.length > 40 ? `${scrapping.url.substring(0, 40)}...` : scrapping.url,
        },
        {
            key: "produtosColetados" as keyof Scrapping,
            label: "Produtos",
            render: (scrapping: Scrapping) => `${scrapping.produtosColetados} coletados`,
        },
        {
            key: "is_active" as keyof Scrapping,
            label: "Ativo",
            render: (scrapping: Scrapping) => (scrapping.is_active ? "✅ Sim" : "❌ Não"),
        },
        {
            key: "status" as keyof Scrapping,
            label: "Status Execução",
            render: (scrapping: Scrapping) => {
                const validStatus = getValidExecutionStatus(scrapping.status)
                const statusConfig = {
                    stop: { bg: "#f3f4f6", color: "#6b7280", icon: "⚫" },
                    erro: { bg: "#fef2f2", color: "#dc2626", icon: "🔴" },
                    executando: { bg: "#fef3c7", color: "#92400e", icon: "🟡" },
                }
                const config = statusConfig[validStatus]
                return (
                    <span
                        style={{
                            padding: "2px 8px",
                            borderRadius: "12px",
                            fontSize: "11px",
                            fontWeight: "500",
                            backgroundColor: config.bg,
                            color: config.color,
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            width: "fit-content",
                        }}
                    >
            {config.icon} {validStatus}
          </span>
                )
            },
        },
        {
            key: "ultimaExecucao" as keyof Scrapping,
            label: "Última Execução",
            render: (scrapping: Scrapping) =>
                scrapping.ultimaExecucao ? new Date(scrapping.ultimaExecucao).toLocaleDateString("pt-BR") : "Nunca executado",
        },
    ]

    // Campos extras para visualização
    const extraViewFields = selectedItem
        ? [
            { label: "Login/Email", value: selectedItem.login || "Não configurado" },
            { label: "URL Completa", value: selectedItem.url },
            ...(selectedItem.type === "scrapping" || selectedItem.type === "api"
                ? [
                    { label: "Key 1", value: selectedItem.key1 || "Não configurado" },
                    { label: "Key 2", value: selectedItem.key2 || "Não configurado" },
                ]
                : []),
            { label: "Ativo", value: selectedItem.is_active ? "Sim" : "Não" },
            { label: "Status de Execução", value: selectedItem.status },
            { label: "Produtos Coletados", value: selectedItem.produtosColetados.toString() },
            {
                label: "Última Execução",
                value: selectedItem.ultimaExecucao
                    ? new Date(selectedItem.ultimaExecucao).toLocaleString("pt-BR")
                    : "Nunca executado",
            },
            { label: "Criado em", value: new Date(selectedItem.criadoEm).toLocaleDateString("pt-BR") },
            { label: "Atualizado em", value: new Date(selectedItem.atualizadoEm).toLocaleDateString("pt-BR") },
        ]
        : []

    // Override do handleSubmit para adicionar campos automáticos
    const handleScrappingSubmit = (data: Partial<Scrapping>) => {
        // Converter is_active de string para boolean
        const processedData = {
            name: data.name!,
            type: data.type!,
            name_type: data.name_type!,
            url: data.url!,
            login: data.login || "",
            password: data.password || "",
            key1: data.key1 || "",
            key2: data.key2 || "",
            is_active: String(data.is_active) === "true" || data.is_active == true,
        }

        if (modalMode === "create") {
            createScrapping.mutate(processedData, {
                onSuccess: () => {
                    showToast("Scrapping criado com sucesso!", "success")
                    closeModal()
                },
                onError: (error: any) => {
                    showToast(`Erro ao criar scrapping: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        } else if (modalMode === "edit" && selectedItem) {
            updateScrapping.mutate(
                {
                    id: selectedItem.id,
                    data: processedData,
                },
                {
                    onSuccess: () => {
                        showToast("Scrapping atualizado com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao atualizar scrapping: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

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
        backgroundColor: "#8b5cf6",
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
    const totalScrappings = scrappings.length
    const scrappingsAtivos = scrappings.filter((s: any) => s.is_active).length
    const scrappingsExecutando = scrappings.filter((s: any) => s.status === "executando").length
    const scrappingsComErro = scrappings.filter((s: any) => s.status === "erro").length
    const totalProdutos = scrappings.reduce((acc: any, s: any) => acc + s.produtosColetados, 0)

    if (isLoading) {
        return (
                <div style={containerStyle}>
                    <div>Carregando scrappings...</div>
                </div>
        )
    }

    return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Scrappings</h1>
                    <button
                        style={{
                            ...createButtonStyle,
                            opacity: createScrapping.isPending ? 0.7 : 1,
                            cursor: createScrapping.isPending ? "not-allowed" : "pointer",
                        }}
                        onClick={() => openModal("create")}
                        disabled={createScrapping.isPending}
                        onMouseEnter={(e) => {
                            if (!createScrapping.isPending) {
                                e.currentTarget.style.backgroundColor = "#7c3aed"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!createScrapping.isPending) {
                                e.currentTarget.style.backgroundColor = "#8b5cf6"
                            }
                        }}
                    >
                        {createScrapping.isPending ? "⏳ Criando..." : "➕ Criar Scrapping"}
                    </button>
                </div>

                {/* Estatísticas */}
                <div style={statsStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalScrappings}</div>
                        <div style={statLabelStyle}>Total</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{scrappingsAtivos}</div>
                        <div style={statLabelStyle}>Ativos</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{scrappingsExecutando}</div>
                        <div style={statLabelStyle}>Executando</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{scrappingsComErro}</div>
                        <div style={statLabelStyle}>Com Erro</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>
                            {new Intl.NumberFormat("pt-BR", { notation: "compact" }).format(totalProdutos)}
                        </div>
                        <div style={statLabelStyle}>Produtos</div>
                    </div>
                </div>

                <CrudTable
                    data={scrappings}
                    columns={tableColumns}
                    cardFields={cardFields}
                    onView={(scrapping) => openModal("view", scrapping)}
                    onEdit={(scrapping) => openModal("edit", scrapping)}
                    onDelete={(scrapping) =>
                        handleDelete(
                            scrapping.id,
                            `Tem certeza que deseja excluir o scrapping "${scrapping.name}"? Esta ação não pode ser desfeita.`,
                        )
                    }
                    defaultView="table"
                    showViewToggle={true}
                    isLoading={deleteScrapping.isPending}
                />

                <CrudModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    title={getModalTitle("Scrapping")}
                    fields={getFormFields()}
                    data={formData}
                    onClose={closeModal}
                    onSubmit={handleScrappingSubmit}
                    onChange={handleScrappingFieldChange}
                    extraViewFields={extraViewFields}
                />

                <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
            </div>
    )
}
