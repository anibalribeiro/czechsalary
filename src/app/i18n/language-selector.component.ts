import { Component, OnInit, Input } from '@angular/core';

import { I18nService } from './i18n.service';
import { LanguageModel } from '@app/i18n/language.model';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss'],
})
export class LanguageSelectorComponent implements OnInit {
  @Input() icon = false;

  constructor(private i18nService: I18nService) {}

  ngOnInit() {}

  setLanguage(language: LanguageModel) {
    this.i18nService.language = language.code;
  }

  get currentLanguage(): string {
    return this.i18nService.language;
  }

  get languages(): LanguageModel[] {
    return this.i18nService.supportedLanguages;
  }
}
