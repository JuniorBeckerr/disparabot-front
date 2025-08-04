"use client"

import type React from "react"
import { useState } from "react"
import { useAuthContext } from "../context/AuthContext"
import { Navigate } from "react-router-dom"
import { Toast } from "../components/Alerts/Toast"
import { useToast } from "../hooks/Alerts/useToast"

export const Login: React.FC = () => {
    const { login, isAuthenticated, isLoading } = useAuthContext()
    const { toast, showToast, hideToast } = useToast()

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    })
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Redirecionar se já estiver logado
    if (isAuthenticated) {
        return <Navigate to="/dashboard" replace />
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!formData.email || !formData.password) {
            showToast("Por favor, preencha todos os campos", "error")
            return
        }

        setIsSubmitting(true)

        try {
            await login(formData.email, formData.password)
            showToast("Login realizado com sucesso!", "success")
            // O Navigate será acionado automaticamente quando isAuthenticated se tornar true
        } catch (error: any) {
            showToast(error.message || "Erro ao fazer login", "error")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (isLoading) {
        return (
            <div style={loadingContainerStyle}>
                <div style={loadingSpinnerStyle}></div>
                <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
            </div>
        )
    }

    return (
        <div style={containerStyle}>
            <div style={loginBoxStyle}>
                {/* Logo/Header */}
                <div style={headerStyle}>
                    <div style={logoStyle}>🚀</div>
                    <h1 style={titleStyle}>DisparaBot</h1>
                    <p style={subtitleStyle}>Faça login para acessar sua conta</p>
                </div>

                {/* Formulário */}
                <form onSubmit={handleSubmit} style={formStyle}>
                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="seu@email.com"
                            style={inputStyle}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <div style={fieldGroupStyle}>
                        <label style={labelStyle}>Senha</label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            placeholder="••••••••"
                            style={inputStyle}
                            disabled={isSubmitting}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        style={{
                            ...submitButtonStyle,
                            opacity: isSubmitting ? 0.7 : 1,
                            cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>
                </form>

                {/* Links adicionais */}
                <div style={linksStyle}>
                    <a href="#" style={linkStyle}>
                        Esqueceu sua senha?
                    </a>
                    <span style={separatorStyle}>•</span>
                    <a href="#" style={linkStyle}>
                        Criar conta
                    </a>
                </div>
            </div>

            <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
        </div>
    )
}

// Styles
const containerStyle: React.CSSProperties = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
    padding: "20px",
}

const loginBoxStyle: React.CSSProperties = {
    backgroundColor: "white",
    borderRadius: "16px",
    padding: "40px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
}

const headerStyle: React.CSSProperties = {
    textAlign: "center",
    marginBottom: "32px",
}

const logoStyle: React.CSSProperties = {
    fontSize: "48px",
    marginBottom: "16px",
}

const titleStyle: React.CSSProperties = {
    fontSize: "28px",
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: "8px",
    margin: 0,
}

const subtitleStyle: React.CSSProperties = {
    color: "#64748b",
    fontSize: "16px",
    margin: 0,
}

const formStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
}

const fieldGroupStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
}

const labelStyle: React.CSSProperties = {
    fontSize: "14px",
    fontWeight: "500",
    color: "#374151",
}

const inputStyle: React.CSSProperties = {
    padding: "12px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.2s, box-shadow 0.2s",
    outline: "none",
}

const submitButtonStyle: React.CSSProperties = {
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "14px 20px",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
    marginTop: "8px",
}

const linksStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "12px",
    marginTop: "24px",
}

const linkStyle: React.CSSProperties = {
    color: "#3b82f6",
    textDecoration: "none",
    fontSize: "14px",
    fontWeight: "500",
}

const separatorStyle: React.CSSProperties = {
    color: "#d1d5db",
    fontSize: "14px",
}

const loadingContainerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f8fafc",
}

const loadingSpinnerStyle: React.CSSProperties = {
    width: "40px",
    height: "40px",
    border: "4px solid #e5e7eb",
    borderTop: "4px solid #3b82f6",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
}
