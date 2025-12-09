import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/sidebar";
import { Bell, Lock, User, Palette } from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Profile",
      icon: User,
      items: [
        { label: "Name", value: "John Doe", editable: true },
        { label: "Email", value: "john@teamflow.com", editable: true },
        { label: "Role", value: "Admin", editable: false },
      ],
    },
    {
      title: "Notifications",
      icon: Bell,
      items: [
        { label: "Email Notifications", value: "Enabled", editable: true },
        { label: "Push Notifications", value: "Disabled", editable: true },
        { label: "Task Reminders", value: "Enabled", editable: true },
      ],
    },
    {
      title: "Appearance",
      icon: Palette,
      items: [
        { label: "Theme", value: "System", editable: true },
        { label: "Language", value: "English", editable: true },
      ],
    },
    {
      title: "Security",
      icon: Lock,
      items: [
        { label: "Password", value: "••••••••", editable: true },
        { label: "Two-Factor Auth", value: "Disabled", editable: true },
      ],
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
              Settings
            </h1>

            <div className="space-y-6">
              {settingsSections.map((section) => (
                <div
                  key={section.title}
                  className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800 shadow-sm"
                >
                  <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                      <section.icon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <dl className="divide-y divide-gray-200 dark:divide-gray-700">
                      {section.items.map((item) => (
                        <div
                          key={item.label}
                          className="py-4 flex justify-between items-center"
                        >
                          <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                            {item.label}
                          </dt>
                          <dd className="flex items-center space-x-2">
                            <span className="text-sm text-gray-900 dark:text-white">
                              {item.value}
                            </span>
                            {item.editable && (
                              <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                                Edit
                              </button>
                            )}
                          </dd>
                        </div>
                      ))}
                    </dl>
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

