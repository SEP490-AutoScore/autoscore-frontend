// GherkinItem.tsx
import React from "react";

interface GherkinItemProps {
  gherkinData: string;
}

const GherkinItem: React.FC<GherkinItemProps> = ({ gherkinData }) => {
  return (
    <div className="border p-4 rounded-lg shadow-sm space-y-2">
      <h4 className="font-bold text-lg">Gherkin Data</h4>
      <pre className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{gherkinData}</pre>
    </div>
  );
};

export default GherkinItem;
