"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatBytes, formatDistanceToNow } from "@/lib/utils"
import {
  FileText,
  ImageIcon,
  Video,
  Music,
  Archive,
  File,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Lock,
  Globe,
  Users,
} from "lucide-react"

interface FileCardProps {
  file: any
  onPreview: (file: any) => void
  onDelete: (fileId: string) => void
  onPrivacyChange: (fileId: string, privacy: string) => void
}

const getFileIcon = (fileType: string) => {
  if (fileType.startsWith("image/")) return ImageIcon
  if (fileType.startsWith("video/")) return Video
  if (fileType.startsWith("audio/")) return Music
  if (fileType.includes("zip") || fileType.includes("rar")) return Archive
  if (fileType.includes("pdf") || fileType.includes("document")) return FileText
  return File
}

const getPrivacyIcon = (privacy: string) => {
  switch (privacy) {
    case "public":
      return Globe
    case "friends":
      return Users
    case "private":
      return Lock
    default:
      return Lock
  }
}

const getPrivacyColor = (privacy: string) => {
  switch (privacy) {
    case "public":
      return "text-secondary"
    case "friends":
      return "text-primary"
    case "private":
      return "text-muted-foreground"
    default:
      return "text-muted-foreground"
  }
}

export default function FileCard({ file, onPreview, onDelete, onPrivacyChange }: FileCardProps) {
  const FileIcon = getFileIcon(file.file_type)
  const PrivacyIcon = getPrivacyIcon(file.privacy_level)
  const isImage = file.file_type.startsWith("image/")

  return (
    <Card className="group hover-lift transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {isImage ? (
              <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted">
                <img
                  src={file.file_url || "/placeholder.svg"}
                  alt={file.original_name}
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <FileIcon className="h-5 w-5 text-muted-foreground" />
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-foreground truncate" title={file.original_name}>
                {file.original_name}
              </h3>
              <p className="text-sm text-muted-foreground">{formatBytes(file.file_size)}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onPreview(file)}>
                <Eye className="mr-2 h-4 w-4" />
                Preview
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <a href={file.file_url} download={file.original_name}>
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </a>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrivacyChange(file.id, "public")}>
                <Globe className="mr-2 h-4 w-4" />
                Make Public
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrivacyChange(file.id, "friends")}>
                <Users className="mr-2 h-4 w-4" />
                Friends Only
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPrivacyChange(file.id, "private")}>
                <Lock className="mr-2 h-4 w-4" />
                Make Private
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDelete(file.id)} className="text-destructive focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="outline" className="text-xs">
            <PrivacyIcon className={`mr-1 h-3 w-3 ${getPrivacyColor(file.privacy_level)}`} />
            {file.privacy_level}
          </Badge>

          <span className="text-xs text-muted-foreground">{formatDistanceToNow(file.created_at)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
