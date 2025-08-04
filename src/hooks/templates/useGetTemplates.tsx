import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useGetTemplates = () => {
    return useQuery({
        queryKey: ["templates"],
        queryFn: async () => {
            const res = await api.get("/templates")
            return res.data.data.map((item: any) => ({
                id: item.id,
                name: item.name,
                conteudo: item.content,
                criadoEm: item.created_at,
                atualizadoEm: item.updated_at,
                // Campos calculados/padrão que não vêm da API
                ultimoUso: null,
                vezesUsado: 0,
                tamanho: item.content?.length || 0,
                categoria: "geral",
                status: "ativo",
            }))
        },
    })
}
