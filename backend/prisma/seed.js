const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding DesignMind AI database...\n');

  // ==================== DEMO USERS ====================
  const password = await bcrypt.hash('password123', 12);

  const users = [
    {
      email: 'admin@designmind.ai',
      password,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      isVerified: true,
      isActive: true,
    },
    {
      email: 'designer@designmind.ai',
      password,
      firstName: 'Sarah',
      lastName: 'Chen',
      role: 'DESIGNER',
      isVerified: true,
      isActive: true,
    },
    {
      email: 'freelancer@designmind.ai',
      password,
      firstName: 'Alex',
      lastName: 'Rivera',
      role: 'FREELANCER',
      isVerified: true,
      isActive: true,
    },
    {
      email: 'agency@designmind.ai',
      password,
      firstName: 'James',
      lastName: 'Mitchell',
      role: 'AGENCY_OWNER',
      isVerified: true,
      isActive: true,
    },
    {
      email: 'marketing@designmind.ai',
      password,
      firstName: 'Emily',
      lastName: 'Johnson',
      role: 'MARKETING_TEAM',
      isVerified: true,
      isActive: true,
    },
    {
      email: 'creator@designmind.ai',
      password,
      firstName: 'Mike',
      lastName: 'Thompson',
      role: 'CONTENT_CREATOR',
      isVerified: true,
      isActive: true,
    },
  ];

  for (const userData of users) {
    const user = await prisma.user.upsert({
      where: { email: userData.email },
      update: {},
      create: {
        ...userData,
        profile: {
          create: {
            bio: `Demo ${userData.role.toLowerCase().replace('_', ' ')} account`,
            company: 'DesignMind AI',
            location: 'San Francisco, CA',
          },
        },
        subscription: {
          create: {
            plan: userData.role === 'ADMIN' ? 'ENTERPRISE' : userData.role === 'AGENCY_OWNER' ? 'PROFESSIONAL' : 'STARTER',
            aiCredits: userData.role === 'ADMIN' ? 9999 : userData.role === 'AGENCY_OWNER' ? 500 : 100,
            maxProjects: userData.role === 'ADMIN' ? 999 : userData.role === 'AGENCY_OWNER' ? 50 : 15,
          },
        },
      },
    });
    console.log(`  ✅ User: ${user.email} (${userData.role})`);
  }

  // ==================== DEMO PROJECTS ====================
  const designer = await prisma.user.findUnique({ where: { email: 'designer@designmind.ai' } });

  const projectsData = [
    { name: 'Coffee Shop Rebrand', description: 'Complete rebrand for an artisan coffee shop', category: 'Branding' },
    { name: 'Tech Startup Launch', description: 'Launch materials for a new SaaS product', category: 'Marketing' },
    { name: 'Fashion E-commerce', description: 'Social media campaign for fashion brand', category: 'Social Media' },
    { name: 'Restaurant Menu Design', description: 'Premium menu design for fine dining', category: 'Print' },
    { name: 'YouTube Channel Assets', description: 'Thumbnails and banners for tech review channel', category: 'Video' },
  ];

  for (const projData of projectsData) {
    await prisma.project.upsert({
      where: { id: 0 }, // Forces create
      update: {},
      create: { userId: designer.id, ...projData },
    }).catch(async () => {
      await prisma.project.create({ data: { userId: designer.id, ...projData } });
    });
  }
  console.log(`  ✅ Created ${projectsData.length} demo projects`);

  // ==================== DEMO TEMPLATES ====================
  const templates = [
    { name: 'Instagram Post - Modern', description: 'Clean modern Instagram post template', category: 'Social Media', type: 'SOCIAL_MEDIA', isPremium: false, isFeatured: true },
    { name: 'Business Logo - Minimal', description: 'Minimalist business logo template', category: 'Logo', type: 'LOGO', isPremium: false, isFeatured: true },
    { name: 'Event Poster - Neon', description: 'Vibrant neon-themed event poster', category: 'Poster', type: 'POSTER', isPremium: true, isFeatured: true },
    { name: 'YouTube Thumbnail - Bold', description: 'Eye-catching YouTube thumbnail', category: 'Thumbnail', type: 'THUMBNAIL', isPremium: false, isFeatured: false },
    { name: 'Facebook Ad - Product', description: 'Product showcase Facebook ad template', category: 'Ads', type: 'AD_CREATIVE', isPremium: true, isFeatured: true },
    { name: 'LinkedIn Banner - Corporate', description: 'Professional LinkedIn banner', category: 'Banner', type: 'BANNER', isPremium: false, isFeatured: false },
    { name: 'Brand Identity Kit', description: 'Complete brand identity package', category: 'Branding', type: 'BRAND_IDENTITY', isPremium: true, isFeatured: true },
    { name: 'Presentation - Startup Pitch', description: 'Modern startup pitch deck template', category: 'Presentation', type: 'PRESENTATION', isPremium: true, isFeatured: false },
  ];

  for (const tmpl of templates) {
    await prisma.template.create({ data: tmpl });
  }
  console.log(`  ✅ Created ${templates.length} demo templates`);

  console.log('\n🎉 Seed completed successfully!');
  console.log('\n📋 Demo Accounts (password: password123):');
  console.log('   admin@designmind.ai       - Admin');
  console.log('   designer@designmind.ai    - Designer');
  console.log('   freelancer@designmind.ai  - Freelancer');
  console.log('   agency@designmind.ai      - Agency Owner');
  console.log('   marketing@designmind.ai   - Marketing Team');
  console.log('   creator@designmind.ai     - Content Creator');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
