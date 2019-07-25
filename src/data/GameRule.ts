export class GameRule {

    public name: string;
    public type: number;        // 1: boolean, 2: int, 3: float
    public value: boolean | number;

    constructor(name: string, type: number, value: boolean | number) {

        this.name = name;
        this.type = type;
        this.value = value;
    }

}
