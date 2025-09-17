"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Map, Star, Lock, CheckCircle, Trophy, Zap } from "lucide-react"

interface MapNode {
  id: string
  title: string
  subject: string
  difficulty: "Easy" | "Medium" | "Hard"
  xp: number
  completed: boolean
  unlocked: boolean
  x: number
  y: number
  connections: string[]
}

interface KnowledgeAdventureMapProps {
  onBack: () => void
}

export function KnowledgeAdventureMap({ onBack }: KnowledgeAdventureMapProps) {
  const [selectedNode, setSelectedNode] = useState<MapNode | null>(null)
  const [mapNodes, setMapNodes] = useState<MapNode[]>([
    {
      id: "start",
      title: "Welcome to Learning",
      subject: "Introduction",
      difficulty: "Easy",
      xp: 10,
      completed: true,
      unlocked: true,
      x: 50,
      y: 90,
      connections: ["math-basics", "reading-basics"],
    },
    {
      id: "math-basics",
      title: "Numbers & Counting",
      subject: "Mathematics",
      difficulty: "Easy",
      xp: 25,
      completed: true,
      unlocked: true,
      x: 20,
      y: 70,
      connections: ["addition-subtraction"],
    },
    {
      id: "reading-basics",
      title: "Letters & Sounds",
      subject: "English",
      difficulty: "Easy",
      xp: 25,
      completed: true,
      unlocked: true,
      x: 80,
      y: 70,
      connections: ["simple-words"],
    },
    {
      id: "addition-subtraction",
      title: "Addition & Subtraction",
      subject: "Mathematics",
      difficulty: "Medium",
      xp: 50,
      completed: false,
      unlocked: true,
      x: 20,
      y: 50,
      connections: ["multiplication"],
    },
    {
      id: "simple-words",
      title: "Building Words",
      subject: "English",
      difficulty: "Medium",
      xp: 50,
      completed: false,
      unlocked: true,
      x: 80,
      y: 50,
      connections: ["sentences"],
    },
    {
      id: "multiplication",
      title: "Multiplication Tables",
      subject: "Mathematics",
      difficulty: "Hard",
      xp: 75,
      completed: false,
      unlocked: false,
      x: 20,
      y: 30,
      connections: ["fractions"],
    },
    {
      id: "sentences",
      title: "Making Sentences",
      subject: "English",
      difficulty: "Hard",
      xp: 75,
      completed: false,
      unlocked: false,
      x: 80,
      y: 30,
      connections: ["stories"],
    },
    {
      id: "fractions",
      title: "Understanding Fractions",
      subject: "Mathematics",
      difficulty: "Hard",
      xp: 100,
      completed: false,
      unlocked: false,
      x: 20,
      y: 10,
      connections: ["boss-math"],
    },
    {
      id: "stories",
      title: "Reading Stories",
      subject: "English",
      difficulty: "Hard",
      xp: 100,
      completed: false,
      unlocked: false,
      x: 80,
      y: 10,
      connections: ["boss-english"],
    },
    {
      id: "boss-math",
      title: "Math Master Boss",
      subject: "Mathematics",
      difficulty: "Hard",
      xp: 200,
      completed: false,
      unlocked: false,
      x: 35,
      y: 5,
      connections: [],
    },
    {
      id: "boss-english",
      title: "Word Wizard Boss",
      subject: "English",
      difficulty: "Hard",
      xp: 200,
      completed: false,
      unlocked: false,
      x: 65,
      y: 5,
      connections: [],
    },
  ])

  const completeNode = (nodeId: string) => {
    setMapNodes((prev) =>
      prev.map((node) => {
        if (node.id === nodeId) {
          const updatedNode = { ...node, completed: true }
          // Unlock connected nodes
          const updatedNodes = prev.map((n) => (node.connections.includes(n.id) ? { ...n, unlocked: true } : n))
          return updatedNode
        }
        return node
      }),
    )
  }

  const totalNodes = mapNodes.length
  const completedNodes = mapNodes.filter((node) => node.completed).length
  const progressPercentage = (completedNodes / totalNodes) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
              <Map className="h-3 w-3 mr-1" />
              Adventure Map
            </Badge>
          </div>
        </div>

        {/* Progress Overview */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <CardTitle className="text-xl">Learning Journey Progress</CardTitle>
                <CardDescription>Complete checkpoints to unlock new learning paths</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-emerald-600">
                  {completedNodes}/{totalNodes}
                </div>
                <div className="text-sm text-gray-500">Checkpoints</div>
              </div>
            </div>
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between text-sm text-gray-500 mt-2">
              <span>Journey Started</span>
              <span>{Math.round(progressPercentage)}% Complete</span>
              <span>Master Level</span>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Interactive Map */}
          <div className="lg:col-span-2">
            <Card className="h-[600px]">
              <CardContent className="p-6 h-full">
                <div className="relative w-full h-full bg-gradient-to-br from-emerald-100 to-cyan-100 rounded-lg overflow-hidden">
                  {/* Map Background */}
                  <div className="absolute inset-0 opacity-20">
                    <svg width="100%" height="100%" className="absolute inset-0">
                      <defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#10b981" strokeWidth="1" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                  </div>

                  {/* Connection Lines */}
                  <svg className="absolute inset-0 w-full h-full">
                    {mapNodes.map((node) =>
                      node.connections.map((connectionId) => {
                        const connectedNode = mapNodes.find((n) => n.id === connectionId)
                        if (!connectedNode) return null

                        return (
                          <line
                            key={`${node.id}-${connectionId}`}
                            x1={`${node.x}%`}
                            y1={`${node.y}%`}
                            x2={`${connectedNode.x}%`}
                            y2={`${connectedNode.y}%`}
                            stroke={node.completed ? "#10b981" : "#d1d5db"}
                            strokeWidth="2"
                            strokeDasharray={node.completed ? "0" : "5,5"}
                          />
                        )
                      }),
                    )}
                  </svg>

                  {/* Map Nodes */}
                  {mapNodes.map((node) => (
                    <div
                      key={node.id}
                      className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-300 hover:scale-110 ${
                        selectedNode?.id === node.id ? "scale-125 z-10" : ""
                      }`}
                      style={{ left: `${node.x}%`, top: `${node.y}%` }}
                      onClick={() => setSelectedNode(node)}
                    >
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center border-4 shadow-lg ${
                          node.completed
                            ? "bg-emerald-500 border-emerald-600 text-white"
                            : node.unlocked
                              ? "bg-white border-emerald-400 text-emerald-600 hover:bg-emerald-50"
                              : "bg-gray-200 border-gray-300 text-gray-400"
                        }`}
                      >
                        {node.completed ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : node.unlocked ? (
                          node.id.includes("boss") ? (
                            <Trophy className="h-6 w-6" />
                          ) : (
                            <Star className="h-6 w-6" />
                          )
                        ) : (
                          <Lock className="h-6 w-6" />
                        )}
                      </div>
                      <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-center">
                        <div className="text-xs font-medium text-gray-700 whitespace-nowrap bg-white/80 px-2 py-1 rounded shadow">
                          {node.title}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Node Details */}
          <div>
            {selectedNode ? (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {selectedNode.completed ? (
                      <CheckCircle className="h-6 w-6 text-emerald-500" />
                    ) : selectedNode.unlocked ? (
                      selectedNode.id.includes("boss") ? (
                        <Trophy className="h-6 w-6 text-yellow-500" />
                      ) : (
                        <Star className="h-6 w-6 text-blue-500" />
                      )
                    ) : (
                      <Lock className="h-6 w-6 text-gray-400" />
                    )}
                    <CardTitle className="text-lg">{selectedNode.title}</CardTitle>
                  </div>

                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Badge variant="outline">{selectedNode.subject}</Badge>
                      <Badge
                        variant={
                          selectedNode.difficulty === "Easy"
                            ? "secondary"
                            : selectedNode.difficulty === "Medium"
                              ? "default"
                              : "destructive"
                        }
                      >
                        {selectedNode.difficulty}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-yellow-500" />
                      <span className="font-medium">+{selectedNode.xp} XP</span>
                    </div>

                    <CardDescription>
                      {selectedNode.id.includes("boss")
                        ? "Face the ultimate challenge! Defeat this boss to prove your mastery."
                        : selectedNode.completed
                          ? "Congratulations! You've mastered this checkpoint."
                          : selectedNode.unlocked
                            ? "Ready to learn? Click start to begin this checkpoint."
                            : "Complete previous checkpoints to unlock this challenge."}
                    </CardDescription>

                    {selectedNode.unlocked && !selectedNode.completed && (
                      <Button className="w-full" onClick={() => completeNode(selectedNode.id)}>
                        {selectedNode.id.includes("boss") ? "Challenge Boss" : "Start Learning"}
                      </Button>
                    )}

                    {selectedNode.completed && (
                      <Button variant="outline" className="w-full bg-transparent">
                        Review Content
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-6 text-center">
                  <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <CardTitle className="text-lg mb-2">Select a Checkpoint</CardTitle>
                  <CardDescription>
                    Click on any checkpoint in the map to see details and start learning!
                  </CardDescription>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
