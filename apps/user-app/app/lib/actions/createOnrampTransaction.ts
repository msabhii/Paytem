"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";

export async function createOnrampTransaction(
  amount: number,
  provider: string
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  const token = (Math.random() * 1000).toString();

  try {
    await prisma.onRampTransaction.create({
      data: {
        userId: Number(session?.user?.id),
        amount: amount,
        status: "Processing",
        startTime: new Date(),
        provider,
        token: token,
      },
    });
    return {
      mgs: "Added On ramp Transactions",
    };
  } catch (error) {
    console.log("Getting error while Transfer", error);
  }
}
