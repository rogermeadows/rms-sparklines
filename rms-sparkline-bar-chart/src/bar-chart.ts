/*
 * Copyright © Markodojo Inc., 2013 - ${YEAR}
 * All Rights Reserved. No part of this website may be reproduced without Markodojo express consent.
 */

/**
 * Introduction
 * Bar chart sparlines are a collection of rectangles, a.k.a. bars, drawn
 * alongside the canvas x-axis, with a small gap between them.
 *
 * Bar chart sparlines are charactized by their types: positive, negative,
 * dual, and tri. Positive charts' bars with positve heights are drawn
 * northward; bars with negative heights are cropped out. Negative charts'
 * bars with negative heights are drawn southward; bars with positive heights
 * are cropped out. Dual charts' bars heights are negative, zero, or positive,
 * with a positive height bars drawn northward and negative ones southward.
 * Tri charts have equal height bars, with positive drawn northward, zero
 * straddling the x-axis, and negative southward.

 * Bars are characterized by origin, height, width, gap, and fill color. The
 * origin is always (0,0). The height is provided, and scaled to fit within the
 * canvas. The width is calculated and its proportional number of bars and the
 * the canvas width. The gap is provided. The fill color is provided and used to
 * draw the bars' backgrounds.
 *
 * Calculation parameters
 * The parameters required to draw a bar char sparkline fall within two
 * categories: attributes, calculated. See below for their definitions and
 * descriptions.
 *
 * Bar width calculation
 * The bar width, barWidth, is the ratio between the canvas width and the
 * number of bars to draw, rounded down. The barWidth calculation is an
 * interation seeking the number o bars to draw, barHeights.length, that yiels
 * a barWidth equal or higher than the minimum bar width, minimumBarWidth. If
 * the initial barWidth, Math.floor(canvas.width / heights.length), yields a
 * barWidth that is less than minimumBarWidth, we drop the leftmost barHeights
 * element and recalculate the barWidth using the new heights.length; we
 * iterate until the barWidth is greater or equal to minBarWidth.
 *
 * Bar gap insertion
 * The bar gaps, barGap, inserted between the bars might cause rightmostbars to
 * be cropped out. The barGap insertion is an iteration seeking for a
 * barHeights.length enabling barGaps to be inserted without cropping any
 * rightmost bars. If the initial width required, widthRequired, to insert the
 * bars and their gaps,
 * barWidth*barHeights.length + barGap*(barHeights.length - 1), is greater than
 * the canvas.width, we drop the leftmost barHeights element and recalculate
 * the widthRequired using the new heights.length; we iterate until the
 * widthRequired is less or equal to canvas.width.
 *
 0        1         2         3         4         5         6         7         8
 12345678901234567890123456789012345678901234567890123456789012345678901234567890
 * Bar chart type drawing
 * The bar chart origin, direction, and scale calculations depend on the bar
 * chart type. We use the canvas setTransform and translate functions to aid in
 * setting them. We start by establishing the canvas default state and then
 * describe the operations to transform it to suit the bar char we are drawing
 *
 * In the canvas original state, its origin is top-let, positive drawing
 * southward, and negative northward. The canvas translate method is used to
 * move the origin; the canvas scale method is used to flip the canvas drawing
 * and to move the origin when inserting gaps.
 *
 * Wehn drawing a positive chart:
 * - the canvas origin is translated to the bottom-left
 * - the drawing is scaled to
 *   - flip the drawing direction
 *   - fit the barHeights into the canvas height.
 *
 * Wehn drawing a negative chart:
 *  - the canvas origin remains at top-right
 * - the drawing is scaled to
 *   - flip the drawing direction
 *   - fit the barHeights into the canvas height.
 *
 * Wehn drawing a dual chart:
 *  - the canvas origin is translated to the middle-left
 * - the drawing is scaled to
 *   - flip the drawing direction
 *   - fit the barHeights into half of the canvas height.
 *
 * Wehn drawing a tri chart:
 *  - the canvas origin is translated to the middle-left
 * - the drawing is scaled to
 *   - flip the drawing direction
 *   - fit the barHeights into half of the canvas height.
 *   - All bars are drawn with height = canvas.height / 2
 *   - zero heights are drawn half northward, and hald southward
 */
