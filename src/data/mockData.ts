import type { User, JobCode, TimesheetWeek, ShiftSchedule, PayStub, PTORequest } from '../types';

export const DEMO_USERS: User[] = [
  {
    id: 'usr_001',
    name: 'Sarah Jenkins',
    preferredName: 'Sarah',
    email: 'sarah.jenkins@acmeworkforce.io',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    title: 'Senior Software Engineer',
    department: 'Engineering & Platform',
    employeeId: 'EMP-84920',
    hourlyRate: 58.50,
    salaryEquivalent: 121680,
    hireDate: '2023-03-15',
    manager: 'David Chen (VP of Engineering)',
    workLocation: 'San Francisco HQ (Hybrid - Building 4)',
    phone: '+1 (415) 890-2341',
    emergencyContacts: [
      { name: 'Michael Jenkins', relationship: 'Spouse', phone: '+1 (415) 890-9912', email: 'm.jenkins@example.com' },
      { name: 'Claire Jenkins', relationship: 'Mother', phone: '+1 (510) 334-1928' }
    ],
    pin: '1234',
    ptoHoursRemaining: 128.5,
    sickHoursRemaining: 40.0,
    floatingHolidays: 2,
    directDeposits: [
      { id: 'dd_1', bankName: 'Chase Bank Premier Checking', accountType: 'Checking', last4: '4821', routingNumber: '021000021', percentage: 80, isPrimary: true },
      { id: 'dd_2', bankName: 'Vanguard High-Yield Savings', accountType: 'Savings', last4: '9034', routingNumber: '031201360', percentage: 20, isPrimary: false }
    ],
    taxSettings: {
      filingStatus: 'Single',
      multipleJobs: false,
      qualifyingChildrenAmount: 0,
      otherDependentsAmount: 0,
      otherIncome: 0,
      extraWithholding: 50.0,
      state: 'California (CA)',
      stateExemptions: 1,
      electronicW2Consent: true
    }
  },
  {
    id: 'usr_002',
    name: 'Marcus Vance',
    preferredName: 'Marcus',
    email: 'marcus.vance@acmeworkforce.io',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    title: 'Logistics & Warehouse Specialist',
    department: 'Supply Chain & Operations',
    employeeId: 'EMP-73119',
    hourlyRate: 34.00,
    salaryEquivalent: 70720,
    hireDate: '2022-08-01',
    manager: 'Roberta Miller (Logistics Director)',
    workLocation: 'Austin Fulfillment Center B',
    phone: '+1 (512) 674-8890',
    emergencyContacts: [
      { name: 'Elena Vance', relationship: 'Sister', phone: '+1 (512) 674-1234' }
    ],
    pin: '4321',
    ptoHoursRemaining: 96.0,
    sickHoursRemaining: 32.0,
    floatingHolidays: 3,
    directDeposits: [
      { id: 'dd_3', bankName: 'Wells Fargo Everyday Checking', accountType: 'Checking', last4: '7721', routingNumber: '121000248', percentage: 100, isPrimary: true }
    ],
    taxSettings: {
      filingStatus: 'Married Filing Jointly',
      multipleJobs: false,
      qualifyingChildrenAmount: 2000,
      otherDependentsAmount: 0,
      otherIncome: 0,
      extraWithholding: 0,
      state: 'Texas (TX)',
      stateExemptions: 2,
      electronicW2Consent: true
    }
  },
  {
    id: 'usr_003',
    name: 'Maya Lin',
    preferredName: 'Maya',
    email: 'maya.lin@acmeworkforce.io',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title: 'Lead Product Designer',
    department: 'Product & UX',
    employeeId: 'EMP-90241',
    hourlyRate: 52.00,
    salaryEquivalent: 108160,
    hireDate: '2023-11-10',
    manager: 'Liam O’Connor (Head of Product)',
    workLocation: 'Seattle Tech Hub / Remote',
    phone: '+1 (206) 441-8930',
    emergencyContacts: [
      { name: 'Arthur Lin', relationship: 'Partner', phone: '+1 (206) 441-2299' }
    ],
    pin: '0000',
    ptoHoursRemaining: 110.0,
    sickHoursRemaining: 48.0,
    floatingHolidays: 2,
    directDeposits: [
      { id: 'dd_4', bankName: 'Bank of America Core Checking', accountType: 'Checking', last4: '3109', routingNumber: '125000024', percentage: 70, isPrimary: true },
      { id: 'dd_5', bankName: 'Marcus by Goldman Sachs', accountType: 'Savings', last4: '8841', routingNumber: '021214406', percentage: 30, isPrimary: false }
    ],
    taxSettings: {
      filingStatus: 'Single',
      multipleJobs: false,
      qualifyingChildrenAmount: 0,
      otherDependentsAmount: 0,
      otherIncome: 0,
      extraWithholding: 25.0,
      state: 'Washington (WA)',
      stateExemptions: 0,
      electronicW2Consent: true
    }
  }
];

