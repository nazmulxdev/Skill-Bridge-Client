export interface StepProps {
  tutorProfile?: any | null;
  isLocked?: boolean;
  onComplete?: () => void;
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

export interface Category {
  id: string;
  name: string;
  description: string;
  subjects: {
    id: string;
    name: string;
  }[];
}

export interface SubjectItem {
  id: string;
  subject: {
    id: string;
    name: string;
    category?: {
      id: string;
      name: string;
      description?: string;
    } | null;
  };
}

export interface CategoryGroup {
  [key: string]: SubjectItem[];
}
