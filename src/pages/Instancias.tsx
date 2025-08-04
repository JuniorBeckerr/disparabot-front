"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { CrudModal } from "../components/CrudModal"
import { CrudTable } from "../components/CrudTable"
import { useGetInstances } from "../hooks/instances/useGetInstances"
import { useCreateInstance } from "../hooks/instances/useCreateInstance"
import { useUpdateInstance } from "../hooks/instances/useUpdateInstance"
import { useDeleteInstance } from "../hooks/instances/useDeleteInstance"
import { useGetInstanceQRCode } from "../hooks/instances/useGetInstanceStatus"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"
import { InstanceStatusManager } from "../components/InstanceStatusManager"

interface Instancia {
    id: number
    nome: string
    descricao: string
    telefone?: string
    status: "conectada" | "desconectada" | "conectando" | "erro"
    qrCode?: string
    webhook?: string
    token: string
    criadoEm: string
    ultimaConexao?: string
    mensagensEnviadas: number
    mensagensRecebidas: number
}

type ModalMode = "create" | "edit" | "view"

export const Instancias = () => {
    const { data: instancias = [], isLoading } = useGetInstances()
    const createInstance = useCreateInstance()
    const updateInstance = useUpdateInstance()
    const deleteInstance = useDeleteInstance()

    const { toast, showToast, hideToast } = useToast()

    // Estado do modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("create")
    const [selectedItem, setSelectedItem] = useState<Instancia | null>(null)
    const [formData, setFormData] = useState<Partial<Instancia>>({})
    const [instanceStatuses, setInstanceStatuses] = useState<Record<number, string>>({})

    // Estado do modal QR Code
    const [qrCodeModal, setQrCodeModal] = useState<{
        isOpen: boolean
        instanceId: number | null
        instanceName: string
    }>({
        isOpen: false,
        instanceId: null,
        instanceName: "",
    })

    // Hook para buscar QR Code quando modal está aberto
    const { data: qrCodeData, isLoading: isLoadingQR, refetch: refetchQR } = useGetInstanceQRCode(qrCodeModal.instanceId)

    // Funções do modal
    const openModal = (mode: ModalMode, item?: Instancia) => {
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
            deleteInstance.mutate(id, {
                onSuccess: () => {
                    showToast("Instância deletada com sucesso!", "success")
                },
                onError: (error: any) => {
                    showToast(`Erro ao deletar instância: ${error.message || "Erro desconhecido"}`, "error")
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

    // Função para reconectar instância
    const handleReconnect = (instancia: Instancia) => {
        showToast(`Verificando status da instância "${instancia.nome}"...`, "info")
        setQrCodeModal({
            isOpen: true,
            instanceId: instancia.id,
            instanceName: instancia.nome,
        })
    }

    // Função para gerar novo QR Code
    const handleGenerateNewQR = () => {
        if (qrCodeModal.instanceId) {
            showToast("Gerando novo QR Code...", "info")
            refetchQR()
        }
    }

    // Função para fechar modal QR Code
    const closeQRModal = () => {
        setQrCodeModal({
            isOpen: false,
            instanceId: null,
            instanceName: "",
        })
    }

    // Adicionar estado para controlar múltiplos cliques no botão criar
    const [isCreating, setIsCreating] = useState(false)

    // Override do handleSubmit para criar instância
    const handleInstanceSubmit = (data: Partial<Instancia>) => {
        if (isCreating) return // Bloquear se já está criando

        const processedData = {
            name: data.nome!,
            number: data.telefone || "",
            status: "active" as const,
        }

        if (modalMode === "create") {
            setIsCreating(true)
            createInstance.mutate(processedData, {
                onSuccess: (response) => {
                    showToast("Instância criada com sucesso!", "success")
                    closeModal()
                    setIsCreating(false)

                    // Se a resposta contém QR Code, mostrar modal
                    if (response.data?.qrcode) {
                        setQrCodeModal({
                            isOpen: true,
                            instanceId: response.data.id || null,
                            instanceName: data.nome || "Nova Instância",
                        })
                    }
                },
                onError: (error: any) => {
                    showToast(`Erro ao criar instância: ${error.message || "Erro desconhecido"}`, "error")
                    setIsCreating(false)
                },
            })
        } else if (modalMode === "edit" && selectedItem) {
            updateInstance.mutate(
                {
                    id: selectedItem.id,
                    data: processedData,
                },
                {
                    onSuccess: () => {
                        showToast("Instância atualizada com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao atualizar instância: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

    // Configuração dos campos do formulário
    const formFields = [
        {
            name: "nome",
            label: "Nome da Instância",
            type: "text" as const,
            required: true,
        },
        {
            name: "telefone",
            label: "Número do WhatsApp",
            type: "text" as const,
            required: false,
        },
    ]

    // Função para atualizar status
    const handleStatusChange = useCallback(
        (instanceId: number, status: string) => {
            const previousStatus = instanceStatuses[instanceId]

            setInstanceStatuses((prev) => ({
                ...prev,
                [instanceId]: status,
            }))

            // Se mudou de desconectada para conectada, mostrar toast e fechar modal
            if (previousStatus === "desconectada" && status === "conectada") {
                const instance = instancias.find((i: any) => i.id === instanceId)
                if (instance) {
                    showToast(`WhatsApp conectado com sucesso na instância "${instance.nome}"! 🎉`, "success")

                    // Fechar modal QR se estiver aberto para esta instância
                    if (qrCodeModal.isOpen && qrCodeModal.instanceId === instanceId) {
                        closeQRModal()
                    }
                }
            }
        },
        [instanceStatuses, instancias, showToast, qrCodeModal.isOpen, qrCodeModal.instanceId],
    )

    // Função para mapear status da API para status visual
    const getVisualStatus = (instancia: Instancia): "conectada" | "desconectada" | "conectando" | "erro" => {
        const realtimeStatus = instanceStatuses[instancia.id]
        if (realtimeStatus) {
            return realtimeStatus as any
        }
        if (instancia.status === "conectada") return "conectada"
        return "desconectada"
    }

    // Configuração das colunas da tabela
    const tableColumns = [
        {
            key: "nome" as keyof Instancia,
            label: "Instância",
            render: (instancia: Instancia) => (
                <div>
                    <strong>{instancia.nome}</strong>
                    <br />
                    <small style={{ color: "#6b7280" }}>
                        {instancia.telefone || "Não conectado"} • Token: {instancia.token.substring(0, 12)}...
                    </small>
                </div>
            ),
        },
        {
            key: "status" as keyof Instancia,
            label: "Status",
            render: (instancia: Instancia) => {
                const status = getVisualStatus(instancia)
                const statusConfig = {
                    conectada: { bg: "#dcfce7", color: "#166534", icon: "🟢" },
                    desconectada: { bg: "#fef2f2", color: "#dc2626", icon: "🔴" },
                    conectando: { bg: "#fef3c7", color: "#92400e", icon: "🟡" },
                    erro: { bg: "#fef2f2", color: "#dc2626", icon: "❌" },
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
                        {status === "desconectada" && (
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
                                onClick={() => handleReconnect(instancia)}
                            >
                                Reconectar
                            </button>
                        )}
                    </div>
                )
            },
        },
        {
            key: "mensagensEnviadas" as keyof Instancia,
            label: "Mensagens",
            render: (instancia: Instancia) => (
                <div style={{ fontSize: "12px" }}>
                    <div style={{ color: "#059669" }}>↗️ {instancia.mensagensEnviadas} enviadas</div>
                    <div style={{ color: "#3b82f6" }}>↙️ {instancia.mensagensRecebidas} recebidas</div>
                </div>
            ),
        },
        {
            key: "ultimaConexao" as keyof Instancia,
            label: "Última Conexão",
            render: (instancia: Instancia) =>
                instancia.ultimaConexao ? new Date(instancia.ultimaConexao).toLocaleString("pt-BR") : "Nunca conectou",
        },
        {
            key: "criadoEm" as keyof Instancia,
            label: "Criado",
            render: (instancia: Instancia) => new Date(instancia.criadoEm).toLocaleDateString("pt-BR"),
        },
    ]

    // Configuração dos campos para visualização em cards
    const cardFields = [
        {
            key: "nome" as keyof Instancia,
            primary: true,
            render: (instancia: Instancia) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: getVisualStatus(instancia) === "conectada" ? "#10b981" : "#6b7280",
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                        }}
                    >
                        📱
                    </div>
                    {instancia.nome}
                </div>
            ),
        },
        {
            key: "descricao" as keyof Instancia,
            secondary: true,
        },
        {
            key: "telefone" as keyof Instancia,
            label: "Telefone",
            render: (instancia: Instancia) => instancia.telefone || "Não conectado",
        },
        {
            key: "status" as keyof Instancia,
            label: "Status",
            render: (instancia: Instancia) => {
                const status = getVisualStatus(instancia)
                const statusConfig = {
                    conectada: { bg: "#dcfce7", color: "#166534", icon: "🟢" },
                    desconectada: { bg: "#fef2f2", color: "#dc2626", icon: "🔴" },
                    conectando: { bg: "#fef3c7", color: "#92400e", icon: "🟡" },
                    erro: { bg: "#fef2f2", color: "#dc2626", icon: "❌" },
                }
                const config = statusConfig[status]
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
            {config.icon} {status}
          </span>
                )
            },
        },
        {
            key: "mensagensEnviadas" as keyof Instancia,
            label: "Mensagens",
            render: (instancia: Instancia) => `${instancia.mensagensEnviadas} / ${instancia.mensagensRecebidas}`,
        },
        {
            key: "token" as keyof Instancia,
            label: "Token",
            render: (instancia: Instancia) => `${instancia.token.substring(0, 12)}...`,
        },
    ]

    // Campos extras para visualização
    const extraViewFields = selectedItem
        ? [
            { label: "Token Completo", value: selectedItem.token },
            { label: "Webhook", value: selectedItem.webhook || "Não configurado" },
            { label: "Mensagens Enviadas", value: selectedItem.mensagensEnviadas.toString() },
            { label: "Mensagens Recebidas", value: selectedItem.mensagensRecebidas.toString() },
            {
                label: "Última Conexão",
                value: selectedItem.ultimaConexao
                    ? new Date(selectedItem.ultimaConexao).toLocaleString("pt-BR")
                    : "Nunca conectou",
            },
            { label: "Criado em", value: new Date(selectedItem.criadoEm).toLocaleDateString("pt-BR") },
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
        backgroundColor: "#10b981",
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

    // QR Code Modal Styles
    const qrModalOverlayStyle: React.CSSProperties = {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1001,
    }

    const qrModalStyle: React.CSSProperties = {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "32px",
        width: "90%",
        maxWidth: "400px",
        textAlign: "center",
    }

    const qrImageStyle: React.CSSProperties = {
        width: "200px",
        height: "200px",
        border: "2px solid #e5e7eb",
        borderRadius: "8px",
        margin: "20px auto",
        display: "block",
        backgroundColor: "#f9fafb",
    }

    // Calcular estatísticas
    const totalInstancias = instancias.length
    const instanciasConectadas = instancias.filter((i: any) => getVisualStatus(i) === "conectada").length
    const totalMensagensEnviadas = instancias.reduce((acc: any, i: any) => acc + i.mensagensEnviadas, 0)
    const totalMensagensRecebidas = instancias.reduce((acc: any, i: any) => acc + i.mensagensRecebidas, 0)

    if (isLoading) {
        return (
                <div style={containerStyle}>
                    <div>Carregando instâncias...</div>
                </div>
        )
    }

    return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Instâncias WhatsApp</h1>
                    <button
                        style={{
                            ...createButtonStyle,
                            opacity: createInstance.isPending || isCreating ? 0.7 : 1,
                            cursor: createInstance.isPending || isCreating ? "not-allowed" : "pointer",
                        }}
                        onClick={() => openModal("create")}
                        disabled={createInstance.isPending || isCreating}
                        onMouseEnter={(e) => {
                            if (!createInstance.isPending && !isCreating) {
                                e.currentTarget.style.backgroundColor = "#059669"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!createInstance.isPending && !isCreating) {
                                e.currentTarget.style.backgroundColor = "#10b981"
                            }
                        }}
                    >
                        {createInstance.isPending || isCreating ? "⏳ Criando..." : "➕ Criar Instância"}
                    </button>
                </div>

                {/* Estatísticas */}
                <div style={statsStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalInstancias}</div>
                        <div style={statLabelStyle}>Total</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{instanciasConectadas}</div>
                        <div style={statLabelStyle}>Conectadas</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalMensagensEnviadas}</div>
                        <div style={statLabelStyle}>Enviadas</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalMensagensRecebidas}</div>
                        <div style={statLabelStyle}>Recebidas</div>
                    </div>
                </div>

                <CrudTable
                    data={instancias}
                    columns={tableColumns}
                    cardFields={cardFields}
                    onView={(instancia) => openModal("view", instancia)}
                    onEdit={(instancia) => openModal("edit", instancia)}
                    onDelete={(instancia) =>
                        handleDelete(
                            instancia.id,
                            `Tem certeza que deseja excluir a instância "${instancia.nome}"? Esta ação não pode ser desfeita.`,
                        )
                    }
                    defaultView="table"
                    showViewToggle={true}
                    isLoading={deleteInstance.isPending}
                />

                <CrudModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    title={getModalTitle("Instância")}
                    fields={formFields}
                    data={formData}
                    onClose={closeModal}
                    onSubmit={handleInstanceSubmit}
                    onChange={handleFieldChange}
                    extraViewFields={extraViewFields}
                    isLoading={isCreating || createInstance.isPending}
                />

                {/* QR Code Modal */}
                {qrCodeModal.isOpen && (
                    <div style={qrModalOverlayStyle} onClick={closeQRModal}>
                        <div style={qrModalStyle} onClick={(e) => e.stopPropagation()}>
                            <h2 style={{ fontSize: "20px", fontWeight: "bold", color: "#1e293b", marginBottom: "8px" }}>
                                Conectar WhatsApp
                            </h2>
                            <p style={{ color: "#6b7280", marginBottom: "20px" }}>
                                Escaneie o QR Code abaixo com seu WhatsApp para conectar a instância "{qrCodeModal.instanceName}"
                            </p>

                            {isLoadingQR ? (
                                <div
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        margin: "20px auto",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "8px",
                                        backgroundColor: "#f9fafb",
                                    }}
                                >
                                    <div>Carregando QR Code...</div>
                                </div>
                            ) : qrCodeData?.base64 ? (
                                <img src={qrCodeData.base64 || "/placeholder.svg"} alt="QR Code WhatsApp" style={qrImageStyle} />
                            ) : (
                                <div
                                    style={{
                                        width: "200px",
                                        height: "200px",
                                        margin: "20px auto",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        border: "2px solid #e5e7eb",
                                        borderRadius: "8px",
                                        backgroundColor: "#f9fafb",
                                        color: "#6b7280",
                                    }}
                                >
                                    {qrCodeData?.state === "open" ? "✅ Já conectado!" : "QR Code não disponível"}
                                </div>
                            )}

                            <div
                                style={{
                                    backgroundColor: "#f0f9ff",
                                    border: "1px solid #0ea5e9",
                                    borderRadius: "8px",
                                    padding: "12px",
                                    marginBottom: "20px",
                                    fontSize: "14px",
                                    color: "#0369a1",
                                }}
                            >
                                <strong>📱 Como conectar:</strong>
                                <br />
                                1. Abra o WhatsApp no seu celular
                                <br />
                                2. Toque em "Mais opções" (⋮) → "Aparelhos conectados"
                                <br />
                                3. Toque em "Conectar um aparelho"
                                <br />
                                4. Aponte a câmera para este QR Code
                            </div>

                            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                                <button
                                    style={{
                                        backgroundColor: "#10b981",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "10px 20px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                        opacity: isLoadingQR ? 0.7 : 1,
                                    }}
                                    onClick={handleGenerateNewQR}
                                    disabled={isLoadingQR}
                                >
                                    {isLoadingQR ? "⏳ Carregando..." : "🔄 Gerar Novo QR"}
                                </button>
                                <button
                                    style={{
                                        backgroundColor: "#f3f4f6",
                                        color: "#374151",
                                        border: "none",
                                        borderRadius: "6px",
                                        padding: "10px 20px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        cursor: "pointer",
                                    }}
                                    onClick={closeQRModal}
                                >
                                    Fechar
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Gerenciadores de status em tempo real */}
                {instancias.map((instancia: any) => (
                    <InstanceStatusManager
                        key={instancia.id}
                        instanceId={instancia.id}
                        instanceName={instancia.nome}
                        onStatusChange={(status) => handleStatusChange(instancia.id, status)}
                        enabled={true}
                    />
                ))}

                <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
            </div>
    )
}
