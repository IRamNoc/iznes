import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-account-godmode',
  templateUrl: './component.html'
})
export class AccountGodmodeComponent implements OnInit {

  godModeFormGroup = this.fb.group({
    username: ['', Validators.required],
  });
  disableBtn: boolean = false;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
  }
  
  handleSubmitButtonClick()
  {
    console.log("ok");
  }
}
