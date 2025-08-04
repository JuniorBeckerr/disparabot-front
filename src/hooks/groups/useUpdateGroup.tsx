import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface UpdateGroupData {
    name?: string
    description?: string
    category_id?: number
    is_active?: boolean
    image_url?: string
}

export const useUpdateGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateGroup"],
        mutationFn: async ({ id, data }: { id: number; data: UpdateGroupData }) => {
            const res = await api.put(`/groups/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar grupo:", error)
        },
    })
}
