export function buildTree<T extends { id: number; parentId: number; orderPriority: number }>(
  data: T[],
  parentId: number,
  rootNodeId: number = 0 // Default root node is "hidden"
): TreeNode[] {
  const processedIds = new Set<number>(); // Keep track of processed node IDs

  // Helper function to recursively build the nested tree
  const buildNestedTree = (data: T[], parentId: number): TreeNode[] =>
    data
      .filter(item => item.parentId === parentId && !processedIds.has(item.id))  // Prevent cycle
      .map(item => {
        processedIds.add(item.id);  // Mark node as processed
        return {
          id: item.id,
          functionName: item.functionName, // Changed from `name` to `functionName`
          parentId: item.parentId,
          orderPriority: item.orderPriority,
          totalTestCase: item.totalTestCase,
          score: item.score,
          children: buildNestedTree(data, item.id), // Recurse to build children
        };
      });

  // Find the root node with the specified rootNodeId (usually "hidden")
  const rootNode = data.find(item => item.id === rootNodeId);

  // If root node exists, build the tree starting from it
  if (rootNode) {
    processedIds.add(rootNode.id);  // Mark root node as processed
    return [
      {
        id: rootNode.id,
        functionName: rootNode.functionName, // Changed from `name` to `functionName`
        parentId: rootNode.parentId,
        orderPriority: rootNode.orderPriority,
        totalTestCase: rootNode.totalTestCase,
        score: rootNode.score,
        children: buildNestedTree(data, rootNode.id), // Recurse for children
      },
    ];
  }

  // If no root node is found, fall back to building a tree with any parentId
  return buildNestedTree(data, parentId);
}
