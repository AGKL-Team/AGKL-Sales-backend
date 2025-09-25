export interface Specification<T> {
  /** Convert the specification to a query criteria */
  toCriteria(): any;
}
