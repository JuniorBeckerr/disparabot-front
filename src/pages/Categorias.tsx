"use client"

import type React from "react"
import { useState } from "react"
import { CrudModal } from "../components/CrudModal"
import { CrudTable } from "../components/CrudTable"
import { useGetCategorias } from "../hooks/category/useGetCategorias"
import { useCreateCategoria } from "../hooks/category/useCreateCategoria"
import { useUpdateCategoria } from "../hooks/category/useUpdateCategoria"
import { useDeleteCategoria } from "../hooks/category/useDeleteCategoria"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"

interface Categoria {
    id: number
    nome: string
    descricao: string
    slug: string
    cor: string
    icone: string
    status: "ativo" | "inativo"
    produtosCount: number
    criadoEm: string
    atualizadoEm: string
}

type ModalMode = "create" | "edit" | "view"

export const Categorias = () => {
    const { data: categorias = [], isLoading } = useGetCategorias()
    const createCategoria = useCreateCategoria()
    const updateCategoria = useUpdateCategoria()
    const deleteCategoria = useDeleteCategoria()

    const { toast, showToast, hideToast } = useToast()

    // Estado do modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("create")
    const [selectedItem, setSelectedItem] = useState<Categoria | null>(null)
    const [formData, setFormData] = useState<Partial<Categoria>>({})

    // Funções do modal
    const openModal = (mode: ModalMode, item?: Categoria) => {
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

    const handleCategoryFieldChange = (field: string, value: any) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleDelete = (id: number, confirmMessage: string) => {
        if (window.confirm(confirmMessage)) {
            deleteCategoria.mutate(id, {
                onSuccess: () => {
                    showToast("Categoria deletada com sucesso!", "success")
                },
                onError: (error: any) => {
                    showToast(`Erro ao deletar categoria: ${error.message || "Erro desconhecido"}`, "error")
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

    // Configuração dos campos do formulário
    const formFields = [
        {
            name: "nome",
            label: "Nome da Categoria",
            type: "text" as const,
            required: true,
        },
        {
            name: "descricao",
            label: "Descrição",
            type: "textarea" as const,
            required: true,
        },
        {
            name: "slug",
            label: "Slug (URL amigável)",
            type: "text" as const,
            required: true,
        },
        {
            name: "cor",
            label: "Cor (Hex)",
            type: "text" as const,
            required: true,
        },
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

    // Configuração das colunas da tabela
    const tableColumns = [
        {
            key: "nome" as keyof Categoria,
            label: "Categoria",
            render: (categoria: Categoria) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            backgroundColor: categoria.cor,
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "18px",
                        }}
                    >
                        {categoria.icone}
                    </div>
                    <div>
                        <strong>{categoria.nome}</strong>
                        <br />
                        <small style={{ color: "#6b7280" }}>/{categoria.slug}</small>
                    </div>
                </div>
            ),
        },
        {
            key: "descricao" as keyof Categoria,
            label: "Descrição",
            render: (categoria: Categoria) => (
                <div style={{ maxWidth: "200px" }}>
                    {categoria.descricao.length > 50 ? `${categoria.descricao.substring(0, 50)}...` : categoria.descricao}
                </div>
            ),
        },
        {
            key: "produtosCount" as keyof Categoria,
            label: "Produtos",
            render: (categoria: Categoria) => {
                const countStyle: React.CSSProperties = {
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor: categoria.produtosCount > 0 ? "#dcfce7" : "#f3f4f6",
                    color: categoria.produtosCount > 0 ? "#166534" : "#6b7280",
                }
                return <span style={countStyle}>{categoria.produtosCount} produtos</span>
            },
        },
        {
            key: "status" as keyof Categoria,
            label: "Status",
            render: (categoria: Categoria) => {
                const statusBadgeStyle: React.CSSProperties = {
                    padding: "4px 12px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: "500",
                    backgroundColor: categoria.status === "ativo" ? "#dcfce7" : "#fef2f2",
                    color: categoria.status === "ativo" ? "#166534" : "#dc2626",
                }
                return <span style={statusBadgeStyle}>{categoria.status === "ativo" ? "Ativo" : "Inativo"}</span>
            },
        },
        {
            key: "atualizadoEm" as keyof Categoria,
            label: "Atualizado",
            render: (categoria: Categoria) => new Date(categoria.atualizadoEm).toLocaleDateString("pt-BR"),
        },
    ]

    // Configuração dos campos para visualização em cards
    const cardFields = [
        {
            key: "nome" as keyof Categoria,
            primary: true,
            render: (categoria: Categoria) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div
                        style={{
                            width: "32px",
                            height: "32px",
                            backgroundColor: categoria.cor,
                            borderRadius: "6px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "16px",
                        }}
                    >
                        {categoria.icone}
                    </div>
                    {categoria.nome}
                </div>
            ),
        },
        {
            key: "descricao" as keyof Categoria,
            secondary: true,
        },
        {
            key: "slug" as keyof Categoria,
            label: "URL",
            render: (categoria: Categoria) => `/${categoria.slug}`,
        },
        {
            key: "produtosCount" as keyof Categoria,
            label: "Produtos",
            render: (categoria: Categoria) => `${categoria.produtosCount} produtos`,
        },
        {
            key: "status" as keyof Categoria,
            label: "Status",
            render: (categoria: Categoria) => (
                <span
                    style={{
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: "500",
                        backgroundColor: categoria.status === "ativo" ? "#dcfce7" : "#fef2f2",
                        color: categoria.status === "ativo" ? "#166534" : "#dc2626",
                    }}
                >
          {categoria.status === "ativo" ? "Ativo" : "Inativo"}
        </span>
            ),
        },
        {
            key: "atualizadoEm" as keyof Categoria,
            label: "Atualizado",
            render: (categoria: Categoria) => new Date(categoria.atualizadoEm).toLocaleDateString("pt-BR"),
        },
    ]

    // Campos extras para visualização
    const extraViewFields = selectedItem
        ? [
            { label: "Produtos vinculados", value: `${selectedItem.produtosCount} produtos` },
            { label: "Criado em", value: new Date(selectedItem.criadoEm).toLocaleDateString("pt-BR") },
            { label: "Atualizado em", value: new Date(selectedItem.atualizadoEm).toLocaleDateString("pt-BR") },
        ]
        : []

    // Override do handleSubmit para adicionar campos automáticos
    const handleCategorySubmit = (data: Partial<Categoria>) => {
        if (modalMode === "create") {
            createCategoria.mutate(
                {
                    name: data.nome!,
                    slug: data.slug!,
                    description: data.descricao,
                    color: data.cor,
                    icon: data.icone,
                },
                {
                    onSuccess: () => {
                        showToast("Categoria criada com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao criar categoria: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        } else if (modalMode === "edit" && selectedItem) {
            updateCategoria.mutate(
                {
                    id: selectedItem.id,
                    data: {
                        name: data.nome!,
                        slug: data.slug!,
                        description: data.descricao,
                        color: data.cor,
                        icon: data.icone,
                        status: data.status,
                    },
                },
                {
                    onSuccess: () => {
                        showToast("Categoria atualizada com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao atualizar categoria: ${error.message || "Erro desconhecido"}`, "error")
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
    const totalCategorias = categorias.length
    const categoriasAtivas = categorias.filter((c: any) => c.status === "ativo").length
    const totalProdutos = categorias.reduce((acc: any, c: any) => acc + c.produtosCount, 0)
    const categoriasVazias = categorias.filter((c: any) => c.produtosCount === 0).length

    if (isLoading) {
        return (
                <div style={containerStyle}>
                    <div>Carregando categorias...</div>
                </div>
        )
    }

    return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Categorias</h1>
                    <button
                        style={{
                            ...createButtonStyle,
                            opacity: createCategoria.isPending ? 0.7 : 1,
                            cursor: createCategoria.isPending ? "not-allowed" : "pointer",
                        }}
                        onClick={() => openModal("create")}
                        disabled={createCategoria.isPending}
                        onMouseEnter={(e) => {
                            if (!createCategoria.isPending) {
                                e.currentTarget.style.backgroundColor = "#2563eb"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!createCategoria.isPending) {
                                e.currentTarget.style.backgroundColor = "#3b82f6"
                            }
                        }}
                    >
                        {createCategoria.isPending ? "⏳ Criando..." : "➕ Criar Categoria"}
                    </button>
                </div>

                {/* Estatísticas */}
                <div style={statsStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalCategorias}</div>
                        <div style={statLabelStyle}>Total</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{categoriasAtivas}</div>
                        <div style={statLabelStyle}>Ativas</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalProdutos}</div>
                        <div style={statLabelStyle}>Produtos</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{categoriasVazias}</div>
                        <div style={statLabelStyle}>Vazias</div>
                    </div>
                </div>

                <CrudTable
                    data={categorias}
                    columns={tableColumns}
                    cardFields={cardFields}
                    onView={(categoria) => openModal("view", categoria)}
                    onEdit={(categoria) => openModal("edit", categoria)}
                    onDelete={(categoria) =>
                        handleDelete(
                            categoria.id,
                            `Tem certeza que deseja excluir a categoria "${categoria.nome}"? ${
                                categoria.produtosCount > 0
                                    ? `Esta categoria possui ${categoria.produtosCount} produtos vinculados.`
                                    : ""
                            }`,
                        )
                    }
                    defaultView="cards"
                    showViewToggle={true}
                    isLoading={deleteCategoria.isPending}
                />

                <CrudModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    title={getModalTitle("Categoria")}
                    fields={formFields}
                    data={formData}
                    onClose={closeModal}
                    onSubmit={handleCategorySubmit}
                    onChange={handleCategoryFieldChange}
                    extraViewFields={extraViewFields}
                />
                <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
            </div>
    )
}
