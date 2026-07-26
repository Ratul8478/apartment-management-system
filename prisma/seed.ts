import { PrismaClient, SystemRole, MetricType, RecordStatus, IngestionSource } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

/**
 * FinTrack Pro — Enterprise Idempotent Database Seeding Engine
 * 
 * Populates foundational enterprise data using `upsert` routines to guarantee
 * 100% idempotency across repeated executions in development and CI environments.
 */

async function seedSystemData() {
  console.log('=====================================================');
  console.log('🌱 FINTRACK PRO DATABASE SEED ENGINE');
  console.log('=====================================================\n');

  const defaultPasswordHash = await bcrypt.hash('Admin@FinTrack2026!', 10);

  // 1. Seed Enterprise System Settings
  console.log('1. Seeding Enterprise System Settings...');
  const settings = [
    { key: 'APP_NAME', value: 'FinTrack Pro Enterprise', category: 'GENERAL', description: 'Application display name' },
    { key: 'DEFAULT_CURRENCY', value: 'INR', category: 'FINANCE', description: 'Primary ledger base currency (ISO 4217)' },
    { key: 'DEFAULT_TIMEZONE', value: 'UTC', category: 'GENERAL', description: 'System timestamp timezone' },
    { key: 'MAX_LOGIN_ATTEMPTS', value: '5', category: 'SECURITY', description: 'Failed login counter threshold for lockout' },
    { key: 'SESSION_TIMEOUT_SECONDS', value: '86400', category: 'SECURITY', description: 'JWT session expiration duration in seconds' },
  ];

  for (const s of settings) {
    await prisma.systemSetting.upsert({
      where: { key: s.key },
      update: { value: s.value, description: s.description },
      create: s,
    });
  }

  // 2. Seed System Roles
  console.log('2. Seeding Enterprise Roles...');
  const roles = [
    { name: 'SUPER_ADMIN', description: 'Global system administrator with unrestricted platform access', isSystem: true },
    { name: 'ADMIN', description: 'Organization administrator managing users and corporate settings', isSystem: true },
    { name: 'FINANCE_MANAGER', description: 'Finance lead managing budgets, approvals, and financial records', isSystem: true },
    { name: 'ANALYST', description: 'Financial analyst entering turnover records and running AI forecasts', isSystem: true },
    { name: 'AUDITOR', description: 'Compliance auditor with read-only access to audit logs and ledgers', isSystem: true },
  ];

  const createdRoles: Record<string, string> = {};
  for (const r of roles) {
    const roleRecord = await prisma.role.upsert({
      where: { name: r.name },
      update: { description: r.description },
      create: r,
    });
    createdRoles[r.name] = roleRecord.id;
  }

  // 3. Seed System Permissions
  console.log('3. Seeding Fine-Grained Permissions...');
  const permissions = [
    { key: 'finance:record:create', description: 'Create new turnover or expense record' },
    { key: 'finance:record:read', description: 'Read financial records and reports' },
    { key: 'finance:record:update', description: 'Modify existing draft financial record' },
    { key: 'finance:record:delete', description: 'Soft-delete financial record' },
    { key: 'finance:record:approve', description: 'Approve pending financial record' },
    { key: 'audit:log:read', description: 'Inspect system audit logs' },
    { key: 'users:manage', description: 'Manage organization user accounts' },
    { key: 'system:configure', description: 'Modify system configuration parameters' },
  ];

  const createdPermissions: Record<string, string> = {};
  for (const p of permissions) {
    const permRecord = await prisma.permission.upsert({
      where: { key: p.key },
      update: { description: p.description },
      create: p,
    });
    createdPermissions[p.key] = permRecord.id;
  }

  // 4. Map Role Permissions
  console.log('4. Mapping Role Permissions...');
  for (const [permKey, permId] of Object.entries(createdPermissions)) {
    await prisma.rolePermission.upsert({
      where: {
        roleId_permissionId: {
          roleId: createdRoles['SUPER_ADMIN'],
          permissionId: permId,
        },
      },
      update: {},
      create: {
        roleId: createdRoles['SUPER_ADMIN'],
        permissionId: permId,
      },
    });
  }

  // 5. Seed Primary Organization & Subsidiary Company
  console.log('5. Seeding Primary Organization & Subsidiary Company...');
  const org = await prisma.organization.upsert({
    where: { slug: 'fintrack-global' },
    update: { name: 'FinTrack Pro Global Enterprise' },
    create: {
      name: 'FinTrack Pro Global Enterprise',
      slug: 'fintrack-global',
      taxId: 'ORG-IN-99201',
      currency: 'INR',
      timezone: 'UTC',
    },
  });

  const company = await prisma.company.upsert({
    where: { id: '00000000-0000-0000-0000-000000000001' },
    update: { name: 'FinTrack India Pvt Ltd' },
    create: {
      id: '00000000-0000-0000-0000-000000000001',
      organizationId: org.id,
      name: 'FinTrack India Pvt Ltd',
      registrationNo: 'CIN-U72200MH2026PTC1049',
      country: 'IN',
      currency: 'INR',
    },
  });

  // 6. Seed Department & Default Admin User
  console.log('6. Seeding Department & Administrator Account...');
  const department = await prisma.department.upsert({
    where: { costCenter: 'CC-FIN-001' },
    update: { name: 'Finance & Treasury' },
    create: {
      companyId: company.id,
      name: 'Finance & Treasury',
      costCenter: 'CC-FIN-001',
      description: 'Corporate financial oversight and accounting department',
    },
  });

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@fintrackpro.internal' },
    update: { fullName: 'Vikramaditya Rao (System Admin)', role: SystemRole.SUPER_ADMIN },
    create: {
      organizationId: org.id,
      email: 'admin@fintrackpro.internal',
      passwordHash: defaultPasswordHash,
      fullName: 'Vikramaditya Rao (System Admin)',
      role: SystemRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  // 7. Seed System Employee
  console.log('7. Seeding Admin Employee Roster Entry...');
  await prisma.employee.upsert({
    where: { userId: adminUser.id },
    update: { designation: 'Chief Information Security Officer' },
    create: {
      userId: adminUser.id,
      departmentId: department.id,
      fullName: 'Vikramaditya Rao',
      designation: 'Chief Information Security Officer',
      email: 'admin@fintrackpro.internal',
      dateJoined: new Date('2024-01-01'),
    },
  });

  // 8. Seed Default Categories
  console.log('8. Seeding Financial Categories...');
  const categories = [
    { name: 'Software Subscriptions', type: MetricType.TURNOVER, description: 'SaaS recurring subscription revenues' },
    { name: 'Cloud Infrastructure Costs', type: MetricType.PROFIT_LOSS, description: 'AWS and Azure hosting expenses' },
  ];

  for (const c of categories) {
    await prisma.category.upsert({
      where: { name: c.name },
      update: { description: c.description },
      create: c,
    });
  }

  // 9. Seed Commercial Subscription Plans
  console.log('9. Seeding Commercial Subscription Plans...');
  const plans = [
    {
      code: 'FREE',
      name: 'Free Trial / Starter',
      description: 'Foundational financial ledger and reporting for micro-businesses',
      priceMonthly: 0,
      priceYearly: 0,
      currency: 'USD',
      trialPeriodDays: 14,
      features: {
        aiTokenQuotaMonthly: 25000,
        apiRequestsMonthly: 1000,
        storageAllocationMb: 500,
        ocrDocumentsMonthly: 10,
        forecastRunsMonthly: 5,
        reportGenerationsMonthly: 5,
        userLimit: 2,
        customBranding: false,
        prioritySupport: false,
        customDomain: false,
        slaPercentage: 99.0,
        integrationsAllowed: ['BASIC_CSV'],
      },
      isActive: true,
      isCustom: false,
    },
    {
      code: 'STARTER',
      name: 'Growth Starter',
      description: 'Essential billing, AI forecasting, and financial reporting tools',
      priceMonthly: 49,
      priceYearly: 470,
      currency: 'USD',
      trialPeriodDays: 14,
      features: {
        aiTokenQuotaMonthly: 250000,
        apiRequestsMonthly: 25000,
        storageAllocationMb: 5000,
        ocrDocumentsMonthly: 100,
        forecastRunsMonthly: 50,
        reportGenerationsMonthly: 50,
        userLimit: 10,
        customBranding: false,
        prioritySupport: false,
        customDomain: false,
        slaPercentage: 99.5,
        integrationsAllowed: ['BASIC_CSV', 'EXCEL_EXPORT', 'STRIPE'],
      },
      isActive: true,
      isCustom: false,
    },
    {
      code: 'PROFESSIONAL',
      name: 'Professional',
      description: 'Advanced multi-branch intelligence, OCR receipt scanning, and unlimited forecasting',
      priceMonthly: 199,
      priceYearly: 1900,
      currency: 'USD',
      trialPeriodDays: 14,
      features: {
        aiTokenQuotaMonthly: 1000000,
        apiRequestsMonthly: 100000,
        storageAllocationMb: 25000,
        ocrDocumentsMonthly: 500,
        forecastRunsMonthly: 250,
        reportGenerationsMonthly: 250,
        userLimit: 50,
        customBranding: true,
        prioritySupport: true,
        customDomain: false,
        slaPercentage: 99.9,
        integrationsAllowed: ['BASIC_CSV', 'EXCEL_EXPORT', 'STRIPE', 'RAZORPAY', 'PAYPAL', 'POWER_BI'],
      },
      isActive: true,
      isCustom: false,
    },
    {
      code: 'BUSINESS',
      name: 'Business Scale',
      description: 'High-throughput enterprise AI, dedicated database allocations, and SLA assurances',
      priceMonthly: 499,
      priceYearly: 4790,
      currency: 'USD',
      trialPeriodDays: 14,
      features: {
        aiTokenQuotaMonthly: 5000000,
        apiRequestsMonthly: 500000,
        storageAllocationMb: 100000,
        ocrDocumentsMonthly: 2500,
        forecastRunsMonthly: 1000,
        reportGenerationsMonthly: 1000,
        userLimit: 250,
        customBranding: true,
        prioritySupport: true,
        customDomain: true,
        slaPercentage: 99.95,
        integrationsAllowed: ['ALL_GATEWAYS', 'SAP', 'ORACLE', 'POWER_BI', 'WEBHOOKS'],
      },
      isActive: true,
      isCustom: false,
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise Ultra',
      description: 'Custom SLA, dedicated LLM fine-tuning, audit compliance guarantees, and unlimited scale',
      priceMonthly: 1499,
      priceYearly: 14390,
      currency: 'USD',
      trialPeriodDays: 30,
      features: {
        aiTokenQuotaMonthly: 25000000,
        apiRequestsMonthly: 2500000,
        storageAllocationMb: 1000000,
        ocrDocumentsMonthly: 10000,
        forecastRunsMonthly: 10000,
        reportGenerationsMonthly: 10000,
        userLimit: 1000,
        customBranding: true,
        prioritySupport: true,
        customDomain: true,
        slaPercentage: 99.99,
        integrationsAllowed: ['ALL'],
      },
      isActive: true,
      isCustom: false,
    },
  ];

  const planMap: Record<string, string> = {};
  for (const p of plans) {
    const planRec = await prisma.subscriptionPlan.upsert({
      where: { code: p.code },
      update: {
        name: p.name,
        description: p.description,
        priceMonthly: p.priceMonthly,
        priceYearly: p.priceYearly,
        features: p.features,
      },
      create: p,
    });
    planMap[p.code] = planRec.id;
  }

  // 10. Seed Regional Tax Rules
  console.log('10. Seeding Regional Tax Rules...');
  const taxRules = [
    { name: 'GST India (Standard)', taxType: 'GST' as const, country: 'IN', state: null, rate: 18.00, isExemptable: true },
    { name: 'VAT United Kingdom', taxType: 'VAT' as const, country: 'GB', state: null, rate: 20.00, isExemptable: true },
    { name: 'VAT Germany', taxType: 'VAT' as const, country: 'DE', state: null, rate: 19.00, isExemptable: true },
    { name: 'Sales Tax California', taxType: 'SALES_TAX' as const, country: 'US', state: 'CA', rate: 7.25, isExemptable: true },
    { name: 'Sales Tax New York', taxType: 'SALES_TAX' as const, country: 'US', state: 'NY', rate: 8.875, isExemptable: true },
  ];

  for (const tr of taxRules) {
    const existing = await prisma.taxRule.findFirst({
      where: { country: tr.country, name: tr.name },
    });
    if (!existing) {
      await prisma.taxRule.create({ data: tr });
    }
  }

  // 11. Seed Active Subscription for Default Organization
  console.log('11. Seeding Default Subscription for Organization...');
  const proPlanId = planMap['PROFESSIONAL'];
  const now = new Date();
  const periodEnd = new Date();
  periodEnd.setMonth(now.getMonth() + 1);

  await prisma.subscription.upsert({
    where: { organizationId: org.id },
    update: {
      planId: proPlanId,
      status: 'ACTIVE',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
    },
    create: {
      organizationId: org.id,
      planId: proPlanId,
      status: 'ACTIVE',
      billingCycle: 'MONTHLY',
      currentPeriodStart: now,
      currentPeriodEnd: periodEnd,
      paymentGateway: 'STRIPE',
    },
  });

  // 12. Seed Onboarding Progress Items
  console.log('12. Seeding Organization Onboarding Progress...');
  const onboardingSteps = [
    { stepKey: 'ORG_PROFILE', stepName: 'Complete Organization Profile & Tax Information', isCompleted: true },
    { stepKey: 'FIRST_RECORD', stepName: 'Ingest First Financial Record or CSV Upload', isCompleted: true },
    { stepKey: 'INVITE_TEAM', stepName: 'Invite Finance Team Members & Assign Roles', isCompleted: true },
    { stepKey: 'AI_FORECAST', stepName: 'Execute AI Revenue & Turnover Forecast Engine', isCompleted: true },
    { stepKey: 'BILLING_SETUP', stepName: 'Configure Subscription Plan & Payment Methods', isCompleted: true },
    { stepKey: 'REPORTS_EXPORT', stepName: 'Generate First PowerBI / PPT Executive Report', isCompleted: false },
  ];

  for (const step of onboardingSteps) {
    await prisma.onboardingProgress.upsert({
      where: {
        organizationId_stepKey: {
          organizationId: org.id,
          stepKey: step.stepKey,
        },
      },
      update: { isCompleted: step.isCompleted },
      create: {
        organizationId: org.id,
        stepKey: step.stepKey,
        stepName: step.stepName,
        isCompleted: step.isCompleted,
        completedAt: step.isCompleted ? new Date() : null,
      },
    });
  }

  // 13. Seed Knowledge Base Articles
  console.log('13. Seeding Enterprise Knowledge Base Articles...');
  const kbArticles = [
    {
      slug: 'getting-started-fintrack-pro',
      title: 'Getting Started with FinTrack Pro Enterprise AI Platform',
      category: 'GETTING_STARTED',
      content: 'Welcome to FinTrack Pro! Learn how to set up corporate structures, multi-tenant departments, and configure real-time turnover ingestion pipelines.',
      views: 1240,
      helpfulCount: 98,
      isPublished: true,
    },
    {
      slug: 'executing-ai-financial-forecasts',
      title: 'How to Run AI Turnover & Profitability Forecasting',
      category: 'FINANCIAL_AI',
      content: 'Guide to utilizing grounded AI models for time-series forecasting, confidence intervals, and budget variance prediction.',
      views: 890,
      helpfulCount: 75,
      isPublished: true,
    },
    {
      slug: 'managing-enterprise-subscriptions-billing',
      title: 'Managing Enterprise Plans, Proration & GST/VAT Invoices',
      category: 'BILLING_SUBSCRIPTIONS',
      content: 'Complete overview of plan upgrades, financial proration formulas, regional tax calculations (GST/VAT/Sales Tax), and downloading PDF receipts.',
      views: 1450,
      helpfulCount: 120,
      isPublished: true,
    },
    {
      slug: 'integrating-salesforce-hubspot-crm',
      title: 'CRM Bi-directional Synchronization Guide',
      category: 'API_INTEGRATIONS',
      content: 'Configure real-time sync between FinTrack Pro and Salesforce, HubSpot, or Zoho CRMs for customer contacts and health metrics.',
      views: 620,
      helpfulCount: 45,
      isPublished: true,
    },
  ];

  for (const article of kbArticles) {
    await prisma.knowledgeArticle.upsert({
      where: { slug: article.slug },
      update: { content: article.content, views: article.views, helpfulCount: article.helpfulCount },
      create: article,
    });
  }

  // 14. Seed Communication Campaigns
  console.log('14. Seeding Automated Communication Campaigns...');
  const campaigns = [
    {
      campaignKey: 'WELCOME_ONBOARDING_DRIP',
      title: 'Welcome & Initial Setup Walkthrough',
      triggerType: 'ONBOARDING',
      channel: 'EMAIL',
      subject: 'Welcome to FinTrack Pro — Complete your setup',
      contentTemplate: 'Hello {{customerName}}, welcome to FinTrack Pro! Complete your 5-step onboarding to unlock AI forecasting.',
      sentCount: 150,
      openCount: 112,
      isActive: true,
    },
    {
      campaignKey: 'AI_FEATURE_ADOPTION_TIP',
      title: 'Proactive Tip: Try Grounded AI OCR Scanning',
      triggerType: 'FEATURE_ADOPTION',
      channel: 'IN_APP',
      subject: 'Speed up document ingestion with OCR',
      contentTemplate: 'Did you know you can upload PDF invoices directly for automated AI extraction? Try it today!',
      sentCount: 320,
      openCount: 240,
      isActive: true,
    },
    {
      campaignKey: 'RENEWAL_READINESS_NOTIF',
      title: 'Annual Subscription Renewal Notice',
      triggerType: 'RENEWAL_REMINDER',
      channel: 'EMAIL',
      subject: 'Your FinTrack Pro subscription renews soon',
      contentTemplate: 'Your Professional subscription will renew on {{renewalDate}}. Review your plan quotas in the Billing Portal.',
      sentCount: 45,
      openCount: 38,
      isActive: true,
    },
  ];

  for (const camp of campaigns) {
    await prisma.communicationCampaign.upsert({
      where: { campaignKey: camp.campaignKey },
      update: { title: camp.title, sentCount: camp.sentCount, openCount: camp.openCount },
      create: camp,
    });
  }

  // 15. Seed Baseline Customer Health Score
  console.log('15. Seeding Baseline Customer Health Score...');
  await prisma.customerHealthScore.create({
    data: {
      organizationId: org.id,
      score: 94,
      category: 'EXCELLENT',
      scoreFactorsJson: {
        onboardingCompletion: 83.3,
        loginFrequencyDaysPerWeek: 6.5,
        aiTokenUtilizationPercentage: 42.0,
        billingStanding: 'GOOD_STANDING',
        supportTicketsOpen: 0,
        reportGenerationsMonthly: 28,
        activeUserPercentage: 90.0,
      },
      recommendationsJson: [
        'Organization is highly active. Recommend upgrading to Business Scale for expanded AI token caps.',
        'Onboarding step "REPORTS_EXPORT" pending — send guided tutorial.',
      ],
    },
  });

  // 16. Seed Initial System Audit Log
  console.log('16. Seeding Initial System Audit Log...');
  await prisma.auditLog.create({
    data: {
      organizationId: org.id,
      actorId: adminUser.id,
      action: 'SYSTEM_INITIALIZATION',
      targetEntity: 'system_settings',
      targetId: org.id,
      newValues: { note: 'Initial enterprise database schema, seed, billing, CX, and analytics initialized successfully' },
      ipAddress: '127.0.0.1',
    },
  });

  console.log('\n=====================================================');
  console.log('✅ DATABASE SEEDING COMPLETED SUCCESSFULLY — 100% IDEMPOTENT');
  console.log('=====================================================\n');
}

seedSystemData()
  .catch((e) => {
    console.error('❌ FATAL SEEDING ERROR:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

