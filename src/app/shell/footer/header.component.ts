import { Title } from '@angular/platform-browser';
import { Component, Input, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
})
export class FooterComponent implements OnInit {
  @Input() sidenav!: MatSidenav;

  constructor(private titleService: Title) {}

  ngOnInit() {}

  get title(): string {
    return this.titleService.getTitle();
  }
}
