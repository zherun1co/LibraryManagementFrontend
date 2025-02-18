import { MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';

export class DateUtils {
    static formatDate(date: Date | string, format: string): string {
        if (!date) return '';

        const d = new Date(date);
        const year = d.getFullYear();
        const month = (d.getMonth() + 1).toString().padStart(2, '0');
        const day = d.getDate().toString().padStart(2, '0');

        return format
            .replace('YYYY', year.toString())
            .replace('MM', month)
            .replace('DD', day);
    }
}