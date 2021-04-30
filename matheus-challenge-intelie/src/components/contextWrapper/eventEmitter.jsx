import EventEmitter from "eventemitter3";

const eventEmitter = new EventEmitter();
//class event emitter with the eventemitter3 library that handle events between components
//documentation:  https://github.com/primus/eventemitter3
const Emitter = {
  on: (event, fn) => eventEmitter.on(event, fn),
  once: (event, fn) => eventEmitter.once(event, fn),
  off: (event, fn) => eventEmitter.off(event, fn),
  emit: (event, payload) => eventEmitter.emit(event, payload),
};

Object.freeze(Emitter);

export default Emitter;
