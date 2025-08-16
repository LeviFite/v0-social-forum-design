"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Share, Trash2, Edit, Globe, Users, Lock } from "lucide-react"
import { formatBytes, formatDistanceToNow } from "@/lib/utils"

interface FilePreviewDialogProps {
  file: {
    id: string
    filename: string
    original_filename: string
    file_type: string
    file_size: number
    file_url: string
    privacy_level: "public" | "friends" | "private"
    created_at: string
  }
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function FilePreviewDialog({ file, open, onOpenChange }: FilePreviewDialogProps) {
  const getPrivacyIcon = (privacy: string) => {
    switch (privacy) {
      case "public":
        return <Globe className="h-4 w-4 text-green-500" />
      case "friends":
        return <Users className="h-4 w-4 text-blue-500" />
      case "private":
        return <Lock className="h-4 w-4 text-red-500" />
      default:
        return <Lock className="h-4 w-4" />
    }
  }

  const renderPreview = () => {
    if (file.file_type.startsWith("image/")) {
      return (
        <div className="flex justify-center">
          <img
            src={file.file_url || "/placeholder.svg"}
            alt={file.original_filename}
            className="max-w-full max-h-96 object-contain rounded border border-border"
          />
        </div>
      )
    }

    if (file.file_type.startsWith("video/")) {
      return (
        <div className="flex justify-center">
          <video controls className="max-w-full max-h-96 rounded border border-border" src={file.file_url}>
            Your browser does not support the video tag.
          </video>
        </div>
      )
    }

    if (file.file_type.startsWith("audio/")) {
      return (
        <div className="flex justify-center p-8">
          <audio controls className="w-full max-w-md" src={file.file_url}>
            Your browser does not support the audio tag.
          </audio>
        </div>
      )
    }

    // For other file types, show a placeholder
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center mb-4">
          <span className="text-2xl">📄</span>
        </div>
        <h3 className="font-semibold text-foreground mb-2">Preview not available</h3>
        <p className="text-muted-foreground text-sm">
          This file type cannot be previewed. Click download to view the file.
        </p>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-card border-border">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-foreground truncate pr-4">{file.original_filename}</DialogTitle>
            <div className="flex items-center gap-2">
              {getPrivacyIcon(file.privacy_level)}
              <Badge variant="outline" className="capitalize">
                {file.privacy_level}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* File Preview */}
          <div className="bg-muted/30 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
            {renderPreview()}
          </div>

          {/* File Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">File Size</p>
              <p className="font-medium text-foreground">{formatBytes(file.file_size)}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">File Type</p>
              <p className="font-medium text-foreground">{file.file_type}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Privacy</p>
              <p className="font-medium text-foreground capitalize">{file.privacy_level}</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Uploaded</p>
              <p className="font-medium text-foreground">
                {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-border">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => window.open(file.file_url, "_blank")}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-2" />
                Edit Details
              </Button>
              <Button variant="destructive" size="sm">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
