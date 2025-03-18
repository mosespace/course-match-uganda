export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string | Date;
  endDate: string | Date;
  reason: string | null;
  status: string;
  approvedBy: string | null;
  remarks: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export interface LeaveFormData {
  leaveType: string;
  startDate: Date;
  endDate: Date;
  reason: string;
}

export interface LeaveStatisticsData {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}
