"use client"

import type React from "react"

export const Dashboard = () => {
    const cardStyle: React.CSSProperties = {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        marginBottom: "24px",
    }

    const titleStyle: React.CSSProperties = {
        fontSize: "24px",
        fontWeight: "bold",
        color: "#1e293b",
        marginBottom: "8px",
    }

    const subtitleStyle: React.CSSProperties = {
        fontSize: "16px",
        color: "#64748b",
        marginBottom: "24px",
    }

    const statsContainerStyle: React.CSSProperties = {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "20px",
        marginBottom: "32px",
    }

    const statCardStyle: React.CSSProperties = {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
        border: "1px solid #e2e8f0",
    }

    const statIconStyle: React.CSSProperties = {
        fontSize: "32px",
        marginBottom: "12px",
    }

    const statValueStyle: React.CSSProperties = {
        fontSize: "28px",
        fontWeight: "bold",
        color: "#1e293b",
        marginBottom: "4px",
    }

    const statLabelStyle: React.CSSProperties = {
        fontSize: "14px",
        color: "#64748b",
    }

    const recentActivityStyle: React.CSSProperties = {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "24px",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }

    const activityItemStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 0",
        borderBottom: "1px solid #f1f5f9",
    }

    const activityIconStyle: React.CSSProperties = {
        fontSize: "20px",
        width: "40px",
        height: "40px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    }

    const activityTextStyle: React.CSSProperties = {
        flex: 1,
    }

    const activityTitleStyle: React.CSSProperties = {
        fontSize: "14px",
        fontWeight: "500",
        color: "#1e293b",
        marginBottom: "2px",
    }

    const activityTimeStyle: React.CSSProperties = {
        fontSize: "12px",
        color: "#64748b",
    }

    return (
            <div style={cardStyle}>
                <h1 style={titleStyle}>Dashboard</h1>
                <p style={subtitleStyle}>Visão geral do seu sistema DisparaBot</p>

                {/* Stats Cards */}
                <div style={statsContainerStyle}>
                    <div style={statCardStyle}>
                        <div style={statIconStyle}>📊</div>
                        <div style={statValueStyle}>1,234</div>
                        <div style={statLabelStyle}>Total de Mensagens</div>
                    </div>

                    <div style={statCardStyle}>
                        <div style={statIconStyle}>👥</div>
                        <div style={statValueStyle}>56</div>
                        <div style={statLabelStyle}>Grupos Ativos</div>
                    </div>

                    <div style={statCardStyle}>
                        <div style={statIconStyle}>📦</div>
                        <div style={statValueStyle}>8319</div>
                        <div style={statLabelStyle}>Produtos Cadastrados</div>
                    </div>

                    <div style={statCardStyle}>
                        <div style={statIconStyle}>🖥️</div>
                        <div style={statValueStyle}>12</div>
                        <div style={statLabelStyle}>Instâncias Ativas</div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div style={recentActivityStyle}>
                    <h2 style={{ ...titleStyle, fontSize: "20px", marginBottom: "20px" }}>Atividade Recente</h2>

                    <div style={activityItemStyle}>
                        <div style={activityIconStyle}>🔍</div>
                        <div style={activityTextStyle}>
                            <div style={activityTitleStyle}>Novo scrapping executado</div>
                            <div style={activityTimeStyle}>Há 5 minutos</div>
                        </div>
                    </div>

                    <div style={activityItemStyle}>
                        <div style={activityIconStyle}>📅</div>
                        <div style={activityTextStyle}>
                            <div style={activityTitleStyle}>Agendamento criado</div>
                            <div style={activityTimeStyle}>Há 15 minutos</div>
                        </div>
                    </div>

                    <div style={activityItemStyle}>
                        <div style={activityIconStyle}>👥</div>
                        <div style={activityTextStyle}>
                            <div style={activityTitleStyle}>Novo grupo adicionado</div>
                            <div style={activityTimeStyle}>Há 1 hora</div>
                        </div>
                    </div>

                    <div style={activityItemStyle}>
                        <div style={activityIconStyle}>📄</div>
                        <div style={activityTextStyle}>
                            <div style={activityTitleStyle}>Template atualizado</div>
                            <div style={activityTimeStyle}>Há 2 horas</div>
                        </div>
                    </div>
                </div>
            </div>
    )
}
