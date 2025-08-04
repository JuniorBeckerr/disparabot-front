import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useGetProducts = () => {
    return useQuery({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await api.get("/products")
            return res.data.data.map((item: any) => ({
                id: item.id,
                nome: item.name,
                descricao: item.description,
                imageUrl: item.image_url,
                preco: item.price,
                url: item.url,
                categoriaId: item.category_id,
                affiliateId: item.affiliate_id,
                source: item.source,
                affiliateCode: item.affiliate_code,
                isActive: Boolean(item.is_active),
                criadoEm: item.created_at,
                atualizadoEm: item.updated_at,
                // Campos calculados/padrão
                status: item.is_active ? "ativo" : "inativo",
            }))
        },
    })
}
