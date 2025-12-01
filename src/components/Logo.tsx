import { Link } from "react-router-dom"

export default function Logo({ className = "", to = "/" }: { className?: string; to?: string }) {
  return (
    <Link to={to} aria-label="InterviewAce Home" className={`flex items-center gap-2 ${className}`}>
      <div className="h-6 w-6 rounded bg-[linear-gradient(135deg,#001233,#002855,#0353a4,#0466c8)] shadow-sm" />
      <span className="text-xl font-extrabold tracking-tight text-heading-gradient select-none">
        InterviewAce
      </span>
    </Link>
  )
}
