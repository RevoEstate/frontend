export interface Package {
  _id: string
  userId: string
  packageName: string
  packagePrice: {
    usd: number
    etb: number
  }
  packageDuration: number
  packageType: "premium" | "standard"
  packageDescription: string
  numberOfProperties: number
  createdAt: string
  updatedAt: string
}

export interface PackageFilter {
  search?: string
  packageType?: "premium" | "standard"
  minPrice?: number
  maxPrice?: number
  minDuration?: number
  maxDuration?: number
  minProperties?: number
  maxProperties?: number
}

export interface PackageSort {
  field: string
  direction: "asc" | "desc"
}

export interface PackagePagination {
  page: number
  limit: number
  total?: number
}
