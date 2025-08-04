import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface UpdateTemplateData {
    name?: string
    content?: string
}

export const useUpdateTemplate = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateTemplate"],
        mutationFn: async ({ id, data }: { id: number; data: UpdateTemplateData }) => {
            const res = await api.put(`/templates/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["templates"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar template:", error)
        },
    })
}
