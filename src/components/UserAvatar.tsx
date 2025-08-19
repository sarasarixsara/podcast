"use client"

import Image from "next/image"
import { useState } from "react"

interface UserAvatarProps {
  src?: string
  alt: string
  size?: "small" | "medium" | "large"
  className?: string
}

export default function UserAvatar({ src, alt, size = "medium", className = "" }: UserAvatarProps) {
  const [imgSrc, setImgSrc] = useState(src || "https://via.placeholder.com/150")
  
  const sizeClasses = {
    small: "w-8 h-8",
    medium: "w-12 h-12", 
    large: "w-16 h-16"
  }

  const handleError = () => {
    setImgSrc("https://via.placeholder.com/150")
  }

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className="rounded-full object-cover"
        onError={handleError}
      />
    </div>
  )
}
