"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Task {
  id: number;
  name: string;
  duration: number;
}

export default function ReverseScheduler() {
  const [endTime, setEndTime] = useState("22:00"); // Default end time is 10 PM
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [schedule, setSchedule] = useState<
    (Task & { startTime: string; endTime: string })[]
  >([]);

  const addTask = () => {
    if (newTask && newDuration) {
      setTasks([
        ...tasks,
        { id: Date.now(), name: newTask, duration: parseInt(newDuration) },
      ]);
      setNewTask("");
      setNewDuration("");
    }
  };

  const removeTask = (id: number) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const calculateSchedule = () => {
    let currentTime = new Date(`2000-01-01T${endTime}:00`);
    return tasks.map((task, index) => {
      currentTime = new Date(currentTime.getTime() - task.duration * 60000);
      const startTime = currentTime.toTimeString().slice(0, 5);
      const taskEndTime =
        index === 0
          ? endTime
          : new Date(currentTime.getTime() + task.duration * 60000)
              .toTimeString()
              .slice(0, 5);
      return { ...task, startTime, endTime: taskEndTime };
    });
  };

  useEffect(() => {
    setSchedule(calculateSchedule().reverse());
  }, [tasks, endTime]);

  return (
    <div className="container mx-auto p-4 max-w-2xl mt-20">
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            Reverse Schedule Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-end space-y-2 sm:space-y-0 sm:space-x-2">
              <div className="w-full sm:flex-1">
                <Label htmlFor="task">Task</Label>
                <Input
                  id="task"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  placeholder="Enter task name"
                />
              </div>
              <div className="w-full sm:w-24">
                <Label htmlFor="duration">Duration (min)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  placeholder="Minutes"
                />
              </div>
              <Button onClick={addTask} className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
            <div>
              <Label htmlFor="endTime">End Time</Label>
              <Input
                id="endTime"
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              {schedule.map((task) => (
                <div
                  key={task.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between bg-muted p-2 rounded"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center mb-2 sm:mb-0">
                    <span className="font-medium mr-2">{task.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ({task.duration} min)
                    </span>
                  </div>
                  <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto">
                    <span className="text-sm">
                      {task.startTime} - {task.endTime}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeTask(task.id)}
                      className="ml-2"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove task</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
