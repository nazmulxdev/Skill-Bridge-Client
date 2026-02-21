export interface StepProps {
  userData?: any;
  tutorProfile?: any | null;
  onComplete?: () => void;
  isLocked?: boolean;
}

export interface Education {
  id: string;
  institute: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number | null;
  isCurrent: boolean;
}

export interface Availability {
  id: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}
