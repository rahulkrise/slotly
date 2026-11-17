import { getEventAvailability, getEventDetails } from "@/actions/events";
import { notFound } from "next/navigation";
import EventDetails from "./_components/event-details";
import BookingForm from "./_components/booking-form";
import { Suspense } from "react";

export async function generateMetadata({ params }) {
  const event = await getEventDetails(params.username, params.eventId);
  if (!event) {
    return {
      title: "Event Not Found",
    };
  }
  return {
    title: `Book ${event.title} with ${event.user.name} | Slotly`,
    description: `Schedule a ${event.duration}-minute ${event.title} event with ${event.user.name}.`,
  };
}

const EventPage = async ({ params }) => {
  const event = await getEventDetails(params.username, params.userId);
  const availability = await getEventAvailability(params.eventId);

  if (!event) return notFound();

  return (
    <div className="flex flex-col justify-center lg:flex-row px-4 py-8">
      <EventDetails event={event} />
      <Suspense fallback={<div>Loading Booking Form...</div>}>
        <BookingForm event={event} availability={availability} />
      </Suspense>
    </div>
  );
};

export default EventPage;
