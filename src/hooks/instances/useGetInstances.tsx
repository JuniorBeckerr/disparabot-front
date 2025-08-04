import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http"

export const useGetInstances = () => {
    return useQuery({
        queryKey: ["instances"],
        queryFn: async () => {
            const res = await api.get("/instances")
            return res.data.data.map((item: any) => ({
                id: item.id,
                nome: item.name,
                descricao: `Instância ${item.name}`, // Como não vem da API, criamos uma descrição padrão
                telefone: item.number || null,
                status: item.status === "active" ? "conectada" : "desconectada",
                qrCode: null, // Será obtido separadamente quando necessário
                webhook: null, // Não vem da API atual
                token: item.api_token,
                criadoEm: item.created_at,
                ultimaConexao: item.last_connected_at,
                mensagensEnviadas: 0, // Não vem da API atual
                mensagensRecebidas: 0, // Não vem da API atual
            }))
        },
    })
}
