import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts" // ajuste o caminho conforme sua estrutura

interface CreateScrappingData {
    name: string
    type: "scrapping" | "api"
    name_type: string
    url: string
    login?: string
    password?: string
    key1?: string | number
    key2?: string
    is_active: boolean
}

export const useCreateScrapping = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createScrapping"],
        mutationFn: async (data: CreateScrappingData) => {
            const res = await api.post("/affiliates", data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scrappings"] })
        },
        onError: (error) => {
            console.error("Erro ao criar scrapping:", error)
        },
    })
}
