export class ObjectPool {
    constructor(createFn, initialSize = 100) {
        this.createFn = createFn;
        this.pool = [];
        this.active = [];

        for (let i = 0; i < initialSize; i++) {
            this.pool.push(this.createFn());
        }
    }

    get() {
        let obj;
        if (this.pool.length > 0) {
            obj = this.pool.pop();
        } else {
            obj = this.createFn();
        }
        obj.active = true;
        this.active.push(obj);
        return obj;
    }

    release(obj) {
        obj.active = false;
        this.pool.push(obj);
        
        const index = this.active.indexOf(obj);
        if (index > -1) {
            this.active.splice(index, 1);
        }
    }

    releaseAll() {
        for (let obj of this.active) {
            obj.active = false;
            this.pool.push(obj);
        }
        this.active = [];
    }
    
    getActive() {
        return this.active;
    }
}
