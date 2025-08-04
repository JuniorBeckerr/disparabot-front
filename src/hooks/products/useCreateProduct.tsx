import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface CreateProductData {
    name: string
    description: string
    image_url?: string
    price: number
    url: string
    category_id: number
    affiliate_id: number
    source: string
    affiliate_code?: string
    is_active: boolean
}

export const useCreateProduct = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createProduct"],
        mutationFn: async (data: CreateProductData) => {
            const res = await api.post("/products", data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["products"] })
        },
        onError: (error) => {
            console.error("Erro ao criar produto:", error)
        },
    })
}
