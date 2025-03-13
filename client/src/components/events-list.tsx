"use client";

import { useEffect, useState } from "react";
import { useEvents, useDeleteEvent, useUpdateEvent } from "../lib/queries";
import { Event } from "../lib/queries";

export function EventsList() {
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const { data: events = [] } = useEvents();
  const { mutate: deleteEvent } = useDeleteEvent();
  const { mutate: updateEvent } = useUpdateEvent();

  const handleDelete = (id: number) => {
    deleteEvent(id);
  };

  const handleUpdate = (event: Event) => {
    updateEvent(event);
    setEditingEvent(null);
  };

  const uniqueCategories = Array.from(
    new Set(events.map((event) => event.category))
  );

  const filteredEvents = events.filter(
    (event) =>
      (event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === "" || event.category === selectedCategory)
  );
  return (
    <div className="space-y-4">
      <div className="flex gap-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search events..."
          className="flex-1 p-2 border rounded"
        />
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="">All Categories</option>
          {uniqueCategories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      {filteredEvents.map((event) => (
        <div key={event.id} className="border p-4 rounded-lg">
          {editingEvent?.id === event.id ? (
            <div className="space-y-4">
              <input
                type="text"
                value={editingEvent.title}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, title: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <textarea
                value={editingEvent.description}
                onChange={(e) =>
                  setEditingEvent({
                    ...editingEvent,
                    description: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              />
              <input
                type="date"
                value={new Date(editingEvent.date).toISOString().split("T")[0]}
                onChange={(e) =>
                  setEditingEvent({ ...editingEvent, date: e.target.value })
                }
                className="w-full p-2 border rounded"
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => handleUpdate(editingEvent)}
                  className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditingEvent(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-start">
                <h3 className="font-semibold">{event.title}</h3>
                <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                  {event.category}
                </span>
              </div>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <p className="text-sm text-gray-500 mt-2">
                {new Date(event.date).toLocaleDateString()}
              </p>
              <div className="mt-4 flex space-x-2">
                <button
                  onClick={() => setEditingEvent(event)}
                  className="text-blue-500"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(event.id)}
                  className="text-red-500"
                >
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
