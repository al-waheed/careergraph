import { useEffect, useState } from "react";

type Person = {
  name: string;
  location: string;
};

type JobMatch = {
  person: string;
  company: string;
  job: string;
  matchingSkillsList: string[];
  matchingSkills: number;
  totalRequiredSkills: number;
  matchPercentage: number;
};

function App() {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState("");
  const [matches, setMatches] = useState<JobMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPeople() {
      try {
        const response = await fetch("https://careergraph-api-ghek.onrender.com/api/jobs/people");

        if (!response.ok) {
          throw new Error("Failed to load candidates");
        }

        const data = await response.json();

        setPeople(data);

        if (data.length > 0) {
          setSelectedPerson(data[0].name);
        }
      } catch (error) {
        console.error(error);
        setError("Unable to load candidates");
      }
    }

    loadPeople();
  }, []);

  async function findJobs() {
    if (!selectedPerson) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `https://careergraph-api-ghek.onrender.com/api/jobs/match/${encodeURIComponent(
          selectedPerson,
        )}`,
      );

      if (!response.ok) {
        throw new Error("Failed to find matching jobs");
      }

      const data = await response.json();

      setMatches(data);
    } catch (error) {
      console.error(error);
      setError("Unable to find matching jobs");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto max-w-4xl">
        <header className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              Career<span className="text-blue-500">Graph</span>
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Graph-powered career matching
            </p>
          </div>

          <div className="rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-xs text-slate-400">
            CognoDB
          </div>
        </header>

        <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-xl font-semibold">Find your best job matches</h2>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <select
              value={selectedPerson}
              onChange={(event) => setSelectedPerson(event.target.value)}
              className="flex-1 rounded-lg border border-slate-700 bg-slate-800 px-4 py-3"
            >
              {people.map((person) => (
                <option key={person.name} value={person.name}>
                  {person.name} — {person.location}
                </option>
              ))}
            </select>

            <button
              onClick={findJobs}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Finding..." : "Find Jobs"}
            </button>
          </div>
        </section>

        {error && (
          <div className="mt-6 rounded-lg border border-red-800 bg-red-950 p-4 text-red-300">
            {error}
          </div>
        )}

        {matches.length > 0 && (
          <section className="mt-8">
            <h2 className="mb-4 text-2xl font-semibold">
              Job Matches for {selectedPerson}
            </h2>

            <div className="space-y-4">
              {matches.map((match) => (
                <article
                  key={match.job}
                  className="rounded-2xl border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <h3 className="text-xl font-semibold">{match.job}</h3>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-green-400">
                        {match.matchPercentage}%
                      </div>

                      <div className="text-xs text-slate-500">match</div>
                    </div>
                  </div>

                  <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-700">
                    <div
                      className="h-full bg-green-500"
                      style={{
                        width: `${match.matchPercentage}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xl text-slate-400">{match.company}</p>

                  <p className="mt-3 text-slate-400">
                    {match.matchingSkills} of {match.totalRequiredSkills}{" "}
                    required skills matched.
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {match.matchingSkillsList.map((skill) => (
                      <span
                        key={skill}
                        className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        {!loading && matches.length === 0 && !error && (
          <div className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900/50 p-10 text-center">
            <div className="text-4xl">🔎</div>

            <h3 className="mt-4 text-lg font-semibold">
              Ready to find your matches?
            </h3>

            <p className="mt-2 text-sm text-slate-400">
              Select a candidate and we'll compare their skills against
              available jobs.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;
