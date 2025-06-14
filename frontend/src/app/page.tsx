"use client";

import { useState } from "react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import TodoTable from "@/components/TodoTable";
import { Todo } from "@/../../types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
	const queryClient = useQueryClient();
	const [newText, setNewText] = useState("");

	const { data: todos = [] } = useQuery({
		queryKey: ["todos"],
		queryFn: async () => {
			const res = await axios.get(`${API_URL}/todos`);
			return res.data as Todo[];
		},
	});

	const addTodo = useMutation({
		mutationFn: (text: string) =>
			axios.post(`${API_URL}/todos/`, { text, done: false }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const toggleTodo = useMutation({
		mutationFn: ({ id, done }: { id: number; done: boolean }) =>
			axios.put(`${API_URL}/todos/${id}`, { done }),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["todos"] });
		},
	});

	const handleAdd = () => {
		if (!newText.trim()) return;
		addTodo.mutate(newText.trim());
		setNewText("");
	};

	const handleToggle = (id: number, current: boolean) => {
		toggleTodo.mutate({ id, done: !current });
	};

	return (
		<div className="min-h-screen bg-gray-50 flex flex-col items-center py-10">
			<Card className="w-full max-w-xl">
				<CardHeader>
					<CardTitle>Todo App</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="flex space-x-2">
						<Label htmlFor="new-todo" className="sr-only">
							New Todo
						</Label>
						<Input
							id="new-todo"
							placeholder="What needs to be done?"
							value={newText}
							onChange={(e) => setNewText(e.target.value)}
						/>
						<Button onClick={handleAdd}>Add</Button>
					</div>
					<TodoTable
						todos={todos}
						toggle={(id) =>
							handleToggle(
								id,
								todos.find((t) => t.id === id)?.done ?? false
							)
						}
					/>
				</CardContent>
			</Card>
		</div>
	);
}
