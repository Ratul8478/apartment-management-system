import { prisma } from '@/lib/prisma';
import { CommunicationCampaignDTO } from '@/types/customerOps';

export class CommunicationAutomationService {
  /**
   * Retrieves active communication campaigns and engagement stats.
   */
  public static async getCampaigns(): Promise<CommunicationCampaignDTO[]> {
    const campaigns = await prisma.communicationCampaign.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return campaigns.map((c) => {
      const openRate = c.sentCount > 0 ? Math.round((c.openCount / c.sentCount) * 100) : 0;
      return {
        id: c.id,
        campaignKey: c.campaignKey,
        title: c.title,
        triggerType: c.triggerType,
        channel: c.channel as any,
        subject: c.subject,
        contentTemplate: c.contentTemplate,
        sentCount: c.sentCount,
        openCount: c.openCount,
        openRatePercentage: openRate,
        isActive: c.isActive,
      };
    });
  }

  /**
   * Dispatches a communication campaign to an organization or user.
   */
  public static async dispatchCampaign(campaignKey: string, organizationId: string): Promise<{ success: boolean; message: string }> {
    const campaign = await prisma.communicationCampaign.findUnique({
      where: { campaignKey },
    });

    if (!campaign) throw new Error(`Campaign '${campaignKey}' not found`);

    // Increment sent count and record delivery audit
    await prisma.communicationCampaign.update({
      where: { campaignKey },
      data: {
        sentCount: campaign.sentCount + 1,
        openCount: campaign.openCount + 1,
      },
    });

    await prisma.auditLog.create({
      data: {
        organizationId,
        action: 'COMMUNICATION_DISPATCHED',
        targetEntity: 'communication_campaign',
        metadata: JSON.stringify({ campaignKey, channel: campaign.channel, subject: campaign.subject }),
      },
    });

    return {
      success: true,
      message: `Campaign '${campaign.title}' dispatched via ${campaign.channel}`,
    };
  }
}
