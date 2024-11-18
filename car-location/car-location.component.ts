import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarLocation } from '../car-location';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-car-location',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <section class="listing">
      <img 
        class="listing-photo" 
        [src]="carLocation.photo" 
        alt="Exterior photo of {{ carLocation.name }}" 
      />
      <h2 class="listing-heading">{{ carLocation.name }}</h2>
      <p class="listing-location">{{ carLocation.city }}, {{ carLocation.state }}</p>
      <a [routerLink]="['/details', carLocation.id]">Learn More</a>
    </section>
  `,
  styleUrls: ['./car-location.component.css'],
})
export class CarLocationComponent {
  @Input() carLocation!: CarLocation;
}
