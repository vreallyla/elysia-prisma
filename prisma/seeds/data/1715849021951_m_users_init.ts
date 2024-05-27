import { PrismaClient } from "@prisma/client";
import { toHash } from "../../../src/app/libs/string.utils";

export default class MUsersInit1715849021951 {
  async up(prisma: PrismaClient) {
    // get role ref
    const role = await prisma.mRoles.findFirst();

    // make user data
    await prisma.mUsers.create({
      data: {
        password: await toHash("secret"),
        username: "root",
        isActive: true,
        information: {
          create: {
            identityCode: "U000",
            phoneNumber: "6285388427463",
            address: "Sint Maarten",
            email: "root@example.com",
            name: "root",
            isActive: true,
          },
        },
        roles: { create: { roleId: role?.id ?? "" } },
      },
    });
  }

  async down(prisma: PrismaClient) {
    const { id } =
      (await prisma.mUsers.findFirst({
        where: { username: "root" },
        select: { id: true },
      })) ?? {};

    // delete rels
    await Promise.all([
      prisma.mUserMRoleRels.deleteMany({
        where: { userId: id },
      }),
      prisma.mInformations.delete({ where: { userId: id } }),
    ]);

    // delete user data
    await prisma.mUsers.delete({
      where: { id },
    });
  }
}
