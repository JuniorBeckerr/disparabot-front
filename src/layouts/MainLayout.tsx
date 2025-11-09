"use client"

import type React from "react"
import { Link, useLocation, Navigate } from "react-router-dom"
import { useAuthContext } from "../context/AuthContext"
import { useState } from "react"

interface MainLayoutProps {
    children: React.ReactNode
}

export const MainLayout = ({ children }: MainLayoutProps) => {
    const [sidebarOpen, setSidebarOpen] = useState(true)
    const { logout, user, isAuthenticated, isLoading } = useAuthContext()
    const location = useLocation()

    const loadingContainerStyle: React.CSSProperties = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f8fafc",
        gap: "16px",
    }

    const loadingSpinnerStyle: React.CSSProperties = {
        width: "40px",
        height: "40px",
        border: "4px solid #e5e7eb",
        borderTop: "4px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    }

    const loadingTextStyle: React.CSSProperties = {
        color: "#6b7280",
        fontSize: "16px",
    }

    // Loading state
    if (isLoading) {
        return (
            <div style={loadingContainerStyle}>
                <div style={loadingSpinnerStyle}></div>
                <p style={loadingTextStyle}>Carregando...</p>
                <style>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        )
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    const menuItems = [
        { name: "Dashboard", path: "/dashboard", icon: "📊" },
        { name: "Grupos", path: "/grupos", icon: "👥" },
        { name: "Produtos", path: "/produtos", icon: "📦" },
        { name: "Instâncias", path: "/instancias", icon: "🖥️" },
        { name: "Scrappings", path: "/scrappings", icon: "🔍" },
        { name: "Categorias", path: "/categorias", icon: "📂" },
        { name: "Linktree", path: "/linktree", icon: "🌳" },
        { name: "Agendamentos", path: "/agendamentos", icon: "📅" },
        { name: "Templates", path: "/templates", icon: "📄" },
    ]

    const handleLogout = () => {
        logout()
        // O Navigate será acionado automaticamente quando isAuthenticated se tornar false
    }

    const containerStyle: React.CSSProperties = {
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "system-ui, -apple-system, sans-serif",
    }

    const sidebarStyle: React.CSSProperties = {
        width: sidebarOpen ? "280px" : "80px",
        backgroundColor: "#1e293b",
        transition: "width 0.3s ease",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        height: "100vh",
        zIndex: 1000,
        boxShadow: "4px 0 6px -1px rgba(0, 0, 0, 0.1)",
    }

    const sidebarHeaderStyle: React.CSSProperties = {
        padding: "20px",
        borderBottom: "1px solid #334155",
        display: "flex",
        alignItems: "center",
        gap: "12px",
    }

    const logoStyle: React.CSSProperties = {
        width: "40px",
        height: "40px",
        background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
        borderRadius: "8px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "20px",
        flexShrink: 0,
    }

    const logoTextStyle: React.CSSProperties = {
        color: "white",
        fontSize: "18px",
        fontWeight: "bold",
        opacity: sidebarOpen ? 1 : 0,
        transition: "opacity 0.3s ease",
        whiteSpace: "nowrap",
    }

    const menuStyle: React.CSSProperties = {
        flex: 1,
        padding: "20px 0",
        overflowY: "auto",
    }

    const menuItemStyle = (isActive: boolean): React.CSSProperties => ({
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 20px",
        color: isActive ? "#3b82f6" : "#cbd5e1",
        textDecoration: "none",
        transition: "all 0.2s ease",
        backgroundColor: isActive ? "rgba(59, 130, 246, 0.1)" : "transparent",
        borderRight: isActive ? "3px solid #3b82f6" : "3px solid transparent",
        cursor: "pointer",
    })

    const menuIconStyle: React.CSSProperties = {
        fontSize: "20px",
        flexShrink: 0,
    }

    const menuTextStyle: React.CSSProperties = {
        fontSize: "14px",
        fontWeight: "500",
        opacity: sidebarOpen ? 1 : 0,
        transition: "opacity 0.3s ease",
        whiteSpace: "nowrap",
    }

    const sidebarFooterStyle: React.CSSProperties = {
        padding: "20px",
        borderTop: "1px solid #334155",
    }

    const logoutButtonStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "12px 0",
        color: "#ef4444",
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        fontWeight: "500",
        width: "100%",
        transition: "color 0.2s ease",
    }

    const mainContentStyle: React.CSSProperties = {
        flex: 1,
        marginLeft: sidebarOpen ? "280px" : "80px",
        transition: "margin-left 0.3s ease",
        display: "flex",
        flexDirection: "column",
    }

    const topBarStyle: React.CSSProperties = {
        backgroundColor: "white",
        padding: "16px 24px",
        borderBottom: "1px solid #e2e8f0",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1)",
    }

    const toggleButtonStyle: React.CSSProperties = {
        background: "none",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        padding: "8px",
        borderRadius: "6px",
        color: "#64748b",
        transition: "background-color 0.2s ease",
    }

    const userInfoStyle: React.CSSProperties = {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        color: "#475569",
    }

    const avatarStyle: React.CSSProperties = {
        width: "32px",
        height: "32px",
        backgroundColor: "#3b82f6",
        color: "white",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "14px",
        fontWeight: "600",
    }

    const contentAreaStyle: React.CSSProperties = {
        flex: 1,
        padding: "24px",
        backgroundColor: "#f8fafc",
        overflow: "auto",
    }

    return (
        <div style={containerStyle}>
            {/* Sidebar */}
            <div style={sidebarStyle}>
                {/* Header */}
                <div style={sidebarHeaderStyle}>
                    <div style={logoStyle}>🚀</div>
                    {sidebarOpen && <div style={logoTextStyle}>DisparaBot</div>}
                </div>
                {/* Menu */}
                <div style={menuStyle}>
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                style={menuItemStyle(isActive)}
                                onMouseEnter={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = "rgba(148, 163, 184, 0.1)"
                                    }
                                }}
                                onMouseLeave={(e) => {
                                    if (!isActive) {
                                        e.currentTarget.style.backgroundColor = "transparent"
                                    }
                                }}
                            >
                                <span style={menuIconStyle}>{item.icon}</span>
                                {sidebarOpen && <span style={menuTextStyle}>{item.name}</span>}
                            </Link>
                        )
                    })}
                </div>
                {/* Footer */}
                <div style={sidebarFooterStyle}>
                    <button
                        style={logoutButtonStyle}
                        onClick={handleLogout}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.color = "#dc2626"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.color = "#ef4444"
                        }}
                    >
                        <span style={menuIconStyle}>🚪</span>
                        {sidebarOpen && <span>Sair</span>}
                    </button>
                </div>
            </div>
            {/* Main Content */}
            <div style={mainContentStyle}>
                {/* Top Bar */}
                <div style={topBarStyle}>
                    <button
                        style={toggleButtonStyle}
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f1f5f9"
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = "transparent"
                        }}
                    >
                        ☰
                    </button>
                    <div style={userInfoStyle}>
                        <span>Bem-vindo, {user?.name || "Usuário"}!</span>
                        <div style={avatarStyle}>{user?.name?.charAt(0).toUpperCase() || "U"}</div>
                    </div>
                </div>
                {/* Content Area */}
                <div style={contentAreaStyle}>{children}</div>
            </div>
        </div>
    )
}
