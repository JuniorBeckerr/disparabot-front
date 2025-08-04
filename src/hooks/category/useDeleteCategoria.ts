import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts" // ajuste o caminho conforme sua estrutura

export const useDeleteCategoria = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteCategoria"],
        mutationFn: async (id: number) => {
            const res = await api.delete(`/category/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias"] })
        },
        onError: (error) => {
            console.error("Erro ao deletar categoria:", error)
        },
    })
}
