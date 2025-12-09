import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { prisma } from "@/lib/prisma";
import { format } from "date-fns";
import {
  CheckCircle2,
  Plus,
  Edit,
  UserPlus,
  Activity as ActivityIcon,
} from "lucide-react";

const getActivitiesQuery = () => prisma.activity.findMany({
  include: {
    user: true,
  },
  orderBy: {
    createdAt: "desc",
  },
  take: 50,
});

type ActivityWithUser = Awaited<ReturnType<typeof getActivitiesQuery>>[number];

async function getActivities(): Promise<ActivityWithUser[]> {
  try {
    const activities = await getActivitiesQuery();
    return activities;
  } catch (error) {
    console.error('Error fetching activities:', error);
    return [];
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "task_created":
      return <Plus className="h-5 w-5 text-blue-500" />;
    case "task_updated":
      return <Edit className="h-5 w-5 text-yellow-500" />;
    case "task_completed":
      return <CheckCircle2 className="h-5 w-5 text-green-500" />;
    case "user_joined":
      return <UserPlus className="h-5 w-5 text-purple-500" />;
    default:
      return <ActivityIcon className="h-5 w-5 text-gray-500" />;
  }
}

export default async function ActivityPage() {
  const activities = await getActivities();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Activity Log
            </h1>

            <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {activities.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== activities.length - 1 && (
                            <span
                              className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700"
                              aria-hidden="true"
                            />
                          )}
                          <div className="relative flex items-start space-x-3">
                            <div className="relative">
                              <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center ring-8 ring-white dark:ring-gray-900">
                                {activity.user ? (
                                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-medium">
                                    {activity.user.name.charAt(0)}
                                  </div>
                                ) : (
                                  getActivityIcon(activity.type)
                                )}
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div>
                                <div className="text-sm">
                                  <span className="font-medium text-gray-900 dark:text-white">
                                    {activity.user?.name || "System"}
                                  </span>
                                </div>
                                <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                                  {activity.message}
                                </p>
                              </div>
                              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                <time dateTime={activity.createdAt.toISOString()}>
                                  {format(
                                    new Date(activity.createdAt),
                                    "MMM d, yyyy 'at' h:mm a"
                                  )}
                                </time>
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

