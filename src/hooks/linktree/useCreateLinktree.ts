import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface CreateLinktreeData {
    title: string
    url: string
    icon?: string
    order?: number
    is_active?: boolean | number
}

export const useCreateLinktree = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createLinktree"],
        mutationFn: async (data: CreateLinktreeData) => {
            const payload = {
                ...data,
                order: Number(data.order ?? 0),
                is_active: typeof data.is_active === "number" ? data.is_active : data.is_active !== false,
            }
            const res = await api.post("/linktree", payload)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["linktree"] })
        },
        onError: (error) => {
            console.error("Erro ao criar link do Linktree:", error)
        },
    })
}