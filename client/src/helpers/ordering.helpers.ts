import { OrderState, OrderItem } from "models/common.models";

export function getOrderState<T>(
  orderBy: OrderItem<T>,
  thenBy?: OrderItem<T>
): OrderState<T> {
  let items: OrderItem<T>[] = [orderBy];
  if (thenBy) items.push(thenBy);
  return {
    orderBy,
    thenBy,
    orderByQueryString: queryStringBuilder(items)
  } as OrderState<T>;
}

export function queryStringBuilder<T>(items: OrderItem<T>[]): string {
  let qs = "";
  for (let i = 0; i < items.length; i++) {
    if(items[i] === undefined)
      continue;
    qs += `${i === 0 ? "" : "&"}orderBy[${i}][name]=${
      items[i].name
    }&orderBy[${i}][descend]=${items[i].descend}`;
  }

  return qs;
}

export function getOrder<T>(
  orderBy: OrderItem<T> | undefined,
  name: string
): boolean {
  if (!orderBy) return false;
  return orderBy.name === name;
}

export function getDescend<T>(
  orderBy: OrderItem<T> | undefined,
  name: string
): boolean {
  if (!orderBy) return false;
  return orderBy.name === name ? orderBy.descend : false;
}
