import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Gop class Tailwind (chuan shadcn/ui) */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Dinh dang tien VND */
export function formatVnd(value: number): string {
  return new Intl.NumberFormat('vi-VN').format(value) + ' d';
}

/** Dinh dang ngay kieu Viet Nam */
export function formatDateVi(value: string | Date): string {
  const d = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(d.getTime())) return '-';
  return d.toLocaleDateString('vi-VN');
}
