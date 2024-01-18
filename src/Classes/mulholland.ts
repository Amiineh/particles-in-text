import p5 from 'p5';
import { Poisson2D, getLastDistance } from './moore';
import { StateManager } from './StateManager';
import { AppState } from '../main';
// source: https://openprocessing.org/sketch/1488948

export class MulhollandSketchManager  {
            // clearing the previous canvas upon a new p5 call
    // Define a variable to hold the current p5 instance
    private currentSketch: p5 | null = null;

    // Function to initialize a new p5 sketch
    initSketch(sketchFunction: (p: p5) => void) {
        // Check if there is an existing sketch and remove it
        if (this.currentSketch !== null) {
            this.currentSketch.remove();
        }
        // Create a new p5 instance with the provided sketch function
        this.currentSketch = new p5(sketchFunction);
    }

    createSketch(state:AppState){
        return (p: p5) => {
        // Define variables that use p5 types
        let canvas: p5.Renderer;
        let w: number; // Width of canvas
        let h: number; // Height of canvas
        let s: number; // Scale, min of w and h
        let asp = 1 / 1.4; // Aspect ratio
        let c: p5.Renderer; // Canvas
        let pixelMapper: PixelMapper; // Pixel coordinate mapper
        let gfx: p5.Graphics;
        let seed: number;
        let pd: number;
        let random = p.random;
        let floor = p.floor;
        let circles: { center: number[], radius: number, dist: number }[];

        let canvasExtent: number[] = [-1, 1, -1 / asp, 1 / asp];
        let artExtent = addMargin(canvasExtent);
        let extentWidth = canvasExtent[1] - canvasExtent[0];

        let pointsPerFrame = 100;
        let pds: Poisson2D;
        let grainImg: p5.Image;
        let backgroundLightness: number;
        let pointFill: string;

        // const palettes = [
        //     ['#1f2421', '#ea8c55', '#ad2e24', '#7b9e89', '#00798c'],
        //     ['#bac1b8', '#58a4b0', '#0c7c59', '#2b303a', '#d64933', '#706993', '#c60f7b']
        // ];
        // let colors: string[];

        

        p.setup = () => {
            pd = p.pixelDensity();

            seed = 5325 * p.random();

            console.log("state", state);

            // colors = palettes[Math.floor(palettes.length*p.random())];
            // colors.sort(() => p.random() - 0.5);

            [w, h] = computeCanvasSize(p.windowWidth, p.windowHeight, asp);
            // w = Math.round(w);
            // h = Math.round(h);
            w = 1000;
            h = 500;
            s = Math.min(w, h);

            pixelMapper = new PixelMapper(w, h);
            pixelMapper.setExtentWidth(extentWidth);

            c = p.createCanvas(w, h);
            gfx = p.createGraphics(w, h);

            p.noiseSeed(72 * seed);
            let xNoise = new Perlin(5631 * seed, 0.5, 10, 0.5);
            let yNoise = new Perlin(7242 * seed, 0.5, 10, 0.5);

            circles = generateCircles(artExtent, 0.25, 0.5, random);
            const nCircles = circles.length;
            // const circles = generateCircles(artExtent, 0.5, 0.5, p.random);
            // const nCircles = 1; // Only considering one circle


            const warpSizeX = p.random(0.1, 1);
            const warpSizeY = p.random(0.1, 1);
            const numWarps = p.floor(p.random(1, 10 + 1));

            function distanceFunction(pt: number[]) {
                let [x, y] = pt;
                let warpScale = 1;
                for (let i = 0; i < numWarps; i++) {
                    const dx = -1 + 2 * xNoise.ev(x, y);
                    const dy = -1 + 2 * xNoise.ev(x, y);

                    x += warpScale * warpSizeX * dx;
                    y += warpScale * warpSizeY * dy;

                    warpScale *= 0.9;
                }

                for (let i = 0; i < nCircles; i++) {
                    const circ = circles[i];
                    const [cX, cY] = circ.center;
                    if (Math.hypot(cX - x, cY - y) < circ.radius) return circ.dist;
                }
                return 1;
            }

            // const minDistance = p.random(0.004, 0.006);
            const minDistance = state.MAP_SCALE;
            const maxDistance = minDistance * p.random(5, 10);

            pds = new Poisson2D({
                extent: artExtent,
                minDistance: minDistance,
                maxDistance: maxDistance,
                distanceFunction,
                tries: 10,
            }, random);

            // grainImg = p.createImage(2 * pd * w, 2 * pd * h);
            // addGrain(grainImg, 0.2, false, random);
            // grainImg.resize(pd * w, pd * h);

            // backgroundLightness = p.random();
            // pointFill = backgroundLightness > 0.5 ? "#030203" : "#fcfdfc";
            pointFill = state.DOT_COLOR;

            gfx.colorMode(p.HSL, 1);
            // // gfx.background(p.random(), p.random(), backgroundLightness);

            // // p.image(gfx, 0, 0);
            // p.blend(grainImg, 0, 0, pd * p.width, pd * p.height, 0, 0, p.width, p.height, p.DIFFERENCE);
            // p.loop();
            // p.background(255);
            // p.background(0, 0, 0, 0);
            p.background(state.BG_COLOR);
        };

        p.draw = () => {
            p.stroke(pointFill);
            // p.strokeWeight(s / 300);
            p.strokeWeight(state.SIZE);

            for (let i = 0; i < pointsPerFrame; i++) {
                let pt = pds.next();
                let d = pds.getLastDistance();
                let dCbrt = Math.pow(d, 1/3);
                if (!pt) {
                        p.noLoop();
                        return;
                }
                
                let idx = Math.floor(dCbrt*state.MAP_STRENGTH);
                if (idx == 0)

                // const currentColor = colors[Math.min(Math.floor(dCbrt*colors.length), colors.length - 1)];
                // if (currentColor === colors[3]) {
                //     p.stroke(currentColor);
                    p.point(...pixelMapper.toPixel(...pt));

                // }
                
            }
        };

        // ... Define other p5 functions and classes as needed


        window.addEventListener("keyup", (e) => {
            if (e.key === " ") {
                p.setup();
                p5.draw();
            }
        });

        //////////////////////////////

        function addGrain(img: p5.Image, fill = 0.05, color = false, rng = Math.random) {
            img.loadPixels();
            const w = img.width;
            const h = img.height;

            for (let i = 0; i < h; i++) {
                for (let j = 0; j < w; j++) {
                    let ind = 4 * (i * w + j);
                    let c;
                    if (color) {
                        c = Array(3).fill(0).map(_ => fill * 255 * rng());
                    } else {
                        const value = fill * 255 * Math.random();
                        c = Array(3).fill(value);
                    }


                    img.pixels[ind] = c[0];
                    img.pixels[ind + 1] = c[1];
                    img.pixels[ind + 2] = c[2];
                    img.pixels[ind + 3] = 255;
                }
            }

            img.updatePixels();
        }

        //////////////////////////////

        function addMargin(extent: number[], margin = 0.05) {
            let [xMin, xMax, yMin, yMax] = extent;
            const width = xMax - xMin;
            const height = yMax - yMin;

            const s = Math.min(width, height);

            xMin += margin * s;
            xMax -= margin * s;
            yMin += margin * s;
            yMax -= margin * s;
            return [xMin, xMax, yMin, yMax];
        }

        //////////////////////////////


        function computeCanvasSize(windowWidth: number, windowHeight: number, aspectRatio: number, margin = 0.1) {
            let w, h;

            if (windowHeight * aspectRatio <= windowWidth) {
                [w, h] = [windowHeight * aspectRatio, windowHeight];
            } else {
                [w, h] = [windowWidth, windowWidth / aspectRatio];
            }
            return [(1 - margin) * w, (1 - margin) * h];
        }

        //////////////////////////////

        function generateCircles(extent: number[], minRadius = 0.1, maxRadius = 2, rng = Math.random) {
            const circles: { center: number[], radius: number, dist: number }[] = [];

            const pds = new Poisson2D({ extent, minDistance: 0.1 }, rng);
            const centers = pds.fill();
            const n = centers.length;

            for (let i = 0; i < n; i++) {
                circles.push({
                    center: centers[i],
                    radius: minRadius + (maxRadius - minRadius) * Math.random(),
                    dist: Math.pow(Math.random(), 3) // Using a power > 1 gives bias towards lower values
                });
            }
            return circles;
        }

        //////////////////////////////

        class Perlin {
            private xOffset: number;
            private yOffset: number;
            private range: number;
            private octaves: number;
            private falloff: number;
            private normConst: number;

            constructor(seed: number, range = 1, octaves = 4, falloff = 0.5) {
                this.xOffset = p.random();
                this.yOffset = p.random();
                this.range = range;
                this.octaves = octaves;
                this.falloff = falloff;

                this.normConst = 0;
                let ampl = 0.5;
                for (let i = 0; i < octaves; i++) {
                    this.normConst += ampl;
                    ampl *= falloff;
                }
            }

            ev(x: number, y: number) {
                const r = this.range;
                p.noiseDetail(this.octaves, this.falloff);
                let v = p.noise((x + this.xOffset) / r, (y + this.yOffset) / r);
                return v / this.normConst;
            }
        }

        //////////////////////////////

        class PixelMapper {
            private size: number[];
            private asp: number;
            private ySign: number;
            private width: number;
            private height: number;

            constructor(pixelWidth: number, pixelHeight: number) {
                this.size = [pixelWidth, pixelHeight];
                this.asp = pixelWidth / pixelHeight;
                this.setFlipY(true);
                this.setExtentWidth(2);
            }

            setFlipY(value: boolean) {
                this.ySign = value ? -1 : 1;
            }

            setExtentWidth(width: number) {
                this.width = width;
                this.height = width / this.asp;
            }

            setExtentHeight(height: number) {
                this.height = height;
                this.width = asp * height;
            }

            pixelToUnit(column: number, row: number) {
                const [w, h] = this.size;
                return [(column + 0.5) / w, (row + 0.5) / h];
            }

            unitToPixel(u: number, v: number) {
                const [w, h] = this.size;
                return [u * w - 0.5, v * h - 0.5];
            }

            fromPixel(column: number, row: number) {
                if (row === undefined) [column, row] = [column, column];
                let [u, v] = this.pixelToUnit(column, row);
                const asp = this.asp;
                let x = (u - 0.5) * this.width;
                let y = (v - 0.5) * this.height * this.ySign;
                return [x, y];
            }

            toPixel(x: number, y: number) {
                if (y === undefined) [x, y] = [x, x];
                let u = x / this.width + 0.5;
                let v = y * this.ySign / this.height + 0.5;
                return this.unitToPixel(u, v);
            }
        }

    };
}
}
//////////////////////////////

// export default MulhollandSketchManager;