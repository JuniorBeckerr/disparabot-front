import { useEffect, useCallback, useRef } from "react"
import { useGetInstanceStatus } from "../hooks/instances/useGetInstanceStatus"

interface InstanceStatusManagerProps {
    instanceId: number
    instanceName: string
    onStatusChange?: (status: string, qrCode?: string) => void
    enabled?: boolean
}

export const InstanceStatusManager: React.FC<InstanceStatusManagerProps> = ({
                                                                                instanceId,
                                                                                onStatusChange,
                                                                                enabled = true,
                                                                            }) => {
    const { data: statusData } = useGetInstanceStatus(instanceId, enabled)

    // Memoriza o último status reportado
    const lastStatusRef = useRef<string | null>(null)

    const handleStatusChange = useCallback(
        (status: string, qrCode?: string) => {
            if (onStatusChange) {
                onStatusChange(status, qrCode)
            }
        },
        [onStatusChange]
    )

    useEffect(() => {
        if (!statusData) return

        const newStatus = statusData.state === "open" ? "conectada" : "desconectada"

        // Evita chamar repetidamente se o status não mudou
        if (newStatus !== lastStatusRef.current) {
            lastStatusRef.current = newStatus
            handleStatusChange(newStatus, statusData.base64 || undefined)
        }
    }, [statusData, handleStatusChange])

    return null
}
