import { createFileRoute } from "@tanstack/react-router";
import { LandingHub, hubHead } from "@/components/LandingHub";
import { LANDING_HUBS } from "@/data/landing";

const hub = LANDING_HUBS["carpet-offcuts"]!;

export const Route = createFileRoute("/carpet-offcuts")({
  head: () => hubHead(hub),
  component: () => <LandingHub hub={hub} />,
});
