export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-white md:bg-[#f8fafc] pt-32 pb-20 px-4 md:px-0 flex justify-center">
      <div className="max-w-7xl w-full">
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
