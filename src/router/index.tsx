import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { Login } from "../pages/Login"
import { Dashboard } from "../pages/Dashboard"
import { Categorias } from "../pages/Categorias"
import { Produtos } from "../pages/Produtos"
import { Instancias } from "../pages/Instancias"
import { Scrappings } from "../pages/Scrappings"
import { Grupos } from "../pages/Grupos"
import { Agendamentos } from "../pages/Agendamentos"
import { Templates } from "../pages/Templates"
import { MainLayout } from "../layouts/MainLayout"

export const AppRouter = () => {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rota de login */}
                <Route path="/login" element={<Login />} />

                {/* Rotas protegidas */}
                <Route
                    path="/dashboard"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />
                <Route
                    path="/categorias"
                    element={
                        <MainLayout>
                            <Categorias />
                        </MainLayout>
                    }
                />
                <Route
                    path="/produtos"
                    element={
                        <MainLayout>
                            <Produtos />
                        </MainLayout>
                    }
                />
                <Route
                    path="/instancias"
                    element={
                        <MainLayout>
                            <Instancias />
                        </MainLayout>
                    }
                />
                <Route
                    path="/scrappings"
                    element={
                        <MainLayout>
                            <Scrappings />
                        </MainLayout>
                    }
                />
                <Route
                    path="/grupos"
                    element={
                        <MainLayout>
                            <Grupos />
                        </MainLayout>
                    }
                />
                <Route
                    path="/agendamentos"
                    element={
                        <MainLayout>
                            <Agendamentos />
                        </MainLayout>
                    }
                />
                <Route
                    path="/templates"
                    element={
                        <MainLayout>
                            <Templates />
                        </MainLayout>
                    }
                />

                {/* Redirecionar raiz para dashboard */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />

                {/* Rota 404 - redirecionar para dashboard */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
