import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'alice@teamflow.com' },
      update: {},
      create: {
        email: 'alice@teamflow.com',
        name: 'Alice Johnson',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
      },
    }),
    prisma.user.upsert({
      where: { email: 'bob@teamflow.com' },
      update: {},
      create: {
        email: 'bob@teamflow.com',
        name: 'Bob Smith',
        role: 'manager',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
      },
    }),
    prisma.user.upsert({
      where: { email: 'charlie@teamflow.com' },
      update: {},
      create: {
        email: 'charlie@teamflow.com',
        name: 'Charlie Brown',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
      },
    }),
    prisma.user.upsert({
      where: { email: 'diana@teamflow.com' },
      update: {},
      create: {
        email: 'diana@teamflow.com',
        name: 'Diana Prince',
        role: 'member',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=diana',
      },
    }),
  ]);

  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Design new dashboard UI',
        description: 'Create mockups and wireframes for the new dashboard interface',
        status: 'in_progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        assignedToId: users[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Implement authentication system',
        description: 'Set up user authentication with JWT tokens',
        status: 'todo',
        priority: 'high',
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        assignedToId: users[1].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Write API documentation',
        description: 'Document all API endpoints and their usage',
        status: 'todo',
        priority: 'medium',
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        assignedToId: users[2].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Fix mobile responsive issues',
        description: 'Ensure all pages work correctly on mobile devices',
        status: 'in_progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        assignedToId: users[3].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Setup CI/CD pipeline',
        description: 'Configure automated testing and deployment',
        status: 'done',
        priority: 'low',
        assignedToId: users[0].id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Review code quality',
        description: 'Perform code review and refactoring',
        status: 'todo',
        priority: 'low',
        assignedToId: users[1].id,
      },
    }),
  ]);

  const activityTypes = [
    { type: 'task_created', message: 'created a new task' },
    { type: 'task_updated', message: 'updated a task' },
    { type: 'task_completed', message: 'completed a task' },
    { type: 'user_joined', message: 'joined the team' },
  ];

  const activities = [];
  for (let i = 0; i < 20; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const activityType = activityTypes[Math.floor(Math.random() * activityTypes.length)];
    const task = tasks[Math.floor(Math.random() * tasks.length)];

    activities.push(
      prisma.activity.create({
        data: {
          type: activityType.type,
          message: `${user.name} ${activityType.message}: ${task.title}`,
          metadata: JSON.stringify({ taskId: task.id }),
          userId: user.id,
          createdAt: new Date(Date.now() - i * 60 * 60 * 1000),
        },
      })
    );
  }

  await Promise.all(activities);

  console.log('✅ Seed data created successfully!');
  console.log(`   - ${users.length} users`);
  console.log(`   - ${tasks.length} tasks`);
  console.log(`   - ${activities.length} activities`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

