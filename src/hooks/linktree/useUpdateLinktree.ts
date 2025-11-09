import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface UpdateLinktreeData {
    title?: string
    url?: string
    icon?: string
    order?: number
    is_active?: boolean | number
}

export const useUpdateLinktree = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateLinktree"],
        mutationFn: async ({ id, data }: { id: number; data: UpdateLinktreeData }) => {
            const payload = {
                ...data,
                order: typeof data.order === "number" ? data.order : undefined,
                is_active:
                    data.is_active === undefined
                        ? undefined
                        : typeof data.is_active === "number"
                            ? data.is_active
                            : data.is_active !== false,
            }
            const res = await api.put(`/linktree/${id}`, payload)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["linktree"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar link do Linktree:", error)
        },
    })
}