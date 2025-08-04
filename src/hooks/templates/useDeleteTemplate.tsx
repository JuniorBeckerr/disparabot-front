import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useDeleteTemplate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteTemplate"],
        mutationFn: async (id: number) => {
            const res = await api.delete(`/templates/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] })
        },
        onError: (error) => {
            console.error("Erro ao deletar template:", error)
        },
    })
}
