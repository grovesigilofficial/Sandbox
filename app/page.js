import Link from "next/link";

export default function Home() {
  return (
    <main style={{ padding: 40 }}>
      <h1>GrovePortal Sandbox</h1>
      <p>This is the Sandbox environment.</p>
      <Link href="/dashboard">Go to Dashboard</Link>
    </main>
  );
}
