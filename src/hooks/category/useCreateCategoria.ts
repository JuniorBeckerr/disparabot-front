import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts" // ajuste o caminho conforme sua estrutura

export const useCreateCategoria = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createCategoria"],
        mutationFn: async (data: { name: string; slug: string; description?: string; color?: string; icon?: string }) => {
            const res = await api.post("/category", data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["categorias"] })
        },
        onError: (error) => {
            console.error("Erro ao criar categoria:", error)
        }
    })
}
