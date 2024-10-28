import type { NextApiRequest, NextApiResponse } from "next";

import { Investment } from "@/db/entities/Investment";
import { getRepo } from "@/db/utils";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;
  const investmentRepo = await getRepo(Investment);

  const investment = await investmentRepo.findOneBy({ id: id as string });

  if (!investment) return res.status(404).end("Investment not found");

  if (req.method === "GET") return res.status(200).json(investment);

  if (req.method === "PUT") {
    const updated = await investmentRepo.update(investment, req.body);

    return res.status(200).json(updated);
  } else if (req.method === "DELETE") {
    await investmentRepo.delete(investment);

    return res.status(204).end();
  }

  res.setHeader("Allow", ["GET", "PUT", "DELETE"]);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}
