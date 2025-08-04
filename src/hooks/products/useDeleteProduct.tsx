import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useDeleteProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteProduct"],
        mutationFn: async (id: number) => {
            const res = await api.delete(`/products/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: (error) => {
            console.error("Erro ao deletar produto:", error)
        },
    })
}
