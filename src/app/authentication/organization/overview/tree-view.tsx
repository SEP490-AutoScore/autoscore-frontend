import { ChevronDownIcon, ChevronRightIcon } from "lucide-react";
import React from "react";
import { motion } from "framer-motion";

type Organization = {
  organizationId: number;
  name: string;
  type: string;
  parentId: number | null;
  status: boolean;
  children?: Organization[];
};

interface TreeNodeProps {
  node: Organization;
}

const TreeNode: React.FC<TreeNodeProps> = ({ node }) => {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center">
        <div
          className="flex items-center py-3 px-2 cursor-pointer rounded-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          {node.children?.length ? (
            isOpen ? (
              <ChevronDownIcon className="w-5 h-5 text-primary mr-2" />
            ) : (
              <ChevronRightIcon className="w-5 h-5 text-primary mr-2" />
            )
          ) : (
            <div className="w-5 h-5 mr-2"></div>
          )}
          <span className="text-gray-800 font-medium">{node.name}</span>
        </div>
      </div>
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: isOpen ? "auto" : 0 }}
        className="flex justify-center overflow-hidden mt-4"
      >
        {node.children && (
          <div className="flex justify-center gap-6 border-t-2 border-gray-200 pt-4">
            {node.children.map((child) => (
              <TreeNode key={child.organizationId} node={child} />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

interface TreeViewProps {
  data: Organization[];
}

const TreeView: React.FC<TreeViewProps> = ({ data }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 border border-gray-200">
      {data.map((node) => (
        <TreeNode key={node.organizationId} node={node} />
      ))}
    </div>
  );
};

export default TreeView;
