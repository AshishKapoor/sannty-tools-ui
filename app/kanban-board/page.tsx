"use client";

import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Task {
  id: string;
  content: string;
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
}

export default function Component() {
  const [columns, setColumns] = useState<Column[]>([
    { id: "todo", title: "TODO", tasks: [] },
    { id: "inprogress", title: "IN PROGRESS", tasks: [] },
    { id: "done", title: "DONE", tasks: [] },
  ]);
  const [newTask, setNewTask] = useState("");

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

  const onDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If there's no destination or the item is dropped in the same place, do nothing
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // Create a copy of the columns
    const newColumns = [...columns];

    // Find the source and destination columns
    const sourceColIndex = newColumns.findIndex(
      (col) => col.id === source.droppableId
    );
    const destColIndex = newColumns.findIndex(
      (col) => col.id === destination.droppableId
    );

    // Create copies of the source and destination task lists
    const sourceCol = { ...newColumns[sourceColIndex] };
    const destCol = { ...newColumns[destColIndex] };

    // Remove the task from the source column
    const [movedTask] = sourceCol.tasks.splice(source.index, 1);

    // Add the task to the destination column
    destCol.tasks.splice(destination.index, 0, movedTask);

    // Update the columns in the state
    newColumns[sourceColIndex] = sourceCol;
    newColumns[destColIndex] = destCol;

    setColumns(newColumns);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto mt-20">
      <h1 className="text-2xl font-bold mb-4">Kanban Board</h1>
      <div className="flex mb-4">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
          className="mr-2"
        />
        <Button onClick={addTask}>Add Task</Button>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4">
          {columns.map((column) => (
            <div key={column.id} className="flex-1">
              <h2 className="font-semibold mb-2">{column.title}</h2>
              <Droppable droppableId={column.id}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="bg-secondary p-2 rounded-md min-h-[200px]"
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
                              {task.content}
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
    </div>
  );
}
