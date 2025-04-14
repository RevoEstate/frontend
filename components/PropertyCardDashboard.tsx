import Image from "next/image"
import { formatCurrency } from "@/lib/utils"

interface PropertyProps {
  property: {
    id: number
    title: string
    price: number
    beds: number
    baths: number
    sqft: number
    image: string
  }
}

export function PropertyCard({ property }: PropertyProps) {
  const { title, price, beds, baths, sqft, image } = property

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md">
      <div className="relative h-60 w-full">
        <Image
          src={image || "/placeholder.svg"}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      <div className="p-4">
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-2xl font-bold mt-1">{formatCurrency(price)}</p>

        <div className="flex items-center gap-2 text-gray-600 mt-2">
          <span>{beds} beds</span>
          <span>·</span>
          <span>{baths} bath</span>
          <span>·</span>
          <span>{sqft.toLocaleString()} sq ft</span>
        </div>

        <div className="flex gap-4 mt-4">
          <button className="text-blue-500 hover:underline">Edit</button>
          <button className="text-blue-500 hover:underline">Delete</button>
        </div>
      </div>
    </div>
  )
}
