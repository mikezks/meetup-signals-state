import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, effect, inject, untracked } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { FlightFilterStore } from './flight-filter.store';
import { FlightFilter } from '../../logic/model/flight-filter';

@Component({
  selector: 'app-flight-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './flight-filter.component.html',
  providers: [
    FlightFilterStore
  ]
})
export class FlightFilterComponent {
  @Input() set filter(filter: FlightFilter) {
    this.inputFilterForm.setValue(filter);
    // this.localStore.addFilter(filter);
  }

  @Output() searchTrigger = new EventEmitter<FlightFilter>();

  inputFilterForm = inject(FormBuilder).nonNullable.group({
    from: ['', [Validators.required]],
    to: ['', [Validators.required]],
    urgent: [false]
  });

  selectedFilterControl = new FormControl(this.inputFilterForm.getRawValue(), { nonNullable: true });

  protected localStore = inject(FlightFilterStore);

  constructor() {
    this.localStore.initInputFilterUpdate(this.inputFilterForm.valueChanges);
    this.localStore.initSelectedFilterUpdate(this.selectedFilterControl.valueChanges);
    effect(() => this.inputFilterForm.patchValue(this.localStore.selectedFilter()), {
      allowSignalWrites: true
    });
    effect(() => this.selectedFilterControl.setValue(this.localStore.latestFilter()), {
      allowSignalWrites: true
    });
    effect(() => {
      const latestFilter = this.localStore.latestFilter();
      untracked(() =>
        latestFilter && this.searchTrigger.emit(latestFilter)
      );
    });
  }
}
