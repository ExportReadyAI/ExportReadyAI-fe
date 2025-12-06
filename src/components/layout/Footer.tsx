export default function Footer() {
  return (
    <footer className="border-t mt-auto">
      <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} Export Management System. All rights reserved.</p>
      </div>
    </footer>
  );
}


