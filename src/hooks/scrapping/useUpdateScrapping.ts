import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts" // ajuste o caminho conforme sua estrutura


interface UpdateScrappingData {
    name?: string
    type?: "scrapping" | "api"
    name_type?: string
    url?: string
    login?: string
    password?: string
    key1?: string | number
    key2?: string
    is_active?: boolean
}

export const useUpdateScrapping = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateScrapping"],
        mutationFn: async ({ id, data }: { id: number; data: UpdateScrappingData }) => {
            const res = await api.put(`/affiliates/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["scrappings"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar scrapping:", error)
        },
    })
}
