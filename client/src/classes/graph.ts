
type WeekDayGraphOptionsOriginal = {
    points: number[],
    curve?: number,
    dimensions: { width:number, height:number },
    animationDuration?: number,
}

type WeekDayGraphOptions = {
    points: number[],
    curve: number,
    dimensions: { width:number, height:number },
    animationDuration?: number,
}

type WeekDayGraphAnimation = {
    height: number,
}

class WeekDayGraph {
    private ctx:CanvasRenderingContext2D | null;
    private options:WeekDayGraphOptionsOriginal;
    private modifiedOptions:WeekDayGraphOptions;   
    private animation:WeekDayGraphAnimation;

    private curve:number = 0; 

    constructor(ctx:CanvasRenderingContext2D | null, options:WeekDayGraphOptions) {
        this.ctx = ctx; 
        this.options = options; 
        this.modifiedOptions = this.updateOptions();
        this.animation = this.updateAnimation();
    }

    private updateAnimation() : WeekDayGraphAnimation {
        let tempAnimation = {
            height: 0,
            duration: this.modifiedOptions.animationDuration || 500,
        }

        return tempAnimation;
    }

    private updateOptions() : WeekDayGraphOptions {
        let tempOptions:any = this.options; 
        
        if (!tempOptions.curve) tempOptions.curve = this.curve; 

        return tempOptions;
    }  

    create() {
        this.clearRect();
        
        if (!this.ctx) throw Error();
        
        const currentCanvasAnimationHeight = this.animation.height; 
        const canvasHeight = this.modifiedOptions.dimensions.height;

        this.renderPoints();

        if (currentCanvasAnimationHeight < canvasHeight) {
            this.animation.height += 12 - (((currentCanvasAnimationHeight / canvasHeight) * 11) + 1);
            requestAnimationFrame(() => {
                this.create();
            });
        };
    }

    clearRect() {
        const { width, height } = this.modifiedOptions.dimensions; 
        this.ctx?.clearRect(0, 0, width, height);
    }

    renderPoints() {
        this.clearRect();

        if (!this.ctx) throw Error();

        const width = this.modifiedOptions.dimensions.width;
        const height = this.modifiedOptions.dimensions.height;

        let points = this.modifiedOptions.points;
        let gap = width / this.modifiedOptions.points?.length;

        this.ctx.beginPath();

        const extra = height - this.animation.height; 
        this.ctx.moveTo(0, extra + this.animation.height - 15);
        
        if (!this.modifiedOptions.curve) {
            points?.forEach((point, index) => {
                if (!this.ctx) throw Error();

                const pointHeight = extra + this.animation.height - 15 - ((point / 24) * this.animation.height);  
                const pointX = gap * (index + 1); 
                
                this.ctx.lineTo(pointX, pointHeight);
            });
        } else {
            
        }

        this.ctx.stroke();
        this.ctx.closePath();
    }
}

export default WeekDayGraph;