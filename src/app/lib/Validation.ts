import { isEmail, isEmpty, isMobilePhone, isLength, isNumeric } from 'validator';
import { AbstractControl } from '@angular/forms';

function formatData(value: any): string {
    if (typeof value === 'object' && value  !== null) {
        return JSON.stringify(value);
    } else {
        return String(value);
    }
}

export class Validation {

    static required(message: string = 'Invalid param is required') {
        return (control: AbstractControl) => {
            if (control.value === null) {
                return { message };
            }
            return (isEmpty(formatData(control.value)) ? { message } : null);
        };
    }

    static isEmail(message: string = 'Invalid param email.') {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            if (!isEmail(String(control.value))) {
                return { message };
            }
        };
    }

    static isMobile(message: string = 'Invalid param mobile phone.') {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            if (!isMobilePhone(String(control.value), 'zh-CN')) {
                return { message };
            }
        };
    }

    static isNumeric(message: string = 'Invalid param number.') {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            if (!isNumeric(String(control.value))) {
                return { message };
            }
        };
    }

    static isLength(options: { min?: number, max?: number } = {}, message: string = 'Invalid param length') {
        return (control: AbstractControl) => {
            if (!control.value) {
                return null;
            }
            if (!isLength(formatData(control.value), options)) {
                return { message };
            }
        };
    }
};


