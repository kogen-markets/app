import { useEffect } from "react";

export const globalEventTarget = new EventTarget();

export enum GLOBAL_CUSTOM_EVENTS {
  SCROLL_CALL_FORM_INTO_VIEW,
}

export function dispatch(
  eventName: GLOBAL_CUSTOM_EVENTS,
  customEventInit?: CustomEventInit,
) {
  const event = new CustomEvent(eventName.toString(), customEventInit);

  return globalEventTarget.dispatchEvent(event);
}

export default function useCustomEventListener(
  eventName: GLOBAL_CUSTOM_EVENTS,
  fn: () => void,
) {
  useEffect(() => {
    globalEventTarget.addEventListener(eventName.toString(), fn);

    return () => {
      globalEventTarget.removeEventListener(eventName.toString(), fn);
    };
  }, [eventName, fn]);
}
