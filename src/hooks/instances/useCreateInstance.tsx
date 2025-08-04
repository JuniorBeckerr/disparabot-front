import { useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "../../api/http"

interface CreateInstanceData {
    name: string
    number?: string
    status: "active" | "inactive"
}

export const useCreateInstance = () => {
    const queryClient = useQueryClient()

    return useMutation({
        mutationKey: ["createInstance"],
        mutationFn: async (data: CreateInstanceData) => {
            const res = await api.post("/instances", data)
            return res.data
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["instances"] })
        },
        onError: (error) => {
            console.error("Erro ao criar instância:", error)
        },
    })
}
