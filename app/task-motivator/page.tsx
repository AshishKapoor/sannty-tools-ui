"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Component() {
  const [task, setTask] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      setSubmitted(true);
    }
  };

  const motivationalMessages = [
    "You've got this! One step at a time.",
    "Believe in yourself. You are capable of amazing things!",
    "Every accomplishment starts with the decision to try.",
    "Your only limit is you. Push through!",
    "Success is the sum of small efforts repeated day in and day out.",
  ];

  const randomMotivation =
    motivationalMessages[
      Math.floor(Math.random() * motivationalMessages.length)
    ];

  return (
    <Card className="w-full max-w-md mx-auto mt-20">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Daily Task Motivator
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="task"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                What is the hardest task you want to accomplish today?
              </label>
              <Input
                id="task"
                type="text"
                value={task}
                onChange={(e) => setTask(e.target.value)}
                placeholder="Enter your task here"
                required
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full">
              Submit
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <p className="font-semibold text-lg">Your task for today:</p>
            <p className="text-xl font-bold">{task}</p>
            <p className="italic">{randomMotivation}</p>
            <Button
              onClick={() => {
                setSubmitted(false);
                setTask("");
              }}
              className="w-full"
            >
              Set a New Task
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
