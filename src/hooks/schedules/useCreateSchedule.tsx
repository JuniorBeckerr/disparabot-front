import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface CreateScheduleData {
    group_id: number
    category_id: number
    template_id: number
    schedule_time: string
    is_active: number
}

export const useCreateSchedule = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createSchedule"],
        mutationFn: async (data: CreateScheduleData) => {
            const res = await api.post("/schedules", data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["schedules"] })
        },
        onError: (error) => {
            console.error("Erro ao criar agendamento:", error)
        },
    })
}
