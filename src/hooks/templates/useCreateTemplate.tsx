import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface CreateTemplateData {
    name: string
    content: string
}

export const useCreateTemplate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createTemplate"],
        mutationFn: async (data: CreateTemplateData) => {
            const res = await api.post("/templates", data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] })
        },
        onError: (error) => {
            console.error("Erro ao criar template:", error)
        },
    })
}
