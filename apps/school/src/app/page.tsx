import { redirect } from "next/navigation";
import { FAKE_SCHOOLS } from "@/core/mocks/fake-data";

export default function Home() {
  // Redirect to the first available school dashboard
  const defaultSchoolId = FAKE_SCHOOLS[0]!.id;
  redirect(`/${defaultSchoolId}/dashboard`);
}
