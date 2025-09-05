"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface CsvUploadProps {
  onUploadComplete: () => void
}

export function CsvUpload({ onUploadComplete }: CsvUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResult, setUploadResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.name.endsWith(".csv")) {
      toast({
        title: "Invalid file type",
        description: "Please upload a CSV file",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setUploadResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/inventory/import", {
        method: "POST",
        body: formData,
      })

      const result = await response.json()

      if (result.success) {
        setUploadResult(result)
        toast({
          title: "Upload successful",
          description: result.message,
        })
        onUploadComplete()
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to process CSV file",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Upload className="h-5 w-5" />
          <span>Import Inventory</span>
        </CardTitle>
        <CardDescription>Upload a CSV file to import or update inventory items</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center space-x-4">
          <Button onClick={triggerFileInput} disabled={isUploading} className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>{isUploading ? "Processing..." : "Choose CSV File"}</span>
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
        </div>

        {uploadResult && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="font-medium text-green-800">Upload Complete</span>
            </div>
            <div className="text-sm text-green-700 space-y-1">
              <p>• {uploadResult.imported} items imported</p>
              <p>• {uploadResult.updated} items updated</p>
              {uploadResult.errors > 0 && (
                <p className="flex items-center space-x-1">
                  <AlertCircle className="h-4 w-4" />
                  <span>• {uploadResult.errors} errors encountered</span>
                </p>
              )}
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500">
          <p>CSV format: Product Name, Quantity, Threshold, Category, Supplier</p>
        </div>
      </CardContent>
    </Card>
  )
}
