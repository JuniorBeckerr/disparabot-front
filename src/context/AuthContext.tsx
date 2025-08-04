"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { api } from "../api/http"

interface User {
    id: number
    name: string
    email: string
    created_at: string
    updated_at: string
}

type AuthContextType = {
    token: string | null
    user: User | null
    isAuthenticated: boolean
    isLoading: boolean
    login: (email: string, password: string) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const getToken = () => localStorage.getItem("token")

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(getToken())
    const [user, setUser] = useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // Função de login com email e senha
    const login = async (email: string, password: string): Promise<void> => {
        try {
            setIsLoading(true)
            const response = await api.post("/auth/login", {
                email,
                password,
            })

            // Ajustar para a estrutura da sua API
            const { data } = response.data
            const { token: authToken, user: userData } = data

            console.log("Login response:", response.data)

            if (!authToken) {
                throw new Error("Token não recebido do servidor")
            }

            // Salvar token e dados do usuário
            localStorage.setItem("token", authToken)
            setToken(authToken)
            setUser(userData)
        } catch (error: any) {
            console.error("Erro no login:", error)
            throw new Error(error.response?.data?.message || "Erro ao fazer login")
        } finally {
            setIsLoading(false)
        }
    }

    // Função de logout
    const logout = () => {
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
        // Opcional: chamar endpoint de logout no servidor
        // api.post("/auth/logout").catch(() => {})
    }

    // Função para buscar dados do usuário
    const refreshUser = async (): Promise<void> => {
        try {
            const response = await api.get("/auth/me")
            // Se o /auth/me retorna no mesmo formato, ajuste aqui também
            const userData = response.data.data?.user || response.data.user || response.data.data || response.data
            setUser(userData)
        } catch (error) {
            console.error("Erro ao buscar dados do usuário:", error)
            // Se falhar, fazer logout
            logout()
        }
    }

    // Verificar token ao inicializar
    useEffect(() => {
        const initAuth = async () => {
            const storedToken = getToken()

            if (storedToken) {
                setToken(storedToken)
                try {
                    // Verificar se o token ainda é válido buscando dados do usuário
                    await refreshUser()
                } catch (error) {
                    // Token inválido, fazer logout
                    logout()
                }
            }

            setIsLoading(false)
        }

        initAuth()
    }, [])

    return (
        <AuthContext.Provider
            value={{
                token,
                user,
                isAuthenticated: !!user && !!token,
                isLoading,
                login,
                logout,
                refreshUser,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuthContext = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuthContext must be used inside AuthProvider")
    return ctx
}
