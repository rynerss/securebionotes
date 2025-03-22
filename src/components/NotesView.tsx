import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus, Search, LogOut } from "lucide-react";
import { Input } from "./ui/input";
import NoteCard from "./NoteCard";
import NoteEditor from "./NoteEditor";
import ConfirmDialog from "./ConfirmDialog";

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: string;
}

interface NotesViewProps {
  notes?: Note[];
  onLogout?: () => void;
  onCreateNote?: (note: { title: string; content: string }) => void;
  onUpdateNote?: (id: string, note: { title: string; content: string }) => void;
  onDeleteNote?: (id: string) => void;
}

const NotesView = ({
  notes = [
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
  ],
  onLogout = () => {},
  onCreateNote = () => {},
  onUpdateNote = () => {},
  onDeleteNote = () => {},
}: NotesViewProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showEditor, setShowEditor] = useState(false);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  // Filter notes based on search query
  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleCreateNote = () => {
    setCurrentNote(null);
    setShowEditor(true);
  };

  const handleEditNote = (id: string) => {
    const noteToEdit = notes.find((note) => note.id === id);
    if (noteToEdit) {
      setCurrentNote(noteToEdit);
      setShowEditor(true);
    }
  };

  const handleDeleteNote = (id: string) => {
    setNoteToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteNote = () => {
    if (noteToDelete) {
      onDeleteNote(noteToDelete);
      setNoteToDelete(null);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveNote = (note: { title: string; content: string }) => {
    if (currentNote) {
      onUpdateNote(currentNote.id, note);
    } else {
      onCreateNote(note);
    }
    setShowEditor(false);
    setCurrentNote(null);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-800">Secure Notes</h1>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
            className="gap-2"
          >
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </Button>
        </div>
      </header>

      <div className="p-6 flex-1">
        <div className="mb-6 flex justify-between items-center">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full"
            />
          </div>
          <Button onClick={handleCreateNote} className="gap-2">
            <Plus className="h-4 w-4" />
            <span>New Note</span>
          </Button>
        </div>

        {filteredNotes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {searchQuery
                ? "No notes match your search"
                : "No notes yet. Create your first note!"}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                id={note.id}
                title={note.title}
                content={note.content}
                lastModified={note.lastModified}
                onEdit={handleEditNote}
                onDelete={handleDeleteNote}
              />
            ))}
          </div>
        )}
      </div>

      {showEditor && (
        <NoteEditor
          isOpen={showEditor}
          onClose={() => setShowEditor(false)}
          onSave={handleSaveNote}
          initialNote={
            currentNote
              ? { title: currentNote.title, content: currentNote.content }
              : undefined
          }
        />
      )}

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete Note"
        description="Are you sure you want to delete this note? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteNote}
        onCancel={() => setShowDeleteConfirm(false)}
        variant="destructive"
      />
    </div>
  );
};

export default NotesView;
