import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts" // ajuste o caminho conforme sua estrutura

export const useDeleteScrapping = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteScrapping"],
        mutationFn: async (id: number) => {
            const res = await api.delete(`/affiliates/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scrappings"] })
        },
        onError: (error) => {
            console.error("Erro ao deletar scrapping:", error)
        },
    })
}