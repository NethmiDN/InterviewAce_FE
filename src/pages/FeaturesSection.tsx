interface FeatureItem {
  title: string;
  description: string;
  accent?: string;
}

const features: FeatureItem[] = [
  {
    title: "Realistic AI Interviews",
    description: "Simulate technical and behavioral interviews with adaptive AI responses.",
    accent: "bg-indigo-600"
  },
  {
    title: "Actionable Feedback",
    description: "Receive structured feedback highlighting strengths and improvement areas.",
    accent: "bg-pink-500"
  },
  {
    title: "Question Bank",
    description: "Practice with curated questions spanning roles and seniority levels.",
    accent: "bg-emerald-500"
  },
  {
    title: "Progress Tracking",
    description: "Monitor growth with performance history and skill metrics.",
    accent: "bg-orange-500"
  }
];

export default function FeaturesSection() {
  return (
    <section className="mt-24 px-6 md:px-12">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-light_text text-center dark:text-brandText">Why InterviewAce?</h2>
        <p className="text-light_text text-center mt-4 max-w-2xl mx-auto dark:text-blue_slate-800">
          Purpose-built to help you prepare efficiently and confidently for real interview scenarios.
        </p>
        <div className="grid gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="rounded-lg border bg-white shadow-sm p-6 flex flex-col dark:bg-white/10 dark:border-twilight_indigo-300/40 dark:backdrop-blur-sm">
              <div className={`h-10 w-10 rounded-md flex items-center justify-center text-white text-sm font-semibold ${f.accent}`}>{f.title[0]}</div>
              <h3 className="mt-4 font-semibold text-light_text text-lg dark:text-lavender_grey-900">{f.title}</h3>
              <p className="mt-2 text-sm text-light_text leading-relaxed dark:text-blue_slate-800">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
