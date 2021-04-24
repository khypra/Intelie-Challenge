import SequenceEvent from "./sequenceEvent";
import SpanEvent from "./spanEvent";
import StartEvent from "./startEvent";

export default class Sequence {
    start : StartEvent;
    stop : SequenceEvent;
    span : SpanEvent;
    data = []; 
}