import { AsyncPipe, DatePipe, JsonPipe, NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { injectBookingFeature } from '../../../+state/booking.state';
import { CardComponent } from '../../ui/card.component';
import { FlightFilterComponent } from "../../ui/flight-filter/flight-filter.component";
import { FlightFilter } from '../../logic/model/flight-filter';
import { signalState } from '@ngrx/signal-store';


type LocalState = {
  filter: FlightFilter;
  basket: Record<number, boolean>;
}


@Component({
    selector: 'app-flight-search',
    standalone: true,
    templateUrl: './search.component.html',
    imports: [
        NgIf, NgFor, DatePipe, JsonPipe, AsyncPipe,
        RouterLink,
        FormsModule,
        CardComponent,
        FlightFilterComponent
    ]
})
export class SearchComponent {
  protected bookingFeature = injectBookingFeature();

  protected localState = signalState<LocalState>({
    filter: {
      from: 'Paris',
      to: 'London',
      urgent: false
    },
    basket: {
      3: true,
      5: true
    }
  });

  filterChange(filter: FlightFilter): void {
    this.filterUpdate(filter);
    this.bookingFeature.search(filter);
  }

  filterUpdate(filter: Partial<FlightFilter>): void {
    this.localState.$update(state => ({
      ...state,
      filter: {
        ...state.filter,
        ...filter
      }
    }));
  }

  basketIdUpdate(id: number, selected: boolean): void {
    this.localState.$update(state => ({
      ...state,
      basket: {
        ...state.basket,
        [id]: selected
      }
    }));
  }
}
