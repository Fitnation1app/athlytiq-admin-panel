"use client"
//import ifteeImg from './iftee.jpg'
import { X } from "lucide-react" 
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import { ChevronDown } from "lucide-react"  
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, UserCog } from "lucide-react"
import Link from "next/link"
//import { CreateUserDialog } from "@/components/create-user-dialog"
import useAuthGuard from "@/hooks/useAuthGuard"

const filterOptions = [
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "ID Type", value: "idType" },
]

export default function UsersPage() {
  const isChecking = useAuthGuard()
  

  const [modalOpen, setModalOpen] = useState(false)
  const [modalImg, setModalImg] = useState("")

  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState("")
  const [filterBy, setFilterBy] = useState<"name" | "email" | "phone">("name")
  const [dropdownOpen, setDropdownOpen] = useState(false)

   useEffect(() => {
    fetch("http://localhost:8000/users/")
      .then(res => res.json())
      .then(data => {
        // Map backend fields to frontend fields
        const mapped = data.map((user: any) => ({
          id: user.id,
          name: user.username || "",
          surname: "",
          email: user.email || "",
          idType: user.role || "",
          phone: user.phone_no || "",
          status: user.status || "",
          role: user.role || "",
          photo: user.profile_picture_url || "" ,
        }))
        setUsers(mapped)
      })
      .catch(err => {
        console.error("Failed to fetch users:", err)
        setUsers([])
      });
  }, []);

  if (isChecking) return null 

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

      {modalOpen && (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    onClick={() => setModalOpen(false)}
  >
    <div
      className="relative bg-transparent"
      onClick={e => e.stopPropagation()}
    >
      <button
        className="absolute top-2 right-2 bg-white rounded-full p-1 shadow hover:bg-gray-200"
        onClick={() => setModalOpen(false)}
      >
        <X className="h-5 w-5" />
      </button>
      <img
        src={modalImg}
        alt="Profile"
        className="max-w-[90vw] max-h-[80vh] rounded shadow-lg"
      />
    </div>
  </div>
)}

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
                      <Avatar
  className="cursor-pointer"
  onClick={() => {
    if (user.photo) {
      setModalImg(user.photo)
      setModalOpen(true)
    }
  }}
>
  <AvatarImage src={user.photo} alt={user.name} />
  <AvatarFallback>
    {user.name[0]}
  </AvatarFallback>
</Avatar>
                    </TableCell>
                    <TableCell className="font-medium">
                      {user.name} {user.surname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.idType}</TableCell>
                    <TableCell className={!user.phone ? "text-muted-foreground" : ""}>
  {user.phone ? user.phone : "not given"}
</TableCell>
                    <TableCell>
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          user.status === "active"
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
