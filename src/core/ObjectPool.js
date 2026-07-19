
export class Pool {
    constructor(ClassType, initialSize) {
        this.ClassType = ClassType;
        this.pool = [];
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(new ClassType());
        }
    }
    
    spawn(...args) {
        let obj = this.pool.length > 0 ? this.pool.pop() : new this.ClassType();
        if (obj.init) obj.init(...args);
        return obj;
    }
    
    release(obj) {
        if(obj) this.pool.push(obj);
    }
}
