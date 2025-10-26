import Container from "@/components/ui/container";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 text-sm md:flex-row">
        <p className="text-slate-600">
          © {new Date().getFullYear()} AI Resume Maker
        </p>
        <div className="flex gap-4 text-slate-600">
          <Link href="/login" className="hover:text-black">
            Login
          </Link>
          <a href="#features" className="hover:text-black">
            Features
          </a>
          <a href="#demo" className="hover:text-black">
            Demo
          </a>
        </div>
      </Container>
    </footer>
  );
}
