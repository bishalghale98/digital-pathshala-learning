"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";


export default function UserProfile() {
  const { data: session, isPending } = authClient.useSession()!;
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.replace("/");
    }
  }, [session, isPending, router]);

  if (isPending || !session?.user) return <div style={{ display: "none" }} />;

  const {
    id,
    createdAt,
    updatedAt,
    email,
    emailVerified,
    name,
    image,
    role
  } = session.user;

  const handleSignOut = async () => {
    try {
      await authClient.signOut();
      router.replace("/");
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto  rounded shadow">
      <h2 className="text-2xl font-bold mb-4">User Details</h2>

      {image && (
        <div className="mb-4">
          <Image
            src={image}
            alt={name || "Profile"}
            width={96}
            height={96}
            className="rounded-full"
          />
        </div>
      )}

      <ul className="space-y-2">
        <li><strong>ID:</strong> {id}</li>
        <li><strong>Name:</strong> {name}</li>
        <li><strong>Email:</strong> {email}</li>
        <li><strong>Role:</strong> {role}</li>
        <li><strong>Email Verified:</strong> {emailVerified ? "Yes" : "No"}</li>
        <li><strong>Created At:</strong> {new Date(createdAt).toLocaleString()}</li>
        <li><strong>Updated At:</strong> {new Date(updatedAt).toLocaleString()}</li>
      </ul>

      <button
        onClick={handleSignOut}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Sign Out
      </button>
    </div>
  );
}
