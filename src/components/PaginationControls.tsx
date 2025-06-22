"use client"

import { useRouter, useSearchParams } from "next/navigation"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationControlsProps {
  currentPage: number
  totalPages: number
}

export default function PaginationControls({ currentPage, totalPages }: PaginationControlsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", String(pageNumber))
    return `/?${params.toString()}`
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      router.push(createPageURL(currentPage - 1))
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      router.push(createPageURL(currentPage + 1))
    }
  }

  const pageNumbers = []
  const maxPageButtons = 5 // Max number of page buttons to show

  let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2))
  const endPage = Math.min(totalPages, startPage + maxPageButtons - 1)

  if (endPage - startPage + 1 < maxPageButtons) {
    startPage = Math.max(1, endPage - maxPageButtons + 1)
  }

  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i)
  }

  return (
    <Pagination className="mt-8">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            onClick={handlePrevious}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>

        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink href={createPageURL(1)}>1</PaginationLink>
            </PaginationItem>
            {startPage > 2 && (
              <PaginationItem>
                <span className="px-2 py-1.5 text-sm">...</span>
              </PaginationItem>
            )}
          </>
        )}

        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink href={createPageURL(page)} isActive={page === currentPage}>
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}

        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <span className="px-2 py-1.5 text-sm">...</span>
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink href={createPageURL(totalPages)}>{totalPages}</PaginationLink>
            </PaginationItem>
          </>
        )}

        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            onClick={handleNext}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
