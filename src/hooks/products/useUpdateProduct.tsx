import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface UpdateProductData {
    name?: string
    description?: string
    image_url?: string
    price?: number
    url?: string
    category_id?: number
    affiliate_id?: number
    source?: string
    affiliate_code?: string
    is_active?: boolean
}

export const useUpdateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateProduct"],
        mutationFn: async ({ id, data }: { id: number; data: UpdateProductData }) => {
            const res = await api.put(`/products/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar produto:", error)
        },
    })
}
