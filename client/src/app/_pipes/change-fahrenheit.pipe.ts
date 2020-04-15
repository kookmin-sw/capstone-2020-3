import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeFahrenheit'
})
export class ChangeFahrenheitPipe implements PipeTransform {

  transform(value: number, changeType: string): any {
    let changeValue = 0;
    if(changeType == "C"){
      changeValue = (value - 32) / 1.8;
    }else{
      changeValue = (value * 1.8) + 32;
    }
    changeValue = Number(changeValue.toFixed(1));
    return changeValue;
  }

}
