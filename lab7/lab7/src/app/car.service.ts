import {Injectable} from '@angular/core';
import {CarLocation} from './car-location';

@Injectable({
  providedIn: 'root',
})
export class CarService {
  readonly baseUrl = 'https://angular.dev/assets/images/tutorials/common';

  url = 'http://localhost:3000/locations';

  constructor() {
    
  }

  async getAllCarLocations(): Promise<CarLocation[]> {
    const data = await fetch(this.url);
    return (await data.json()) ?? [];
  }

  async getCarLocationById(id: number): Promise<CarLocation | undefined> {
    const data = await fetch(`${this.url}/${id}`);
    return (await data.json()) ?? {};
  }

  submitApplication(firstName: string, lastName: string, email: string) {
    console.log(
      `Homes application received: firstName: ${firstName}, lastName: ${lastName}, email: ${email}.`,
    );
  }
  
}
