"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Upload,
  Search,
  Grid3X3,
  List,
  File,
  ImageIcon,
  Video,
  Music,
  FileText,
  Download,
  Trash2,
  Eye,
  Share,
  Lock,
  Users,
  Globe,
} from "lucide-react"
import FileUploadDialog from "./file-upload-dialog"
import FilePreviewDialog from "./file-preview-dialog"
import { formatBytes, formatDistanceToNow } from "@/lib/utils"

interface FileItem {
  id: string
  filename: string
  original_filename: string
  file_type: string
  file_size: number
  file_url: string
  privacy_level: "public" | "friends" | "private"
  created_at: string
}

interface FileManagerProps {
  files: FileItem[]
}

export default function FileManager({ files: initialFiles }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>(initialFiles)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [filterType, setFilterType] = useState<string>("all")
  const [filterPrivacy, setFilterPrivacy] = useState<string>("all")
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null)

  // Filter files based on search and filters
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.original_filename.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = filterType === "all" || file.file_type.startsWith(filterType)
    const matchesPrivacy = filterPrivacy === "all" || file.privacy_level === filterPrivacy
    return matchesSearch && matchesType && matchesPrivacy
  })

  // Group files by type
  const filesByType = {
    images: filteredFiles.filter((f) => f.file_type.startsWith("image/")),
    videos: filteredFiles.filter((f) => f.file_type.startsWith("video/")),
    audio: filteredFiles.filter((f) => f.file_type.startsWith("audio/")),
    documents: filteredFiles.filter(
      (f) =>
        f.file_type.includes("pdf") ||
        f.file_type.includes("document") ||
        f.file_type.includes("text") ||
        f.file_type.includes("spreadsheet") ||
        f.file_type.includes("presentation"),
    ),
    other: filteredFiles.filter(
      (f) =>
        !f.file_type.startsWith("image/") &&
        !f.file_type.startsWith("video/") &&
        !f.file_type.startsWith("audio/") &&
        !f.file_type.includes("pdf") &&
        !f.file_type.includes("document") &&
        !f.file_type.includes("text") &&
        !f.file_type.includes("spreadsheet") &&
        !f.file_type.includes("presentation"),
    ),
  }

  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith("image/")) return <ImageIcon className="h-5 w-5" />
    if (fileType.startsWith("video/")) return <Video className="h-5 w-5" />
    if (fileType.startsWith("audio/")) return <Music className="h-5 w-5" />
    if (fileType.includes("pdf") || fileType.includes("document") || fileType.includes("text")) {
      return <FileText className="h-5 w-5" />
    }
    return <File className="h-5 w-5" />
  }

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

  const handleFileUpload = (newFiles: FileItem[]) => {
    setFiles((prev) => [...newFiles, ...prev])
  }

  const handleDeleteFile = async (fileId: string) => {
    if (!confirm("Are you sure you want to delete this file?")) return

    // TODO: Implement actual file deletion
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  const renderFileCard = (file: FileItem) => (
    <Card
      key={file.id}
      className={`bg-card border-border hover:bg-card/80 transition-all cursor-pointer ${
        selectedFiles.includes(file.id) ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => toggleFileSelection(file.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            {getFileIcon(file.file_type)}
            <span className="text-sm font-medium text-foreground truncate max-w-[150px]">{file.original_filename}</span>
          </div>
          <div className="flex items-center gap-1">{getPrivacyIcon(file.privacy_level)}</div>
        </div>

        {file.file_type.startsWith("image/") && (
          <div className="mb-3">
            <img
              src={file.file_url || "/placeholder.svg"}
              alt={file.original_filename}
              className="w-full h-32 object-cover rounded border border-border"
            />
          </div>
        )}

        <div className="space-y-2 text-xs text-muted-foreground">
          <div className="flex justify-between">
            <span>{formatBytes(file.file_size)}</span>
            <Badge variant="outline" className="text-xs capitalize">
              {file.privacy_level}
            </Badge>
          </div>
          <div>{formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}</div>
        </div>

        <div className="flex items-center gap-1 mt-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              setPreviewFile(file)
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              window.open(file.file_url, "_blank")
            }}
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              // TODO: Implement share functionality
            }}
          >
            <Share className="h-3 w-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation()
              handleDeleteFile(file.id)
            }}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )

  const renderFileRow = (file: FileItem) => (
    <Card
      key={file.id}
      className={`bg-card border-border hover:bg-card/80 transition-all cursor-pointer ${
        selectedFiles.includes(file.id) ? "ring-2 ring-primary" : ""
      }`}
      onClick={() => toggleFileSelection(file.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            {getFileIcon(file.file_type)}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground truncate">{file.original_filename}</p>
              <p className="text-sm text-muted-foreground">
                {formatBytes(file.file_size)} • {formatDistanceToNow(new Date(file.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {getPrivacyIcon(file.privacy_level)}
            <Badge variant="outline" className="text-xs capitalize">
              {file.privacy_level}
            </Badge>

            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  setPreviewFile(file)
                }}
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(file.file_url, "_blank")
                }}
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  handleDeleteFile(file.id)
                }}
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* File Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{files.length}</div>
            <div className="text-sm text-muted-foreground">Total Files</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">{filesByType.images.length}</div>
            <div className="text-sm text-muted-foreground">Images</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">{filesByType.videos.length}</div>
            <div className="text-sm text-muted-foreground">Videos</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-secondary mb-1">{filesByType.documents.length}</div>
            <div className="text-sm text-muted-foreground">Documents</div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary mb-1">
              {formatBytes(files.reduce((acc, file) => acc + file.file_size, 0))}
            </div>
            <div className="text-sm text-muted-foreground">Total Size</div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search files..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-input border-border"
                />
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-32 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="image">Images</SelectItem>
                  <SelectItem value="video">Videos</SelectItem>
                  <SelectItem value="audio">Audio</SelectItem>
                  <SelectItem value="application">Documents</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterPrivacy} onValueChange={setFilterPrivacy}>
                <SelectTrigger className="w-32 bg-input border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Privacy</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="friends">Friends</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center border border-border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>

              <Button onClick={() => setUploadDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                <Upload className="h-4 w-4 mr-2" />
                Upload Files
              </Button>
            </div>
          </div>

          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-between mt-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
              <span className="text-sm text-foreground">{selectedFiles.length} files selected</span>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedFiles([])}>
                  Clear Selection
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Delete ${selectedFiles.length} selected files?`)) {
                      setFiles((prev) => prev.filter((f) => !selectedFiles.includes(f.id)))
                      setSelectedFiles([])
                    }
                  }}
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete Selected
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files Display */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-6 bg-card border border-border">
          <TabsTrigger value="all">All ({filteredFiles.length})</TabsTrigger>
          <TabsTrigger value="images">Images ({filesByType.images.length})</TabsTrigger>
          <TabsTrigger value="videos">Videos ({filesByType.videos.length})</TabsTrigger>
          <TabsTrigger value="audio">Audio ({filesByType.audio.length})</TabsTrigger>
          <TabsTrigger value="documents">Docs ({filesByType.documents.length})</TabsTrigger>
          <TabsTrigger value="other">Other ({filesByType.other.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {filteredFiles.length > 0 ? (
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                  : "space-y-2"
              }
            >
              {filteredFiles.map((file) => (viewMode === "grid" ? renderFileCard(file) : renderFileRow(file)))}
            </div>
          ) : (
            <Card className="bg-card border-border">
              <CardContent className="p-8 text-center">
                <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No files found</h3>
                <p className="text-muted-foreground mb-4">Upload your first file to get started</p>
                <Button onClick={() => setUploadDialogOpen(true)} className="bg-primary hover:bg-primary/90">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {Object.entries(filesByType).map(([type, typeFiles]) => (
          <TabsContent key={type} value={type} className="mt-6">
            {typeFiles.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
                    : "space-y-2"
                }
              >
                {typeFiles.map((file) => (viewMode === "grid" ? renderFileCard(file) : renderFileRow(file)))}
              </div>
            ) : (
              <Card className="bg-card border-border">
                <CardContent className="p-8 text-center">
                  <File className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No {type} files</h3>
                  <p className="text-muted-foreground">Upload some {type} files to see them here</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Dialogs */}
      <FileUploadDialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen} onUpload={handleFileUpload} />

      {previewFile && (
        <FilePreviewDialog file={previewFile} open={!!previewFile} onOpenChange={() => setPreviewFile(null)} />
      )}
    </div>
  )
}
