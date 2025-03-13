import { CreateEventForm } from "@/components/create-event-form";
import { EventsList } from "@/components/events-list";
import { Dashboard } from "@/components/dashboard";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Event Manager</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
            <Dashboard />
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Create New Event</h2>
            <CreateEventForm />
          </section>
          <section>
            <h2 className="text-2xl font-semibold mb-4">Events</h2>
            <EventsList />
          </section>
        </div>
      </main>
    </div>
  );
}