export const JOB_CODES: JobCode[] = [
  { code: 'ENG-201', name: 'Core Application Development', department: 'Engineering', color: '#3b82f6' },
  { code: 'ENG-104', name: 'Code Review & Architecture', department: 'Engineering', color: '#6366f1' },
  { code: 'DES-301', name: 'UI/UX Design & Prototyping', department: 'Product', color: '#ec4899' },
  { code: 'OPS-402', name: 'Logistics & Warehouse Operations', department: 'Operations', color: '#f59e0b' },
  { code: 'GEN-001', name: 'General Administrative & Team Standup', department: 'Company-wide', color: '#10b981' },
  { code: 'SUP-101', name: 'Customer Support Escalations', department: 'Support', color: '#8b5cf6' },
  { code: 'TRN-500', name: 'Compliance Training & Professional Dev', department: 'HR', color: '#06b6d4' }
];

export const INITIAL_SCHEDULES: ShiftSchedule[] = [
  {
    id: 'sh_101',
    date: '2026-10-05',
    startTime: '08:30',
    endTime: '17:00',
    title: 'Regular Shift - Sprint Delivery',
    role: 'Lead Developer',
    location: 'Main Office - Desk 402',
    type: 'regular',
    notes: 'Morning architecture sync with DevOps team at 10:00 AM.',
    status: 'scheduled'
  },
  {
    id: 'sh_102',
    date: '2026-10-06',
    startTime: '08:30',
    endTime: '17:00',
    title: 'Regular Shift - Feature Work',
    role: 'Lead Developer',
    location: 'Main Office - Desk 402',
    type: 'regular',
    notes: 'Focus on timesheet punch state machine refactor.',
    status: 'scheduled'
  },
  {
    id: 'sh_103',
    date: '2026-10-07',
    startTime: '08:30',
    endTime: '17:00',
    title: 'Remote Engineering Shift',
    role: 'Lead Developer',
    location: 'Remote Workstation',
    type: 'remote',
    notes: 'All-hands engineering town hall at 2:00 PM.',
    status: 'scheduled'
  },
  {
    id: 'sh_104',
    date: '2026-10-08',
    startTime: '08:30',
    endTime: '18:00',
    title: 'Extended Release Support (+1.5h OT)',
    role: 'Release Engineer',
    location: 'Main Office - Tech Lab',
    type: 'overtime',
    notes: 'Production rollout deployment window.',
    status: 'scheduled'
  },
  {
    id: 'sh_105',
    date: '2026-10-09',
    startTime: '08:30',
    endTime: '17:00',
    title: 'Regular Shift - Code Review & Demos',
    role: 'Lead Developer',
    location: 'Main Office - Desk 402',
    type: 'regular',
    notes: 'Weekly sprint demo at 4:00 PM.',
    status: 'scheduled'
  },
  {
    id: 'sh_106',
    date: '2026-10-10',
    startTime: '10:00',
    endTime: '14:00',
    title: 'Weekend On-Call Standby',
    role: 'On-Call Tier 2',
    location: 'Remote / Standby',
    type: 'on-call',
    notes: 'Monitoring system metrics and latency alerts.',
    status: 'scheduled'
  }
];

