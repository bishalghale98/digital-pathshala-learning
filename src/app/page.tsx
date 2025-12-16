'use client'

import { authClient } from '../lib/auth-client';


export default function Home() {
  const { data: session, isPending } = authClient.useSession();



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
