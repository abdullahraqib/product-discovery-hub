import { createFileRoute } from "@tanstack/react-router";
import { LandingHub, hubHead } from "@/components/LandingHub";
import { LANDING_HUBS } from "@/data/landing";
import { productsQuery } from "@/lib/products";

const hub = LANDING_HUBS["roll-ends"]!;

export const Route = createFileRoute("/roll-ends/")  loader: ({ context }) => context.queryClient.ensureQueryData(productsQuery()),
  head: () => hubHead(hub),
  component: () => <LandingHub hub={hub} />,
});
