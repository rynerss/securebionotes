import React from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Edit, Trash2 } from "lucide-react";

interface NoteCardProps {
  id: string;
  title: string;
  content: string;
  lastModified: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

const NoteCard = ({
  id = "note-1",
  title = "Meeting Notes",
  content = "Discussed project timeline and assigned tasks to team members. Follow-up meeting scheduled for next week.",
  lastModified = "2023-06-15T14:30:00Z",
  onEdit,
  onDelete,
}: NoteCardProps) => {
  // Format the date to be more readable
  const formattedDate = new Date(lastModified).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  // Truncate content if it's too long
  const truncatedContent =
    content.length > 100 ? `${content.substring(0, 100)}...` : content;

  const handleEdit = () => {
    if (onEdit) onEdit(id);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(id);
  };

  return (
    <Card className="w-[350px] h-[180px] bg-white shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium truncate">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow overflow-hidden">
        <p className="text-sm text-gray-600 line-clamp-3">{truncatedContent}</p>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between items-center border-t border-gray-100">
        <span className="text-xs text-gray-500">{formattedDate}</span>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit note</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Delete note</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default NoteCard;
