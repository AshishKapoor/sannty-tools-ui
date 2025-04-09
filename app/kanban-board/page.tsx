"use client";

import React, { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EditIcon, TrashIcon, PlusIcon } from "lucide-react";

interface Task {
  id: string;
  title: string;
  description: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

const initialColumns = [
  { id: "backlog", title: "Backlog", tasks: [] },
  { id: "inprogress", title: "In Progress", tasks: [] },
  { id: "inreview", title: "In Review", tasks: [] },
  { id: "blocked", title: "Blocked", tasks: [] },
  { id: "done", title: "Done", tasks: [] },
];

export default function Component() {
  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [editingTask, setEditingTask] = useState<{ columnId: string; taskId: string; title: string; description: string } | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    const storedColumns = window.localStorage.getItem("kanbanColumns");
    if (storedColumns) {
      setColumns(JSON.parse(storedColumns));
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem("kanbanColumns", JSON.stringify(columns));
  }, [columns]);

  const addTask = () => {
    if (newTask.title.trim() !== "") {
      const updatedColumns = [...columns];
      updatedColumns[0].tasks.push({
        id: Date.now().toString(),
        title: newTask.title.trim(),
        description: newTask.description.trim(),
      });
      setColumns(updatedColumns);
      setNewTask({ title: "", description: "" });
    }
  };

  const editTask = (columnId: string, taskId: string, title: string, description: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId ? { ...task, title, description } : task
          ),
        };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  const removeTask = (columnId: string, taskId: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.filter((task) => task.id !== taskId),
        };
      }
      return column;
    });
    setColumns(updatedColumns);
  };

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    if (!destination || (source.droppableId === destination.droppableId && source.index === destination.index)) {
      return;
    }

    const newColumns = [...columns];
    const sourceColIndex = newColumns.findIndex((col) => col.id === source.droppableId);
    const destColIndex = newColumns.findIndex((col) => col.id === destination.droppableId);

    const sourceCol = { ...newColumns[sourceColIndex] };
    const destCol = { ...newColumns[destColIndex] };

    const [movedTask] = sourceCol.tasks.splice(source.index, 1);
    destCol.tasks.splice(destination.index, 0, movedTask);

    newColumns[sourceColIndex] = sourceCol;
    newColumns[destColIndex] = destCol;

    setColumns(newColumns);
  };

  const handleNewTaskKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTask.title.trim() !== '') {
      addTask();
      setIsAddModalOpen(false);
    }
  };

  const startEditingTask = (columnId: string, taskId: string, title: string, description: string) => {
    setEditingTask({ columnId, taskId, title, description });
  };

  const handleEditSave = () => {
    if (editingTask) {
      editTask(editingTask.columnId, editingTask.taskId, editingTask.title, editingTask.description);
      setEditingTask(null);
    }
  };

  return (
    <div className="p-4 mt-8">
      <div className="flex items-center gap-2 mb-4">
        <h1 className="text-2xl font-bold">Kanban Board</h1>
        <Button
          size="icon"
          variant="outline"
          onClick={() => setIsAddModalOpen(true)}
          className="bg-emerald-500 hover:bg-emerald-400"
        >
          <PlusIcon className="h-4 w-4 text-white" />
        </Button>
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              type="text"
              value={newTask.title}
              onChange={(e) => setNewTask(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Task Title"
              onKeyPress={handleNewTaskKeyPress}
            />
            <textarea
              value={newTask.description}
              onChange={(e) => setNewTask(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Task Description"
              className="w-full resize-none h-20 p-2 rounded-md border"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button onClick={() => {
                addTask();
                setIsAddModalOpen(false);
              }}>Add Task</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">
                  {column.title} ({column.tasks.length})
                </h2>
                {column.tasks.length > 0 && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete all tasks in ${column.title}?`)) {
                        const updatedColumns = columns.map(col => 
                          col.id === column.id ? { ...col, tasks: [] } : col
                        );
                        setColumns(updatedColumns);
                      }
                    }}
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-secondary p-2 rounded-md min-h-[200px] w-full"
                  >
                    {column.tasks.map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <Card
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2"
                          >
                            <CardContent className="p-2">
                              <div className="font-medium">{task.title}</div>
                              {task.description && (
                                <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                              )}
                              <div className="flex gap-2 mt-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditingTask(column.id, task.id, task.title, task.description)}
                                >
                                  <EditIcon className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => removeTask(column.id, task.id)}
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
      <Dialog open={editingTask !== null} onOpenChange={() => setEditingTask(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <div className="p-4 space-y-4">
            <Input
              value={editingTask?.title || ''}
              onChange={(e) => setEditingTask(prev => prev ? { ...prev, title: e.target.value } : null)}
              placeholder="Task Title"
            />
            <textarea
              value={editingTask?.description || ''}
              onChange={(e) => setEditingTask(prev => prev ? { ...prev, description: e.target.value } : null)}
              placeholder="Task Description"
              className="w-full resize-none h-20 p-2 rounded-md border"
            />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingTask(null)}>Cancel</Button>
              <Button onClick={handleEditSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
