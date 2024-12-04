import React, { useEffect, useState } from "react";
import TreeView from "./tree-view";
import { API_ENDPOINTS, BASE_URL } from "@/config/apiConfig";
import { useNavigate } from "react-router-dom";

type Organization = {
  organizationId: number;
  name: string;
  type: string;
  parentId: number | null;
  status: boolean;
  children?: Organization[];
};

function buildTree(data: Organization[]): Organization[] {
  const map = new Map<number, Organization>();
  data.forEach((item) => {
    map.set(item.organizationId, { ...item, children: [] });
  });

  const tree: Organization[] = [];
  data.forEach((item) => {
    if (item.parentId) {
      const parent = map.get(item.parentId);
      parent?.children?.push(map.get(item.organizationId)!);
    } else {
      tree.push(map.get(item.organizationId)!);
    }
  });

  return tree;
}

function App({ reload }: { reload: boolean; }) {
  const [treeData, setTreeData] = useState<Organization[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        `${BASE_URL}${API_ENDPOINTS.getAllOrganizations}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
          },
        }
      );
      const data: Organization[] = await response.json();
      const tree = buildTree(data);
      setTreeData(tree);
    };
    if (reload) {
      fetchData();
      navigate("/organizations", { state: { reload: false } });
    } else {
      fetchData();
    }

  }, [reload, navigate]);

  return (
    <div className="container mx-auto w-full border border-gray-200 p-8 rounded-lg ">
      <div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Organization</h2>
          <p className="text-muted-foreground">
            Here's a list of organizations in the system!
          </p>
        </div>
        <div className="flex flex-col w-full">
          <main className="flex-grow pt-10">
            <TreeView data={treeData} />
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
