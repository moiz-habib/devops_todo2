import {
	Table,
	TableHeader,
	TableBody,
	TableRow,
	TableHead,
	TableCell,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Todo } from "@/../../types";

interface Props {
	todos: Todo[];
	toggle: (id: number) => void;
}

export default function TodoTable({ todos, toggle }: Props) {
	return (
		<Table className="w-full divide-y">
			<TableHeader>
				<TableRow>
					<TableHead className="w-12 p-2">Done</TableHead>
					<TableHead>Task</TableHead>
				</TableRow>
			</TableHeader>
			<TableBody>
				{todos.map((todo) => (
					<TableRow key={todo.id}>
						<TableCell className="p-2">
							<Checkbox
								checked={todo.done}
								onCheckedChange={() => toggle(todo.id)}
							/>
						</TableCell>
						<TableCell
							className={
								todo.done ? "line-through text-gray-400" : ""
							}
						>
							{todo.text}
						</TableCell>
					</TableRow>
				))}
			</TableBody>
		</Table>
	);
}
