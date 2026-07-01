import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItem } from '../../models/common';

@Component({
  selector: 'app-side-panel',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './side-panel.html',
  styleUrl: './side-panel.scss',
})
export class SidePanel {
  menuItems = signal<MenuItem[]>([
    {
      title: 'Start',
      route: '/basic',
    },
    {
      title: 'Basic All',
      route: '/basic-all',
    },
    {
      title: 'Nested',
      route: '/nested-form',
    },
    {
      title: 'Form Array',
      route: '/form-array',
    },
  ]);
}
