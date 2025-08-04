import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http"

interface UpdateInstanceData {
    name?: string
    number?: string
    status?: "active" | "inactive"
}

export const useUpdateInstance = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateInstance"],
        mutationFn: async ({ id, data }: { id: number; data: UpdateInstanceData }) => {
            const res = await api.put(`/instances/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instances"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar instância:", error)
        },
    })
}
