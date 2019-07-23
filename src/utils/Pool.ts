/**
 * Experimental utility for object pooling
 */
export default class Pool<T> {

    private size: number;
    private readonly originalSize: number;
    private readonly construct: any;
    private readonly objects: any[];
    private offset: number;
    private numActive: number;

    constructor(construct, size: number) {

        this.size = 0;
        this.originalSize = size;
        this.construct = construct;
        this.objects = [];
        this.offset = 0;
        this.numActive = 0;

        this.expand(size);
    }

    public expand(num: number): void {

        for (let i = 0; i < num; i++) {
            const obj = this.construct();
            obj.id = i + this.size;
            obj.active = false;
            this.objects.push(obj);
        }
        this.size += num;
    }

    public retrieve(): T {

        let i = this.offset;

        do {
            i = (i + 1) % this.size;
            const obj = this.objects[i];

            if (!obj.active) {
                this.offset = i;
                this.numActive++;
                obj.active = true;
                return obj;
            }
        } while (i != this.offset);

        this.expand(this.originalSize);
        console.log('[Pool] Expanding \'' + this.objects[0].constructor.name + '\' to ' + this.size);
        return this.retrieve();
    }

    public recycle(obj) {
        obj.active = false;
        this.numActive--;
    }

}
