/* eslint-disable @next/next/no-img-element */
"use client"

import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { X, Upload } from 'lucide-react'

import { SLIP_MAX_FILE_SIZE } from "@/lib/const"

interface SlipUploadProps {
    file: {file: File; preview: string } | null,
    setFile: (receipt: { file: File; preview: string } | null) => void
}

export function SlipUpload({ file, setFile }: SlipUploadProps) {
    const onDrop = useCallback(
    (acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
                const file = acceptedFiles[0]
                setFile({
                    file,
                    preview: URL.createObjectURL(file),
                })
            }
        },
        [setFile]
    )

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: SLIP_MAX_FILE_SIZE, // 10MB
    maxFiles: 1
  })

  const removeFile = () => {
    setFile(null)
  }

  return (
    <div>
      {!file ? (
        <div
          {...getRootProps()}
          className="p-4 border-2 border-dashed rounded-md text-center cursor-pointer bg-gray-50"
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto mb-2" size={24} />
          <p className="text-sm">Tap to upload slip</p>
        </div>
      ) : (
        <div className="mt-4 relative">
          <img
            src={file.preview}
            alt="Receipt"
            className="w-full h-48 object-cover rounded"
          />
          <button
            onClick={removeFile}
            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full"
          >
            <X size={20} />
          </button>
        </div>
      )}
    </div>
  )
}

