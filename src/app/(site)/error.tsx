"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main id="main" className="container empty-state error-state">
      <span className="eyebrow">A BRIEF INTERRUPTION</span>
      <h1>We’re reconnecting.</h1>
      <p>The stories couldn’t load right now. Please try again in a moment.</p>
      <button className="button button-red" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
