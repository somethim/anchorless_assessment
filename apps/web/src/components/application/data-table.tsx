import {useNavigate} from 'react-router-dom';
import type {Applications} from '@/types/applicationResponse.ts';
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from '../ui/table.tsx';

type Application = Applications['items'][number];

type DataTableProps = {
    data: Application[];
};

export function DataTable({data}: DataTableProps) {
    const navigate = useNavigate();

    const handleRowClick = (app: Application) => {
        navigate(`/application/${app._id}`, {
            state: {application: app},
        });
    };

    const formatDate = (date: string | null) => {
        if (!date) return '-';
        const d = new Date(date);
        return d.toLocaleDateString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>User UUID</TableHead>
                    <TableHead>Created At</TableHead>
                    <TableHead>Updated At</TableHead>
                    <TableHead>Deleted At</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((app) => (
                    <TableRow
                        key={app._id}
                        onClick={() => handleRowClick(app)}
                        className="cursor-pointer hover:bg-gray-100"
                    >
                        <TableCell>{app._id}</TableCell>
                        <TableCell>{app.user_uuid}</TableCell>
                        <TableCell>{formatDate(app._createdAt)}</TableCell>
                        <TableCell>{formatDate(app._updatedAt)}</TableCell>
                        <TableCell>{formatDate(app._deletedAt)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
