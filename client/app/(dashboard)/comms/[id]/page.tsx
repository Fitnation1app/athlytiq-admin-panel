"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, UserCog, Users, History } from "lucide-react"
import Link from "next/link"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"

function HistoryModal({ item, onClose }: { item: any, onClose: () => void }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-lg font-bold mb-2">
          {item.type === "post" ? "Post Details" : "Comment Details"}
        </h2>
        <p className="mb-2">{item.description}</p>
        <p className="text-sm text-muted-foreground">Date: {item.date}</p>
        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default function CommunityInfoPage(props: { params: { id: string } }) {
  const { params } = props;
  const community = communities.find((c) => c.id === params.id) || communities[0];
  const [selectedHistory, setSelectedHistory] = useState<any | null>(null);

  function formatDate(dateString: string) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/comms">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {community.name}
          </h1>
          <p className="text-muted-foreground">Community info and management</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <UserCog className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="members">
            <Users className="h-4 w-4 mr-2" />
            Members
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
  <Card>
    <CardHeader>
      <CardTitle>Community Profile</CardTitle>
      <CardDescription>View and update community details</CardDescription>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="communityName">Community Name</Label>
          <Input id="communityName" defaultValue={community.name} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="owner">Owner</Label>
          <Input id="owner" defaultValue={community.owner} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactNumber">Contact Number</Label>
          <Input id="contactNumber" defaultValue={community.phone} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="contactEmail">Contact Email</Label>
          <Input id="contactEmail" type="email" defaultValue={community.email} />
        </div>
      </div>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="outline">Reset</Button>
      <Button>Save Changes</Button>
    </CardFooter>
  </Card>
</TabsContent>

<TabsContent value="members">
  <Card>
    <CardHeader className="p-4">
      <CardTitle>Members</CardTitle>
      <CardDescription>List of community members</CardDescription>
    </CardHeader>
    <CardContent className="p-0 overflow-auto">
      <div className="w-full min-w-[640px]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Photo</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {community.members && community.members.length > 0 ? (
    community.members.map((member: any, idx: number) => {
      const user = users.find((u) => u.id === member.id);
      return (
        <TableRow key={idx}>
          <TableCell>
            <Avatar>
              <AvatarImage src={typeof user?.photo === "string" ? user.photo : user?.photo?.src} alt={user?.name} />
              <AvatarFallback>
                {user?.name?.[0]}
                {user?.surname ? user.surname[0] : ""}
              </AvatarFallback>
            </Avatar>
          </TableCell>
          <TableCell className="font-medium">
            {user?.name} {user?.surname}
          </TableCell>
          <TableCell>{user?.email}</TableCell>
          <TableCell>{member.role}</TableCell>
          <TableCell>{user?.phone}</TableCell>
          <TableCell>
            <div
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                user?.status === "Active"
                  ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300"
                  : "bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300"
              }`}
            >
              {user?.status}
            </div>
          </TableCell>
          <TableCell className="text-right">
            <Button variant="ghost" size="icon" asChild>
              <Link href={`/users/${user?.id ?? ""}`}>
                <UserCog className="h-4 w-4" />
                <span className="sr-only">Edit member</span>
              </Link>
            </Button>
          </TableCell>
        </TableRow>
      );
    })
  ) : (
    <TableRow>
      <TableCell colSpan={7} className="text-muted-foreground">
        No members yet.
      </TableCell>
    </TableRow>
  )}
</TableBody>
        </Table>
      </div>
    </CardContent>
  </Card>
</TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>Community Activity History</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {community.history && community.history.length > 0 ? (
                  community.history.map((item: any, idx: number) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 rounded px-2 py-1"
                      onClick={() => setSelectedHistory(item)}
                    >
                      {item.type === "post" && (
                        <span className="font-medium text-blue-600">📝</span>
                      )}
                      {item.type === "comment" && (
                        <span className="font-medium text-green-600">💬</span>
                      )}
                      <span>{item.description} on {formatDate(item.date)}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-muted-foreground">No history yet.</li>
                )}
              </ul>
            </CardContent>
          </Card>
          {selectedHistory && (
            <HistoryModal item={selectedHistory} onClose={() => setSelectedHistory(null)} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

const users = [
  {
    id: "1",
    name: "Thabo",
    surname: "Mbeki",
    email: "thabo.mbeki@example.com",
    phone: "+27 71 234 5678",
    status: "Active",
    photo: "/avatars/thabo.jpg",
  },
  {
    id: "2",
    name: "Nomzamo",
    surname: "Mbatha",
    email: "nomzamo.mbatha@example.com",
    phone: "+27 82 345 6789",
    status: "Active",
    photo: "/avatars/nomzamo.jpg",
  },
  {
    id: "3",
    name: "Siya",
    surname: "Kolisi",
    email: "siya.kolisi@example.com",
    phone: "+27 63 456 7890",
    status: "Active",
    photo: "/avatars/siya.jpg",
  },
  {
    id: "4",
    name: "Bonang",
    surname: "Matheba",
    email: "bonang.matheba@example.com",
    phone: "+27 74 567 8901",
    status: "Active",
    photo: "/avatars/bonang.jpg",
  },
  {
    id: "5",
    name: "Trevor",
    surname: "Noah",
    email: "trevor.noah@example.com",
    phone: "+27 85 678 9012",
    status: "Active",
    photo: "/avatars/trevor.jpg",
  },
];

const communities = [
  {
    id: "1",
    name: "FitNation Runners",
    owner: "Thabo Mbeki",
    phone: "+27 71 234 5678",
    email: "fitnation.runners@example.com",
    status: "Active",
    members: [
      { id: "1", role: "Owner" }, // Thabo Mbeki
      { id: "2", role: "Member" }, // Nomzamo Mbatha
    ],
    history: [
      { type: "post", description: "Uploaded a group run event", date: "2024-05-20" },
      { type: "comment", description: "Commented on a post", date: "2024-05-18" },
    ],
  },
  {
    id: "2",
    name: "Yoga Enthusiasts",
    owner: "Nomzamo Mbatha",
    phone: "+27 82 345 6789",
    email: "yoga.enthusiasts@example.com",
    status: "Active",
    members: [
      { id: "2", role: "Owner" }, // Nomzamo Mbatha
      { id: "3", role: "Member" }, // Siya Kolisi
    ],
    history: [
      { type: "post", description: "Shared a yoga session", date: "2024-05-19" },
      { type: "comment", description: "Commented on a yoga tip", date: "2024-05-17" },
    ],
  },
  {
    id: "3",
    name: "Strength Squad",
    owner: "Siya Kolisi",
    phone: "+27 63 456 7890",
    email: "strength.squad@example.com",
    status: "Active",
    members: [
      { id: "3", role: "Owner" }, // Siya Kolisi
      { id: "4", role: "Member" }, // Bonang Matheba
    ],
    history: [
      { type: "post", description: "Uploaded a strength workout", date: "2024-05-15" },
      { type: "comment", description: "Commented on a workout", date: "2024-05-14" },
    ],
  },
  {
    id: "4",
    name: "Wellness Warriors",
    owner: "Bonang Matheba",
    phone: "+27 74 567 8901",
    email: "wellness.warriors@example.com",
    status: "Active",
    members: [
      { id: "4", role: "Owner" }, // Bonang Matheba
      { id: "5", role: "Member" }, // Trevor Noah
    ],
    history: [
      { type: "post", description: "Shared a wellness tip", date: "2024-05-10" },
    ],
  },
  {
    id: "5",
    name: "Comedy Cardio",
    owner: "Trevor Noah",
    phone: "+27 85 678 9012",
    email: "comedy.cardio@example.com",
    status: "Active",
    members: [
      { id: "5", role: "Owner" }, // Trevor Noah
      { id: "1", role: "Member" }, // Thabo Mbeki
    ],
    history: [
      { type: "comment", description: "Commented on a funny workout", date: "2024-05-12" },
    ],
  },
]