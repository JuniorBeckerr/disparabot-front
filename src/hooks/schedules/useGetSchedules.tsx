import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useGetSchedules = () => {
    return useQuery({
        queryKey: ["schedules"],
        queryFn: async () => {
            const res = await api.get("/schedules")
            return res.data.data.map((item: any) => ({
                id: item.id,
                grupoId: item.group_id,
                categoriaId: item.category_id,
                templateId: item.template_id,
                horaAgendamento: item.schedule_time,
                isActive: Boolean(item.is_active),
                criadoEm: item.created_at,
                atualizadoEm: item.updated_at,
                // Campos relacionados que vêm da API
                grupoNome: item.group_name,
                categoriaNome: item.category_name,
                templateNome: item.template_title,
                // Campos calculados/padrão
                nome: `${item.template_title} - ${item.group_name}`,
                status: item.is_active ? "ativo" : "inativo",
                dataAgendamento: new Date().toISOString().split("T")[0], // Padrão para hoje
                destinatarios: 0, // Não vem da API
                mensagensEnviadas: 0,
                mensagensFalha: 0,
            }))
        },
    })
}
