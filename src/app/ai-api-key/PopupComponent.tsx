import { Button } from "@/components/ui/button";

export const PopupComponent = ({ data, onClose }: any) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-1/2">
        <h2 className="text-xl font-bold mb-4">Question Ask AI</h2>
        <div className="overflow-y-auto max-h-96">
          <ul>
            {data.map((item: any) => (
              <li key={item.contentId} className="mb-2">
                <p className="font-bold">{item.purpose}</p>
                <p>{item.questionAskAiContent}</p>
              </li>
            ))}
          </ul>
        </div>
        <Button className="mt-4" onClick={onClose}>
          Close
        </Button>
      </div>
    </div>
  );
};
