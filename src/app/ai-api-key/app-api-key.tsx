"use client";

import { useEffect, useState } from "react";
import { DataTable } from "@/app/ai-api-key/data-table";
import { columns } from "@/app/ai-api-key/columns";
// import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { AIApiKeysSkeleton } from "@/app/ai-api-key/ai-api-key-skeleton";

interface AIApiKey {
  aiApiKeyId: number;
  aiName: string;
  aiApiKey: string;
  createBy: string;
  status: boolean;
  createAt: string;
  updateAt: string;
  isShared: boolean;
}

async function getAIApiKeys() {
  //   try {
  //     const response = await fetch(`${BASE_URL}${API_ENDPOINTS.aiAPIKeys}`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
  //       },
  //     })

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch AI API Keys")
  //     }

  //     const data = await response.json()
  //     return data
  //   } catch (error) {
  //     console.error(error)
  //     return []
  //   }
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return [
    {
      aiApiKeyId: 1,
      aiName: "GPT-3",
      aiApiKey: "sk-1234567890abcdef",
      createBy: "Minhtpv",
      status: true,
      createAt: "2023-06-01T10:00:00Z",
      updateAt: "2023-06-01T10:00:00Z",
      isShared: false,
    },
    {
      aiApiKeyId: 2,
      aiName: "DALL-E",
      aiApiKey: "sk-abcdefghijklmnop",
      createBy: "Minhtpv",
      status: true,
      createAt: "2023-06-02T11:30:00Z",
      updateAt: "2023-06-02T11:30:00Z",
      isShared: true,
    },
    {
      aiApiKeyId: 3,
      aiName: "Claude",
      aiApiKey: "sk-qrstuvwxyz123456",
      createBy: "Minhtpv",
      status: false,
      createAt: "2023-06-03T09:15:00Z",
      updateAt: "2023-06-03T14:20:00Z",
      isShared: false,
    },
    {
      aiApiKeyId: 4,
      aiName: "Stable Diffusion",
      aiApiKey: "sk-7890123456abcdef",
      createBy: "Minhtpv",
      status: true,
      createAt: "2023-06-04T13:45:00Z",
      updateAt: "2023-06-04T13:45:00Z",
      isShared: true,
    },
    {
      aiApiKeyId: 5,
      aiName: "Midjourney",
      aiApiKey: "sk-ghijklmnopqrstuv",
      createBy: "Minhtpv",
      status: true,
      createAt: "2023-06-05T16:00:00Z",
      updateAt: "2023-06-05T16:00:00Z",
      isShared: false,
    },
  ];
}

export default function AIApiKeysPage() {
  const [data, setData] = useState<AIApiKey[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    getAIApiKeys()
      .then((fetchedData) => {
        setData(fetchedData);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <AIApiKeysSkeleton />;
  }

  return (
    <div className="container mx-auto">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
