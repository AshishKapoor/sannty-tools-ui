"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trello,
  Timer,
  Clock,
  Zap,
  Layers,
  CalendarClock,
  ListChecks,
  Rewind,
} from "lucide-react";
import { useRouter } from "next/navigation";

function LandingPage() {
  const router = useRouter();

  const tools = [
    {
      icon: <Clock className="h-8 w-8 text-primary" />,
      title: "Pomodoro Timer",
      description: "Boost productivity with timed work sessions and breaks.",
      onClick: () => router.push("/pomodoro", { scroll: false }),
    },
    {
      icon: <Trello className="h-8 w-8 text-primary" />,
      title: "Kanban Board",
      description:
        "Visualize and manage your workflow with customizable boards.",
      onClick: () => router.push("/kanban-board", { scroll: false }),
    },
    {
      icon: <Timer className="h-8 w-8 text-primary" />,
      title: "Two Minutes",
      description:
        "Tackle small tasks quickly with our two-minute timer challenge.",
      onClick: () => router.push("/two-minutes", { scroll: false }),
    },
    {
      icon: <CalendarClock className="h-8 w-8 text-primary" />,
      title: "Time Boxing",
      description:
        "Allocate specific time slots to tasks for improved focus and efficiency.",
      onClick: () => router.push("/time-boxing", { scroll: false }),
    },
    {
      icon: <Zap className="h-8 w-8 text-primary" />,
      title: "Daily Task Motivator",
      description:
        "Get daily motivation and reminders to keep you on track with your tasks.",
      onClick: () => router.push("/task-motivator", { scroll: false }),
    },
    {
      icon: <Layers className="h-8 w-8 text-primary" />,
      title: "Task Batcher",
      description:
        "Group similar tasks together for more efficient completion.",
      onClick: () => router.push("/task-batcher", { scroll: false }),
    },
    {
      icon: <Rewind className="h-8 w-8 text-primary" />,
      title: "Reverse Day Planner",
      description:
        "Plan your day backwards to ensure you meet your most important goals.",
      onClick: () => router.push("/reverse-planner", { scroll: false }),
    },
    {
      icon: <ListChecks className="h-8 w-8 text-primary" />,
      title: "Daily Task List",
      description:
        "Organize and prioritize your daily tasks for maximum productivity.",
      onClick: () => router.push("/todo-list", { scroll: false }),
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4 text-green-500">Sannty.in</h1>
        <p className="text-xl text-muted-foreground">
          Empower your productivity with our suite of tools
        </p>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 cursor-pointer">
        {tools.map((tool, index) => (
          <Card
            key={index}
            onClick={() => tool.onClick()}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader className="flex flex-row items-center space-x-4">
              {tool.icon}
              <CardTitle>{tool.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{tool.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
