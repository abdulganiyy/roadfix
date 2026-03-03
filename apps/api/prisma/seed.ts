import { RoleName } from 'generated/prisma/enums';
import { PrismaService } from '../src/prisma.service';
import * as argon2 from 'argon2';

const prisma = new PrismaService();

async function main() {
  const adminPassword = await argon2.hash('pass');

  const userPassword = await argon2.hash('pass');

  const roles = [RoleName.admin, RoleName.staff, RoleName.user];

  await prisma.role.createMany({
    data: roles.map((role) => ({ name: role })),
    skipDuplicates: true,
  });

  console.log(`Created/updated roles`);

  // Create an admin user using upsert for idempotency
  const admin = await prisma.user.upsert({
    where: { email: 'admin@roadfixng.com' },
    update: {}, // empty update if the record already exists
    create: {
      email: 'admin@roadfixng.com',
      password: adminPassword,
    },
  });
  console.log(`Created/updated admin user with id: ${admin.id}`);

  // Create an reporter user using upsert for idempotency
  const reporter = await prisma.user.upsert({
    where: {
      email: 'reporter@roadfixng.com',
    },
    update: {}, // empty update if the record already exists
    create: {
      email: 'reporter@roadfixng.com',
      password: userPassword,
      emailVerified: true,
      name: 'Abdul Wright',
    },
  });
  console.log(`Created/updated reporter user with id: ${reporter.id}`);

  // Fetch admin role
  const adminRole = await prisma.role.findUnique({
    where: { name: RoleName.admin },
  });
  console.log(`Fetched admin role with id: ${adminRole!.id}`);

  // Fetch user role
  const userRole = await prisma.role.findUnique({
    where: { name: RoleName.user },
  });
  console.log(`Fetched user role with id: ${userRole!.id}`);

  // Create admin-role links
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: admin.id,
        roleId: adminRole!.id,
      },
    },
    update: {},
    create: {
      userId: admin.id,
      roleId: adminRole!.id,
    },
  });
  console.log('Linked admin user with admin role');

  // Create user-role links
  await prisma.userRole.upsert({
    where: {
      userId_roleId: {
        userId: reporter.id,
        roleId: userRole!.id,
      },
    },
    update: {},
    create: {
      userId: reporter.id,
      roleId: userRole!.id,
    },
  });
  console.log('Linked reporter user with user role');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
