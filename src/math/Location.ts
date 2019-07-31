import {float} from "../types";
import {Vector3} from "./Vector3";

export class Location {

    public x: float;
    public y: float;
    public z: float;
    public pitch: float;
    public yaw: float;

    constructor(x?: float, y?: float, z?: float, pitch?: float, yaw?: float) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.yaw = yaw;
        this.pitch = pitch;
    }

    public static from(vec: Vector3, pitch?: float, yaw?: float): Location {
        return new Location(vec.x, vec.y, vec.z, pitch, yaw);
    }
}
