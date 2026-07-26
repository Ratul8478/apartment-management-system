import { TransactionClient } from './transaction';
import { prismaClient } from './client';

/**
 * FinTrack Pro — Enterprise Base Repository Abstraction
 * 
 * Implements the Repository Pattern, isolating application business services from
 * underlying ORM mechanics (Prisma Client). Provides standard data access operations,
 * soft-deletion filtering, pagination math, and transaction propagation hooks.
 */

export interface PaginationOptions {
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  meta: {
    totalRecords: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

export interface IBaseRepository<T> {
  findById(id: string, tx?: TransactionClient): Promise<T | null>;
  findMany(where?: Record<string, unknown>, tx?: TransactionClient): Promise<T[]>;
  paginate(
    where?: Record<string, unknown>,
    options?: PaginationOptions,
    tx?: TransactionClient
  ): Promise<PaginatedResult<T>>;
  create(data: Record<string, unknown>, tx?: TransactionClient): Promise<T>;
  update(id: string, data: Record<string, unknown>, tx?: TransactionClient): Promise<T>;
  softDelete(id: string, tx?: TransactionClient): Promise<boolean>;
  delete(id: string, tx?: TransactionClient): Promise<boolean>;
  count(where?: Record<string, unknown>, tx?: TransactionClient): Promise<number>;
}

/**
 * Generic Abstract Base Repository class.
 * Concrete domain repositories extend this class, specifying the Prisma model delegate name.
 */
export abstract class BaseRepository<T extends { id: string }> implements IBaseRepository<T> {
  protected abstract readonly modelName: string;

  /**
   * Helper to retrieve either the active transaction client or default singleton Prisma Client.
   */
  protected getClient(tx?: TransactionClient): TransactionClient {
    return tx || (prismaClient as unknown as TransactionClient);
  }

  /**
   * Helper to access the dynamic model delegate on Prisma Client.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  protected getModel(tx?: TransactionClient): any {
    const client = this.getClient(tx);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (client as any)[this.modelName];
  }

  public async findById(id: string, tx?: TransactionClient): Promise<T | null> {
    const model = this.getModel(tx);
    return await model.findUnique({
      where: { id },
    });
  }

  public async findMany(where: Record<string, unknown> = {}, tx?: TransactionClient): Promise<T[]> {
    const model = this.getModel(tx);
    return await model.findMany({
      where: {
        deletedAt: null, // Default active soft delete filter
        ...where,
      },
    });
  }

  public async paginate(
    where: Record<string, unknown> = {},
    options: PaginationOptions = {},
    tx?: TransactionClient
  ): Promise<PaginatedResult<T>> {
    const { page = 1, pageSize = 20, sortBy = 'createdAt', sortOrder = 'desc' } = options;

    const validatedPage = Math.max(1, page);
    const validatedPageSize = Math.min(100, Math.max(1, pageSize));
    const skip = (validatedPage - 1) * validatedPageSize;

    const queryWhere = {
      deletedAt: null,
      ...where,
    };

    const model = this.getModel(tx);

    const [data, totalRecords] = await Promise.all([
      model.findMany({
        where: queryWhere,
        skip,
        take: validatedPageSize,
        orderBy: {
          [sortBy]: sortOrder,
        },
      }),
      model.count({ where: queryWhere }),
    ]);

    const totalPages = Math.ceil(totalRecords / validatedPageSize);

    return {
      data,
      meta: {
        totalRecords,
        page: validatedPage,
        pageSize: validatedPageSize,
        totalPages,
        hasNextPage: validatedPage < totalPages,
        hasPreviousPage: validatedPage > 1,
      },
    };
  }

  public async create(data: Record<string, unknown>, tx?: TransactionClient): Promise<T> {
    const model = this.getModel(tx);
    return await model.create({
      data,
    });
  }

  public async update(id: string, data: Record<string, unknown>, tx?: TransactionClient): Promise<T> {
    const model = this.getModel(tx);
    return await model.update({
      where: { id },
      data,
    });
  }

  public async softDelete(id: string, tx?: TransactionClient): Promise<boolean> {
    const model = this.getModel(tx);
    try {
      await model.update({
        where: { id },
        data: {
          deletedAt: new Date(),
        },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async delete(id: string, tx?: TransactionClient): Promise<boolean> {
    const model = this.getModel(tx);
    try {
      await model.delete({
        where: { id },
      });
      return true;
    } catch {
      return false;
    }
  }

  public async count(where: Record<string, unknown> = {}, tx?: TransactionClient): Promise<number> {
    const model = this.getModel(tx);
    return await model.count({
      where: {
        deletedAt: null,
        ...where,
      },
    });
  }
}
