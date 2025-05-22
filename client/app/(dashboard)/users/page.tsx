"use client"
import ifteeImg from './iftee.jpg'

import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"  
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserCog } from "lucide-react"
import Link from "next/link"
//import { CreateUserDialog } from "@/components/create-user-dialog"

const filterOptions = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "ID Type", value: "idType" },
]

export default function UsersPage() {
  const [search, setSearch] = useState("")
  const [filterBy, setFilterBy] = useState<"name" | "email" | "phone">("name")
  const [dropdownOpen, setDropdownOpen] = useState(false)

 const filteredUsers = users.filter((user) => {
    const value =
      filterBy === "name"
        ? `${user.name} ${user.surname}`
        : filterBy === "email"
        ? user.email
        : user.phone
    return value.toLowerCase().includes(search.toLowerCase())
  })

  // Export table data as CSV
  const handleExport = () => {
    const headers = ["Name", "Email", "ID Type", "Phone", "Status"]
    const rows = filteredUsers.map(user => [
      `"${user.name} ${user.surname}"`,
      `"${user.email}"`,
      `"${user.idType}"`,
      `"${user.phone}"`,
      `"${user.status}"`
    ])
    const csvContent =
      headers.join(",") + "\n" +
      rows.map(row => row.join(",")).join("\n")

    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "users.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts</p>
        </div>
       
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2 w-full max-w-sm">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                 placeholder={`Search by ${filterBy}`}
                 className="h-9"
                 value={search}
                 onChange={e => setSearch(e.target.value)}
/>
            </div>
            <div className="flex items-center gap-2 ml-auto">
              <Button variant="outline" size="sm" onClick={handleExport}>
                Export
              </Button>
              <div className="relative">
                <Button
                 variant="outline"
                 size="sm"
                 className="flex items-center gap-1"
                 onClick={() => setDropdownOpen((open) => !open)}
                 type="button"
  >
    Filter: {filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
    <ChevronDown className="h-4 w-4" />
  </Button>
  {dropdownOpen && (
    <div className="absolute right-0 mt-2 w-32 bg-white border rounded shadow z-10">
      {["name", "email", "phone"].map(option => (
        <button
          key={option}
          className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${
            filterBy === option ? "bg-gray-100 font-semibold" : ""
          }`}
          onClick={() => {
            setFilterBy(option as "name" | "email" | "phone")
            setDropdownOpen(false)
            setSearch("")
          }}
          type="button"
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  )}
</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <div className="w-full min-w-[640px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Photo</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>ID Type</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={typeof user.photo === "string" ? user.photo : user.photo?.src} alt={user.name} />
                         <AvatarFallback>
                          {user.name[0]}
                          {user.surname ? user.surname[0] : ""}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.name} {user.surname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.idType}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.status === "Active"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                        }`}
                      >
                        {user.status}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/users/${user.id}`}>
                          <UserCog className="h-4 w-4" />
                          <span className="sr-only">Edit user</span>
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

const users = [
  {
    id: "1",
    name: "Iftekharul Islam",
    surname: "Iftee",
    email: "iftee@example.com",
    idType: "ID",
    phone: "+27 71 234 5678",
    status: "Active",
    photo: ifteeImg,
  },
  {
    id: "2",
    name: "Arqam Bin",
    surname: "Almas",
    email: "arqam@example.com",
    idType: "ID",
    phone: "+27 82 345 6789",
    status: "Active",
    photo:"arqam.jpg"
  },
  {
    id: "3",
    name: "Ruslan",
    surname: "Sunbeeb",
    email: "ruslan@example.com",
    idType: "ID",
    phone: "+27 63 456 7890",
    status: "Active",
    photo:"ruslan.jpg"
  },
  {
    id: "4",
    name: "Ibrahim Reza",
    surname: "Rabbi",
    email: "rabbi@example.com",
    idType: "ID",
    phone: "+27 74 567 8901",
    status: "Active",
  },
  {
    id: "5",
    name: "Trevor",
    surname: "Noah",
    email: "trevor.noah@example.com",
    idType: "ID",
    phone: "01234567890",
    status: "Active",
  },
  {
    id: "6",
    name: "Patrice",
    surname: "Motsepe",
    email: "patrice.motsepe@example.com",
    idType: "ID",
    phone: "01567890123",
    status: "Active",
  },
  {
    id: "7",
    name: "Caster",
    surname: "Semenya",
    email: "caster.semenya@example.com",
    idType: "ID",
    phone: "01897854632",
    status: "Active",
  },
  {
    id: "8",
    name: "Elon",
    surname: "Musk",
    email: "elon.musk@example.com",
    idType: "Asylum Seeker",
    phone: "01678901011",
    status: "Active",
  },
]