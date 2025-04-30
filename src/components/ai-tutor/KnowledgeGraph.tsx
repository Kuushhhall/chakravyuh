
import { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui-custom/Card";
import { Button } from "@/components/ui-custom/Button";
import { ZoomIn, ZoomOut, RefreshCw, Search, Info } from "lucide-react";

interface KnowledgeNode {
  id: string;
  label: string;
  category: string;
  difficulty: "basic" | "intermediate" | "advanced";
  mastery: number;
  prerequisites?: string[];
}

interface Connection {
  source: string;
  target: string;
  type: "prerequisite" | "related" | "leads-to";
}

interface KnowledgeGraphProps {
  nodes: KnowledgeNode[];
  connections: Connection[];
  onNodeClick?: (nodeId: string) => void;
}

export function KnowledgeGraph({ nodes, connections, onNodeClick }: KnowledgeGraphProps) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<KnowledgeNode | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredNodes, setFilteredNodes] = useState<KnowledgeNode[]>(nodes);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredNodes(nodes);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredNodes(
        nodes.filter(
          (node) =>
            node.label.toLowerCase().includes(query) ||
            node.category.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, nodes]);

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.2, 0.5));
  };

  const handleReset = () => {
    setZoomLevel(1);
    setSearchQuery("");
    setSelectedNode(null);
  };

  const handleNodeClick = (node: KnowledgeNode) => {
    setSelectedNode(node);
    if (onNodeClick) {
      onNodeClick(node.id);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Mechanics":
        return "#3b82f6";
      case "Thermodynamics":
        return "#ef4444";
      case "Electromagnetism":
        return "#eab308";
      case "Units and Dimensions":
        return "#8b5cf6";
      case "Electrostatics":
        return "#ec4899";
      case "Work, Energy and Power":
        return "#14b8a6";
      default:
        return "#64748b";
    }
  };

  const getDifficultyStyle = (difficulty: string) => {
    switch (difficulty) {
      case "basic":
        return "border-2 border-green-500";
      case "intermediate":
        return "border-2 border-amber-500";
      case "advanced":
        return "border-2 border-red-500";
      default:
        return "border-2 border-gray-300";
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex justify-between items-center mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search concepts..."
            className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handleZoomOut} title="Zoom Out">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleZoomIn} title="Zoom In">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleReset} title="Reset View">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Card className="relative border overflow-hidden" style={{ height: "500px" }}>
        <CardContent className="p-0 h-full">
          <div className="absolute p-4 info-overlay z-10 right-4 top-4 max-w-xs">
            {selectedNode ? (
              <Card className="shadow-lg">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold">{selectedNode.label}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => setSelectedNode(null)}
                    >
                      ×
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-opacity-20"
                      style={{
                        backgroundColor: `${getCategoryColor(selectedNode.category)}30`,
                        color: getCategoryColor(selectedNode.category),
                      }}
                    >
                      {selectedNode.category}
                    </span>
                    <span
                      className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                        selectedNode.difficulty === "basic"
                          ? "bg-green-100 text-green-800"
                          : selectedNode.difficulty === "intermediate"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {selectedNode.difficulty.charAt(0).toUpperCase() +
                        selectedNode.difficulty.slice(1)}
                    </span>
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1 text-xs">
                      <span>Mastery</span>
                      <span>{selectedNode.mastery}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${selectedNode.mastery}%` }}
                      ></div>
                    </div>
                  </div>

                  {selectedNode.prerequisites && selectedNode.prerequisites.length > 0 && (
                    <div>
                      <h4 className="text-xs font-medium mb-1">Prerequisites:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedNode.prerequisites.map((prereq) => {
                          const prereqNode = nodes.find((n) => n.id === prereq);
                          return (
                            <span
                              key={prereq}
                              className="text-xs px-2 py-0.5 bg-secondary/50 rounded-full cursor-pointer hover:bg-secondary"
                              onClick={() => {
                                const node = nodes.find((n) => n.id === prereq);
                                if (node) handleNodeClick(node);
                              }}
                            >
                              {prereqNode?.label || prereq}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <Button className="w-full mt-3" size="sm">
                    Study This Concept
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card className="shadow-lg bg-secondary/30 border-dashed">
                <CardContent className="p-4 flex items-center gap-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click on a concept node to see details</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Simplified concept visualization */}
          <div
            className="relative w-full h-full p-4 overflow-auto"
            style={{
              transform: `scale(${zoomLevel})`,
              transformOrigin: "center",
              transition: "transform 0.3s ease",
            }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative" style={{ width: "800px", height: "600px" }}>
                {/* Connection lines */}
                <svg className="absolute inset-0 w-full h-full">
                  {connections.map((connection, index) => {
                    const sourceNode = filteredNodes.find(
                      (n) => n.id === connection.source
                    );
                    const targetNode = filteredNodes.find(
                      (n) => n.id === connection.target
                    );

                    if (!sourceNode || !targetNode) return null;

                    // Simplified positioning
                    const sourceIndex = filteredNodes.indexOf(sourceNode);
                    const targetIndex = filteredNodes.indexOf(targetNode);

                    const sourceX = 100 + (sourceIndex % 5) * 150;
                    const sourceY = 100 + Math.floor(sourceIndex / 5) * 120;

                    const targetX = 100 + (targetIndex % 5) * 150;
                    const targetY = 100 + Math.floor(targetIndex / 5) * 120;

                    return (
                      <path
                        key={index}
                        d={`M${sourceX},${sourceY} C${(sourceX + targetX) / 2},${sourceY} ${
                          (sourceX + targetX) / 2
                        },${targetY} ${targetX},${targetY}`}
                        stroke={
                          connection.type === "prerequisite"
                            ? "#ef4444"
                            : connection.type === "related"
                            ? "#3b82f6"
                            : "#22c55e"
                        }
                        strokeWidth="2"
                        fill="none"
                        strokeDasharray={connection.type === "related" ? "5,5" : "none"}
                        markerEnd="url(#arrowhead)"
                      />
                    );
                  })}
                  <defs>
                    <marker
                      id="arrowhead"
                      markerWidth="10"
                      markerHeight="7"
                      refX="9"
                      refY="3.5"
                      orient="auto"
                    >
                      <polygon points="0 0, 10 3.5, 0 7" fill="#64748b" />
                    </marker>
                  </defs>
                </svg>

                {/* Nodes */}
                {filteredNodes.map((node, index) => {
                  // Simplified positioning
                  const x = 100 + (index % 5) * 150;
                  const y = 100 + Math.floor(index / 5) * 120;

                  return (
                    <div
                      key={node.id}
                      className={`absolute cursor-pointer rounded-lg shadow-md hover:shadow-lg transition-shadow ${getDifficultyStyle(
                        node.difficulty
                      )} bg-white dark:bg-gray-800 overflow-hidden`}
                      style={{
                        left: `${x}px`,
                        top: `${y}px`,
                        transform: "translate(-50%, -50%)",
                        width: "120px",
                        height: "80px",
                      }}
                      onClick={() => handleNodeClick(node)}
                    >
                      <div
                        className="h-1.5 w-full"
                        style={{ backgroundColor: getCategoryColor(node.category) }}
                      ></div>
                      <div className="p-2 flex flex-col items-center justify-center h-full">
                        <span className="font-medium text-sm text-center">{node.label}</span>
                        <span className="text-xs text-muted-foreground">{node.category}</span>
                        <div className="mt-1 h-1 w-full bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-green-500 rounded-full"
                            style={{ width: `${node.mastery}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="mt-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Basic</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-amber-500"></div>
            <span>Intermediate</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Advanced</span>
          </div>
        </div>
      </div>
    </div>
  );
}
