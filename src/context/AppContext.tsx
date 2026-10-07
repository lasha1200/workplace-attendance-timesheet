import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  User,
  PunchStatus,
  PunchRecord,
  TimesheetWeek,
  ShiftSchedule,
  PayStub,
  PTORequest,
  TaxSettings,
  JobCode,
  ToastNotification,
  ActiveTab
} from '../types';
import {
  DEMO_USERS,
  JOB_CODES,
  INITIAL_TIMESHEET_WEEKS,
  INITIAL_SCHEDULES,
  INITIAL_PAY_STUBS,
  INITIAL_PTO_REQUESTS
} from '../data/mockData';
import { soundManager } from '../utils/sound';
import confetti from 'canvas-confetti';

interface AppContextType {
  currentUser: User;
  users: User[];
  setCurrentUser: (user: User) => void;
  isAuthenticated: boolean;
  login: (userOrPin: string | User) => boolean;
  logout: () => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  punchStatus: PunchStatus;
  currentPunchStartTime: string | null;
  breakStartTime: string | null;
  totalBreakSecondsToday: number;
  selectedJobCode: JobCode;
  setSelectedJobCode: (code: JobCode) => void;
  punchLocation: string;
  setPunchLocation: (loc: string) => void;
  punchNote: string;
  setPunchNote: (note: string) => void;
  recentPunches: PunchRecord[];
  clockIn: (customNote?: string) => void;
  takeBreak: () => void;
  resumeWork: () => void;
  clockOut: (customNote?: string) => void;
  addManualPunch: (record: Omit<PunchRecord, 'id'>) => void;
  timesheetWeeks: TimesheetWeek[];
  submitTimesheet: (weekId: string) => void;
  schedules: ShiftSchedule[];
  addScheduleShift: (shift: Omit<ShiftSchedule, 'id'>) => void;
  requestShiftSwap: (shiftId: string, colleagueName: string) => void;
  payStubs: PayStub[];
  selectedPayStub: PayStub | null;
  setSelectedPayStub: (stub: PayStub | null) => void;
  ptoRequests: PTORequest[];
  submitPTORequest: (req: { type: PTORequest['type']; startDate: string; endDate: string; totalHours: number; reason: string }) => void;
  taxSettings: TaxSettings;
  updateTaxSettings: (settings: Partial<TaxSettings>) => void;
  updateUserProfile: (profile: Partial<User>) => void;
  jobCodes: JobCode[];
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  timeFormat: '12h' | '24h';
  toggleTimeFormat: () => void;
  soundEnabled: boolean;
  toggleSound: () => void;
  toasts: ToastNotification[];
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => void;
  removeToast: (id: string) => void;
  elapsedShiftSeconds: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence helpers
  const getStored = <T,>(key: string, fallback: T): T => {
    try {
      const item = localStorage.getItem(`workpulse_${key}`);
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStored = <T,>(key: string, val: T) => {
    try {
      localStorage.setItem(`workpulse_${key}`, JSON.stringify(val));
    } catch {
      // ignore
    }
  };

  // Auth & User State
  const [users, setUsers] = useState<User[]>(() => getStored('users', DEMO_USERS));
  const [currentUser, setCurrentUserState] = useState<User>(() => getStored('current_user', DEMO_USERS[0]));
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => getStored('is_auth', true));

  // Navigation
  const [activeTab, setActiveTabState] = useState<ActiveTab>(() => getStored('active_tab', 'timesheet'));

  // Punch State
  const [punchStatus, setPunchStatus] = useState<PunchStatus>(() => getStored('punch_status', 'CLOCKED_IN'));
  const [currentPunchStartTime, setCurrentPunchStartTime] = useState<string | null>(() => {
    const saved = getStored<string | null>('punch_start_time', null);
    if (saved) return saved;
    // Default to ~3 hours ago today for immediate live visualization
    const today830 = new Date();
    today830.setHours(8, 30, 0, 0);
    return today830.toISOString();
  });
  const [breakStartTime, setBreakStartTime] = useState<string | null>(() => getStored('break_start_time', null));
  const [totalBreakSecondsToday, setTotalBreakSecondsToday] = useState<number>(() => getStored('break_seconds', 1800)); // 30m break default
  const [jobCodes] = useState<JobCode[]>(JOB_CODES);
  const [selectedJobCode, setSelectedJobCode] = useState<JobCode>(JOB_CODES[0]);
  const [punchLocation, setPunchLocation] = useState<string>('San Francisco HQ - Tech Wing');
  const [punchNote, setPunchNote] = useState<string>('');
  
  const [recentPunches, setRecentPunches] = useState<PunchRecord[]>(() => getStored('recent_punches', [
    {
      id: 'p_live_1',
      timestamp: new Date(Date.now() - 3.5 * 3600 * 1000).toISOString(),
      type: 'IN',
      jobCode: 'ENG-201',
      jobName: 'Core Application Development',
      location: 'San Francisco HQ - Tech Wing',
      note: 'Morning sprint kickoff & feature implementation'
    }
  ]));

  // Timesheet & Schedules
  const [timesheetWeeks, setTimesheetWeeks] = useState<TimesheetWeek[]>(() => getStored('timesheets', INITIAL_TIMESHEET_WEEKS));
  const [schedules, setSchedules] = useState<ShiftSchedule[]>(() => getStored('schedules', INITIAL_SCHEDULES));
  const [payStubs, setPayStubs] = useState<PayStub[]>(() => getStored('pay_stubs', INITIAL_PAY_STUBS));
  const [selectedPayStub, setSelectedPayStub] = useState<PayStub | null>(null);
  const [ptoRequests, setPtoRequests] = useState<PTORequest[]>(() => getStored('pto_requests', INITIAL_PTO_REQUESTS));

  // Preferences
  const [theme, setTheme] = useState<'dark' | 'light'>(() => getStored('theme', 'dark'));
  const [timeFormat, setTimeFormat] = useState<'12h' | '24h'>(() => getStored('time_format', '12h'));
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => getStored('sound_enabled', true));

