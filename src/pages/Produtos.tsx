"use client"

import type React from "react"
import { useState } from "react"
import { CrudModal } from "../components/CrudModal"
import { CrudTable } from "../components/CrudTable"
import { useGetProducts } from "../hooks/products/useGetProducts"
import { useCreateProduct } from "../hooks/products/useCreateProduct"
import { useUpdateProduct } from "../hooks/products/useUpdateProduct"
import { useDeleteProduct } from "../hooks/products/useDeleteProduct"
import { useGetCategorias } from "../hooks/category/useGetCategorias"
import { useGetScrappings } from "../hooks/scrapping/useGetScrapping"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"

interface Produto {
    id: number
    nome: string
    descricao: string
    imageUrl?: string
    preco: number
    url: string
    categoriaId: number
    affiliateId: number
    source: string
    affiliateCode?: string
    isActive: boolean
    criadoEm: string
    atualizadoEm: string
    status: "ativo" | "inativo"
}

type ModalMode = "create" | "edit" | "view"

export const Produtos = () => {
    const { data: produtos = [], isLoading } = useGetProducts()
    const { data: categorias = [] } = useGetCategorias()
    const { data: scrappings = [] } = useGetScrappings()
    const createProduct = useCreateProduct()
    const updateProduct = useUpdateProduct()
    const deleteProduct = useDeleteProduct()

    const { toast, showToast, hideToast } = useToast()

    // Estado do modal
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("create")
    const [selectedItem, setSelectedItem] = useState<Produto | null>(null)
    const [formData, setFormData] = useState<Partial<Produto>>({})

    // Funções do modal
    const openModal = (mode: ModalMode, item?: Produto) => {
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
            deleteProduct.mutate(id, {
                onSuccess: () => {
                    showToast("Produto deletado com sucesso!", "success")
                },
                onError: (error: any) => {
                    showToast(`Erro ao deletar produto: ${error.message || "Erro desconhecido"}`, "error")
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

    // Submit do formulário
    const handleProductSubmit = (data: Partial<Produto>) => {
        if (modalMode === "create") {
            const createData = {
                name: data.nome!,
                description: data.descricao!,
                image_url: data.imageUrl || "",
                price: Number(data.preco!),
                url: data.url!,
                category_id: Number(data.categoriaId!),
                affiliate_id: Number(data.affiliateId!),
                source: data.source!,
                affiliate_code: data.affiliateCode || "",
                is_active: data.isActive !== false,
            }

            createProduct.mutate(createData, {
                onSuccess: () => {
                    showToast("Produto criado com sucesso!", "success")
                    closeModal()
                },
                onError: (error: any) => {
                    showToast(`Erro ao criar produto: ${error.message || "Erro desconhecido"}`, "error")
                },
            })
        } else if (modalMode === "edit" && selectedItem) {
            const updateData = {
                name: data.nome!,
                description: data.descricao!,
                image_url: data.imageUrl || "",
                price: Number(data.preco!),
                url: data.url!,
                category_id: Number(data.categoriaId!),
                affiliate_id: Number(data.affiliateId!),
                source: data.source!,
                affiliate_code: data.affiliateCode || "",
                is_active: data.isActive !== false,
            }

            updateProduct.mutate(
                {
                    id: selectedItem.id,
                    data: updateData,
                },
                {
                    onSuccess: () => {
                        showToast("Produto atualizado com sucesso!", "success")
                        closeModal()
                    },
                    onError: (error: any) => {
                        showToast(`Erro ao atualizar produto: ${error.message || "Erro desconhecido"}`, "error")
                    },
                },
            )
        }
    }

    // Configuração dos campos do formulário
    const formFields = [
        {
            name: "nome",
            label: "Nome do Produto",
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
            name: "preco",
            label: "Preço (R$)",
            type: "number" as const,
            required: true,
            step: "0.01",
        },
        {
            name: "url",
            label: "URL do Produto",
            type: "text" as const,
            required: true,
        },
        {
            name: "imageUrl",
            label: "URL da Imagem",
            type: "text" as const,
            required: false,
        },
        {
            name: "categoriaId",
            label: "Categoria",
            type: "select" as const,
            required: true,
            options: categorias.map((c: any) => ({ value: c.id, label: c.nome })),
        },
        {
            name: "affiliateId",
            label: "Afiliado/Scrapping",
            type: "select" as const,
            required: true,
            options: scrappings.map((s: any) => ({ value: s.id, label: s.name })),
        },
        {
            name: "source",
            label: "Fonte",
            type: "select" as const,
            required: true,
            options: [
                { value: "amazon", label: "Amazon" },
                { value: "mercadolivre", label: "Mercado Livre" },
                { value: "americanas", label: "Americanas" },
                { value: "magazineluiza", label: "Magazine Luiza" },
                { value: "casasbahia", label: "Casas Bahia" },
                { value: "extra", label: "Extra" },
                { value: "submarino", label: "Submarino" },
                { value: "shoptime", label: "Shoptime" },
                { value: "outros", label: "Outros" },
            ],
        },
        {
            name: "affiliateCode",
            label: "Código de Afiliado",
            type: "text" as const,
            required: false,
        },
        {
            name: "isActive",
            label: "Status",
            type: "select" as const,
            options: [
                { value: "true", label: "Ativo" },
                { value: "false", label: "Inativo" },
            ],
        },
    ]

    // Configuração das colunas da tabela
    const tableColumns = [
        {
            key: "nome" as keyof Produto,
            label: "Produto",
            render: (produto: Produto) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {produto.imageUrl ? (
                        <img
                            src={produto.imageUrl || "/placeholder.svg"}
                            alt={produto.nome}
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
                                backgroundColor: "#f3f4f6",
                                borderRadius: "8px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "18px",
                            }}
                        >
                            📦
                        </div>
                    )}
                    <div>
                        <strong>{produto.nome}</strong>
                        <br />
                        <small style={{ color: "#6b7280" }}>
                            {produto.source} • {categorias.find((c: any) => c.id === produto.categoriaId)?.nome}
                        </small>
                    </div>
                </div>
            ),
        },
        {
            key: "descricao" as keyof Produto,
            label: "Descrição",
            render: (produto: Produto) => (
                <div style={{ maxWidth: "200px" }}>
                    {produto.descricao
                        ? (produto.descricao.length > 60
                            ? `${produto.descricao.substring(0, 60)}...`
                            : produto.descricao)
                        : "--"}
                </div>
            ),
        },
        {
            key: "preco" as keyof Produto,
            label: "Preço",
            render: (produto: Produto) => (
                <strong style={{ color: "#059669" }}>
                    {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                    }).format(produto.preco)}
                </strong>
            ),
        },
        {
            key: "source" as keyof Produto,
            label: "Fonte",
            render: (produto: Produto) => {
                const sourceConfig: Record<string, { bg: string; color: string; icon: string }> = {
                    amazon: { bg: "#fef3c7", color: "#92400e", icon: "🛒" },
                    mercadolivre: { bg: "#fef3c7", color: "#92400e", icon: "🛍️" },
                    americanas: { bg: "#fecaca", color: "#dc2626", icon: "🏪" },
                    magazineluiza: { bg: "#ddd6fe", color: "#7c3aed", icon: "🏬" },
                    casasbahia: { bg: "#fed7d7", color: "#e53e3e", icon: "🏠" },
                    extra: { bg: "#bee3f8", color: "#3182ce", icon: "🛒" },
                    submarino: { bg: "#c6f6d5", color: "#38a169", icon: "🚢" },
                    shoptime: { bg: "#fbb6ce", color: "#d53f8c", icon: "⏰" },
                    outros: { bg: "#e2e8f0", color: "#4a5568", icon: "🔗" },
                }
                const config = sourceConfig[produto.source] || sourceConfig.outros
                return (
                    <span
                        style={{
                            padding: "4px 8px",
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
            {config.icon} {produto.source}
          </span>
                )
            },
        },
        {
            key: "status" as keyof Produto,
            label: "Status",
            render: (produto: Produto) => {
                const statusConfig = {
                    ativo: { bg: "#dcfce7", color: "#166534", icon: "✅" },
                    inativo: { bg: "#fef2f2", color: "#dc2626", icon: "❌" },
                }
                const config = statusConfig[produto.status]
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
            {config.icon} {produto.status}
          </span>
                )
            },
        },
        {
            key: "url" as keyof Produto,
            label: "Link",
            render: (produto: Produto) => (
                <a
                    href={produto.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                        color: "#3b82f6",
                        textDecoration: "none",
                        fontSize: "12px",
                        padding: "4px 8px",
                        border: "1px solid #3b82f6",
                        borderRadius: "4px",
                    }}
                >
                    🔗 Ver produto
                </a>
            ),
        },
        {
            key: "atualizadoEm" as keyof Produto,
            label: "Atualizado",
            render: (produto: Produto) => new Date(produto.atualizadoEm).toLocaleDateString("pt-BR"),
        },
    ]

    // Configuração dos campos para visualização em cards
    const cardFields = [
        {
            key: "nome" as keyof Produto,
            primary: true,
            render: (produto: Produto) => (
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    {produto.imageUrl ? (
                        <img
                            src={produto.imageUrl || "/placeholder.svg"}
                            alt={produto.nome}
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
                                backgroundColor: produto.isActive ? "#3b82f6" : "#6b7280",
                                borderRadius: "6px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "16px",
                            }}
                        >
                            📦
                        </div>
                    )}
                    {produto.nome}
                </div>
            ),
        },
        {
            key: "descricao" as keyof Produto,
            secondary: true,
            render: (produto: Produto) => {
                const descricao = produto.descricao ?? "--";
                return descricao.length > 80
                    ? `${descricao.substring(0, 80)}...`
                    : descricao;
            },
        },
        {
            key: "preco" as keyof Produto,
            label: "Preço",
            render: (produto: Produto) =>
                new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                }).format(produto.preco),
        },
        {
            key: "categoriaId" as keyof Produto,
            label: "Categoria",
            render: (produto: Produto) => categorias.find((c: any) => c.id === produto.categoriaId)?.nome || "Sem categoria",
        },
        {
            key: "source" as keyof Produto,
            label: "Fonte",
            render: (produto: Produto) => {
                const sourceLabels: Record<string, string> = {
                    amazon: "Amazon",
                    mercadolivre: "Mercado Livre",
                    americanas: "Americanas",
                    magazineluiza: "Magazine Luiza",
                    casasbahia: "Casas Bahia",
                    extra: "Extra",
                    submarino: "Submarino",
                    shoptime: "Shoptime",
                    outros: "Outros",
                }
                return sourceLabels[produto.source] || produto.source
            },
        },
        {
            key: "status" as keyof Produto,
            label: "Status",
            render: (produto: Produto) => (produto.isActive ? "✅ Ativo" : "❌ Inativo"),
        },
        {
            key: "atualizadoEm" as keyof Produto,
            label: "Atualizado",
            render: (produto: Produto) => new Date(produto.atualizadoEm).toLocaleDateString("pt-BR"),
        },
    ]

    // Campos extras para visualização
    const extraViewFields = selectedItem
        ? [
            { label: "URL do Produto", value: selectedItem.url },
            { label: "URL da Imagem", value: selectedItem.imageUrl || "Não definida" },
            {
                label: "Categoria",
                value: categorias.find((c: any) => c.id === selectedItem.categoriaId)?.nome || "Sem categoria",
            },
            {
                label: "Afiliado/Scrapping",
                value: scrappings.find((s: any) => s.id === selectedItem.affiliateId)?.name || "Não definido",
            },
            { label: "Fonte", value: selectedItem.source },
            { label: "Código de Afiliado", value: selectedItem.affiliateCode || "Não definido" },
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
    const totalProdutos = produtos.length
    const produtosAtivos = produtos.filter((p: any) => p.isActive).length
    const precoMedio = totalProdutos > 0 ? produtos.reduce((acc: any, p: any) => acc + p.preco, 0) / totalProdutos : 0
    const fontesMaisUsadas = new Set(produtos.map((p: any) => p.source)).size

    if (isLoading) {
        return (
                <div style={containerStyle}>
                    <div>Carregando produtos...</div>
                </div>
        )
    }

    return (
            <div style={containerStyle}>
                <div style={headerStyle}>
                    <h1 style={titleStyle}>Produtos</h1>
                    <button
                        style={{
                            ...createButtonStyle,
                            opacity: createProduct.isPending ? 0.7 : 1,
                            cursor: createProduct.isPending ? "not-allowed" : "pointer",
                        }}
                        onClick={() => openModal("create")}
                        disabled={createProduct.isPending}
                        onMouseEnter={(e) => {
                            if (!createProduct.isPending) {
                                e.currentTarget.style.backgroundColor = "#2563eb"
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!createProduct.isPending) {
                                e.currentTarget.style.backgroundColor = "#3b82f6"
                            }
                        }}
                    >
                        {createProduct.isPending ? "⏳ Criando..." : "➕ Criar Produto"}
                    </button>
                </div>

                {/* Estatísticas */}
                <div style={statsStyle}>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{totalProdutos}</div>
                        <div style={statLabelStyle}>Total</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{produtosAtivos}</div>
                        <div style={statLabelStyle}>Ativos</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>
                            {new Intl.NumberFormat("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                notation: "compact",
                            }).format(precoMedio)}
                        </div>
                        <div style={statLabelStyle}>Preço Médio</div>
                    </div>
                    <div style={statCardStyle}>
                        <div style={statValueStyle}>{fontesMaisUsadas}</div>
                        <div style={statLabelStyle}>Fontes</div>
                    </div>
                </div>

                <CrudTable
                    data={produtos}
                    columns={tableColumns}
                    cardFields={cardFields}
                    onView={(produto) => openModal("view", produto)}
                    onEdit={(produto) => openModal("edit", produto)}
                    onDelete={(produto) =>
                        handleDelete(produto.id, `Tem certeza que deseja excluir o produto "${produto.nome}"?`)
                    }
                    defaultView="cards"
                    showViewToggle={true}
                    isLoading={deleteProduct.isPending}
                />

                <CrudModal
                    isOpen={modalOpen}
                    mode={modalMode}
                    title={getModalTitle("Produto")}
                    fields={formFields}
                    data={formData}
                    onClose={closeModal}
                    onSubmit={handleProductSubmit}
                    onChange={handleFieldChange}
                    extraViewFields={extraViewFields}
                    isLoading={createProduct.isPending || updateProduct.isPending}
                />

                <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
            </div>
    )
}
