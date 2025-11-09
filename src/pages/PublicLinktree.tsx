"use client"

import { useMemo } from "react"
import { useGetLinktree } from "../hooks/linktree/useGetLinktree"
import "./PublicLinktree.css"

const getIcon = (raw?: string) => {
    const v = raw?.trim()
    if (!v) return "⭐"
    const map: Record<string, string> = {
        instagram: "📸",
        whatsapp: "💬",
        telegram: "💬",
        store: "🛍️",
        website: "🌍",
        coupon: "🎟️",
        contact: "🤝",
        star: "⭐",
    }
    return map[v.toLowerCase()] ?? v
}

export const PublicLinktree = () => {
    const { data: links = [] } = useGetLinktree()

    const activeLinks = useMemo(
        () => links.filter((l) => l.isActive).sort((a, b) => a.ordem - b.ordem),
        [links],
    )

    return (
        <div className="public-linktree">
            <div className="particle" style={{ left: "10%", animationDelay: "0s" }}></div>
            <div className="particle" style={{ left: "25%", animationDelay: "2s" }}></div>
            <div className="particle" style={{ left: "40%", animationDelay: "4s" }}></div>
            <div className="particle" style={{ left: "60%", animationDelay: "1s" }}></div>
            <div className="particle" style={{ left: "75%", animationDelay: "3s" }}></div>
            <div className="particle" style={{ left: "90%", animationDelay: "5s" }}></div>

            <div className="container">
                <div className="avatar-container">
                    <div className="avatar-3d">
                        <div className="avatar-image">🛒</div>
                        <div className="floating-badge">🔥 Ativo</div>
                    </div>
                </div>

                <div className="header">
                    <h1>💸 Comprei Todos</h1>
                    <p className="subtitle">Achadinhos, Promoções e Cupons do Dia</p>
                </div>

                <div className="stats-bar">
                    <span className="icon">⚡</span>
                    <span className="text">
                        <span className="number">+15.000</span> pessoas economizando agora
                    </span>
                </div>

                <div className="links">
                    {activeLinks.map((link) => {
                        const emoji = getIcon(link.icone)
                        const isVip = link.titulo.toLowerCase().includes("vip")
                        return (
                            <a
                                key={link.id}
                                href={link.url}
                                className={`link-button ${isVip ? "vip" : ""}`}
                                target="_blank"
                                rel="noreferrer"
                            >
                                <span className="icon">{emoji}</span>
                                <span className="text">{link.titulo}</span>
                                <span className="arrow">→</span>
                            </a>
                        )
                    })}
                </div>

                <footer>
                    🔥 Ofertas atualizadas em tempo real
                    <span className="copyright">© 2025 CompreiTodos.com — Todos os direitos reservados.</span>
                </footer>
            </div>
        </div>
    )
}

export default PublicLinktree