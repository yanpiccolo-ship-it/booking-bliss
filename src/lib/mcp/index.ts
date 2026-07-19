import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listMyBusinessesTool from "./tools/list-my-businesses";
import listReservationsTool from "./tools/list-reservations";
import listServicesTool from "./tools/list-services";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "flowbooking-mcp",
  title: "FlowBooking",
  version: "0.1.0",
  instructions:
    "Tools for FlowBooking. Use list_my_businesses to find businesses you own, then list_services and list_reservations to inspect them.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listMyBusinessesTool, listReservationsTool, listServicesTool],
});
