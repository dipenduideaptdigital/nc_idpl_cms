import { prisma } from "../../config/db.js";
import { hashPassword } from "../../shared/utils/password.js";
import { env } from "../../config/env.js";

async function main() {
  console.log("Seeding started...");

  // System roles
  const superAdminRole = await prisma.systemRole.upsert({
    where: { slug: "SUPER_ADMIN" },
    update: {},
    create: {
      name: "Super Admin",
      slug: "SUPER_ADMIN",
      description: "Highest level system administrator",
    },
  });

  const adminRole = await prisma.systemRole.upsert({
    where: { slug: "ADMIN" },
    update: {},
    create: {
      name: "Admin",
      slug: "ADMIN",
      description: "Administrative user",
    },
  });

  const userRole = await prisma.systemRole.upsert({
    where: { slug: "USER" },
    update: {},
    create: {
      name: "User",
      slug: "USER",
      description: "Regular platform user",
    },
  });

  console.log("System roles seeded");

  // Super admin
  const existingSuperAdmin = await prisma.user.findUnique({
    where: { email: env.SUPER_ADMIN_EMAIL },
  });

  if (!existingSuperAdmin) {
    const hashedPassword = await hashPassword(env.SUPER_ADMIN_PASSWORD);

    await prisma.user.create({
      data: {
        name: env.SUPER_ADMIN_NAME,
        email: env.SUPER_ADMIN_EMAIL,
        password: hashedPassword,
        systemRoleId: superAdminRole.id,
        status: "ACTIVE",
        isEmailVerified: true,
      },
    });

    console.log("Super admin seeded");
  } else {
    console.log("Super admin already exists");
  }

  console.log("Seeding completed");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });