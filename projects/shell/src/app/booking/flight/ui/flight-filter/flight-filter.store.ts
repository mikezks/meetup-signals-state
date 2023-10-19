import { rxMethod, selectSignal, signalStore, withMethods, withSignals, withState } from "@ngrx/signal-store";
import { pipe, tap } from "rxjs";
import { FlightFilter, initialFlightFilter } from "../../logic/model/flight-filter";


export type LocalState = {
  filters: FlightFilter[];
  inputFilter: FlightFilter;
  selectedFilter: FlightFilter;
}

export const initialLocalState: LocalState = {
  filters: [],
  inputFilter: initialFlightFilter,
  selectedFilter: initialFlightFilter
};


export const FlightFilterStore =  signalStore(
  // State
  withState<LocalState>(initialLocalState),
  // Selectors
  withSignals(({ filters }) => ({
    latestFilter: selectSignal(() => filters().slice(-1)[0])
  })),
  // Updater
  withMethods(({ $update }) => ({
    updateInputFilter: (filter: FlightFilter) => $update(state => ({
      ...state,
      inputFilter: filter
    })),
    updateSelectedFilter: (filter: FlightFilter) => $update(state => ({
      ...state,
      selectedFilter: filter
    })),
    addFilter: (filter: FlightFilter) => $update(state => ({
      ...state,
      filters: [
        ...state.filters.filter(f => !(
          f.from === filter.from &&
          f.to === filter.to
        )),
        filter
      ]
    }))
  })),
  // Effects
  withMethods((
    { inputFilter, addFilter, updateInputFilter, updateSelectedFilter }
  ) => ({
    triggerSearch: () => {
      addFilter(inputFilter());
    },
    initInputFilterUpdate: rxMethod<Partial<FlightFilter>>(pipe(
      tap(filter => updateInputFilter(filter as FlightFilter))
    )),
    initSelectedFilterUpdate: rxMethod<FlightFilter>(pipe(
      tap(filter => updateSelectedFilter(filter))
    ))
  }))
);
