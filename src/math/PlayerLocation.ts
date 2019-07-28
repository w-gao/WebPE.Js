import {float} from "../types";
import {Vector3} from "./Vector3";

export class PlayerLocation {

    public x: float;
    public y: float;
    public z: float;
    public yaw: float;
    public pitch: float;
    public headYaw: float;

    constructor(x: float, y: float, z: float, yaw: float, pitch: float, headYaw: float) {

        this.x = x;
        this.y = y;
        this.z = z;
        this.yaw = yaw;
        this.pitch = pitch;
        this.headYaw = headYaw;
    }

    public static from(vec: Vector3, yaw: float, pitch: float, headYaw: float): PlayerLocation {
        return new PlayerLocation(vec.x, vec.y, vec.z, yaw, pitch, headYaw);
    }
}
