import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GodModeService } from './service';
import { ToasterService, Toast } from 'angular2-toaster';

@Component({
  selector: 'app-account-godmode',
  templateUrl: './component.html'
})
export class AccountGodmodeComponent implements OnInit {

  godModeFormGroup = this.fb.group({
    username: ['', Validators.required],
  });
  disableBtn: boolean = false;
  giveMeAccessTriggered: boolean = false;
  secondsLeft: number = 0;
  secondsMax: number = 10;
  toastTimer;
  timerToast: Toast;
  toasterConfig: any = {
      type: 'warning',
      title: '',
      timeout: 0,
      tapToDismiss: false,
  };

  constructor(
    private fb: FormBuilder,
    private GodModeService: GodModeService,
    private toaster: ToasterService,
    ) { }

  ngOnInit() {
    this.godModeFormGroup.valueChanges.subscribe(() => {
      this.disableBtn = this.godModeFormGroup.valid;
    });
  }
  
  handleSubmitButtonClick()
  {
    const request = {
      username: this.godModeFormGroup.controls['username'].value,
    };

    const timer = setInterval(() => {
      this.secondsLeft = this.secondsLeft > 0 ? this.secondsLeft - 1 : 0;
    }, 1000);

    this.disableBtn = false;
    this.giveMeAccessTriggered = true;
    this.secondsLeft = this.secondsMax;

    this.GodModeService.requestGiveMeAccessAdmin(request).then((result) => {
      const data = result[1].Data;
      if (data.error) {
        this.godModeFormGroup.controls['username'].setValue(['']);
        return this.toaster.pop('error', data.Message);
      }
    }).catch((error) => {
      const data = error[1].Data;
      this.godModeFormGroup.controls['username'].setValue(['']);
      return this.toaster.pop('error', data.Message);
    }).finally(() => {
      this.disableBtn = true;
      this.giveMeAccessTriggered = false;
      clearInterval(timer);
    });
  }
}
