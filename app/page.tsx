"use client";
import KanbanBoard from "./kanban-board/page";

function LandingPage() {
  return (
    <div className="mx-auto px-2 py-8">
      <style jsx>{`
        @keyframes colorChange {
          0% {
            color: #3b82f6;
          }
          50% {
            color: #10b981;
          }
          100% {
            color: #3b82f6;
          }
        }
        .animated-heading {
          animation: slideIn 1s ease-out, colorChange 4s infinite;
        }
      `}</style>
      <header className="text-center">
        <a href="https://sannty.in">
          <h1 className="text-5xl font-extrabold animated-heading">
            Mission Control
          </h1>
          <span className="text-lg font-semibold text-gray-500">
            An offline Kanban Board for your projects.
          </span>
        </a>
      </header>
      <KanbanBoard />
    </div>
  );
}

export default LandingPage;
