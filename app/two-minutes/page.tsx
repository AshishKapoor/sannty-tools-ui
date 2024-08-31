"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Component() {
  const [task, setTask] = useState("");
  const [duration, setDuration] = useState<"less" | "more" | null | undefined>(null);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [longerTasks, setLongerTasks] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (duration === "less") {
      setRecommendation("Do it now! This task takes less than 2 minutes.");
    } else if (duration === "more") {
      setRecommendation(
        "This task takes more than 2 minutes. Choose to schedule, delegate, or delete it."
      );
      setLongerTasks([...longerTasks, task]);
    }
    setTask("");
    setDuration(null);
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle>Two-Minute Rule Task Manager</CardTitle>
        <CardDescription>
          Efficiently manage your tasks based on the two-minute rule
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="task">Task</Label>
            <Input
              id="task"
              value={task}
              onChange={(e) => setTask(e.target.value)}
              placeholder="Enter your task"
              required
            />
          </div>
          <RadioGroup
            value={duration!}
            onValueChange={(value) => setDuration(value as "less" | "more")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="less" id="less" />
              <Label htmlFor="less">Less than 2 minutes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="more" id="more" />
              <Label htmlFor="more">More than 2 minutes</Label>
            </div>
          </RadioGroup>
          <Button type="submit" disabled={!task || !duration}>
            Submit
          </Button>
        </form>
        {recommendation && (
          <div className="mt-4 p-4 bg-muted rounded-md">
            <p className="font-semibold">{recommendation}</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-2">
            Tasks Longer Than 2 Minutes:
          </h3>
          <ScrollArea className="h-[200px] w-full rounded-md border p-4">
            {longerTasks.map((task, index) => (
              <div key={index} className="py-2">
                <p>{task}</p>
                <div className="flex space-x-2 mt-1">
                  <Button size="sm" variant="outline">
                    Schedule
                  </Button>
                  <Button size="sm" variant="outline">
                    Delegate
                  </Button>
                  <Button size="sm" variant="outline">
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </ScrollArea>
        </div>
      </CardFooter>
    </Card>
  );
}
