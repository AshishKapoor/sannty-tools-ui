"use client";

import { useState } from "react";
import { PlusCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Task = {
  id: number;
  text: string;
  batchId: number | null;
};

type Batch = {
  id: number;
  name: string;
};

export default function TaskBatcher() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newBatch, setNewBatch] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, { id: Date.now(), text: newTask, batchId: null }]);
      setNewTask("");
    }
  };

  const addBatch = () => {
    if (newBatch.trim()) {
      setBatches([...batches, { id: Date.now(), name: newBatch }]);
      setNewBatch("");
    }
  };

  const moveTask = (taskId: number, batchId: number | null) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, batchId } : task))
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const deleteBatch = (batchId: number) => {
    setBatches(batches.filter((batch) => batch.id !== batchId));
    setTasks(
      tasks.map((task) =>
        task.batchId === batchId ? { ...task, batchId: null } : task
      )
    );
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl mt-20">
      <h1 className="text-2xl font-bold mb-4">Task Batcher</h1>

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task"
          className="flex-grow"
        />
        <Button onClick={addTask}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Task
        </Button>
      </div>

      <div className="flex gap-2 mb-4">
        <Input
          type="text"
          value={newBatch}
          onChange={(e) => setNewBatch(e.target.value)}
          placeholder="Enter a new batch name"
          className="flex-grow"
        />
        <Button onClick={addBatch}>
          <PlusCircle className="mr-2 h-4 w-4" /> Add Batch
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Unbatched Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {tasks
                .filter((task) => task.batchId === null)
                .map((task) => (
                  <li
                    key={task.id}
                    className="flex items-center justify-between bg-secondary p-2 rounded"
                  >
                    <span>{task.text}</span>
                    <div>
                      <select
                        onChange={(e) =>
                          moveTask(task.id, Number(e.target.value))
                        }
                        className="mr-2 bg-background text-foreground border rounded p-1"
                      >
                        <option value="">Move to batch</option>
                        {batches.map((batch) => (
                          <option key={batch.id} value={batch.id}>
                            {batch.name}
                          </option>
                        ))}
                      </select>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => deleteTask(task.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        {batches.map((batch) => (
          <Card key={batch.id}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>{batch.name}</CardTitle>
              <Button
                variant="destructive"
                size="icon"
                onClick={() => deleteBatch(batch.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {tasks
                  .filter((task) => task.batchId === batch.id)
                  .map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between bg-secondary p-2 rounded"
                    >
                      <span>{task.text}</span>
                      <div>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => moveTask(task.id, null)}
                          className="mr-2"
                        >
                          Unbatch
                        </Button>
                        <Button
                          variant="destructive"
                          size="icon"
                          onClick={() => deleteTask(task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
