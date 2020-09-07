function EventBus() {
  this.listeners = [];
  this.remove = function(eventName) {
    const arr = this.listeners.filter((temp) => {
      return temp.eventName !== eventName;
    });
    this.listeners = arr;
  }

  this.trigger = function(eventName, param) {
    this.listeners.forEach((item) => {
      if (eventName === item.eventName) {
        item.fn(param);
      }
    })
  }

  this.on = function(eventName, fn) {
    this.listeners.push({
      eventName, 
      fn
    });
  }
}

export const eventBus = new EventBus();