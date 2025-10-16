import Image from 'next/image'
import { cn } from '@/lib/utils'

interface TarotCardImageProps {
  src: string
  alt: string
  className?: string
  flipped?: boolean
  priority?: boolean
}

export function TarotCardImage({
  src,
  alt,
  className,
  flipped = false,
  priority = false
}: TarotCardImageProps) {
  return (
    <div className={cn(
      "relative aspect-[2/3] overflow-hidden rounded-lg",
      flipped && "rotate-180",
      className
    )}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="object-cover"
        priority={priority}
        quality={90}
      />
    </div>
  )
}
