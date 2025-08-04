"use client"

import { useState } from "react"

interface CrudItem {
    id: number
    [key: string]: any
}

interface UseCrudOptions<T> {
    initialData: T[]
    generateId?: () => number
}

export function useCrud<T extends CrudItem>({ initialData, generateId }: UseCrudOptions<T>) {
    const [items, setItems] = useState<T[]>(initialData)
    const [modalOpen, setModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<"create" | "edit" | "view">("create")
    const [selectedItem, setSelectedItem] = useState<T | null>(null)
    const [formData, setFormData] = useState<Partial<T>>({})

    const defaultGenerateId = () => Math.max(...items.map((item) => item.id), 0) + 1

    const openModal = (mode: "create" | "edit" | "view", item?: T) => {
        setModalMode(mode)
        setSelectedItem(item || null)
        setFormData(item ? { ...item } : {})
        setModalOpen(true)
    }

    const closeModal = () => {
        setModalOpen(false)
        setSelectedItem(null)
        setFormData({})
    }

    const handleSubmit = (data: Partial<T>) => {
        if (modalMode === "create") {
            const newItem = {
                ...data,
                id: generateId ? generateId() : defaultGenerateId(),
            } as T
            setItems([...items, newItem])
        } else if (modalMode === "edit" && selectedItem) {
            setItems(items.map((item) => (item.id === selectedItem.id ? { ...item, ...data } : item)))
        }
        closeModal()
    }

    const handleDelete = (id: number, confirmMessage?: string) => {
        const message = confirmMessage || "Tem certeza que deseja excluir este item?"
        if (confirm(message)) {
            setItems(items.filter((item) => item.id !== id))
        }
    }

    const handleFieldChange = (field: string, value: any) => {
        setFormData({ ...formData, [field]: value })
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
                return ""
        }
    }

    return {
        // Data
        items,
        setItems,

        // Modal state
        modalOpen,
        modalMode,
        selectedItem,
        formData,

        // Actions
        openModal,
        closeModal,
        handleSubmit,
        handleDelete,
        handleFieldChange,
        getModalTitle,
    }
}
