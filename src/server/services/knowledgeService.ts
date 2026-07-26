import { prisma } from '@/lib/prisma';
import { KnowledgeArticleDTO } from '@/types/customerOps';

export class KnowledgeService {
  /**
   * Searches or retrieves published Knowledge Base articles.
   */
  public static async searchArticles(params: {
    query?: string;
    category?: string;
  }): Promise<KnowledgeArticleDTO[]> {
    const { query, category } = params;

    const articles = await prisma.knowledgeArticle.findMany({
      where: {
        isPublished: true,
        ...(category ? { category } : {}),
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: 'insensitive' } },
                { content: { contains: query, mode: 'insensitive' } },
              ],
            }
          : {}),
      },
      orderBy: { views: 'desc' },
    });

    return articles.map((a) => this.mapToDTO(a));
  }

  /**
   * Retrieves single article by slug and increments views count.
   */
  public static async getArticleBySlug(slug: string): Promise<KnowledgeArticleDTO | null> {
    const article = await prisma.knowledgeArticle.findUnique({
      where: { slug },
    });

    if (!article) return null;

    // Increment view count asynchronously
    await prisma.knowledgeArticle.update({
      where: { slug },
      data: { views: article.views + 1 },
    });

    return this.mapToDTO({ ...article, views: article.views + 1 });
  }

  /**
   * Records helpfulness vote for an article.
   */
  public static async voteHelpful(slug: string): Promise<void> {
    await prisma.knowledgeArticle.update({
      where: { slug },
      data: { helpfulCount: { increment: 1 } },
    });
  }

  private static mapToDTO(a: any): KnowledgeArticleDTO {
    return {
      id: a.id,
      slug: a.slug,
      title: a.title,
      category: a.category,
      content: a.content,
      views: a.views,
      helpfulCount: a.helpfulCount,
      isPublished: a.isPublished,
    };
  }
}
