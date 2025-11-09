import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export interface LinktreeItem {
    id: number
    titulo: string
    url: string
    icone?: string
    ordem: number
    isActive: boolean
    criadoEm: string
    atualizadoEm: string
    status: "ativo" | "inativo"
}

export const useGetLinktree = () => {
    return useQuery<{ id: number }[], LinktreeItem[]>({
        queryKey: ["linktree"],
        queryFn: async () => {
            const res = await api.get("/linktree")
            return res.data.data.map((item: any) => ({
                id: item.id,
                titulo: item.title,
                url: item.url,
                icone: item.icon || "",
                ordem: Number(item.order ?? 0),
                isActive: Boolean(item.is_active),
                criadoEm: item.created_at,
                atualizadoEm: item.updated_at,
                status: item.is_active ? "ativo" : "inativo",
            }))
        },
    })
}