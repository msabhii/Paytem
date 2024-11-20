"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

interface p2pParams {
  to: string;
  amount: number;
}

export async function p2pTransfer({ to, amount }: p2pParams) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;
  if (!from) {
    return { msg: "Error while sending " };
  }
  console.log(from, ">>>>>>>>>>>>>>>>>>");

  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      msg: "User Not found",
    };
  }

  await prisma.$transaction(async (tx) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userid"=${Number(from)} FOR UPDATE`;
  });
}
