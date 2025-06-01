"use client";
import toast, { Toaster } from "react-hot-toast";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ArrowLeft,
  UserCog,
  Users,
  History,
  Shield,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function HistoryModal({ item, onClose }: { item: any; onClose: () => void }) {
  if (!item) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-lg font-bold mb-2">
          {item.type === "post" ? "Post Details" : "Comment Details"}
        </h2>
        {item.content && (
          <div className="mb-4">
            <span className="font-semibold">Content:</span>
            <div className="mt-1">{item.content}</div>
          </div>
        )}
        <p className="mb-2">{item.message}</p>
        <p className="text-sm text-muted-foreground">Date: {item.timestamp}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default function UserProfilePage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);
  const [user, setUser] = useState<any>(null);
  const [selectedHistory, setSelectedHistory] = useState<any | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const [form, setForm] = useState({
    name: "",
    displayName: "",
    email: "",
    idType: "",
    phone: "",
    status: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8000/users/${id}/history`)
      .then(res => res.json())
      .then(data => {
        setHistory(data.history || []);
        setLoadingHistory(false);
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8000/users/${id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched user data:", data);
        setUser(data);
        setForm({
          name: data.username || "",
          displayName: data.display_name || "",
          email: data.email || "",
          idType: data.role || "",
          phone: data.phone_no || "",
          status: data.status || "",
        });
      });
  }, [id]);

  useEffect(() => {
    fetch(`http://localhost:8000/users/${id}/followers`)
      .then(res => res.json())
      .then(data => {
        setFollowersCount(data.followers_count || 0);
      });

    fetch(`http://localhost:8000/users/${id}/following`)
      .then(res => res.json())
      .then(data => {
        setFollowingCount(data.following_count || 0);
      });
  }, [id]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      const res = await fetch(`http://localhost:8000/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: form.status,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update user");
      }

      toast.success("User updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Error updating user");
    }
  };

  if (!user) return <div>Loading...</div>;

  function formatDate(dateString: string) {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  }

  // ...rest of your component (JSX return)


  return (
    <div className="flex flex-col gap-4">
      <Toaster position="bottom-right" />
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/users">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{user.username}</h1>
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
    <Label htmlFor="username">Username</Label>
    <Input id="username" value={form.name} readOnly />
  </div>
  <div className="space-y-2">
    <Label htmlFor="displayName">Display Name</Label>
<Input
  id="displayName"
  value={form.displayName}
  readOnly
  placeholder="not given"
  className={!form.displayName ? "text-muted-foreground" : ""}
/>

  </div>
</div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={form.email} readOnly />
                </div>
<div className="space-y-2">
  <Label htmlFor="phone">Phone Number</Label>
  <Input
    id="phone"
    value={form.phone}
    readOnly
    placeholder="not given"
    className={!form.phone ? "text-muted-foreground" : ""}
  />
</div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="idType">ID Type</Label>
                  <Input id="idType" value={form.idType} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Account Status</Label>
                  <Select
                    value={form.status}
                    onValueChange={(value) => handleChange("status", value)}
                    disabled={form.idType === "admin"} // Disable if admin
                  >
                    <SelectTrigger id="status" disabled={form.idType === "admin"}>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={() =>
                  setForm({
                    name: user.username || "",
                    displayName: user.display_name || "",
                    email: user.email || "",
                    idType: user.role || "",
                    phone: user.phone_no || "",
                    status: user.status || "",
                  })
                }
              >
                Reset
              </Button>
              <Button onClick={handleSave}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="followers">
          <Card>
            <CardHeader>
              <CardTitle>Followers Information</CardTitle>
              <CardDescription>View Followers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Current Followers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{followersCount}</div>
                    <p className="text-xs text-muted-foreground">Last updated: Today at 12:34 PM</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Following</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{followingCount}</div>
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
{loadingHistory ? (
  <div className="text-center text-muted-foreground text-sm">Loading history...</div>
) : (
  <div
    style={{ maxHeight: 400, overflowY: "auto" }}
    className="pr-2 space-y-2"
  >
    {history.length > 0 ? (
  history.map((item, idx) => (
    <div
      key={idx}
      className="flex items-center min-h-[60px] hover:bg-muted/40 rounded p-2 cursor-pointer"
      onClick={() => setSelectedHistory(item)}
    >
      <span className="text-xl mr-3">
        {item.type === "post" ? "📝" : item.type === "comment" ? "💬" : "📌"}
      </span>
      <div>
        <div className="text-sm font-medium">{item.message}</div>
        <div className="text-xs text-muted-foreground">{item.timestamp}</div>
      </div>
    </div>
  ))
) : (
  <div className="text-muted-foreground text-sm">No history yet.</div>
)}
  </div>
)}
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
                  <Button
                    variant={user.twoFactorEnabled ? "destructive" : "outline"}
                  >
                    {user.twoFactorEnabled ? "Disable" : "Enable"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
