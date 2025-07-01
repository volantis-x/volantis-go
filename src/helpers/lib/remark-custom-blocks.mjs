// import { visit, EXIT } from "unist-util-visit";
// import { fromMarkdown } from "mdast-util-from-markdown";
// import { gfmTable } from "micromark-extension-gfm-table"; // 示例，如果你想在块内支持 GFM
// import { gfmTableFromMarkdown } from "mdast-util-gfm-table"; // 示例

// TODO: MD 非常简化的 props 解析器，实际应用需要进一步考虑各 markdown 文档的兼容性.
// 例如：{key1="value1" key2='value2' boolKey}
function parseProps(propsString) {
  const props = {};
  if (
    !propsString ||
    !propsString.trim().startsWith("{") ||
    !propsString.trim().endsWith("}")
  ) {
    return props; // 不是有效的 props 格式
  }
  const innerString = propsString.trim().slice(1, -1); // 移除大括号
  // 这个解析器非常基础，不能处理嵌套引号、复杂值等
  const regex = /(\w+)\s*=\s*(?:"([^"]*)"|'([^']*)'|(\w+))/g;
  let match;
  while ((match = regex.exec(innerString)) !== null) {
    props[match[1]] =
      match[2] ||
      match[3] ||
      (match[4] === "true" ? true : match[4] === "false" ? false : match[4]);
  }
  return props;
}

export default function remarkCustomBlocks() {
  return (tree, file) => {
    // 我们将遍历所有 'text' 节点来查找我们的标记
    // 这是一种方法，另一种是使用 micromark 扩展来定义新的语法
    // 为了简单起见，我们先用 text 节点查找和替换

    // 需要一个更高级的解析策略，因为 visit 是深度优先的，
    // 直接在 visit 中修改父节点的 children 数组可能会导致问题。
    // 更稳妥的方法是先收集所有块的范围，然后再进行转换。
    // 或者，创建一个新的树。

    // 简化版：尝试直接替换，这在嵌套时可能会非常棘手。
    // 一个更好的方法是使用 fromMarkdown 来重新解析块的内容。

    function processNodes(nodes) {
      const newChildren = [];
      let i = 0;
      while (i < nodes.length) {
        const node = nodes[i];
        if (node.type === "text" || node.type === "paragraph") {
          // 检查段落或纯文本
          const value =
            node.type === "paragraph"
              ? node.children.map((c) => c.value).join("")
              : node.value;
          const blockStartRegex = /^:::\s*([A-Za-z0-9_-]+)\s*(\{.*?\})?\s*$/m; // 匹配 ::: Component {props}
          const blockEndRegex = /^:::$/m;

          const matchStart = value && value.match(blockStartRegex);

          if (matchStart) {
            const componentName = matchStart[1];
            const propsString = matchStart[2] || "{}"; // 如果没有 props，默认为空对象字符串
            const props = parseProps(propsString);

            // 查找匹配的结束标记
            let endIndex = -1;
            let blockContent = "";
            let nestingLevel = 0; // 用于处理嵌套

            for (let j = i + 1; j < nodes.length; j++) {
              const innerNode = nodes[j];
              const innerValue =
                innerNode.type === "paragraph"
                  ? innerNode.children.map((c) => c.value).join("")
                  : innerNode.value;

              if (innerValue && innerValue.match(blockStartRegex)) {
                nestingLevel++;
              }
              if (innerValue && innerValue.match(blockEndRegex)) {
                if (nestingLevel === 0) {
                  endIndex = j;
                  break;
                } else {
                  nestingLevel--;
                }
              }
              // 收集块内容 (需要将 AST 节点转换为 Markdown 字符串)
              // 这是一个难点，或者直接传递 AST 子节点
              blockContent +=
                innerNode.value ||
                (innerNode.children
                  ? innerNode.children.map((c) => c.value).join("")
                  : "");
              if (j < nodes.length - 1) blockContent += "\n";
            }

            if (endIndex !== -1) {
              // 找到了完整的块
              const contentNodes = nodes.slice(i + 1, endIndex);

              // 递归处理块内部的内容
              const processedBlockChildren = processNodes(contentNodes);

              // 创建新的 MDX JSX 节点
              const mdxNode = {
                type: "mdxJsxFlowElement",
                name: componentName,
                attributes: Object.entries(props).map(([key, val]) => ({
                  type: "mdxJsxAttribute",
                  name: key,
                  value: String(val), // Props 值通常是字符串或布尔值
                })),
                children: processedBlockChildren, // 将处理后的子节点作为 children
              };
              newChildren.push(mdxNode);
              i = endIndex + 1; // 跳过已处理的节点
              continue;
            } else {
              // 未找到结束标记，视为普通文本
              newChildren.push(node);
              i++;
            }
          } else {
            newChildren.push(node);
            i++;
          }
        } else {
          // 对于非文本/段落节点，如果它们有 children，也需要递归处理
          if (node.children && Array.isArray(node.children)) {
            node.children = processNodes(node.children);
          }
          newChildren.push(node);
          i++;
        }
      }
      return newChildren;
    }

    tree.children = processNodes(tree.children);
  };
}
