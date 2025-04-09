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
import { EditIcon, TrashIcon } from "lucide-react";

interface Task {
  id: string;
  content: string;
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
  const [newTask, setNewTask] = useState("");
  const [editingTask, setEditingTask] = useState<{ columnId: string; taskId: string; content: string } | null>(null);

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
    if (newTask.trim() !== "") {
      const updatedColumns = [...columns];
      updatedColumns[0].tasks.push({
        id: Date.now().toString(),
        content: newTask.trim(),
      });
      setColumns(updatedColumns);
      setNewTask("");
    }
  };

  const editTask = (columnId: string, taskId: string, newContent: string) => {
    const updatedColumns = columns.map((column) => {
      if (column.id === columnId) {
        return {
          ...column,
          tasks: column.tasks.map((task) =>
            task.id === taskId ? { ...task, content: newContent } : task
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
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const startEditingTask = (columnId: string, taskId: string, content: string) => {
    setEditingTask({ columnId, taskId, content });
  };

  const handleEditSave = () => {
    if (editingTask) {
      editTask(editingTask.columnId, editingTask.taskId, editingTask.content);
      setEditingTask(null);
    }
  };

  return (
    <div className="p-4 mt-8">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          onKeyPress={handleNewTaskKeyPress}
          placeholder="Add a new task"
          className="mr-2"
        />
        <Button onClick={addTask}>Add Task</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex-1">
              <h2 className="font-semibold mb-2">
                {column.title} ({column.tasks.length})
              </h2>
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
                            <CardContent className="p-2 flex justify-between items-center">
                              <span>{task.content}</span>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => startEditingTask(column.id, task.id, task.content)}
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
          <div className="p-4">
            <Input
              value={editingTask?.content || ''}
              onChange={(e) => setEditingTask(prev => prev ? { ...prev, content: e.target.value } : null)}
              className="mb-4"
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
