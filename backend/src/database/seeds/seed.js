import { prisma } from "../../config/db.js";
import { hashPassword } from "../../shared/utils/password.js";
import { env } from "../../config/env.js";

const PERMISSIONS = [
  // PAGES
  { name: "View Pages", slug: "page.view", module: "PAGES" },
  { name: "Create Page", slug: "page.create", module: "PAGES" },
  { name: "Edit Page", slug: "page.edit", module: "PAGES" },
  { name: "Delete Page", slug: "page.delete", module: "PAGES" },
  { name: "Publish Page", slug: "page.publish", module: "PAGES" },
  { name: "Preview Page", slug: "page.preview", module: "PAGES" },

  // BLOGS
  { name: "View Blogs", slug: "blog.view", module: "BLOGS" },
  { name: "Create Blog", slug: "blog.create", module: "BLOGS" },
  { name: "Edit Blog", slug: "blog.edit", module: "BLOGS" },
  { name: "Delete Blog", slug: "blog.delete", module: "BLOGS" },
  { name: "Publish Blog", slug: "blog.publish", module: "BLOGS" },
  { name: "Preview Blog", slug: "blog.preview", module: "BLOGS" },

  // TAXONOMY (Categories & Tags)
  { name: "View Taxonomy", slug: "taxonomy.view", module: "BLOGS" },
  { name: "Create Taxonomy", slug: "taxonomy.create", module: "BLOGS" },
  { name: "Edit Taxonomy", slug: "taxonomy.edit", module: "BLOGS" },
  { name: "Delete Taxonomy", slug: "taxonomy.delete", module: "BLOGS" },

  // MEDIA
  { name: "View Media", slug: "media.view", module: "MEDIA" },
  { name: "Upload Media", slug: "media.upload", module: "MEDIA" },
  { name: "Edit Media", slug: "media.edit", module: "MEDIA" }, 
  { name: "Delete Media", slug: "media.delete", module: "MEDIA" },

  // CONTACTS
  { name: "View Contacts", slug: "contact.view", module: "CONTACTS" },
  { name: "Assign Contacts", slug: "contact.assign", module: "CONTACTS" }, 
  { name: "Resolve Contacts", slug: "contact.resolve", module: "CONTACTS" },
  { name: "Delete Contacts", slug: "contact.delete", module: "CONTACTS" },

  // ADVANCED
  { name: "Manage SEO", slug: "seo.manage", module: "SEO" },
  { name: "Manage Settings", slug: "settings.manage", module: "SETTINGS" },

  // ADMIN (Users)
  { name: "View Users", slug: "user.view", module: "USERS" },
  { name: "Create User", slug: "user.create", module: "USERS" },
  { name: "Edit User", slug: "user.edit", module: "USERS" },
  { name: "Suspend User", slug: "user.suspend", module: "USERS" },

  // ROLES
  { name: "View Roles", slug: "role.view", module: "ROLES" },
  { name: "Create Role", slug: "role.create", module: "ROLES" },
  { name: "Edit Role", slug: "role.edit", module: "ROLES" },
  { name: "Delete Role", slug: "role.delete", module: "ROLES" },
  { name: "Delete User", slug: "user.delete", module: "USERS" },

  //CONTACT-FORMS
  { name: "View Contact Forms", slug: "contact_form.view", module: "CONTACT_FORMS" },
  { name: "Create Contact Form", slug: "contact_form.create", module: "CONTACT_FORMS" },
  { name: "Edit Contact Form", slug: "contact_form.edit", module: "CONTACT_FORMS" },
  { name: "Delete Contact Form", slug: "contact_form.delete", module: "CONTACT_FORMS" },
];

async function main() {
  console.log("Seeding started...");

  // System Roles
  const superAdminRole = await prisma.systemRole.upsert({
    where: { slug: "SUPER_ADMIN" },
    update: {},
    create: { name: "Super Admin", slug: "SUPER_ADMIN", description: "Highest level system administrator" },
  });

  const adminRole = await prisma.systemRole.upsert({
    where: { slug: "ADMIN" },
    update: {},
    create: { name: "Admin", slug: "ADMIN", description: "Administrative user" },
  });

  const userRole = await prisma.systemRole.upsert({
    where: { slug: "USER" },
    update: {},
    create: { name: "User", slug: "USER", description: "Regular platform user" },
  });
  console.log("System roles seeded");

  // Permissions 
  await prisma.$transaction(
    PERMISSIONS.map((perm) =>
      prisma.permission.upsert({
        where: { slug: perm.slug },
        update: { name: perm.name, module: perm.module },
        create: perm,
      })
    )
  );
  console.log("Permissions seeded (via $transaction)");

  // Super Admin User Initialization
  let existingSuperAdmin = await prisma.user.findUnique({
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

  const defaultContactFormId = "cmqzjpzfz0000t00s7pd31okk"; 
  
  const defaultForm = await prisma.contactForm.upsert({
    where: { slug: "main-contact" },
    update: {},
    create: {
      id: defaultContactFormId,
      name: "Main Contact Page",
      slug: "main-contact",
      successMessage: "Thank you! Your submission has been successfully processed. We will get back to you soon.",
      notifyEmails: ["dipendu.ideaptdigital@gmail.com"], 
      isActive: true,
    }
  });
  console.log(`Default Contact Form seeded with ID: ${defaultForm.id}`);

  console.log("Seeding completely finished.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });