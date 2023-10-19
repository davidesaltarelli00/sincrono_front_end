import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StepperService {
  private currentStep: number = 0;

  setCurrentStep(step: number) {
    this.currentStep = step;
  }

  getCurrentStep(): number {
    return this.currentStep;
  }
}
