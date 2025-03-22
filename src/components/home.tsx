import React, { useState, useEffect } from "react";
import LockScreen from "./LockScreen";
import NotesView from "./NotesView";
import DeviceWarning from "./DeviceWarning";
import { isMobileDevice } from "../utils/deviceDetection";

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

const Home = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showDeviceWarning, setShowDeviceWarning] = useState(false);
  const [bypassDeviceCheck, setBypassDeviceCheck] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "note-1",
      title: "Meeting Notes",
      content:
        "Discussed project timeline and assigned tasks to team members. Follow-up meeting scheduled for next week.",
      lastModified: "2023-06-15T14:30:00Z",
    },
    {
      id: "note-2",
      title: "Shopping List",
      content:
        "Milk, eggs, bread, fruits, vegetables, chicken, pasta, rice, olive oil, coffee.",
      lastModified: "2023-06-14T10:15:00Z",
    },
    {
      id: "note-3",
      title: "Project Ideas",
      content:
        "1. Mobile app for tracking daily habits\n2. Website redesign for client\n3. Personal blog about technology\n4. Smart home automation system",
      lastModified: "2023-06-13T18:45:00Z",
    },
  ]);

  const handleAuthenticate = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  const handleCreateNote = (note: { title: string; content: string }) => {
    const newNote: Note = {
      id: `note-${Date.now()}`,
      title: note.title,
      content: note.content,
      lastModified: new Date().toISOString(),
    };
    setNotes([newNote, ...notes]);
  };

  const handleUpdateNote = (
    id: string,
    updatedNote: { title: string; content: string },
  ) => {
    setNotes(
      notes.map((note) =>
        note.id === id
          ? {
              ...note,
              title: updatedNote.title,
              content: updatedNote.content,
              lastModified: new Date().toISOString(),
            }
          : note,
      ),
    );
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

  // Check if user is on a mobile device
  useEffect(() => {
    const isMobile = isMobileDevice();
    if (!isMobile) {
      setShowDeviceWarning(true);
    }
  }, []);

  // Auto lock when window loses focus
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        setIsAuthenticated(false);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  // Auto lock after inactivity (5 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    let inactivityTimer: number;
    const resetTimer = () => {
      clearTimeout(inactivityTimer);
      inactivityTimer = window.setTimeout(
        () => {
          setIsAuthenticated(false);
        },
        5 * 60 * 1000,
      ); // 5 minutes
    };

    // Reset timer on user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
    ];
    events.forEach((event) => {
      document.addEventListener(event, resetTimer);
    });

    resetTimer();

    return () => {
      clearTimeout(inactivityTimer);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimer);
      });
    };
  }, [isAuthenticated]);

  return (
    <div className="bg-white min-h-screen">
      {showDeviceWarning && !bypassDeviceCheck ? (
        <DeviceWarning onContinueAnyway={() => setBypassDeviceCheck(true)} />
      ) : !isAuthenticated ? (
        <LockScreen onAuthenticate={handleAuthenticate} />
      ) : (
        <NotesView
          notes={notes}
          onLogout={handleLogout}
          onCreateNote={handleCreateNote}
          onUpdateNote={handleUpdateNote}
          onDeleteNote={handleDeleteNote}
        />
      )}
    </div>
  );
};

export default Home;
