import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useDeleteGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteGroup"],
        mutationFn: async (id: number) => {
            const res = await api.delete(`/groups/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
        onError: (error) => {
            console.error("Erro ao deletar grupo:", error)
        },
    })
}
