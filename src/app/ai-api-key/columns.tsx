"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AIApiKey = {
  aiApiKeyId: number
  aiName: string
  aiApiKey: string
  createBy: string
  status: boolean
  createAt: string
  updateAt: string
  isShared: boolean
}

export const columns: ColumnDef<AIApiKey>[] = [
  {
    accessorKey: "aiName",
    header: "AI Name",
  },
  {
    accessorKey: "aiApiKey",
    header: "API Key",
    cell: ({ row }) => {
      const apiKey = row.getValue("aiApiKey") as string
      return <div>{apiKey.slice(0, 15)}...</div>
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as boolean
      return <div>{status ? "Active" : "Inactive"}</div>
    },
  },
  {
    accessorKey: "createAt",
    header: "Create At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createAt"))
      return <div>{date.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "updateAt",
    header: "Update At",
    cell: ({ row }) => {
      const date = new Date(row.getValue("updateAt"))
      return <div>{date.toLocaleString()}</div>
    },
  },
  {
    accessorKey: "createBy",
    header: "Create by",
  },
  {
    accessorKey: "isShared",
    header: "Shared",
    cell: ({ row }) => {
      const isShared = row.getValue("isShared") as boolean
      return <div>{isShared ? "Yes" : "No"}</div>
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const aiApiKey = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(aiApiKey.aiApiKey)}
            >
              Copy API Key
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]