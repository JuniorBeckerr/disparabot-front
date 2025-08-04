import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface UpdateScheduleData {
    group_id?: number
    category_id?: number
    template_id?: number
    schedule_time?: string
    is_active?: number
}

export const useUpdateSchedule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateSchedule"],
        mutationFn: async ({ id, data }: { id: number; data: UpdateScheduleData }) => {
            const res = await api.put(`/schedules/${id}`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar agendamento:", error)
        },
    })
}
