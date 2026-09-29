import Calculator from "@/components/calculator/Calculator";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="flex min-h-full flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            Self-employment tax estimator
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            For 1099 gig workers and freelancers — Uber, DoorDash, Instacart, freelance clients, and
            similar. Enter your numbers to estimate your self-employment tax, federal income tax, and
            quarterly payments. Nothing you enter is saved.
          </p>
        </div>
        <Calculator />
      </main>
      <Footer />
    </div>
  );
}
