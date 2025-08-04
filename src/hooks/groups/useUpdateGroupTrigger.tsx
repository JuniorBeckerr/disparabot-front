import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface UpdateTriggerData {
    instance_id: number
}

export const useUpdateGroupTrigger = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["updateGroupTrigger"],
        mutationFn: async ({ groupId, data }: { groupId: number; data: UpdateTriggerData }) => {
            const res = await api.put(`/groups/${groupId}/trigger`, data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
        onError: (error) => {
            console.error("Erro ao atualizar trigger:", error)
        },
    })
}
