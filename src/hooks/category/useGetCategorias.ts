import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http.ts" // ajuste o caminho conforme sua estrutura

export const useGetCategorias = () => {
    return useQuery({
        queryKey: ["categorias"],
        queryFn: async () => {
            const res = await api.get("/category")
            return res.data.data.map((item: any) => ({
                id: item.id,
                nome: item.name,
                slug: item.slug,
                descricao: item.description || "Sem descrição", // ajustado
                cor: item.color || "#3b82f6", // valor padrão
                icone: item.icon || "📦", // valor padrão
                status: item.status || "ativo", // adaptar se necessário
                produtosCount: item.products_count || 0, // se vier do backend
                criadoEm: item.created_at,
                atualizadoEm: item.updated_at,
            }))
        },
    })
}
