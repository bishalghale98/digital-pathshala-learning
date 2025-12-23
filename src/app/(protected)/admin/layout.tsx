import Dashboard from "@/components/dashboard/admin-dashboard";

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