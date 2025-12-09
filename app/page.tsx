import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { prisma } from "@/lib/prisma";
import { CheckSquare, Users, Activity, TrendingUp } from "lucide-react";

async function getStats() {
  try {
    const [tasks, users, activities, completedTasks] = await Promise.all([
      prisma.task.count(),
      prisma.user.count(),
      prisma.activity.count(),
      prisma.task.count({ where: { status: "done" } }),
    ]);

    return {
      totalTasks: tasks,
      totalUsers: users,
      totalActivities: activities,
      completedTasks,
    };
  } catch (error) {
    console.error('Error fetching stats:', error);
    return {
      totalTasks: 0,
      totalUsers: 0,
      totalActivities: 0,
      completedTasks: 0,
    };
  }
}

export default async function Dashboard() {
  const stats = await getStats();

  const statCards = [
    {
      name: "Total Tasks",
      value: stats.totalTasks,
      icon: CheckSquare,
      change: "+12%",
      changeType: "positive" as const,
    },
    {
      name: "Team Members",
      value: stats.totalUsers,
      icon: Users,
      change: "+2",
      changeType: "positive" as const,
    },
    {
      name: "Activities",
      value: stats.totalActivities,
      icon: Activity,
      change: "+24%",
      changeType: "positive" as const,
    },
    {
      name: "Completed",
      value: stats.completedTasks,
      icon: TrendingUp,
      change: "+8%",
      changeType: "positive" as const,
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Dashboard
            </h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {statCards.map((card) => (
                <div
                  key={card.name}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {card.name}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                        {card.value}
                      </p>
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <card.icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <span
                      className={`text-sm font-medium ${
                        card.changeType === "positive"
                          ? "text-green-600 dark:text-green-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {card.change}
                    </span>
                    <span className="text-sm text-gray-600 dark:text-gray-400 ml-1">
                      from last month
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Activity feed will appear here...
                  </p>
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h2>
                <div className="space-y-2">
                  <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    Create New Task
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    Invite Team Member
                  </button>
                  <button className="w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300">
                    View Reports
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

