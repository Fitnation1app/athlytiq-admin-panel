"use client"

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

export default function UsersPage() {
  const isChecking = useAuthGuard()
  const [search, setSearch] = useState("")
  const [filterBy, setFilterBy] = useState<"name" | "email" | "phone">("name")
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [communities, setCommunities] = useState<any[]>([]);

    useEffect(() => {
    fetch("http://localhost:8000/communities")
      .then(res => res.json())
      .then(data => setCommunities(data));
  }, []);

  if (isChecking) return null

    const filteredCommunities = communities.filter((community) => {
  const value =
    filterBy === "name"
      ? community.name
      : filterBy === "email"
      ? community.owner // or community.email if you have it
      : community.contact;
  return value.toLowerCase().includes(search.toLowerCase());
});

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Communities</h1>
          <p className="text-muted-foreground">Manage communities</p>
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
                  <TableHead>Owner</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Contact No.</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommunities.map((community) => (
                  <TableRow key={community.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={community.image_url || undefined} alt={community.name} />
                        <AvatarFallback>
                            {community.name?.[0] || "?"}
                            </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="font-medium">{community.name}</TableCell>
                    <TableCell>{community.creator_name}</TableCell>
                    <TableCell>{community.member_count}</TableCell>
                    <TableCell className={!community.creator_phone ? "text-muted-foreground" : ""}>
  {community.creator_phone ? community.creator_phone : "not given"}
</TableCell>
                    <TableCell>
                      
                      <div
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          community.community_status === "active"
                            ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                            : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
                        }`}
                      >
                            {community.community_status.charAt(0).toUpperCase() + community.community_status.slice(1)}

                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" asChild>
                        <Link href={`/comms/${community.id}`}>
                          <UserCog className="h-4 w-4" />
                          <span className="sr-only">Edit Community</span>
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

const communities = [
  {
    id: "1",
    name: "Fight  Club",
    owner: "Tyler Durden",
    members: 42,
    contact: "+27 71 234 5678",
    status: "Active",
    photo: "/groups/fitrunners.jpg",
  },
  // ...more communities
]