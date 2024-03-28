export class EventBus {
  public static on(event: any, callback: any) {
    document.addEventListener(event, (e) => callback(e.detail))
  }

  public static dispatch(event: any, data: EventBus.Data | any) {
    document.dispatchEvent(new CustomEvent(event, { detail: data }))
  }

  public static remove(event: any, callback: any) {
    document.removeEventListener(event, callback)
  }
}
