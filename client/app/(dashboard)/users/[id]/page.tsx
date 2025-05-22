"use client"
import {useState} from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, UserCog, Users, History, Shield, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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

export default  function UserProfilePage(props: { params: { id: string } }) {

  const { params } =  props
 
  const user = users.find((u) => u.id === params.id) || users[0]
  const [selectedHistory, setSelectedHistory] = useState<any | null>(null);


    function formatDate(dateString: string) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {user.name} {user.surname}
          </h1>
          <p className="text-muted-foreground">User profile and account management</p>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">
            <UserCog className="h-4 w-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="followers">
            <Users className="h-4 w-4 mr-2" />
            Connections
          </TabsTrigger>
          <TabsTrigger value="history">
            <History className="h-4 w-4 mr-2" />
            History
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>View and update user profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" defaultValue={user.name} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname</Label>
                  <Input id="surname" defaultValue={user.surname} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue={user.email} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue={user.phone} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type</Label>
                  <Select defaultValue={user.idType}>
                    <SelectTrigger id="idType">
                      <SelectValue placeholder="Select ID type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ID">ID</SelectItem>
                      <SelectItem value="ID">ID</SelectItem>
                      <SelectItem value="Asylum Seeker">Asylum Seeker</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select defaultValue={user.status}>
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      
                      <SelectItem value="Suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset</Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="followers">
          <Card>
            <CardHeader>
              <CardTitle>Followers Information</CardTitle>
              <CardDescription>View Followers </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Followers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.followers}</div>
                    <p className="text-xs text-muted-foreground">Last updated: Today at 12:34 PM</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Following</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{user.following}</div>
                    <p className="text-xs text-muted-foreground">Last updated: Today at 12:34 PM</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" className="gap-2">
                <AlertTriangle className="h-4 w-4" />
                Suspend Account
              </Button>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>History</CardTitle>
              <CardDescription>User Activity History</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                   {user.history && user.history.length > 0 ? (
                  user.history.map((item: any, idx: number) => (
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

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Manage user security and access</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resetPassword">Reset Password</Label>
                <div className="flex gap-2">
                  <Button variant="outline" className="w-full">
                    Send Reset Link
                  </Button>
                  <Button className="w-full">Generate Temporary Password</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Two-Factor Authentication</Label>
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <div className="font-medium">2FA Status</div>
                    <div className="text-sm text-muted-foreground">
                      {user.twoFactorEnabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                  <Button variant={user.twoFactorEnabled ? "destructive" : "outline"}>
                    {user.twoFactorEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
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
    idType: "ID",
    phone: "+27 71 234 5678",
    status: "Active",
    followers: 1200,
    following: 350,
    accountCreated: "2023-01-15",
    twoFactorEnabled: false,
    history: [
      { type: "post", description: "Uploaded a post", date: "2024-05-20" },
      { type: "comment", description: "Commented on a post", date: "2024-05-18" },
    ],
  },
  {
    id: "2",
    name: "Nomzamo",
    surname: "Mbatha",
    email: "nomzamo.mbatha@example.com",
    idType: "ID",
    phone: "+27 82 345 6789",
    status: "Active",
    followers: 3450,
    following: 410,
    accountCreated: "2023-06-18",
    twoFactorEnabled: true,
    history: [
      { type: "post", description: "Uploaded a post", date: "2024-05-19" },
      { type: "comment", description: "Commented on a post", date: "2024-05-17" },
    ],
  },
  {
    id: "3",
    name: "Siya",
    surname: "Kolisi",
    email: "siya.kolisi@example.com",
    idType: "ID",
    phone: "+27 63 456 7890",
    status: "Active",
    followers: 50000,
    following: 1200,
    accountCreated: "2023-04-30",
    twoFactorEnabled: false,
    history: [
      { type: "post", description: "Uploaded a post", date: "2024-05-15" },
      { type: "comment", description: "Commented on a post", date: "2024-05-14" },
    ],
  },
  {
    id: "4",
    name: "Bonang",
    surname: "Matheba",
    email: "bonang.matheba@example.com",
    idType: "ID",
    phone: "+27 74 567 8901",
    status: "Active",
    followers: 0,
    following: 50,
    accountCreated: "2023-08-05",
    twoFactorEnabled: false,
    history: [
      { type: "post", description: "Uploaded a post", date: "2024-05-10" },
    ],
  },
  {
    id: "5",
    name: "Trevor",
    surname: "Noah",
    email: "trevor.noah@example.com",
    idType: "ID",
    phone: "+27 85 678 9012",
    status: "Active",
    followers: 12500,
    following: 900,
    accountCreated: "2023-02-14",
    twoFactorEnabled: true,
    history: [
      { type: "comment", description: "Commented on a post", date: "2024-05-12" },
    ],
  },
]