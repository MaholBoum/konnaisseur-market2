interface CartContainerProps {
  children: React.ReactNode;
}

export function CartContainer({ children }: CartContainerProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto p-4">
        <div className="bg-card rounded-lg shadow-lg p-6 border border-border">
          {children}
        </div>
      </div>
    </div>
  );
}