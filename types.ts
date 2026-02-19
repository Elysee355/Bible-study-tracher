
export type DayOfWeek = 'Sab' | 'Sun' | 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';

export interface StudyDay {
  completed: boolean;
  note: string;
}

export interface StudyProgress {
  Sab: StudyDay;
  Sun: StudyDay;
  Mon: StudyDay;
  Tue: StudyDay;
  Wed: StudyDay;
  Thu: StudyDay;
  Fri: StudyDay;
}

export interface FamilyMember {
  id: string;
  name: string;
  progress: StudyProgress;
}

export interface Reflection {
  id: string;
  author: string;
  content: string;
  timestamp: number;
}

export interface VerseOfTheDay {
  verse: string;
  reference: string;
  reflection: string;
}
