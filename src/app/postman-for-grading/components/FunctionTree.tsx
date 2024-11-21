import React from "react";
import { useDrag, useDrop } from "react-dnd";

const ItemType = "TREE_NODE";

const FunctionNode: React.FC<{
  node: any;
  onUpdateParent: (nodeId: number, newParentId: number | null) => void;
}> = ({ node, onUpdateParent }) => {
  const [{ isDragging }, dragRef] = useDrag({
    type: ItemType,
    item: { id: node.id },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, dropRef] = useDrop({
    accept: ItemType,
    drop: (draggedItem: { id: number }) => {
      onUpdateParent(draggedItem.id, node.id);
    },
  });

  return (
    <div
      ref={dragRef}
      className={`p-2 border rounded-lg ${isDragging ? "opacity-50" : "opacity-100"} ${
        node.parentIds.length === 0 ? "border-blue-500" : "border-gray-300"
      }`}
      style={{ marginLeft: node.parentIds.length > 0 ? 20 : 0 }}
    >
      <div>{node.name}</div>
      {node.children.length > 0 && (
        <div className="ml-4">
          {node.children.map(child => (
            <FunctionNode key={child.id} node={child} onUpdateParent={onUpdateParent} />
          ))}
        </div>
      )}
    </div>
  );
};

const FunctionTree: React.FC<{ tree: any[]; onUpdateParent: Function }> = ({ tree, onUpdateParent }) => {
  return (
    <div>
      {tree.map(node => (
        <FunctionNode key={node.id} node={node} onUpdateParent={onUpdateParent} />
      ))}
    </div>
  );
};

export default FunctionTree;
