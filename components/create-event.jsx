"use client";

import React, { useState, useEffect } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
  DrawerFooter,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import EventForm from "./event-form";

export default function CreateEventDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const create = searchParams.get("create");
    if (create === "true") {
      setIsOpen(true);
    }
  }, [searchParams]);

  const handleClose = () => {
    setIsOpen(false);
    if (searchParams.get("create") === "true") {
      router.replace(window?.location?.pathname);
    }
  };

  return (
    <Drawer open={isOpen} onClose={handleClose}>
      <DrawerContent className="bg-white">
        <DrawerHeader>
          <DrawerTitle>Create New Event</DrawerTitle>
        </DrawerHeader>
        <EventForm onSubmitForm={() => handleClose()} />
        <DrawerFooter>
          <DrawerClose asChild>
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
