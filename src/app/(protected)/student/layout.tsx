import StudentDashboard from "@/components/dashboard/student-dashboard";

function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {


  return (
    <StudentDashboard>
      {children}
    </StudentDashboard>
  );
}

export default StudentLayout