import { Bar } from './bar';

export class BarChart {

    // Attributes
    canvasEl: HTMLCanvasElement;    // the canvas element to draw the chart on
    chartType: string;              // Positive, negative, dual, tri
    barHeights: number[];           // the bar heights world coordinates
    minimumBarWidth: number;        // the minimum width for a bar
    barGap: number;                 // the width of the gap between two bars, likely to be always 1
    fillColorMinus: string;          // the color to fill up the negative bars
    fillColorZero: string;          // the color to fill up the zero bars
    fillColorPlus: string;         // the color to fill up the positive bars

    // Calculated
    ctx: CanvasRenderingContext2D;  // canvas context
    canvasWidth: number;            // the canvas width
    canvasHeight: number;           // the canvas height
    barWidth: number;               // the bars' width
    bars: Bar[];                    // bar bars to be drawn

    VALID_TYPES: string[] = ['positive', 'negative', 'dual', 'tri'];
    POSITIVE = 1;
    NEGATIVE = 1;
    DUAL = 1;
    TRI = 1;

    // from here: https://gist.github.com/olmokramer/82ccce673f86db7cda5e
    CSS_VALID_COLOR: any = /(#(?:[0-9a-f]{2}){2,4}|(#[0-9a-f]{3})|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/i;

    // Attributes setters and Getters
    setCanvasEl(value: HTMLCanvasElement) { this.canvasEl = value; }
    getCanvasEl(): HTMLCanvasElement { return this.canvasEl; }

    setChartType(value: string) { this.chartType = value; }
    getChartType(): string { return this.chartType; }

    setBarHeights(value: number[]) { this.barHeights = value.slice(0); }
    getBarHeights(): number[] { return this.barHeights.slice(0); }

    setMinimumBarWidth(value: number) { this.minimumBarWidth = value; }
    getMinimumBarWidth(): number { return this.minimumBarWidth; }

    setBarGap(value: number) { this.barGap = value; }
    getBarGap(): number { return this.barGap; }

    setFillColorMinus(value: string) { this.fillColorMinus = value; }
    getFillColorMinus(): string { return this.fillColorMinus; }

    setFillColorZero(value: string) { this.fillColorZero = value; }
    getFillColorZero(): string { return this.fillColorZero; }

    setFillColorPlus(value: string) { this.fillColorPlus = value; }
    getFillColorPlus(): string { return this.fillColorPlus; }

    // Parameters setters and getters
    setCtx(value: CanvasRenderingContext2D) { this.ctx = value; }
    getCtx(): CanvasRenderingContext2D { return this.ctx; }

    setCanvasWidth(value: number) { this.canvasWidth = value; }
    getCanvasWidth(): number { return this.canvasWidth; }

    setCanvasHeight(value: number) { this.canvasHeight = value; }
    getCanvasHeight(): number { return this.canvasHeight; }

    setBarWidth(value: number) { this.barWidth = value; }
    getBarWidth(): number { return this.barWidth; }

    setBars(value: Bar[]) { this.bars = value.slice(0); }
    getBars(): Bar[] { return this.bars; }

    constructor(canvasEl: HTMLCanvasElement,
                chartType: string,
                barHeights: number[],
                minimumBarWidth: number,
                barGap: number,
                fillColorMinus: string,
                fillColorZero: string,
                fillColorPlus: string) {

        // canvasEl must be provided
        if (canvasEl === null) { throw new Error('barchat: canvasEl is null'); }
        this.setCanvasEl(canvasEl);

        // chartType must be valid
        if (this.VALID_TYPES.findIndex(checkCartType) === -1) { throw new Error('barChart: Invalid chart type:  + chartType'); }
        function checkCartType(_chartType: string): boolean {
            return _chartType === chartType;
        }
        this.setChartType(chartType);

        if (barHeights.length === 0) { throw new Error('barchat: barHeights is empty'); }
        this.setBarHeights(barHeights.slice(0));

        // Minumum barWidth must be equal or higher than 3
        if (minimumBarWidth < 3) { throw new Error('barchat: minimumBarWidth less than 3: ' + minimumBarWidth); }
        this.setMinimumBarWidth(minimumBarWidth);

        // Bar gap must be equal or higher than 1
        if (barGap < 1) { throw new Error('barchat: barGap less than 1: ' + barGap); }
        this.setBarGap(barGap);

        // fillColorPlus must be a valid CSS color
        if (!this.CSS_VALID_COLOR.test(fillColorMinus)) { throw new Error('barChart: Invalid fillColorMinus: ' + fillColorMinus); }
        this.setFillColorMinus(fillColorMinus);

        // fillColorZero must be a valid CSS color
        if (!this.CSS_VALID_COLOR.test(fillColorZero)) { throw new Error('barChart: Invalid fillColorZero: ' + fillColorZero); }
        this.setFillColorZero(fillColorZero);

        // fillColorPlus must be a valid CSS color
        if (!this.CSS_VALID_COLOR.test(fillColorPlus)) { throw new Error('barChart: Invalid fillColorPlus: ' + fillColorPlus); }
        this.setFillColorPlus(fillColorPlus);
    }

    draw() {
        // Calculate parameters
        this.setCtx(this.getCanvasEl().getContext('2d'));
        this.setCanvasWidth(this.getCanvasEl().width);
        this.setCanvasHeight(this.getCanvasEl().height);

        // Insert the bars
        let _barHeights: number[] =
            this.calculateBarWidth(
                this.getCanvasWidth(),
                this.getBarHeights(),
                this.getMinimumBarWidth()).slice(0);

        // Save the bar width
        this.setBarWidth(this.computeBarWidth(this.getCanvasWidth(), _barHeights));

        // Insert the gaps
        _barHeights = this.insertGaps(
            this.getCanvasWidth(),
            _barHeights,
            this.getMinimumBarWidth(),
            this.getBarGap()).slice(0);

        // Set the bars to be drawn
        this.setBars(this.buildBars(
            this.getCanvasWidth(),
            _barHeights,
            this.getBarWidth(),
            this.getChartType(),
            this.getFillColorMinus(),
            this.getFillColorZero(),
            this.getFillColorPlus()).slice(0));

        // Transform the canvas
        this.transformCanvas(
            this.getCtx(),
            this.getChartType(),
            this.getCanvasHeight(),
            this.getBarHeights());

        // Draw the sparkline
        this._draw(this.getCtx(), this.getBars(), this.getCanvasHeight());
    }

    /**
     * The bar width, barWidth, is the ratio between the canvas width and the
     * number of bars to draw, rounded down. The barWidth calculation is an
     * interation seeking the number o bars to draw, barHeights.length, that yiels
     * a barWidth equal or higher than the minimum bar width, minimumBarWidth. If
     * the initial barWidth, Math.floor(canvas.width / heights.length), yields a
     * barWidth that is less than minimumBarWidth, we drop the leftmost barHeights
     * element and recalculate the barWidth using the new heights.length; we iterate
     * until the barWidth is greater or equal to minBarWidth.
     */
    calculateBarWidth(canvasWidth: number, barHeights: number[], minBarWidth: number): number[] {
        let barWidth = 0;
        let _barHeights = barHeights.slice(0);

        if (_barHeights.length > 0) {
            barWidth = this.computeBarWidth(canvasWidth, _barHeights);
            while (barWidth < minBarWidth) {
                _barHeights = _barHeights.slice(1);
                barWidth = this.computeBarWidth(canvasWidth, _barHeights);
            }
        }

        return _barHeights;
    }
    computeBarWidth(canvasWidth: number, barHeights: number[]) {
        return Math.floor(canvasWidth / barHeights.length);
    }

    /**
     * The bar gaps, barGap, inserted between the bars might cause rightmostbars to
     * be cropped out. The barGap insertion is an iteration seeking for a
     * barHeights.length enabling barGaps to be inserted without cropping any
     * rightmost bars. If the initial width required, widthRequired, to insert the
     * bars and their gaps,
     * barWidth*barHeights.length + barGap*(barHeights.length - 1), is greater than
     * the canvas.width, we drop the leftmost barHeights element and recalculate the
     * widthRequired using the new heights.length; we iterate until the widthRequired
     * is less or equal to canvas.width.
     */
    insertGaps(canvasWidth: number, barHeights: number[], barWidth: number, barGap: number): number[] {
        let _barHeights = barHeights.slice(0);
        if (_barHeights.length > 0) {
            let requiredWidth = this.computeRequiredWidth(barWidth, _barHeights, barGap);
            while (requiredWidth > canvasWidth) {
                _barHeights = _barHeights.slice(1);
                requiredWidth = this.computeRequiredWidth(barWidth, _barHeights, barGap);
            }
        }

        return _barHeights;
    }
    computeRequiredWidth(barWidth: number, barHeights: number[], barGap: number): number {
        return barWidth * barHeights.length + barGap * (barHeights.length - 1);
    }

    buildBars(
        canvasHeight: number,
        barHeights: number[],
        barWidth: number,
        chartType: string,
        fillColorMinus: string,
        fillColorZero: string,
        fillColorPlus: string): Bar[] {

        const bars: Bar[] = [];
        let fillColor: string;
        let xOrigin: number;
        let yOrigin: number;
        let height: number;

        for (const barHeight of barHeights) {
            switch (chartType) {
                case this.VALID_TYPES[this.POSITIVE]:
                    xOrigin = 0;
                    yOrigin = 0;
                    height = barHeight;
                    fillColor = fillColorPlus;
                    break;
                case this.VALID_TYPES[this.NEGATIVE]:
                    xOrigin = 0;
                    yOrigin = 0;
                    height = barHeight;
                    fillColor = fillColorMinus;
                    break;
                case this.VALID_TYPES[this.DUAL]:
                    xOrigin = 0;
                    yOrigin = 0;
                    height = barHeight;
                    fillColor = barHeight > 0 ? fillColorPlus : fillColorMinus;
                    break;
                case this.VALID_TYPES[this.TRI]:
                    xOrigin = 0;
                    yOrigin = -canvasHeight / 4;
                    height = barHeight === 0 ? canvasHeight : canvasHeight / 4;
                    fillColor = barHeight < 0 ? fillColorMinus : barHeight === 0 ? fillColorZero : fillColorPlus;
                    break;
                default:
                    break;
            }
            const bar: Bar = new Bar(xOrigin, yOrigin, barWidth, height, fillColor);
            bars.push(bar);
        }
        return bars;
    }

    //
    transformCanvas(
        ctx: CanvasRenderingContext2D,
        chartType: string,
        canvasHeight: number,
        barHeights: number[]) {

        let hScaling = 1;
        const hSkewing = 0;
        const vSkewing = 0;
        let vScaling = 1;
        let hMoving = 0;
        let vMoving = 0;
        switch (chartType) {
            case this.VALID_TYPES[this.POSITIVE]:
                hScaling = 1;
                vScaling = -1 * canvasHeight / Math.max(...barHeights);
                hMoving  = 0;
                vMoving  = canvasHeight;
                break;
            case this.VALID_TYPES[this.NEGATIVE]:
                hScaling = 1;
                vScaling = -1 * canvasHeight / Math.abs(Math.min(...barHeights));
                hMoving  = 0;
                vMoving  = 0;
                break;
            case this.VALID_TYPES[this.DUAL]:
                hScaling = 1;
                vScaling = -1 * canvasHeight / (Math.max(Math.abs(Math.min(...barHeights)), Math.max(...barHeights)) / 2);
                hMoving  = 0;
                vMoving  = canvasHeight / 2;
                break;
            case this.VALID_TYPES[this.TRI]:
                hScaling = 1;
                vScaling = -1;
                hMoving  = 0;
                vMoving  = canvasHeight / 2;
                break;
            default:
                break;
        }
        ctx.setTransform(hScaling, hSkewing, vSkewing, vScaling, hMoving, vMoving);
    }

    // Draw the bars!
    _draw(ctx: CanvasRenderingContext2D, bars: Bar[], barGap: number): void {
        for (const bar of bars) {
            // set the bar fill color
            ctx.fillStyle = bar.getFillColor();

            // draw the bar
            ctx.fillRect(bar.getX(), bar.getY(), bar.getWidth(), bar.getHeight());

            // Inser barGap by translating x-orign
            ctx.translate(barGap, 0);
        }
    }
}

