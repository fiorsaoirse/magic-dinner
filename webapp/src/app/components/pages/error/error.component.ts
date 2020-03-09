import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorCodes } from '../../../objects/error-codes.enum';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute) {
  }

  errorDescription: string;
  errorCode: string;

  ngOnInit() {
    let errorCode = ErrorCodes[this.activatedRoute.snapshot.paramMap.get('errorCode')];
    errorCode = ErrorCodes[errorCode];
    switch (errorCode) {
      case ErrorCodes.AUTHENTICATION_ERROR:
        this.errorDescription = 'Ошибка аутентификации';
        break;
      case ErrorCodes.SYSTEM_ERROR:
        this.errorDescription = 'Системная ошибка';
        break;
      case ErrorCodes.NOT_FOUND:
        this.errorDescription = 'Страница не найдена';
        this.errorCode = '404';
        break;
      default:
        this.errorDescription = 'Неизвестная ошибка';
        break;
    }
  }
}
