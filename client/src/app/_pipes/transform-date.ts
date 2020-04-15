import { Pipe, PipeTransform } from '@angular/core';
import { DatePipe } from '@angular/common';

/**
 * UTC 날짜를 사용자가 보고 있는 date에 맞추어 변형.
 */
@Pipe({
    name: 'transformDate',
})
export class TransformDatePipe implements PipeTransform {
    constructor(
        private datePipe: DatePipe
    ) { }

    transform(value: string, displayFormat: string) {
        let dftDisplayFormat = "yyyy-MM-dd HH:mm:ss";

        if (value) {
            let tempDate: string = value;
            let year = parseInt(tempDate.substr(0, 4));
            let month = parseInt(tempDate.substr(5, 2)) - 1;
            let day = parseInt(tempDate.substr(8, 2));
            let hour = parseInt(tempDate.substr(11, 2));
            let minute = parseInt(tempDate.substr(14, 2));
            let second = parseInt(tempDate.substr(17, 2));

            let changeDate: any;


            if (displayFormat) {
                changeDate = this.datePipe.transform(new Date(year, month, day, hour, minute, second), displayFormat);
            } else {
                changeDate = this.datePipe.transform(new Date(year, month, day, hour, minute, second), dftDisplayFormat);
            }

            return changeDate;
        }
        return this.datePipe.transform(new Date(), dftDisplayFormat);
    }
}