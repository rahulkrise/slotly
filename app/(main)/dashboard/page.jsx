"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { usernameSchema } from "@/app/_lib/validators";
import useFetch from "@/hooks/use-fetch";
import { updateUsername } from "@/actions/users";
import { BarLoader } from "react-spinners";
import { getUpcomingMeetings } from "@/actions/dashboard";
import { format } from "date-fns";

const Dashboard = () => {
  const { isLoaded, user } = useUser();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(usernameSchema),
  });

  useEffect(() => {
    setValue("username", user?.username);
  }, [isLoaded]);

  const { loading, error, fn: fnUpdateUsername } = useFetch(updateUsername);

  const onSubmit = async (data) => {
    fnUpdateUsername(data.username);
  };

  const {
    loading: loadingUpcomingMeetings,
    data: upcomingMeetings,
    fn: fnUpcomingMeetings,
  } = useFetch(getUpcomingMeetings);

  useEffect(() => {
    (async () => await fnUpcomingMeetings())();
  }, []);

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.firstName}</CardTitle>
        </CardHeader>
        <CardContent>
          {!loadingUpcomingMeetings ? (
            <div>
              {upcomingMeetings && upcomingMeetings.length > 0 ? (
                <ul>
                  {upcomingMeetings.map((meeting) => (
                    <li key={meeting.id}>
                      - {meeting.event.title} on{" "}
                      {format(
                        new Date(meeting.startTime),
                        "MMM d, yyyy h:mm a",
                      )}{" "}
                      with {meeting.name}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No upcoming meetings</p>
              )}
            </div>
          ) : (
            <p>Loading upcoming meetings...</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your Unique Link</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <div className="flex items-center gap-2">
                <span>{window.location.origin + "/"}</span>
                <input
                  type="text"
                  placeholder="username"
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.username.message}
                </p>
              )}
              {errors && (
                <p className="text-red-500 text-sm mt-1">{errors?.message}</p>
              )}
            </div>
            {loading && (
              <BarLoader className="mb-4" width={"10%"} color="#36d7b7" />
            )}
            <Button>Update User</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
