import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Bold, Italic, Underline, List, Save, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";

interface NoteEditorProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSave?: (note: { title: string; content: string }) => void;
  initialNote?: { title: string; content: string };
}

const NoteEditor = ({
  isOpen = true,
  onClose = () => {},
  onSave = () => {},
  initialNote = { title: "", content: "" },
}: NoteEditorProps) => {
  const [title, setTitle] = useState(initialNote.title);
  const [content, setContent] = useState(initialNote.content);
  const [isEdited, setIsEdited] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsEdited(true);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsEdited(true);
  };

  const handleSave = () => {
    onSave({ title, content });
    setIsEdited(false);
    onClose();
  };

  const handleClose = () => {
    if (isEdited) {
      setShowConfirmDialog(true);
    } else {
      onClose();
    }
  };

  const handleConfirmDiscard = () => {
    setShowConfirmDialog(false);
    onClose();
  };

  const handleCancelDiscard = () => {
    setShowConfirmDialog(false);
  };

  // Placeholder formatting functions
  const applyFormatting = (format: string) => {
    // In a real implementation, this would apply formatting to the selected text
    console.log(`Applying ${format} formatting`);
    setIsEdited(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={() => handleClose()}>
        <DialogContent className="bg-white w-full max-w-4xl h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              <Input
                value={title}
                onChange={handleTitleChange}
                placeholder="Note Title"
                className="text-xl font-semibold border-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
              />
            </DialogTitle>
          </DialogHeader>

          <div className="flex items-center space-x-2 mb-2 p-1 border rounded-md">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => applyFormatting("bold")}
              className="h-8 w-8 p-0"
            >
              <Bold className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => applyFormatting("italic")}
              className="h-8 w-8 p-0"
            >
              <Italic className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => applyFormatting("underline")}
              className="h-8 w-8 p-0"
            >
              <Underline className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => applyFormatting("list")}
              className="h-8 w-8 p-0"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>

          <Textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Start typing your note here..."
            className="flex-1 resize-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={handleClose} className="gap-2">
              <X className="h-4 w-4" /> Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" /> Save Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Discard changes?</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to discard them?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancelDiscard}>
              Continue editing
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDiscard}>
              Discard
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default NoteEditor;
