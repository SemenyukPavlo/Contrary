import type { NextApiRequest, NextApiResponse } from "next";

import { Investment } from "@/db/entities/Investment";
import { getRepo } from "@/db/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const investmentRepo = await getRepo(Investment);

  if (req.method === "POST") {
    const investment = await investmentRepo.insert(req.body);
    res.status(201).json(investment);
  }

  if (req.method === "GET") {
    const investments = await investmentRepo.find({ order: { companyName: "asc" } });
    return res.status(200).json(investments);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
