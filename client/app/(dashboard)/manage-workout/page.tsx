"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Search, Pencil, Trash2, Plus } from "lucide-react";
import { Workout } from "@/app/types/workout";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function WorkoutTablePage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setimageUrl] = useState("");
  const [editId, setEditId] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      try {
        const res = await fetch("http://localhost:8000/workouts");
        const data = await res.json();
        setWorkouts(data);
      } catch (err) {
        console.error("Failed to fetch workouts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWorkouts();
  }, []);

  const filteredWorkouts = workouts.filter((w) =>
    w.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (workout: Workout) => {
    setEditId(workout.id);
    setName(workout.name);
    setDescription(workout.description);
    setimageUrl(workout.imageUrl);
  };

  const handleDelete = async (id: string) => {
    try {
      await fetch(`http://localhost:8000/workouts/${id}`, {
        method: "DELETE",
      });
      setWorkouts(workouts.filter((w) => w.id !== id));
    } catch (err) {
      console.error("Failed to delete workout:", err);
    }
  };

  const handleAddOrUpdateWorkout = async () => {
    const workoutData = { name, description, imageUrl };
    try {
      if (editId) {
        const res = await fetch(`http://localhost:8000/workouts/${editId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workoutData),
        });
        const updated = await res.json();
        setWorkouts(workouts.map((w) => (w.id === editId ? updated : w)));
      } else {
        const res = await fetch("http://localhost:8000/workouts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(workoutData),
        });
        const created = await res.json();
        setWorkouts([...workouts, created]);
      }

      setName("");
      setDescription("");
      setimageUrl("");
      setEditId(null);
    } catch (err) {
      console.error("Failed to submit workout:", err);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Workouts</h1>
          <p className="text-muted-foreground">Manage your workout plans</p>
        </div>
        {/* add workout button start */}
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" /> {editId ? "Edit Workout" : "Add Workout"}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editId ? "Edit Workout" : "Add Workout"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Name</Label>
                <Input value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>Description</Label>
                <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
              </div>
              <div className="grid gap-2">
                <Label>imageUrl URL</Label>
                <Input value={imageUrl} onChange={(e) => setimageUrl(e.target.value)} />
              </div>
              <Button onClick={handleAddOrUpdateWorkout}>Submit</Button>
            </div>
          </DialogContent>
        </Dialog>
        {/* add workout button end */}
      </div>

      <Card>
        <CardHeader className="p-4">
          <div className="flex items-center gap-2 w-full max-w-sm">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search workouts by name"
              className="h-9"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent className="p-0 overflow-auto">
          <div className="w-full min-w-[640px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>imageUrl</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWorkouts.map((workout) => (
                  <TableRow key={workout.id}>
                    <TableCell className="font-medium">{workout.name}</TableCell>
                    <TableCell>{workout.description}</TableCell>
                    <TableCell>
                      {workout.imageUrl && (
                        <a
                          href={workout.imageUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          View
                        </a>
                      )}
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => handleEdit(workout)}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Workout</DialogTitle>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label>Name</Label>
                              <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                              <Label>Description</Label>
                              <Textarea value={description} onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="grid gap-2">
                              <Label>imageUrl URL</Label>
                              <Input value={imageUrl} onChange={(e) => setimageUrl(e.target.value)} />
                            </div>
                            <Button onClick={handleAddOrUpdateWorkout}>Update</Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDelete(workout.id)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
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
  );
}
