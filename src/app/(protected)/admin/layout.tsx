import Dashboard from "@/components/dashboard/dashboard";

function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dashboard>
      {children}
    </Dashboard>
  );
}

export default AdminLayout