'use client';

import { format } from 'date-fns';
import { Briefcase } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';

export function EmploymentSettings({ user }: { user: any }) {
  // Format employment status for display
  const formatEmploymentStatus = (status: string | null | undefined) => {
    if (!status) return 'N/A';

    const statusMap: Record<
      string,
      {
        label: string;
        variant: 'default' | 'outline' | 'secondary' | 'destructive';
      }
    > = {
      ACTIVE: { label: 'Active', variant: 'default' },
      PROBATION: { label: 'Probation', variant: 'secondary' },
      SUSPENDED: { label: 'Suspended', variant: 'destructive' },
      TERMINATED: { label: 'Terminated', variant: 'destructive' },
      ON_LEAVE: { label: 'On Leave', variant: 'outline' },
    };

    return statusMap[status] || { label: status, variant: 'outline' };
  };

  // Format employment type for display
  const formatEmploymentType = (type: string | null | undefined) => {
    if (!type) return 'N/A';
    return type
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  // Format department for display
  const formatDepartment = (department: string | null | undefined) => {
    if (!department) return 'N/A';
    return department
      .replace('_', ' ')
      .toLowerCase()
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Briefcase className="mr-2 h-5 w-5" />
            Employment Information
          </CardTitle>
          <CardDescription>
            View your current employment details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">Employment Status</p>
                <p className="text-sm text-muted-foreground">
                  Your current status
                </p>
              </div>
              <Badge variant={user?.employmentStatus}>
                {user?.employmentStatus}
              </Badge>
            </div>

            <Table>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Employee ID</TableCell>
                  <TableCell>{user?.employeeId || 'Not assigned'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Position</TableCell>
                  <TableCell>{user?.position || 'Not specified'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Department</TableCell>
                  <TableCell>
                    {formatDepartment(user?.employmentDepartment as string)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Employment Type</TableCell>
                  <TableCell>
                    {formatEmploymentType(user?.employmentType as string)}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Hire Date</TableCell>
                  <TableCell>
                    {user?.hireDate
                      ? format(new Date(user.hireDate), 'PPP')
                      : 'Not specified'}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">
                    Reporting Manager
                  </TableCell>
                  <TableCell>
                    {user?.reportingManagerId ? 'Assigned' : 'Not assigned'}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <p className="text-sm text-muted-foreground">
              To update your employment information, please contact your HR
              department.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
