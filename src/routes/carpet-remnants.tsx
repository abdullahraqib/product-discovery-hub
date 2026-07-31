import { createFileRoute } from "@tanstack/react-router";
import { LandingHub, hubHead } from "@/components/LandingHub";
import { LANDING_HUBS } from "@/data/landing";

const hub = LANDING_HUBS["carpet-remnants"]!;

export const Route = createFileRoute("/carpet-remnants")({
  head: () => hubHead(hub),
  component: () => <LandingHub hub={hub} />,
});
