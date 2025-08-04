import ReactDOM from "react-dom/client";
import { AppRouter } from "./router";
import { AuthProvider } from "./context/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./index.css";
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
    <AuthProvider> {/* 👈 ESSENCIAL */}
        <QueryClientProvider client={queryClient}>
            <AppRouter />
        </QueryClientProvider>
    </AuthProvider>
);
