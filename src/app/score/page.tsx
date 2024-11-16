import React, { useEffect, useState } from "react";
import { Payment, columns } from "./columns"
import { DataTable } from "./data-table"

async function getData(): Promise<Payment[]> {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      amount: 100,
      status: "pending",
      email: "m@example.com",
    },
    {
      id: "829dh21a",
      amount: 200,
      status: "success",
      email: "example@test.com",
    },

    // ...
  ]
}

export default function ScorePage() {
    const [data, setData] = useState<Payment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
  
    useEffect(() => {
      const fetchData = async () => {
        const result = await getData();
        setData(result);
        setLoading(false);
      };
  
      fetchData();
    }, []);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    return (
      <div className="container mx-auto py-10">
        <h1 className="text-2xl font-bold mb-5">Scores</h1>
        <DataTable columns={columns} data={data} />
      </div>
    );
}
