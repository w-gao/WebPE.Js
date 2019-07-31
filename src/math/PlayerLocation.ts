import {float} from "../types";
import {Vector3} from "./Vector3";

export class PlayerLocation {

    public x: float;
    public y: float;
    public z: float;
    public pitch: float;
    public yaw: float;
    public headYaw: float;

    constructor(x?: float, y?: float, z?: float, pitch?: float, yaw?: float, headYaw?: float) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.pitch = pitch;
        this.yaw = yaw;
        this.headYaw = headYaw;
    }

    public static from(vec: Vector3, pitch?: float, yaw?: float, headYaw?: float): PlayerLocation {
        return new PlayerLocation(vec.x, vec.y, vec.z, pitch, yaw, headYaw);
    }
}
