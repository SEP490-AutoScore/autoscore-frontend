import { FC, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import AddDatabaseForm from './import-database-form';
import { BASE_URL, API_ENDPOINTS } from "@/config/apiConfig";

interface DatabaseResponse {
    examDatabaseId: number;
    databaseScript: string;
    databaseDescription: string;
    databaseName: string;
    databaseImage: string; // Base64 string
    databaseNote: string;
    status: string;
    createdAt: string;
    createdBy: number;
    updatedAt: number;
    updatedBy: number;
    deletedAt: string | null;
    deletedBy: number | null;
    examPaperId: number;
}

interface DatabaseInfoProps {
    examPaperId: number;
}

const DatabaseInfoComponent: FC<DatabaseInfoProps> = ({ examPaperId }) => {
    const [database, setDatabase] = useState<DatabaseResponse | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string>('');
    const token = localStorage.getItem("jwtToken");

    const fetchDatabase = async () => {
        try {
            const response = await fetch(`${BASE_URL}${API_ENDPOINTS.getDatabase}?examPaperId=${examPaperId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 204) {
                setDatabase(null);
                setLoading(false);
                return;
            }

            if (!response.ok) {
                throw new Error('Failed to fetch database information');
            }

            const data: DatabaseResponse = await response.json();
            setDatabase(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDatabase();
    }, [examPaperId, token]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    if (!database) {
        return (
            <div className="space-y-4">
                <Card className="bg-white shadow-md rounded-lg border border-gray-200">
                    <CardContent className="p-4 text-sm text-gray-700 space-y-4">
                        <div className="text-center text-gray-500">
                            <AddDatabaseForm examPaperId={examPaperId} onAddSuccess={fetchDatabase} />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const imageSrc = `data:image/png;base64,${database.databaseImage}`;

    return (
        <div className="space-y-4">
            <Card className="bg-white shadow-md rounded-lg border border-gray-200">
                <CardHeader className="font-semibold text-lg p-4">Database Information</CardHeader>
                <CardContent className="p-4 text-sm text-gray-700 space-y-4">
                    <div>
                        <h3 className="font-semibold text-gray-600">Name:</h3>
                        <p>{database.databaseName || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Description:</h3>
                        <p>{database.databaseDescription || 'N/A'}</p>
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-600">Note:</h3>
                        <p>{database.databaseNote || 'N/A'}</p>
                    </div>

                    <h3 className="font-semibold text-gray-600">Database Image:</h3>
                    {database.databaseImage && (
                        <div className="flex justify-center items-center">
                            <div className="max-w-lg max-h-96 overflow-hidden">
                                <img
                                    src={imageSrc}
                                    alt={database.databaseName}
                                    className="w-full h-auto object-contain border rounded shadow-md"
                                />
                            </div>
                        </div>
                    )}
                    <div>
                        <h3 className="font-semibold text-gray-600">Script:</h3>
                        <div className="flex bg-gray-100 p-4 rounded border">
                            <pre className="whitespace-pre-wrap">{database.databaseScript || 'N/A'}</pre>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default DatabaseInfoComponent;