export const INITIAL_TIMESHEET_WEEKS: TimesheetWeek[] = [
  {
    id: 'tw_current',
    weekNumber: 41,
    year: 2026,
    startDate: '2026-10-05',
    endDate: '2026-10-11',
    status: 'Draft',
    totalRegularHours: 24.5,
    totalOvertimeHours: 1.5,
    totalHours: 26.0,
    totalGross: 1564.88,
    days: [
      {
        date: '2026-10-05',
        dayOfWeek: 'Mon',
        regularHours: 8.0,
        overtimeHours: 0.5,
        breakMinutes: 30,
        totalHours: 8.5,
        grossEarned: 511.88,
        status: 'complete',
        punches: [
          { id: 'p_101', timestamp: '2026-10-05T08:30:00.000Z', type: 'IN', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ' },
          { id: 'p_102', timestamp: '2026-10-05T12:00:00.000Z', type: 'BREAK_START', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ' },
          { id: 'p_103', timestamp: '2026-10-05T12:30:00.000Z', type: 'BREAK_END', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ' },
          { id: 'p_104', timestamp: '2026-10-05T17:30:00.000Z', type: 'OUT', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ', note: 'Sprint planning overtime' }
        ]
      },
      {
        date: '2026-10-06',
        dayOfWeek: 'Tue',
        regularHours: 8.0,
        overtimeHours: 0.0,
        breakMinutes: 45,
        totalHours: 8.0,
        grossEarned: 468.00,
        status: 'complete',
        punches: [
          { id: 'p_105', timestamp: '2026-10-06T08:30:00.000Z', type: 'IN', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ' },
          { id: 'p_106', timestamp: '2026-10-06T12:15:00.000Z', type: 'BREAK_START', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ' },
          { id: 'p_107', timestamp: '2026-10-06T13:00:00.000Z', type: 'BREAK_END', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ' },
          { id: 'p_108', timestamp: '2026-10-06T17:15:00.000Z', type: 'OUT', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ' }
        ]
      },
      {
        date: '2026-10-07',
        dayOfWeek: 'Wed',
        regularHours: 8.0,
        overtimeHours: 1.0,
        breakMinutes: 30,
        totalHours: 9.0,
        grossEarned: 555.75,
        status: 'complete',
        punches: [
          { id: 'p_109', timestamp: '2026-10-07T08:00:00.000Z', type: 'IN', jobCode: 'ENG-104', jobName: 'Code Review', location: 'Remote' },
          { id: 'p_110', timestamp: '2026-10-07T12:00:00.000Z', type: 'BREAK_START', jobCode: 'ENG-104', jobName: 'Code Review', location: 'Remote' },
          { id: 'p_111', timestamp: '2026-10-07T12:30:00.000Z', type: 'BREAK_END', jobCode: 'ENG-104', jobName: 'Code Review', location: 'Remote' },
          { id: 'p_112', timestamp: '2026-10-07T17:30:00.000Z', type: 'OUT', jobCode: 'ENG-104', jobName: 'Code Review', location: 'Remote' }
        ]
      },
      {
        date: '2026-10-08',
        dayOfWeek: 'Thu',
        regularHours: 0.5,
        overtimeHours: 0.0,
        breakMinutes: 0,
        totalHours: 0.5,
        grossEarned: 29.25,
        status: 'active',
        punches: [
          { id: 'p_113', timestamp: '2026-10-08T08:30:00.000Z', type: 'IN', jobCode: 'ENG-201', jobName: 'Core App Dev', location: 'San Francisco HQ' }
        ]
      },
      {
        date: '2026-10-09',
        dayOfWeek: 'Fri',
        regularHours: 0,
        overtimeHours: 0,
        breakMinutes: 0,
        totalHours: 0,
        grossEarned: 0,
        status: 'empty',
        punches: []
      },
      {
        date: '2026-10-10',
        dayOfWeek: 'Sat',
        regularHours: 0,
        overtimeHours: 0,
        breakMinutes: 0,
        totalHours: 0,
        grossEarned: 0,
        status: 'empty',
        punches: []
      },
      {
        date: '2026-10-11',
        dayOfWeek: 'Sun',
        regularHours: 0,
        overtimeHours: 0,
        breakMinutes: 0,
        totalHours: 0,
        grossEarned: 0,
        status: 'empty',
        punches: []
      }
    ]
  },
  {
    id: 'tw_prev1',
    weekNumber: 40,
    year: 2026,
    startDate: '2026-09-28',
    endDate: '2026-10-04',
    status: 'Approved',
    totalRegularHours: 40.0,
    totalOvertimeHours: 3.5,
    totalHours: 43.5,
    totalGross: 2647.13,
    submittedAt: '2026-10-04T18:00:00.000Z',
    approvedBy: 'David Chen (VP of Engineering)',
    days: [
      { date: '2026-09-28', dayOfWeek: 'Mon', regularHours: 8.0, overtimeHours: 1.0, breakMinutes: 30, totalHours: 9.0, grossEarned: 555.75, status: 'complete', punches: [] },
      { date: '2026-09-29', dayOfWeek: 'Tue', regularHours: 8.0, overtimeHours: 0.0, breakMinutes: 30, totalHours: 8.0, grossEarned: 468.00, status: 'complete', punches: [] },
      { date: '2026-09-30', dayOfWeek: 'Wed', regularHours: 8.0, overtimeHours: 1.5, breakMinutes: 30, totalHours: 9.5, grossEarned: 599.63, status: 'complete', punches: [] },
      { date: '2026-10-01', dayOfWeek: 'Thu', regularHours: 8.0, overtimeHours: 0.0, breakMinutes: 30, totalHours: 8.0, grossEarned: 468.00, status: 'complete', punches: [] },
      { date: '2026-10-02', dayOfWeek: 'Fri', regularHours: 8.0, overtimeHours: 1.0, breakMinutes: 30, totalHours: 9.0, grossEarned: 555.75, status: 'complete', punches: [] },
      { date: '2026-10-03', dayOfWeek: 'Sat', regularHours: 0, overtimeHours: 0, breakMinutes: 0, totalHours: 0, grossEarned: 0, status: 'empty', punches: [] },
      { date: '2026-10-04', dayOfWeek: 'Sun', regularHours: 0, overtimeHours: 0, breakMinutes: 0, totalHours: 0, grossEarned: 0, status: 'empty', punches: [] }
    ]
  }
];

export const INITIAL_PAY_STUBS: PayStub[] = [
  {
    id: 'ps_2026_19',
    stubNumber: 'PAY-2026-0019',
    payPeriodStart: '2026-09-15',
    payPeriodEnd: '2026-09-30',
    payDate: '2026-10-05',
    grossPay: 4899.38,
    netPay: 3624.12,
    regularHours: 80.0,
    regularRate: 58.50,
    regularPay: 4680.00,
    overtimeHours: 2.5,
    overtimeRate: 87.75,
    overtimePay: 219.38,
    federalTax: 512.40,
    stateTax: 248.60,
    ficaMedicare: 71.04,
    ficaSocialSecurity: 303.76,
    retirement401k: 244.97, // 5%
    healthInsurance: 94.49,
    ytdGross: 91420.50,
    ytdNet: 67680.12,
    ytdFederalTax: 9580.40,
    ytdStateTax: 4640.20,
    ytdFica: 6993.67,
    ytd401k: 4571.02,
    directDeposits: [
      { bankName: 'Chase Bank Premier Checking', accountType: 'Checking (...4821)', last4: '4821', amount: 2899.30 },
      { bankName: 'Vanguard High-Yield Savings', accountType: 'Savings (...9034)', last4: '9034', amount: 724.82 }
    ]
  },
  {
    id: 'ps_2026_18',
    stubNumber: 'PAY-2026-0018',
    payPeriodStart: '2026-09-01',
    payPeriodEnd: '2026-09-14',
    payDate: '2026-09-18',
    grossPay: 5074.88,
    netPay: 3752.40,
    regularHours: 80.0,
    regularRate: 58.50,
    regularPay: 4680.00,
    overtimeHours: 4.5,
    overtimeRate: 87.75,
    overtimePay: 394.88,
    federalTax: 531.20,
    stateTax: 258.40,
    ficaMedicare: 73.59,
    ficaSocialSecurity: 314.64,
    retirement401k: 253.74,
    healthInsurance: 94.49,
    ytdGross: 86521.12,
    ytdNet: 64056.02,
    ytdFederalTax: 9068.00,
    ytdStateTax: 4391.60,
    ytdFica: 6618.87,
    ytd401k: 4326.05,
    directDeposits: [
      { bankName: 'Chase Bank Premier Checking', accountType: 'Checking (...4821)', last4: '4821', amount: 3001.92 },
      { bankName: 'Vanguard High-Yield Savings', accountType: 'Savings (...9034)', last4: '9034', amount: 750.48 }
    ]
  },
  {
    id: 'ps_2026_17',
    stubNumber: 'PAY-2026-0017',
    payPeriodStart: '2026-08-15',
    payPeriodEnd: '2026-08-31',
    payDate: '2026-09-04',
    grossPay: 4680.00,
    netPay: 3465.18,
    regularHours: 80.0,
    regularRate: 58.50,
    regularPay: 4680.00,
    overtimeHours: 0.0,
    overtimeRate: 87.75,
    overtimePay: 0.00,
    federalTax: 489.10,
    stateTax: 237.20,
    ficaMedicare: 67.86,
    ficaSocialSecurity: 290.16,
    retirement401k: 234.00,
    healthInsurance: 94.49,
    ytdGross: 81446.24,
    ytdNet: 60303.62,
    ytdFederalTax: 8536.80,
    ytdStateTax: 4133.20,
    ytdFica: 6230.64,
    ytd401k: 4072.31,
    directDeposits: [
      { bankName: 'Chase Bank Premier Checking', accountType: 'Checking (...4821)', last4: '4821', amount: 2772.14 },
      { bankName: 'Vanguard High-Yield Savings', accountType: 'Savings (...9034)', last4: '9034', amount: 693.04 }
    ]
  }
];

export const INITIAL_PTO_REQUESTS: PTORequest[] = [
  {
    id: 'pto_01',
    employeeId: 'usr_001',
    type: 'Vacation',
    startDate: '2026-11-23',
    endDate: '2026-11-27',
    totalHours: 24,
    status: 'Approved',
    reason: 'Thanksgiving family gathering and annual leave.',
    submittedDate: '2026-09-12'
  },
  {
    id: 'pto_02',
    employeeId: 'usr_001',
    type: 'Personal',
    startDate: '2026-10-16',
    endDate: '2026-10-16',
    totalHours: 8,
    status: 'Pending',
    reason: 'Home utility maintenance appointment.',
    submittedDate: '2026-10-02'
  }
];
