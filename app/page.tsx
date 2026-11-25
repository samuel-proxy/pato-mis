export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-800">
      <nav className="flex items-center justify-between border-b border-slate-300 px-8 py-4">
        <h1 className="text-xl font-bold text-slate-900">PATO SACCO</h1>

        <div className="hidden items-center gap-6 md:flex">
          <a href="#home" className="text-sm hover:underline">Home</a>
          <a href="#about" className="text-sm hover:underline">About</a>
          <a href="#services" className="text-sm hover:underline">Services</a>
          <a href="#contact" className="text-sm hover:underline">Contact</a>
        </div>

        <a
          href="/login"
          className="rounded border border-slate-400 px-4 py-2 text-sm hover:bg-slate-100"
        >
          Login
        </a>
      </nav>

      <section
        id="home"
        className="border-b border-slate-300 bg-slate-50 px-8 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <p className="mb-3 text-sm uppercase tracking-wide text-slate-500">
            Welcome to PATO SACCO
          </p>

          <h2 className="mb-6 text-3xl font-bold text-slate-900">
            Your financial growth starts with us.
          </h2>

          <p className="mb-8 max-w-xl leading-7 text-slate-600">
            Manage your savings, apply for loans and keep track of your
            financial activities through a simple digital SACCO platform.
          </p>

          <a
            href="/login"
            className="inline-block rounded bg-blue-900 px-6 py-2 text-sm text-white hover:bg-blue-800"
          >
            Access Your Account
          </a>
        </div>
      </section>

      <section id="about" className="border-b border-slate-300 px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-4 text-xl font-bold text-slate-900">
            About PATO SACCO
          </h2>

          <p className="leading-7 text-slate-600">
            PATO SACCO aims to make financial services more accessible to its
            members through convenient digital services. Members can access
            savings information, apply for loans and keep track of their
            financial activities.
          </p>
        </div>
      </section>

      <section id="services" className="border-b border-slate-300 bg-slate-50 px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-xl font-bold text-slate-900">Our Services</h2>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded border border-slate-300 bg-white p-6">
              <h3 className="mb-2 font-bold text-slate-900">
                Savings Management
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Keep track of your savings and contributions.
              </p>
            </div>

            <div className="rounded border border-slate-300 bg-white p-6">
              <h3 className="mb-2 font-bold text-slate-900">
                Loan Applications
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Submit loan applications and follow their progress.
              </p>
            </div>

            <div className="rounded border border-slate-300 bg-white p-6">
              <h3 className="mb-2 font-bold text-slate-900">
                Repayment Tracking
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Keep track of loan repayments and outstanding balances.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="px-8 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-3 text-xl font-bold text-slate-900">
            Get Started with PATO SACCO
          </h2>

          <p className="mb-6 text-slate-600">
            Access your account to manage your SACCO activities.
          </p>

          <a
            href="/login"
            className="inline-block rounded bg-blue-900 px-6 py-2 text-sm text-white hover:bg-blue-800"
          >
            Member Login
          </a>
        </div>
      </section>

      <footer className="border-t border-slate-300 px-8 py-6 text-sm text-slate-500">
        <p>PATO SACCO Management System</p>
      </footer>
    </main>
  );
}