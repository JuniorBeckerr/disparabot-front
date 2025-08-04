import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface CreateGroupData {
    instance_id: number
    subject: string
    category_id?: number
    participants: string[]
    description?: string
    image_url?: string
    extra_instances?: number[]
    trigger_instance_id: number
}

export const useCreateGroup = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createGroup"],
        mutationFn: async (data: CreateGroupData) => {
            const res = await api.post("/groups", data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["groups"] })
        },
        onError: (error) => {
            console.error("Erro ao criar grupo:", error)
        },
    })
}
