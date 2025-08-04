import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http"

export const useDeleteInstance = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteInstance"],
        mutationFn: async (id: number) => {
            const res = await api.delete(`/instances/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instances"] })
        },
        onError: (error) => {
            console.error("Erro ao deletar instância:", error)
        },
    })
}
