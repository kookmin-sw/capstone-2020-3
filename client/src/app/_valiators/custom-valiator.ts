import { FormControl } from '@angular/forms';

export class EmailValidator {
    /**
     * 이메일이 유효한지 검증
     * @param control 
     */
    static invalidEmail(control: FormControl): any {
        let re =  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        // skip validation if empty (Validators.required should handle this)
        if(!control.value) {
            return null;
        }
        
        if(!re.test(control.value)) {
            return {
                "invalidEmail": true
            };
        }
        return null;
    }
}

export class InputValidator {
    
    /**
     * 입력문자의 첫글자는 숫자가 안되도록 검증
     * @param control
     */
    static startsWithNumber(control: FormControl) {
        var valid = /^\d/.test(control.value);
        if (valid && control.value != "" && !isNaN(control.value.charAt(0))) {
            return { startsWithNumber: true };
        }
        return null;
    }

    /**
     * 공백이 있나 없나 체크
     * @param control 
     */
    static checkSpace(control: FormControl) { 
        var valid = control.value.search(/\s/) != -1
        if(valid && control.value != "") { 
            return { checkSpace: true }; 
        }
        return null;
    }

    /**
     * 특수 문자가 있나 없나 체크
     * @param control 
     */
    static checkSpecial(control: FormControl) { 
        var special_pattern = /[`~!@#$%^&*|\\\'\";:\/?]/gi;
        var valid = special_pattern.test(control.value);
        if(valid && control.value != "") { 
            return { checkSpecial: true };
        }
        return null;
    }
}