
import { DayOfWeek, StudyProgress } from './types';

export const DAYS_OF_WEEK: DayOfWeek[] = ['Sab', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const INITIAL_PROGRESS: StudyProgress = {
  Sab: { completed: false, note: '' },
  Sun: { completed: false, note: '' },
  Mon: { completed: false, note: '' },
  Tue: { completed: false, note: '' },
  Wed: { completed: false, note: '' },
  Thu: { completed: false, note: '' },
  Fri: { completed: false, note: '' },
};

export const COLORS = {
  gold: '#D4AF37',
  warmWhite: '#FDFCF0',
  charcoal: '#2D3748',
  softYellow: '#FCD34D'
};
