import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { prisma } from "@/lib/prisma";
import { Shield, User as UserIcon, Users } from "lucide-react";

const getTeamMembersQuery = () => prisma.user.findMany({
  include: {
    _count: {
      select: {
        tasks: true,
      },
    },
  },
  orderBy: {
    createdAt: "desc",
  },
});

type UserWithCount = Awaited<ReturnType<typeof getTeamMembersQuery>>[number];

async function getTeamMembers(): Promise<UserWithCount[]> {
  try {
    const users = await getTeamMembersQuery();
    return users;
  } catch (error) {
    console.error('Error fetching team members:', error);
    return [];
  }
}

function getRoleIcon(role: string) {
  switch (role) {
    case "admin":
      return <Shield className="h-4 w-4 text-purple-500" />;
    case "manager":
      return <Users className="h-4 w-4 text-blue-500" />;
    default:
      return <UserIcon className="h-4 w-4 text-gray-500" />;
  }
}

function getRoleBadge(role: string) {
  const styles = {
    admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400",
    manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400",
    member: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400",
  };
  return (
    <span
      className={`px-2 py-1 text-xs font-medium rounded-full ${
        styles[role as keyof typeof styles] || styles.member
      }`}
    >
      {role}
    </span>
  );
}

export default async function TeamPage() {
  const members = await getTeamMembers();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Team Management
              </h1>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Invite Member
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {members.map((member) => (
                <div
                  key={member.id}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 p-6 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-lg font-medium">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {member.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {member.email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getRoleIcon(member.role)}
                      {getRoleBadge(member.role)}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Tasks Assigned
                      </span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {member._count.tasks}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

