import { createFileRoute } from "@tanstack/react-router";
import { LandingHub, hubHead } from "@/components/LandingHub";
import { LANDING_HUBS } from "@/data/landing";

const hub = LANDING_HUBS["end-of-line-carpets"]!;

export const Route = createFileRoute("/end-of-line-carpets")({
  head: () => hubHead(hub),
  component: () => <LandingHub hub={hub} />,
});
