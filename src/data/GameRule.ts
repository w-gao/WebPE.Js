import {float, int} from "../types";

export class GameRule {

    public name: string;
    public type: int;        // 1: boolean, 2: int, 3: float
    public value: boolean | int | float;

    constructor(name: string, type: number, value: boolean | int | float) {

        this.name = name;
        this.type = type;
        this.value = value;
    }

}
