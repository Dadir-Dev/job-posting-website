import Image from "next/image";
import Link from "next/link";

const navLinks = [
  { href: "/jobs", label: "Browse Jobs" },
  { href: "/post-job", label: "Post a Job" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/signin", label: "Sign In" },
];

const Navbar = () => {
  return (
    <nav className="w-full border-b border-[#23466d] bg-[#0d2442]">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-8 py-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-3 text-lg font-semibold text-slate-100 transition-colors hover:text-sky-300"
        >
          <Image
            src="/logo.png"
            alt="Job Board Logo"
            width={40}
            height={40}
            priority
          />
          <span>Job Board</span>
        </Link>

        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-slate-300">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-sky-300"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
