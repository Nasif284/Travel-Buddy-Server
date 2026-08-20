import { inject, injectable } from 'tsyringe';
import { BaseRepository } from './base.repository';
import { Prisma } from '@prisma/client';
import {
  IVerificationRepository,
  UpdateVerificationAfterOcrRepositoryDTO,
  UpdateVerificationReviewRepositoryDTO,
} from '../../../application/interfaces/repositories/verificatiom.repository';
import { TOKENS } from '../../di/tokens';
import { PrismaClient } from '@prisma/client/extension';
import { SubmitVerificationRepositoryDTO } from '../../../application/dtos/profile/request/doc-verification.dto';
import { Verification } from '../../../application/dtos/profile/response/doc-verification.dto';
import { GetDocVerificationResponseDTO } from '../../../application/dtos/profile/response/get-doc-verification.dto';
import { GetVerificationQueueRequestDTO } from '../../../application/dtos/verifications/request/get-verification-queue.dto';
import { VerificationQueueItemDTO } from '../../../application/dtos/verifications/response/get-verification-queue.dto';
import {
  VerificationDetailsRepositoryResponse,
  VerificationProcessingProjection,
} from '../../../application/dtos/verifications/response/get-verification-details.dto';

@injectable()
export class VerificationRepository
  extends BaseRepository<
    Verification,
    Prisma.VerificationCreateArgs,
    Prisma.VerificationUpdateInput
  >
  implements IVerificationRepository
{
  constructor(@inject(TOKENS.PrismaClient) prisma: PrismaClient) {
    super(prisma, prisma.checklist);
  }
  async submitVerification(
    data: SubmitVerificationRepositoryDTO,
  ): Promise<Verification> {
    const verification = await this.prisma.$transaction(async (tx) => {
      const existing = await tx.verification.findFirst({
        where: {
          userId: data.userId,
        },
      });

      if (!existing) {
        const verification = await tx.verification.create({
          data: {
            userId: data.userId,
            documentTypeCode: data.documentTypeCode,
            statusCode: 'processing',
          },
        });

        await tx.verificationDocument.createMany({
          data: data.documents.map((document) => ({
            verificationId: verification.id,
            sideCode: document.sideCode,
            storageKey: document.storageKey,
            mimeType: document.mimeType,
            fileSize: document.fileSize,
          })),
        });

        await tx.verificationActivity.create({
          data: {
            verificationId: verification.id,
            actionCode: 'submitted',
          },
        });

        return verification;
      }

      await tx.verificationExtractedData.deleteMany({
        where: {
          verificationId: existing.id,
        },
      });

      await tx.verificationDocument.deleteMany({
        where: {
          verificationId: existing.id,
        },
      });

      const verification = await tx.verification.update({
        where: {
          id: existing.id,
        },
        data: {
          documentTypeCode: data.documentTypeCode,
          statusCode: 'processing',
          assignedReviewerId: null,
          reviewStartedAt: null,
          reviewedAt: null,
          reviewNotes: null,
          rejectionReason: null,
          resubmissionReason: null,
          overallRiskScore: null,
          ocrConfidence: null,
        },
      });

      await tx.verificationDocument.createMany({
        data: data.documents.map((document) => ({
          verificationId: verification.id,
          sideCode: document.sideCode,
          storageKey: document.storageKey,
          mimeType: document.mimeType,
          fileSize: document.fileSize,
        })),
      });

      await tx.verificationActivity.create({
        data: {
          verificationId: verification.id,
          actionCode: 'submitted',
        },
      });

      return verification;
    });

    return {
      id: verification.id,
      assignedReviewerId: verification.assignedReviewerId!,
      documentTypeCode: verification.documentTypeCode,
      statusCode: verification.statusCode,
      userId: verification.userId,
    };
  }

  async getMyVerification(
    userId: string,
  ): Promise<GetDocVerificationResponseDTO | null> {
    return await this.prisma.verification.findFirst({
      where: {
        userId,
      },
      include: {
        status: {
          select: {
            code: true,
            name: true,
          },
        },
        documentType: {
          select: {
            code: true,
            name: true,
          },
        },
      },
      orderBy: {
        submittedAt: 'desc',
      },
    });
  }
  async getVerificationQueue(dto: GetVerificationQueueRequestDTO): Promise<{
    items: VerificationQueueItemDTO[];
    total: number;
  }> {
    console.log(dto);
    const where: Prisma.VerificationWhereInput = {
      ...(dto.tab && {
        statusCode: dto.tab.toLocaleLowerCase(),
      }),
    };

    if (dto.search) {
      where.user = {
        OR: [
          {
            fullName: {
              contains: dto.search,
              mode: 'insensitive',
            },
          },
          {
            email: {
              contains: dto.search,
              mode: 'insensitive',
            },
          },
        ],
      };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.verification.findMany({
        where,

        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              avatarUrl: true,
            },
          },

          status: {
            select: {
              code: true,
              name: true,
            },
          },

          documentType: {
            select: {
              code: true,
              name: true,
            },
          },

          reviewer: {
            select: {
              id: true,
              fullName: true,
            },
          },
        },

        orderBy: {
          submittedAt: 'desc',
        },
        skip: (dto.page - 1) * dto.limit,
        take: dto.limit,
      }),

      this.prisma.verification.count({
        where,
      }),
    ]);

    return {
      items: items.map((verification) => ({
        verificationId: verification.id,

        user: {
          id: verification.user.id,
          fullName: verification.user.fullName,
          email: verification.user.email,
          profilePicture: verification.user.avatarUrl,
        },

        documentType: {
          code: verification.documentType.code,
          name: verification.documentType.name,
        },

        status: {
          code: verification.status.code,
          name: verification.status.name,
        },

        submittedAt: verification.submittedAt,
        assignedReviewer: verification.reviewer
          ? {
              id: verification.reviewer.id,
              fullName: verification.reviewer.fullName,
            }
          : null,
      })),
      total,
    };
  }
  async getVerificationDetails(
    verificationId: string,
  ): Promise<VerificationDetailsRepositoryResponse | null> {
    const verification = await this.prisma.verification.findUnique({
      where: {
        id: verificationId,
      },

      select: {
        id: true,

        submittedAt: true,
        reviewStartedAt: true,
        reviewedAt: true,

        reviewNotes: true,
        rejectionReason: true,
        resubmissionReason: true,

        overallRiskScore: true,
        ocrConfidence: true,

        status: {
          select: {
            code: true,
            name: true,
          },
        },

        documentType: {
          select: {
            code: true,
            name: true,
          },
        },

        reviewer: {
          select: {
            id: true,
            fullName: true,
          },
        },

        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phone: true,
            avatarUrl: true,

            createdAt: true,

            isEmailVerified: true,
            isPhoneVerified: true,
            isIdVerified: true,

            country: {
              select: {
                name: true,
              },
            },
          },
        },

        documents: {
          select: {
            id: true,
            storageKey: true,
            mimeType: true,
            width: true,
            height: true,

            side: {
              select: {
                code: true,
              },
            },
          },
        },

        extractedData: {
          select: {
            fullName: true,
            documentNumber: true,
            nationality: true,
            gender: true,
            dateOfBirth: true,
            expiryDate: true,
            issuingCountry: true,

            analysisSummary: true,
          },
        },

        activities: {
          orderBy: {
            createdAt: 'desc',
          },

          select: {
            id: true,
            createdAt: true,

            action: {
              select: {
                code: true,
                name: true,
              },
            },

            admin: {
              select: {
                fullName: true,
              },
            },
          },
        },
      },
    });

    if (!verification) {
      return null;
    }
    return {
      ...verification,
      overallRiskScore: verification.overallRiskScore?.toNumber() ?? null,
      ocrConfidence: verification.ocrConfidence?.toNumber() ?? null,
    };
  }
  async getVerificationForProcessing(
    verificationId: string,
  ): Promise<VerificationProcessingProjection | null> {
    return this.prisma.verification.findUnique({
      where: {
        id: verificationId,
      },

      select: {
        id: true,
        statusCode: true,
        documentTypeCode: true,

        documents: {
          select: {
            id: true,
            sideCode: true,
            storageKey: true,
            mimeType: true,
          },
        },
      },
    });
  }
  async updateVerificationAfterOcr(
    verificationId: string,
    data: UpdateVerificationAfterOcrRepositoryDTO,
  ): Promise<void> {
    console.log('Repo:', data.extraction.fields.dateOfBirth);
    const extractedData = {
      fullName: data.extraction.fields.fullName.value,
      documentNumber: data.extraction.fields.documentNumber.value,
      nationality: data.extraction.fields.nationality.value,
      gender: data.extraction.fields.gender.value,

      dateOfBirth: data.extraction.fields.dateOfBirth.value
        ? new Date(data.extraction.fields.dateOfBirth.value)
        : null,

      expiryDate: data.extraction.fields.expiryDate.value
        ? new Date(data.extraction.fields.expiryDate.value)
        : null,

      issuingCountry: data.extraction.fields.issuingCountry.value,
      issuingAuthority: data.extraction.fields.issuingAuthority.value,
      documentVersion: data.extraction.fields.documentVersion.value,
      analysisSummary: data.analysis.analysisSummary,
    };
    await this.prisma.$transaction(async (tx) => {
      await tx.verificationExtractedData.upsert({
        where: {
          verificationId,
        },

        create: {
          verificationId,
          ...extractedData,
        },

        update: extractedData,
      });

      await tx.verification.update({
        where: {
          id: verificationId,
        },

        data: {
          statusCode: 'under_review',
          ocrConfidence: data.extraction.confidence,
          overallRiskScore: data.analysis.overallRiskScore,
        },
      });
      await tx.verificationActivity.create({
        data: {
          verificationId,
          actionCode: 'ocr_completed',
        },
      });
    });
  }

  async updateVerificationReview(
    verificationId: string,
    dto: UpdateVerificationReviewRepositoryDTO,
  ): Promise<void> {
    const verification = await this.prisma.verification.findFirst({
      where: {
        id: verificationId,
      },
      select: {
        id: true,
        statusCode: true,
      },
    });

    if (!verification) {
      throw new Error('Verification not found');
    }

    if (verification.statusCode !== 'under_review') {
      throw new Error('Only verifications under review can be approved.');
    }
    await this.prisma.$transaction(async (tx) => {
      await tx.verification.update({
        where: {
          id: verificationId,
        },

        data: {
          statusCode: dto.statusCode,
          assignedReviewerId: dto.reviewerId,
          reviewedAt: dto.reviewedAt,
          rejectionReason: dto.rejectionReason,
          resubmissionReason: dto.resubmissionReason,
        },
      });

      await tx.verificationActivity.create({
        data: {
          verificationId,
          actionCode: dto.activityCode,
          performedByAdminId: dto.reviewerId,
        },
      });
    });
  }

  async getVerificationDocuments(
    userId: string,
  ): Promise<{ side: string; storageKey: string }[] | null> {
    const verification = await this.prisma.verification.findFirst({
      where: {
        userId,
      },
      select: {
        id: true,
        statusCode: true,
        documents: {
          select: {
            storageKey: true,
            sideCode: true,
          },
        },
      },
    });
    if (!verification) {
      return null;
    }
    return verification.documents.map((d) => ({
      side: d.sideCode,
      storageKey: d.storageKey,
    }));
  }
}
