import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/shared/ui/table"
import { Button } from "@/shared/ui/button";
import { Edit, Trash2, InfoIcon } from 'lucide-react';
import { User } from "../types";

interface UserTableProps {
    users: User[],
    isMutating: boolean,
    onView: (user: User) => void
    onEdit: (user: User) => void
    onDelete: (user: User) => void

}
export default function UserTable({ users, isMutating, onDelete, onEdit, onView }: UserTableProps) {

    return (
        <Table className="mt-5">
            <TableHeader>
                <TableRow>
                    <TableHead className="text-center w-[50px]">#</TableHead>
                    <TableHead className="text-center">Username</TableHead>
                    <TableHead className="text-center">Name</TableHead>
                    <TableHead className="text-center">Email</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {users.map((user, index) => (
                    <TableRow key={user.id}>
                        <TableCell className="text-center font-medium">{index + 1}</TableCell>
                        <TableCell className="text-center font-medium">{user.username}</TableCell>
                        <TableCell className="text-center">{user.full_name || "—"}</TableCell>
                        <TableCell className="text-center">{user.email || "—"}</TableCell>
                        <TableCell className="text-right">
                            {user.username !== 'admin' && (
                                <div className="flex items-center justify-end gap-1">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={isMutating}
                                        onClick={() => onEdit(user)}
                                        className="h-8 w-8 p-0 hover:text-blue-700"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => onView(user)}
                                        className="h-8 w-8 p-0 hover:text-blue-700"
                                    >
                                        <InfoIcon className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        disabled={isMutating}
                                        onClick={() => onDelete(user)}
                                        className="h-8 w-8 p-0 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}