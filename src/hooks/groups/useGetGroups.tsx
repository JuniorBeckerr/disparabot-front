import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useGetGroups = () => {
    return useQuery({
        queryKey: ["groups"],
        queryFn: async () => {
            const res = await api.get("/groups")
            return res.data.data.map((item: any) => ({
                id: item.id,
                nome: item.name,
                groupId: item.group_id,
                descricao: item.description || "Sem descrição",
                inviteCode: item.invite_code,
                imageUrl: item.image_url,
                isActive: Boolean(item.is_active),
                categoryId: item.category_id,
                criadoEm: item.created_at,
                atualizadoEm: item.updated_at,
                // Campos calculados/padrão
                membros: 0, // Não vem da API, pode ser implementado depois
                status: item.is_active ? "ativo" : "inativo",
            }))
        },
    })
}
