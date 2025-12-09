import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import { CheckCircle2, Circle, Clock } from "lucide-react";

const getTasksQuery = () => prisma.task.findMany({
  include: {
    assignedTo: true,
  },
  orderBy: {
    createdAt: "desc",
  },
});

type TaskWithUser = Awaited<ReturnType<typeof getTasksQuery>>[number];

async function getTasks(): Promise<TaskWithUser[]> {
  try {
    const tasks = await getTasksQuery();
    return tasks;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
}

function getStatusIcon(status: string) {
  switch (status) {
    case "done":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "in_progress":
      return <Clock className="h-5 w-5 text-blue-500" />;
    default:
      return <Circle className="h-5 w-5 text-gray-400" />;
  }
}

function getPriorityBadge(priority: string) {
  const styles = {
    high: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400",
    medium: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400",
    low: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[priority as keyof typeof styles] || styles.low
      }`}
    >
      {priority}
    </span>
  );
}

export default async function TasksPage() {
  const tasks = await getTasks();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Tasks
              </h1>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                New Task
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Assigned To
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Due Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {tasks.map((task) => (
                      <tr
                        key={task.id}
                        className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                              {task.title}
                            </div>
                            {task.description && (
                              <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {task.description}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {task.assignedTo ? (
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                {task.assignedTo.name.charAt(0)}
                              </div>
                              <span className="ml-2 text-sm text-gray-900 dark:text-white">
                                {task.assignedTo.name}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">Unassigned</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            {getStatusIcon(task.status)}
                            <span className="text-sm text-gray-900 dark:text-white capitalize">
                              {task.status.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getPriorityBadge(task.priority)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {task.dueDate
                            ? format(new Date(task.dueDate), "MMM d, yyyy")
                            : "No due date"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

