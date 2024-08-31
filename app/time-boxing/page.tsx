"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X } from "lucide-react";

interface Task {
  id: number;
  name: string;
  duration: number;
  startTime: number;
}

export default function Component() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [taskName, setTaskName] = useState("");
  const [taskDuration, setTaskDuration] = useState("");

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (taskName && taskDuration) {
      const duration = parseInt(taskDuration);
      const startTime = tasks.reduce((acc, task) => acc + task.duration, 0);
      if (startTime + duration <= 480) {
        // 8 hours = 480 minutes
        setTasks([
          ...tasks,
          { id: Date.now(), name: taskName, duration, startTime },
        ]);
        setTaskName("");
        setTaskDuration("");
      } else {
        alert("Task exceeds workday duration!");
      }
    }
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60) + 9;
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, "0")}:${mins
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <Card className="w-full max-w-3xl mx-auto mt-20">
      <CardHeader>
        <CardTitle>Workday Time Boxing (9 AM - 5 PM)</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={addTask} className="flex space-x-2 mb-4">
          <div className="flex-grow">
            <Label htmlFor="taskName" className="sr-only">
              Task Name
            </Label>
            <Input
              id="taskName"
              placeholder="Task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              required
            />
          </div>
          <div className="w-24">
            <Label htmlFor="taskDuration" className="sr-only">
              Duration (minutes)
            </Label>
            <Input
              id="taskDuration"
              type="number"
              placeholder="Minutes"
              value={taskDuration}
              onChange={(e) => setTaskDuration(e.target.value)}
              required
              min="1"
              max="480"
            />
          </div>
          <Button type="submit">Add Task</Button>
        </form>

        <div className="h-12 bg-gray-200 rounded-lg overflow-hidden mb-4">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="h-full bg-blue-500 inline-block"
              style={{
                width: `${(task.duration / 480) * 100}%`,
                marginLeft: `${(task.startTime / 480) * 100}%`,
              }}
              title={`${task.name} (${formatTime(
                task.startTime
              )} - ${formatTime(task.startTime + task.duration)})`}
            />
          ))}
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <div
              key={task.id}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>
                {task.name} ({task.duration} min)
              </span>
              <span>
                {formatTime(task.startTime)} -{" "}
                {formatTime(task.startTime + task.duration)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTask(task.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
