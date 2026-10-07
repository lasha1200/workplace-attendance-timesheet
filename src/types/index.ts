export type PunchType = 'IN' | 'OUT' | 'BREAK_START' | 'BREAK_END';

export type PunchStatus = 'CLOCKED_OUT' | 'CLOCKED_IN' | 'ON_BREAK';

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
}

export interface DirectDepositAccount {
  id: string;
  bankName: string;
  accountType: 'Checking' | 'Savings';
  last4: string;
  routingNumber: string;
  percentage: number; // e.g. 80 for 80%
  isPrimary: boolean;
}

export interface User {
  id: string;
  name: string;
  preferredName?: string;
  email: string;
  avatar: string;
  title: string;
  department: string;
  employeeId: string;
  hourlyRate: number;
  salaryEquivalent: number;
  hireDate: string;
  manager: string;
  workLocation: string;
  phone: string;
  emergencyContacts: EmergencyContact[];
  pin: string;
  ptoHoursRemaining: number;
  sickHoursRemaining: number;
  floatingHolidays: number;
  directDeposits: DirectDepositAccount[];
  taxSettings: TaxSettings;
}

export interface JobCode {
  code: string;
  name: string;
  department: string;
  color: string;
}

export interface PunchRecord {
  id: string;
  timestamp: string; // ISO string
  type: PunchType;
  jobCode: string;
  jobName: string;
  location: string;
  note?: string;
  isManual?: boolean;
}

export interface TimesheetDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string; // Mon, Tue, etc.
  regularHours: number;
  overtimeHours: number;
  breakMinutes: number;
  totalHours: number;
  grossEarned: number;
  punches: PunchRecord[];
  status: 'complete' | 'active' | 'empty' | 'holiday' | 'pto';
}

export interface TimesheetWeek {
  id: string;
  weekNumber: number;
  year: number;
  startDate: string;
  endDate: string;
  days: TimesheetDay[];
  totalRegularHours: number;
  totalOvertimeHours: number;
  totalHours: number;
  totalGross: number;
  status: 'Draft' | 'Submitted' | 'Approved' | 'Paid';
  submittedAt?: string;
  approvedBy?: string;
}

export interface ShiftSchedule {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // "08:30"
  endTime: string; // "17:00"
  title: string;
  role: string;
  location: string;
  type: 'regular' | 'overtime' | 'on-call' | 'remote' | 'pto';
  notes?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'swapped';
}

export interface PayStub {
  id: string;
  stubNumber: string;
  payPeriodStart: string;
  payPeriodEnd: string;
  payDate: string;
  grossPay: number;
  netPay: number;
  regularHours: number;
  regularRate: number;
  regularPay: number;
  overtimeHours: number;
  overtimeRate: number;
  overtimePay: number;
  federalTax: number;
  stateTax: number;
  ficaMedicare: number;
  ficaSocialSecurity: number;
  retirement401k: number;
  healthInsurance: number;
  ytdGross: number;
  ytdNet: number;
  ytdFederalTax: number;
  ytdStateTax: number;
  ytdFica: number;
  ytd401k: number;
  directDeposits: {
    bankName: string;
    accountType: string;
    last4: string;
    amount: number;
  }[];
}

export interface TaxSettings {
  filingStatus: 'Single' | 'Married Filing Jointly' | 'Married Filing Separately' | 'Head of Household';
  multipleJobs: boolean;
  qualifyingChildrenAmount: number;
  otherDependentsAmount: number;
  otherIncome: number;
  extraWithholding: number;
  state: string;
  stateExemptions: number;
  electronicW2Consent: boolean;
}

export interface PTORequest {
  id: string;
  employeeId: string;
  type: 'Vacation' | 'Sick Leave' | 'Personal' | 'Floating Holiday' | 'Bereavement';
  startDate: string;
  endDate: string;
  totalHours: number;
  status: 'Approved' | 'Pending' | 'Denied';
  reason: string;
  submittedDate: string;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
}

export type ActiveTab = 'timesheet' | 'schedule' | 'payroll' | 'taxes' | 'profile';
