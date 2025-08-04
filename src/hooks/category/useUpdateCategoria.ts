import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts" // ajuste o caminho conforme sua estrutura

export const useUpdateCategoria = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateCategoria"],
        mutationFn: async ({
                               id,
                               data,
                           }: {
            id: number
            data: {
                name?: string
                slug?: string
                description?: string
                color?: string
                icon?: string
                status?: string
            }
        }) => {
            const res = await api.put(`/category/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar categoria:", error)
        },
    })
}
