import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useDeleteLinktree = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteLinktree"],
        mutationFn: async (id: number) => {
            const res = await api.delete(`/linktree/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["linktree"] })
        },
        onError: (error) => {
            console.error("Erro ao deletar link do Linktree:", error)
        },
    })
}