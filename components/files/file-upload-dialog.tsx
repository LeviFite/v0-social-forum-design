"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, X, File, Video, Music, FileText, ImageIcon } from "lucide-react"
import { supabase } from "@/lib/supabase/client"
import { formatBytes } from "@/lib/utils"

interface FileUploadDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onUpload: (files: any[]) => void
}

interface UploadFile {
  file: File
  id: string
  privacy_level: "public" | "friends" | "private"
  progress: number
  status: "pending" | "uploading" | "completed" | "error"
  error?: string
}

export default function FileUploadDialog({ open, onOpenChange, onUpload }: FileUploadDialogProps) {
  const [filesToUpload, setFilesToUpload] = useState<UploadFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])
    const newUploadFiles: UploadFile[] = files.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      privacy_level: "private",
      progress: 0,
      status: "pending",
    }))

    setFilesToUpload((prev) => [...prev, ...newUploadFiles])
  }

  const removeFile = (id: string) => {
    setFilesToUpload((prev) => prev.filter((f) => f.id !== id))
  }

  const updateFilePrivacy = (id: string, privacy_level: "public" | "friends" | "private") => {
    setFilesToUpload((prev) => prev.map((f) => (f.id === id ? { ...f, privacy_level } : f)))
  }

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (file.type.startsWith("video/")) return <Video className="h-5 w-5" />
    if (file.type.startsWith("audio/")) return <Music className="h-5 w-5" />
    if (file.type.includes("pdf") || file.type.includes("document") || file.type.includes("text")) {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

  const handleUpload = async () => {
    if (filesToUpload.length === 0) return

    setIsUploading(true)
    const uploadedFiles: any[] = []

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        throw new Error("User not authenticated")
      }

      for (const uploadFile of filesToUpload) {
        try {
          // Update status to uploading
          setFilesToUpload((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "uploading" as const } : f)),
          )

          // Generate unique filename
          const fileExt = uploadFile.file.name.split(".").pop()
          const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`

          // Simulate file upload progress (replace with actual upload logic)
          for (let progress = 0; progress <= 100; progress += 10) {
            setFilesToUpload((prev) => prev.map((f) => (f.id === uploadFile.id ? { ...f, progress } : f)))
            await new Promise((resolve) => setTimeout(resolve, 100))
          }

          // For demo purposes, create a mock file URL
          const fileUrl = `/placeholder.svg?file=${uploadFile.file.name}`

          // Save file metadata to database
          const { data: fileData, error } = await supabase
            .from("user_files")
            .insert({
              user_id: user.id,
              filename: fileName,
              original_filename: uploadFile.file.name,
              file_type: uploadFile.file.type,
              file_size: uploadFile.file.size,
              file_url: fileUrl,
              privacy_level: uploadFile.privacy_level,
            })
            .select()
            .single()

          if (error) {
            throw error
          }

          uploadedFiles.push(fileData)

          // Update status to completed
          setFilesToUpload((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "completed" as const } : f)),
          )
        } catch (error) {
          console.error("Error uploading file:", error)
          setFilesToUpload((prev) =>
            prev.map((f) => (f.id === uploadFile.id ? { ...f, status: "error" as const, error: "Upload failed" } : f)),
          )
        }
      }

      // Call onUpload with successfully uploaded files
      if (uploadedFiles.length > 0) {
        onUpload(uploadedFiles)
      }

      // Close dialog after successful upload
      setTimeout(() => {
        onOpenChange(false)
        setFilesToUpload([])
      }, 1000)
    } catch (error) {
      console.error("Upload error:", error)
    } finally {
      setIsUploading(false)
    }
  }

  const handleClose = () => {
    if (!isUploading) {
      onOpenChange(false)
      setFilesToUpload([])
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Upload Files</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Drop files here or click to browse</h3>
            <p className="text-muted-foreground">Support for all file types up to 100MB each</p>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={handleFileSelect}
              accept="*/*"
            />
          </div>

          {/* File List */}
          {filesToUpload.length > 0 && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {filesToUpload.map((uploadFile) => (
                <div key={uploadFile.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="flex-shrink-0">{getFileIcon(uploadFile.file)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-medium text-foreground truncate">{uploadFile.file.name}</p>
                      <Badge
                        variant={
                          uploadFile.status === "completed"
                            ? "default"
                            : uploadFile.status === "error"
                              ? "destructive"
                              : "secondary"
                        }
                      >
                        {uploadFile.status}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
                      <span>{formatBytes(uploadFile.file.size)}</span>
                      <Select
                        value={uploadFile.privacy_level}
                        onValueChange={(value: "public" | "friends" | "private") =>
                          updateFilePrivacy(uploadFile.id, value)
                        }
                        disabled={isUploading}
                      >
                        <SelectTrigger className="w-24 h-6 text-xs">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="public">Public</SelectItem>
                          <SelectItem value="friends">Friends</SelectItem>
                          <SelectItem value="private">Private</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {uploadFile.status === "uploading" && <Progress value={uploadFile.progress} className="h-2" />}

                    {uploadFile.status === "error" && <p className="text-xs text-destructive">{uploadFile.error}</p>}
                  </div>

                  {!isUploading && uploadFile.status === "pending" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(uploadFile.id)}
                      className="flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {filesToUpload.length} file{filesToUpload.length !== 1 ? "s" : ""} selected
            </p>

            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleClose} disabled={isUploading}>
                Cancel
              </Button>
              <Button
                onClick={handleUpload}
                disabled={filesToUpload.length === 0 || isUploading}
                className="bg-primary hover:bg-primary/90"
              >
                {isUploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
