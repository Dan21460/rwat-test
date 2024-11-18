import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarLocationComponent } from '../car-location/car-location.component';
import { CarLocation } from '../car-location';
import { CarService } from '../car.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarLocationComponent],
  template: `
    <section>
      <form>
        <input type="text" placeholder="Filter by Car or Location" #filter />
        <button class="primary" type="button" (click)="filterResults(filter.value)">Search</button>
      </form>
    </section>
    <section class="results">
      <app-car-location
        *ngFor="let carLocation of filteredLocationList"
        [carLocation]="carLocation"
      ></app-car-location>
    </section>
  `,
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  carLocationList: CarLocation[] = [];
  carService: CarService = inject(CarService);
  filteredLocationList: CarLocation[] = [];

  constructor() {
    this.carService.getAllCarLocations().then((carLocationList: CarLocation[]) => {
      this.carLocationList = carLocationList;
      this.filteredLocationList = carLocationList;
    });
  }

  filterResults(text: string) {
    if (!text) {
      this.filteredLocationList = this.carLocationList;
      return;
    }
    const lowerText = text.toLowerCase();
    this.filteredLocationList = this.carLocationList.filter(
      (carLocation) =>
        carLocation?.city.toLowerCase().includes(lowerText) ||
        carLocation?.name.toLowerCase().includes(lowerText)
    );
  }
}
