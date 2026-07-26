/**
 * FinTrack Pro — Cloudinary Cloud Storage Abstraction
 * 
 * Provides signed upload signatures, document optimization, image CDN transformation,
 * and invoice/receipt storage.
 */

export interface SignedUploadParams {
  folder?: string;
  tags?: string[];
  transformation?: string;
}

export interface UploadSignatureResult {
  signature: string;
  timestamp: number;
  apiKey: string;
  cloudName: string;
  folder: string;
  uploadUrl: string;
}

export class CloudinaryStorageService {
  private static instance: CloudinaryStorageService;

  private constructor() {}

  public static getInstance(): CloudinaryStorageService {
    if (!CloudinaryStorageService.instance) {
      CloudinaryStorageService.instance = new CloudinaryStorageService();
    }
    return CloudinaryStorageService.instance;
  }

  /**
   * Generates signed parameters for direct secure client uploads to Cloudinary CDN.
   */
  public generateSignedUploadParams(params?: SignedUploadParams): UploadSignatureResult {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = params?.folder || 'fintrack_documents';
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'fintrack-demo';
    const apiKey = process.env.CLOUDINARY_API_KEY || 'demo_key';
    const apiSecret = process.env.CLOUDINARY_API_SECRET || 'demo_secret';

    const crypto = require('crypto');
    const signatureStr = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = crypto.createHash('sha1').update(signatureStr).digest('hex');

    return {
      signature,
      timestamp,
      apiKey,
      cloudName,
      folder,
      uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
    };
  }

  /**
   * Generates CDN transformation URLs for invoices, profile avatars, and receipts.
   */
  public getOptimizedUrl(publicId: string, options?: { width?: number; height?: number; format?: string }): string {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME || 'fintrack-demo';
    const width = options?.width || 800;
    const format = options?.format || 'webp';
    return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width},f_${format},q_auto/${publicId}`;
  }
}

export const cloudinaryStorage = CloudinaryStorageService.getInstance();
