import { useMutation } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

interface SendMessageData {
    message: string
}

export const useSendGroupMessage = () => {
    return useMutation({
        mutationKey: ["sendGroupMessage"],
        mutationFn: async ({ groupId, data }: { groupId: number; data: SendMessageData }) => {
            const res = await api.post(`/groups/${groupId}/send-message`, data)
            return res.data
        },
        onError: (error) => {
            console.error("Erro ao enviar mensagem:", error)
        },
    })
}
