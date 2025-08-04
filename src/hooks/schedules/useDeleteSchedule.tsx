import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useDeleteSchedule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["deleteSchedule"],
        mutationFn: async (id: number) => {
            const res = await api.delete(`/schedules/${id}`)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] })
        },
        onError: (error) => {
            console.error("Erro ao deletar agendamento:", error)
        },
    })
}