  // Toasts
  const [toasts, setToasts] = useState<ToastNotification[]>([]);

  // Live elapsed seconds counter for active shift
  const [elapsedShiftSeconds, setElapsedShiftSeconds] = useState<number>(0);

  // Sync theme to root class
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    setStored('theme', theme);
  }, [theme]);

  // Sync sound manager
  useEffect(() => {
    soundManager.enabled = soundEnabled;
    setStored('sound_enabled', soundEnabled);
  }, [soundEnabled]);

  // Update elapsed time every second if clocked in
  useEffect(() => {
    const calculateElapsed = () => {
      if (punchStatus === 'CLOCKED_OUT' || !currentPunchStartTime) {
        setElapsedShiftSeconds(0);
        return;
      }
      const startMs = new Date(currentPunchStartTime).getTime();
      const nowMs = Date.now();
      let diff = Math.max(0, Math.floor((nowMs - startMs) / 1000));
      
      // If currently on break, subtract active break time
      if (punchStatus === 'ON_BREAK' && breakStartTime) {
        // Break is running
      }
      // Subtract accumulated break seconds
      diff = Math.max(0, diff - totalBreakSecondsToday);
      setElapsedShiftSeconds(diff);
    };

    calculateElapsed();
    const interval = setInterval(calculateElapsed, 1000);
    return () => clearInterval(interval);
  }, [punchStatus, currentPunchStartTime, breakStartTime, totalBreakSecondsToday]);

  // Save states
  useEffect(() => {
    setStored('punch_status', punchStatus);
    setStored('punch_start_time', currentPunchStartTime);
    setStored('break_start_time', breakStartTime);
    setStored('break_seconds', totalBreakSecondsToday);
    setStored('recent_punches', recentPunches);
    setStored('timesheets', timesheetWeeks);
    setStored('schedules', schedules);
    setStored('pay_stubs', payStubs);
    setStored('pto_requests', ptoRequests);
    setStored('current_user', currentUser);
    setStored('is_auth', isAuthenticated);
    setStored('active_tab', activeTab);
  }, [punchStatus, currentPunchStartTime, breakStartTime, totalBreakSecondsToday, recentPunches, timesheetWeeks, schedules, payStubs, ptoRequests, currentUser, isAuthenticated, activeTab]);

  const addToast = (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => {
    const id = 'toast_' + Math.random().toString(36).substring(2, 9);
    const newToast: ToastNotification = {
      ...toast,
      id,
      timestamp: new Date().toISOString()
    };
    setToasts(prev => [newToast, ...prev].slice(0, 5));

    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const setActiveTab = (tab: ActiveTab) => {
    if (soundEnabled) soundManager.playClick();
    setActiveTabState(tab);
  };

  const toggleTheme = () => {
    if (soundEnabled) soundManager.playClick();
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleTimeFormat = () => {
    if (soundEnabled) soundManager.playClick();
    const next = timeFormat === '12h' ? '24h' : '12h';
    setTimeFormat(next);
    setStored('time_format', next);
    addToast({
      type: 'info',
      title: 'Time Display Changed',
      message: `Clock format is now ${next.toUpperCase()}`
    });
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    if (next) soundManager.playClick();
    addToast({
      type: 'info',
      title: 'Audio Preferences',
      message: next ? 'Punch sound feedback turned ON' : 'Punch sound feedback muted'
    });
  };

  const setCurrentUser = (user: User) => {
    setCurrentUserState(user);
    setStored('current_user', user);
    addToast({
      type: 'success',
      title: 'Profile Switched',
      message: `Switched active employee to ${user.name} (${user.title})`
    });
  };

  const login = (userOrPin: string | User): boolean => {
    if (typeof userOrPin === 'object') {
      setCurrentUserState(userOrPin);
      setIsAuthenticated(true);
      if (soundEnabled) soundManager.playPunchIn();
      addToast({
        type: 'success',
        title: 'Welcome Back!',
        message: `Logged in as ${userOrPin.name}`
      });
      return true;
    }

    const found = users.find(u => u.pin === userOrPin || u.employeeId.toLowerCase() === userOrPin.toLowerCase() || u.email.toLowerCase() === userOrPin.toLowerCase());
    if (found) {
      setCurrentUserState(found);
      setIsAuthenticated(true);
      if (soundEnabled) soundManager.playPunchIn();
      addToast({
        type: 'success',
        title: 'Welcome Back!',
        message: `Logged in as ${found.name}`
      });
      return true;
    }

    addToast({
      type: 'error',
      title: 'Login Failed',
      message: 'Invalid Employee PIN or Email. Try 1234, 4321, or 0000.'
    });
    return false;
  };

  const logout = () => {
    if (soundEnabled) soundManager.playPunchOut();
    setIsAuthenticated(false);
    addToast({
      type: 'info',
      title: 'Logged Out',
      message: 'You have been securely signed out of WorkPulse.'
    });
  };

  // Clock Actions
  const clockIn = (customNote?: string) => {
    const now = new Date();
    const isoString = now.toISOString();

    setPunchStatus('CLOCKED_IN');
    setCurrentPunchStartTime(isoString);
    setBreakStartTime(null);
    setTotalBreakSecondsToday(0);

    const newPunch: PunchRecord = {
      id: 'p_' + Date.now(),
      timestamp: isoString,
      type: 'IN',
      jobCode: selectedJobCode.code,
      jobName: selectedJobCode.name,
      location: punchLocation,
      note: customNote || punchNote || undefined
    };

    setRecentPunches(prev => [newPunch, ...prev]);

    if (soundEnabled) soundManager.playPunchIn();

    addToast({
      type: 'success',
      title: 'Clocked In Successfully',
      message: `Shift started at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })} • [${selectedJobCode.code}] ${selectedJobCode.name}`
    });
  };

  const takeBreak = () => {
    const now = new Date();
    const isoString = now.toISOString();

    setPunchStatus('ON_BREAK');
    setBreakStartTime(isoString);

    const newPunch: PunchRecord = {
      id: 'p_' + Date.now(),
      timestamp: isoString,
      type: 'BREAK_START',
      jobCode: selectedJobCode.code,
      jobName: selectedJobCode.name,
      location: punchLocation,
      note: 'Break start'
    };

    setRecentPunches(prev => [newPunch, ...prev]);
    if (soundEnabled) soundManager.playBreak();

    addToast({
      type: 'info',
      title: 'Break Started',
      message: `Break period initiated at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
    });
  };

  const resumeWork = () => {
    const now = new Date();
    const isoString = now.toISOString();

    if (breakStartTime) {
      const breakMs = now.getTime() - new Date(breakStartTime).getTime();
      const breakSec = Math.floor(breakMs / 1000);
      setTotalBreakSecondsToday(prev => prev + breakSec);
    }

    setPunchStatus('CLOCKED_IN');
    setBreakStartTime(null);

    const newPunch: PunchRecord = {
      id: 'p_' + Date.now(),
      timestamp: isoString,
      type: 'BREAK_END',
      jobCode: selectedJobCode.code,
      jobName: selectedJobCode.name,
      location: punchLocation,
      note: 'Returned from break'
    };

    setRecentPunches(prev => [newPunch, ...prev]);
    if (soundEnabled) soundManager.playPunchIn();

    addToast({
      type: 'success',
      title: 'Resumed Work',
      message: `Back on the clock at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`
    });
  };

  const clockOut = (customNote?: string) => {
    const now = new Date();
    const isoString = now.toISOString();

    // Calculate worked hours
    let hoursWorked = 0;
    if (currentPunchStartTime) {
      const totalSec = Math.max(0, Math.floor((now.getTime() - new Date(currentPunchStartTime).getTime()) / 1000) - totalBreakSecondsToday);
      hoursWorked = parseFloat((totalSec / 3600).toFixed(2));
    }

    setPunchStatus('CLOCKED_OUT');
    setCurrentPunchStartTime(null);
    setBreakStartTime(null);

    const newPunch: PunchRecord = {
      id: 'p_' + Date.now(),
      timestamp: isoString,
      type: 'OUT',
      jobCode: selectedJobCode.code,
      jobName: selectedJobCode.name,
      location: punchLocation,
      note: customNote || punchNote || `Completed shift (${hoursWorked} hrs)`
    };

    setRecentPunches(prev => [newPunch, ...prev]);

    // Update today's timesheet record in current week
    const todayStr = now.toISOString().split('T')[0];
    setTimesheetWeeks(prev =>
      prev.map(week => {
        if (week.id === 'tw_current') {
          const updatedDays = week.days.map(d => {
            if (d.date === todayStr || d.status === 'active') {
              const regHours = Math.min(8, hoursWorked);
              const otHours = Math.max(0, hoursWorked - 8);
              const gross = (regHours * currentUser.hourlyRate) + (otHours * currentUser.hourlyRate * 1.5);
              return {
                ...d,
                regularHours: regHours,
                overtimeHours: otHours,
                totalHours: hoursWorked,
                grossEarned: parseFloat(gross.toFixed(2)),
                status: 'complete' as const,
                punches: [...d.punches, newPunch]
              };
            }
            return d;
          });

          const totalReg = updatedDays.reduce((acc, curr) => acc + curr.regularHours, 0);
          const totalOt = updatedDays.reduce((acc, curr) => acc + curr.overtimeHours, 0);
          const totalGross = updatedDays.reduce((acc, curr) => acc + curr.grossEarned, 0);

          return {
            ...week,
            days: updatedDays,
            totalRegularHours: parseFloat(totalReg.toFixed(2)),
            totalOvertimeHours: parseFloat(totalOt.toFixed(2)),
            totalHours: parseFloat((totalReg + totalOt).toFixed(2)),
            totalGross: parseFloat(totalGross.toFixed(2))
          };
        }
        return week;
      })
    );

    if (soundEnabled) soundManager.playPunchOut();

    // Trigger celebration confetti
    try {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.8 }
      });
    } catch {
      // ignore
    }

    addToast({
      type: 'info',
      title: 'Clocked Out',
      message: `Shift ended at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}. Total logged: ${hoursWorked} hrs ($${(hoursWorked * currentUser.hourlyRate).toFixed(2)})`
    });
  };

  const addManualPunch = (record: Omit<PunchRecord, 'id'>) => {
    const newRecord: PunchRecord = {
      ...record,
      id: 'p_man_' + Date.now(),
      isManual: true
    };
    setRecentPunches(prev => [newRecord, ...prev]);
    if (soundEnabled) soundManager.playPunchIn();

    addToast({
      type: 'success',
      title: 'Manual Punch Added',
      message: `Manual ${record.type} record logged for ${new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    });
  };

  const submitTimesheet = (weekId: string) => {
    setTimesheetWeeks(prev =>
      prev.map(w => {
        if (w.id === weekId) {
          return {
            ...w,
            status: 'Submitted',
            submittedAt: new Date().toISOString()
          };
        }
        return w;
      })
    );

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.7 }
      });
    } catch {
      // ignore
    }

    if (soundEnabled) soundManager.playPunchIn();

    addToast({
      type: 'success',
      title: 'Timesheet Submitted',
      message: `Timesheet for Week sent to manager ${currentUser.manager} for sign-off.`
    });
  };

  const addScheduleShift = (shift: Omit<ShiftSchedule, 'id'>) => {
    const newShift: ShiftSchedule = {
      ...shift,
      id: 'sh_' + Date.now()
    };
    setSchedules(prev => [...prev, newShift]);
    addToast({
      type: 'success',
      title: 'Shift Added to Schedule',
      message: `${shift.title} on ${shift.date} (${shift.startTime} - ${shift.endTime})`
    });
  };

  const requestShiftSwap = (shiftId: string, colleagueName: string) => {
    setSchedules(prev =>
      prev.map(s => {
        if (s.id === shiftId) {
          return { ...s, status: 'swapped', notes: `Swap request submitted with ${colleagueName}` };
        }
        return s;
      })
    );
    addToast({
      type: 'info',
      title: 'Swap Request Sent',
      message: `Shift swap request sent to ${colleagueName} & awaiting manager review.`
    });
  };

  const submitPTORequest = (req: { type: PTORequest['type']; startDate: string; endDate: string; totalHours: number; reason: string }) => {
    const newReq: PTORequest = {
      id: 'pto_' + Date.now(),
      employeeId: currentUser.id,
      type: req.type,
      startDate: req.startDate,
      endDate: req.endDate,
      totalHours: req.totalHours,
      status: 'Pending',
      reason: req.reason,
      submittedDate: new Date().toISOString().split('T')[0]
    };
    setPtoRequests(prev => [newReq, ...prev]);
    
    // Deduct pending balance for preview
    setCurrentUserState(prev => ({
      ...prev,
      ptoHoursRemaining: Math.max(0, prev.ptoHoursRemaining - req.totalHours)
    }));

    addToast({
      type: 'success',
      title: 'Time Off Requested',
      message: `${req.totalHours} hrs of ${req.type} requested (${req.startDate} to ${req.endDate}).`
    });
  };

  const updateTaxSettings = (settings: Partial<TaxSettings>) => {
    const updated = {
      ...currentUser.taxSettings,
      ...settings
    };
    setCurrentUserState(prev => ({
      ...prev,
      taxSettings: updated
    }));
    addToast({
      type: 'success',
      title: 'Tax Settings Saved',
      message: 'W-4 & state withholding parameters updated successfully.'
    });
  };

  const updateUserProfile = (profile: Partial<User>) => {
    setCurrentUserState(prev => ({
      ...prev,
      ...profile
    }));
    addToast({
      type: 'success',
      title: 'Profile Updated',
      message: 'Employee personal and contact information saved.'
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        setCurrentUser,
        isAuthenticated,
        login,
        logout,
        activeTab,
        setActiveTab,
        punchStatus,
        currentPunchStartTime,
        breakStartTime,
        totalBreakSecondsToday,
        selectedJobCode,
        setSelectedJobCode,
        punchLocation,
        setPunchLocation,
        punchNote,
        setPunchNote,
        recentPunches,
        clockIn,
        takeBreak,
        resumeWork,
        clockOut,
        addManualPunch,
        timesheetWeeks,
        submitTimesheet,
        schedules,
        addScheduleShift,
        requestShiftSwap,
        payStubs,
        selectedPayStub,
        setSelectedPayStub,
        ptoRequests,
        submitPTORequest,
        taxSettings: currentUser.taxSettings,
        updateTaxSettings,
        updateUserProfile,
        jobCodes,
        theme,
        toggleTheme,
        timeFormat,
        toggleTimeFormat,
        soundEnabled,
        toggleSound,
        toasts,
        addToast,
        removeToast,
        elapsedShiftSeconds
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
