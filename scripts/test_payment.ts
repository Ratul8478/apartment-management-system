import { prisma } from '../src/lib/prisma';
import { PaymentGatewayService } from '../src/server/services/paymentGatewayService';
import { PaymentGatewayProvider } from '../src/types/billing';

async function main() {
  console.log('--- Testing Stripe Payment Gateway & Real-time Balance Settlement ---');

  // 1. Find or create an Organization
  let org = await prisma.organization.findFirst();
  if (!org) {
    org = await prisma.organization.create({
      data: {
        name: 'Test Payment Org',
        slug: `test-org-${Date.now()}`,
      },
    });
  }
  console.log(`Using Organization: ${org.name} (${org.id})`);

  // 2. Find or create a draft BillingInvoice
  let invoice = await prisma.billingInvoice.findFirst({
    where: { organizationId: org.id, status: 'DRAFT' },
  });

  if (!invoice) {
    invoice = await prisma.billingInvoice.create({
      data: {
        invoiceNumber: `INV-TEST-${Date.now().toString().slice(-6)}`,
        organizationId: org.id,
        status: 'DRAFT',
        periodStart: new Date(),
        periodEnd: new Date(),
        subtotal: 250.00,
        taxTotal: 0,
        total: 250.00,
        amountRemaining: 250.00,
        currency: 'USD',
        dueDate: new Date(Date.now() + 86400000 * 7),
      },
    });
  }
  console.log(`Target Invoice: ${invoice.invoiceNumber} | Amount: $${invoice.total} | Status: ${invoice.status}`);

  // 3. Execute Payment Process via PaymentGatewayService
  const idempotencyKey = `test_ik_${Date.now()}`;
  console.log(`Processing Stripe payment with Idempotency Key: ${idempotencyKey}...`);

  const paymentResult = await PaymentGatewayService.processPayment({
    organizationId: org.id,
    invoiceId: invoice.id,
    gateway: PaymentGatewayProvider.STRIPE,
    idempotencyKey,
  });

  console.log('\n--- Payment Process Result ---');
  console.log('Success:', paymentResult.success);
  console.log('Transaction ID:', paymentResult.transactionId);
  console.log('Message:', paymentResult.message);

  // 4. Verify Invoice state after payment
  const updatedInvoice = await prisma.billingInvoice.findUnique({
    where: { id: invoice.id },
  });
  console.log('\n--- Verified Invoice Status ---');
  console.log('New Invoice Status:', updatedInvoice?.status);
  console.log('Amount Paid:', updatedInvoice?.amountPaid.toString());
  console.log('Amount Remaining:', updatedInvoice?.amountRemaining.toString());

  // 5. Verify Inter-Company Balancing Finance Record
  const balancingRecord = await prisma.financeRecord.findFirst({
    where: {
      organizationId: org.id,
      source: 'ERP_SYNC',
    },
    orderBy: { createdAt: 'desc' },
  });
  console.log('\n--- Verified Inter-Company Ledger Balancing Record ---');
  console.log('Record ID:', balancingRecord?.id);
  console.log('Metric Type:', balancingRecord?.metricType);
  console.log('Amount:', balancingRecord?.amount.toString());
  console.log('Currency:', balancingRecord?.currency);
  console.log('Record Date:', balancingRecord?.recordDate);

  if (paymentResult.success && updatedInvoice?.status === 'PAID' && balancingRecord) {
    console.log('\n✅ TEST PASSED: Payment engine & inter-company balance settlement working perfectly!');
  } else {
    console.log('\n❌ TEST FAILED: Validation mismatch');
  }

  await prisma.$disconnect();
}

main().catch((err) => {
  console.error('Test Execution Error:', err);
  process.exit(1);
});
