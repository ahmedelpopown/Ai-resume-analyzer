import { useCallback, useState } from "react"
import React from 'react'
import { useDropzone } from 'react-dropzone'
import { formaSize } from "~/utils";
interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void;

}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0]
            || null
        onFileSelect?.(file)
    }, [onFileSelect])
    const maxFileSize = 20 * 1024 * 1024;//20mb

    const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize

    })
    const file = acceptedFiles[0] || null
    return (
        <div className='w-full gradient-border'>
            <div {...getRootProps()}>
                <input {...getInputProps()} />
                <div className="space-y-4 cursor-pointer">
                    <div className="mx-auto w-16 h-16 flex items-center justify-center">
                        <img src="/icons/info.svg" alt="icon" className="size-20" />
                    </div>
                    {file ? (
                        <div className="">
                            <div className="uploader-selected-file" onClick={(e) => e.stopPropagation}>
                                <img src="/images/pdf.png" alt="pdf" className="size-10" />
                                <div className="flex items-center space-x-3">
                                    <div>
                                        <p className="text-gray-700 text-sm max-w-xs font-medium truncate">
                                            {file.name}
                                        </p>

                                        <p className="text-lg text-gray-500 ">PDF(max {file.size})</p>

                                    </div>

                                </div>
                                <button onClick={(e) => {
                                    onFileSelect?.(null)
                                }} className="cursor-pointer p-4">

                                    <img src="/icons/cross.svg" alt="remove" className="size-4" />
                                </button>
                            </div>

                        </div>

                    ) : (
                        <div className="flex items-start ">
                            <div className="mb-2 mx-auto h-16 w-16 flex items-center justify-center">
                                {/* <img src="/images/pdf.png" alt="pdf" className="size-10" /> */}
                            </div>

                            <p className="text-lg  text-gray-500">
                                <span className="font-semibold">Click To Upload</span>or drag and drop
                            </p>

                            <p className="text-lg text-gray-500 ">PDF(max {formaSize((maxFileSize))})</p>


                        </div>


                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader
