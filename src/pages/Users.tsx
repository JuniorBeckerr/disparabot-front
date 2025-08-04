import { useQuery } from "@tanstack/react-query";
import { api } from "../api/http";
import { MainLayout } from "../layouts/MainLayout";

export const Users = () => {
    const { data, isLoading } = useQuery({
        queryKey: ["users"],
        queryFn: async () => {
            const res = await api.get("/users"); // mock ou backend real
            return res.data;
        },
    });

    return (
        <MainLayout>
            <h1 className="text-xl font-bold mb-4">Usuários</h1>
            {isLoading ? (
                <p>Carregando...</p>
            ) : (
                <ul className="list-disc pl-4">
                    {data.map((user: any) => (
                        <li key={user.id}>{user.name} - {user.email}</li>
                    ))}
                </ul>
            )}
        </MainLayout>
    );
};
