import { useQuery } from "@tanstack/react-query"
import { api } from "../../api/http.ts"

export const useGetInstanceStatus = (instanceId: number, enabled = true) => {
    return useQuery({
        queryKey: ["instanceStatus", instanceId],
        queryFn: async () => {
            const res = await api.get(`/instances/${instanceId}/status`)
            return {
                instanceName: res.data.data.instance?.instanceName || "",
                state: res.data.data.instance?.state || "closed",
                pairingCode: res.data.data.pairingCode || null,
                code: res.data.data.code || null,
                base64: res.data.data.base64 || null,
                count: res.data.data.count || 0,
            }
        },
        enabled,
        refetchInterval: enabled ? 5000 : false, // Só faz polling se enabled
        retry: 3,
    })
}

// Hook específico para buscar QR Code sob demanda
export const useGetInstanceQRCode = (instanceId: number | null) => {
    return useQuery({
        queryKey: ["instanceQRCode", instanceId],
        queryFn: async () => {
            if (!instanceId) return null
            const res = await api.get(`/instances/${instanceId}/status`)
            return {
                base64: res.data.data.base64 || null,
                instanceName: res.data.data.instance?.instanceName || "",
                state: res.data.data.instance?.state || "closed",
            }
        },
        enabled: !!instanceId,
        retry: 2,
        refetchOnWindowFocus: false,
    })
}
