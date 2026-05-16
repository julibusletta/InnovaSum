import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProfileForm from '@/app/components/Profile/ProfileForm';

export default async function MiCuentaPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    redirect('/auth/signin');
  }

  // Pass session user data to the client component
  return (
    <div className="py-10">
      <ProfileForm user={session.user} />
    </div>
  );
}
