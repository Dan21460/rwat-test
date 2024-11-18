import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { CarService } from '../car.service';
import { CarLocation } from '../car-location';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <article>
      <img class="listing-photo" [src]="carLocation?.photo" alt="Photo of {{carLocation?.name}}" />
      <section class="listing-description">
        <h2 class="listing-heading">{{ carLocation?.name }}</h2>
        <p class="listing-location">{{ carLocation?.city }}, {{ carLocation?.state }}</p>
      </section>
      <section class="listing-features">
        <h2 class="section-heading">About this Model</h2>
        <ul>
          <li>Number Available: {{ carLocation?.availableUnits }}</li>
          <li>Is the Car Serviced?: {{ carLocation?.wifi ? 'Yes' : 'No' }}</li>
          <li>Does the Car have Insurance?: {{ carLocation?.laundry ? 'Yes' : 'No' }}</li>
        </ul>
      </section>
      <section class="listing-apply">
        <h2 class="section-heading">Order One Today!!!</h2>
        <form [formGroup]="applyForm" (ngSubmit)="submitApplication()">
          <label for="first-name">First Name</label>
          <input id="first-name" type="text" formControlName="firstName" />
          <label for="last-name">Last Name</label>
          <input id="last-name" type="text" formControlName="lastName" />
          <label for="email">Email</label>
          <input id="email" type="email" formControlName="email" />
          <button type="submit" class="primary">Apply Now</button>
        </form>
      </section>
    </article>
  `,
  styleUrls: ['./details.component.css'],
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  carService = inject(CarService);
  carLocation: CarLocation | undefined;

  applyForm = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl(''),
  });

  constructor() {
    const carLocationId = Number(this.route.snapshot.params['id']);
    this.carService.getCarLocationById(carLocationId).then((carLocation) => {
      this.carLocation = carLocation;
    });
  }

  submitApplication() {
    if (this.applyForm.valid) {
      this.carService.submitApplication(
        this.applyForm.value.firstName ?? '',
        this.applyForm.value.lastName ?? '',
        this.applyForm.value.email ?? ''
      );
      alert('Application submitted successfully!');
    } else {
      alert('Please fill out all fields.');
    }
  }
}
