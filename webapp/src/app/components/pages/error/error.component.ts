import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ErrorCodes } from '../../../objects/error-codes.enum';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})
export class ErrorComponent implements OnInit {
  private errorDescription?: string;
  private errorCode?: string;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    const code = this.activatedRoute.snapshot.paramMap.get('errorCode');
    if (!code) {
      throw new Error(`Route doesn't contains param "errorCode"`);
    }
    this.errorCode = code;
    switch (code) {
      case ErrorCodes.AUTHENTICATION_ERROR:
        this.errorDescription = 'Ошибка аутентификации';
        break;
      case ErrorCodes.SYSTEM_ERROR:
        this.errorDescription = 'Системная ошибка';
        break;
      case ErrorCodes.NOT_FOUND:
        this.errorDescription = 'Страница не найдена';
        break;
      default:
        this.errorDescription = 'Неизвестная ошибка';
        break;
    }
  }
}
