'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from '../lib/auth-client';


export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  // 👇 Smooth redirect handled inside useEffect
  useEffect(() => {
    if (session?.user) {
      router.replace("/home"); // replace = no back button flicker
    }
  }, [session, router]);

  if (isPending || session?.user) {
    return <div style={{ display: "none" }}></div>;
    // Hides everything while redirecting
  }

  return (
    <div>
      <button
        onClick={async () => {
          await authClient.signIn.social({
            provider: "google",
          });
        }}
      >
        Sign In with Google
      </button>
    </div>
  );
}
