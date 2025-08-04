import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http.ts" // ajuste o caminho conforme sua estrutura

export const useGetScrappings = () => {
    return useQuery({
        queryKey: ["scrappings"],
        queryFn: async () => {
            const res = await api.get("/affiliates")
            return res.data.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                type: item.type,
                name_type: item.name_type,
                url: item.url,
                login: item.login || "",
                password: item.password || "",
                key1: item.key1 || "",
                key2: item.key2 || "",
                is_active: Boolean(item.is_active),
                status: item.status,
                criadoEm: item.created_at,
                atualizadoEm: item.updated_at,
                ultimaExecucao: item.last_execution || null,
                produtosColetados: item.products_count || 0,
            }))
        },
    })
}

