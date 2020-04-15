import { NgModule } from '@angular/core';
import { LocalDatePipe } from './local-date';
import { TransformDatePipe } from './transform-date';
import { ChangeFahrenheitPipe } from './change-fahrenheit.pipe';
@NgModule({
	declarations: [
		LocalDatePipe,
		TransformDatePipe,
		ChangeFahrenheitPipe,
	],
	imports: [],
	providers: [
		LocalDatePipe,
		TransformDatePipe,
		ChangeFahrenheitPipe,
	],
	exports: [
		LocalDatePipe,
		TransformDatePipe,
		ChangeFahrenheitPipe,
	]
})
export class PipesModule { }
