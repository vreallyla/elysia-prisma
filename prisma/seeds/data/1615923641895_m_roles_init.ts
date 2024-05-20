import { PrismaClient } from "@prisma/client";

export default class MRolesInit1715923641895 {
  async up(prisma: PrismaClient) {
    await prisma.mRoles.create({
      data: { code: "C000", name: "root", isActive: true },
    });
  }

  async down(prisma: PrismaClient) {
    await prisma.mRoles.delete({ where: { code: "C000" } });
  }
}
