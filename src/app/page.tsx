'use client'

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authClient } from '../lib/auth-client';


export default function Home() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace("/home"); 
    }
  }, [session, router]);

  if (isPending || session?.user) {
    return <div style={{ display: "none" }}></div>;
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
