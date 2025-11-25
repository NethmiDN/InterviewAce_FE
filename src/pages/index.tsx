import { Link } from "react-router-dom";
import SimulationImg from "../assets/simulation.svg";
import FeedbackImg from "../assets/feedback.svg";
import ProgressImg from "../assets/progress.svg";

function FeaturesSection() {
  return (
    <section className="mt-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-heading-gradient">
        Why InterviewAce?
      </h2>
      <div className="grid md:grid-cols-3 gap-8 mt-12">
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 dark:border-white/20 dark:bg-white/10 dark:backdrop-blur-sm dark:text-lavender_grey-900">
          <img src={SimulationImg} alt="Realistic simulation illustration" className="h-12 w-12 mb-4" />
          <h3 className="font-semibold text-lg">Realistic Simulation</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-blue_slate-800">Get interview questions tailored to your role and experience level.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 dark:border-white/20 dark:bg-white/10 dark:backdrop-blur-sm dark:text-lavender_grey-900">
          <img src={FeedbackImg} alt="AI feedback illustration" className="h-12 w-12 mb-4" />
          <h3 className="font-semibold text-lg">Actionable Feedback</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-blue_slate-800">Receive instant AI-driven feedback to improve your answers.</p>
        </div>
        <div className="p-6 rounded-xl border border-gray-200 bg-white shadow-sm text-gray-900 dark:border-white/20 dark:bg-white/10 dark:backdrop-blur-sm dark:text-lavender_grey-900">
          <img src={ProgressImg} alt="Progress tracking illustration" className="h-12 w-12 mb-4" />
          <h3 className="font-semibold text-lg">Track Progress</h3>
          <p className="text-sm mt-2 text-gray-600 dark:text-blue_slate-800">Measure improvement and build confidence before the real interview.</p>
        </div>
      </div>
    </section>
  );
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-app-gradient flex flex-col text-light_text dark:text-lavender_grey-900">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-5 sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-white/10 dark:border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-[linear-gradient(135deg,#001233,#002855,#0353a4,#0466c8)]" />
          <h1 className="text-xl font-extrabold tracking-tight text-heading-gradient">InterviewAce</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-medium text-smart_blue-600 hover:text-smart_blue-700 dark:text-brandText dark:hover:text-smart_blue-600 transition">Log In</Link>
          <Link
            to="/register"
            className="btn-primary-gradient px-6 py-3 rounded-md font-semibold hover:brightness-110"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-20 px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold max-w-4xl leading-tight text-light_text dark:text-alice_blue drop-shadow-sm">
          Ace Your Next Interview with AI
        </h1>

        <p className="text-lg mt-6 max-w-2xl text-light_text dark:text-cornsilk-900">
          InterviewAce provides a realistic, AI-powered interview experience to help you
          land your dream job. Practice, get feedback, and build confidence.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Link
            to="/register"
            className="btn-primary-gradient px-8 py-4 rounded-xl font-semibold hover:brightness-110"
          >
            Get Started for Free
          </Link>

          <Link
            to="/login"
            className="px-8 py-4 font-semibold rounded-xl bg-white border border-gray-200 text-light_text hover:bg-gray-50 transition dark:bg-white/15 dark:border-white/25 dark:text-lavender_grey-900 dark:hover:bg-white/25"
          >
            I have an account
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <FeaturesSection />

      {/* Footer */}
      <footer className="mt-20 py-10 text-center border-t border-gray-200 bg-white dark:border-white/20 dark:bg-white/10">
        <p className="text-sm text-slate-600 dark:text-blue_slate-800">© 2025 InterviewAce. All rights reserved.</p>
      </footer>
    </div>
  );
}