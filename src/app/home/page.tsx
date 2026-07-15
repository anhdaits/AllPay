import { redirect } from "next/navigation";

/**
 * /home used to be a second marketing landing page that duplicated most of
 * "/". That was confusing — two overlapping landing pages instead of one
 * marketing page ("/") plus one working app ("/dashboard"). Anything that
 * still links here goes straight to the dashboard now.
 */
export default function HomeRedirect() {
  redirect("/dashboard");
}
