// Copyright 2018 Rodrigo Silveira
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this software and associated documentation files (the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
// the Software, and to permit persons to whom the Software is furnished to do so,
// subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
// FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
// COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
// IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
// CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

import { html, render, TemplateResult } from 'lit-html';
import {BarChart} from './bar-chart';
import { CssColorString } from '../../util-lib/src/valid-colors';

export class RmsSparklineBarChart extends HTMLElement {
    public barHeights: number[] = [];
    VALID_CHART_TYPES: string[] = ['positive', 'negative', 'dual', 'tri'];
    private cssColorString: CssColorString = null;
    
    
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.cssColorString = new CssColorString();
    }
    
    static get observedAttributes(): string[] {
        return ['chartType', 'barHeights', 'minimumBarWidth', 'barGap', 'fillColorPlus', 'fillColorZero', 'fillColorMinus', 'className', 'width', 'height'];
    }
    
    connectedCallback() {
    this.upgradeProperties();
        this.render();
    }
    
    disconnectedCallback() {
    }
    
    attributeChangedCallback(_name: string, _oldValue: any, _newValue: any) {
    this.render();
    }
    
    private upgradeProperties() {
        // Support lazy properties https://developers.google.com/web/fundamentals/web-components/best-practices#lazy-properties
        (<any>this).constructor['observedAttributes'].forEach((prop: string) => {
            if (this.hasOwnProperty(prop)) {
                const value = (<any>this)[prop];
                delete (<any>this)[prop];
                (<any>this)[prop] = value;
            }
        });
    }
    
    get chartType(): string {
        return this.getAttribute('chartType');
    }
    
    set chartType(value: string) {
        if (value) {
            this.setAttribute('chartType', value);
        } else {
            this.removeAttribute('chartType');
        }
    }
    
    get className(): string {
        return this.getAttribute('className');
    }
    
    set className(value: string) {
        if (value) {
            this.setAttribute('className', value);
        } else {
            this.removeAttribute('className');
        }
    }
    
    get minimumBarWidth(): number {
        if (this.hasAttribute('minimumBarWidth')) {
            return Number(this.getAttribute('minimumBarWidth'));
        } else {
            return 0;
        }
    }
    
    set minimumBarWidth(value: number) {
        if (value) {
            this.setAttribute('minimumBarWidth', String(value));
        } else {
            this.removeAttribute('minimumBarWidth');
        }
    }
    
    get barGap(): number {
        if (this.hasAttribute('barGap')) {
            return Number(this.getAttribute('barGap'));
        } else {
            return 0;
        }
    }
    
    set barGap(value: number) {
        if (value) {
            this.setAttribute('barGap', String(value));
        } else {
            this.removeAttribute('barGap');
        }
    }
    
    get fillColorMinus(): string {
        return this.getAttribute('fillColorMinus');
    }
    
    set fillColorMinus(value: string) {
        if (value) {
            this.setAttribute('fillColorMinus', value);
        } else {
            this.removeAttribute('fillColorMinus');
        }
    }
    
    get fillColorZero(): string {
        return this.getAttribute('fillColorZero');
    }
    
    set fillColorZero(value: string) {
        if (value) {
            this.setAttribute('fillColorZero', value);
        } else {
            this.removeAttribute('fillColorZero');
        }
    }
    
    get fillColorPlus(): string {
        return this.getAttribute('fillColorPlus');
    }
    
    set fillColorPlus(value: string) {
        if (value) {
            this.setAttribute('fillColorPlus', value);
        } else {
            this.removeAttribute('fillColorPlus');
        }
    }

    get width(): number {
        if (this.hasAttribute('width')) {
            return Number(this.getAttribute('width'));
        } else {
            return 0;
        }
    }
    set width(value: number) {
        if (value) {
            this.setAttribute('width', String(value));
        } else {
            this.removeAttribute('width');
        }
    }
    
    get height(): number {
        if (this.hasAttribute('height')) {
            return Number(this.getAttribute('height'));
        } else {
            return 0;
        }
    }

    set height(value: number) {
        if (value) {
            this.setAttribute('height', String(value));
        } else {
            this.removeAttribute('height');
        }
    }
    private get styles(): TemplateResult {
        return html`
            <style>
            </style>
        `;
    }
    
    private get template(): TemplateResult {
     
        const canvasEl = document.createElement('canvas');
        canvasEl.width = this.width;
        canvasEl.height = this.height;
        canvasEl.style.display = 'inline-block';
        canvasEl.style.verticalAlign = 'top';
        if (this.className && this.className !== ``) { canvasEl.classList.add(this.className); }
    
        const barChart = new BarChart(canvasEl, this.chartType, this.barHeights, this.minimumBarWidth, this.barGap, this.fillColorMinus, this.fillColorZero, this.fillColorPlus);
        barChart.draw();
        
        return html`
            ${this.styles}
            ${canvasEl}
        `;
    }
    
    render() {
        // ensure attribute coherence
        //
        const __this = this;
        if (this.VALID_CHART_TYPES.findIndex(checkChartType) === -1) { return; }
        function checkChartType(_charttype: string): boolean {
            return _charttype === __this.chartType;
        }
        if (!this.barHeights) { return; }
        if (this.barHeights.length === 0) { return; }
        if (this.minimumBarWidth < 3) {return; }
        if (this.barGap < 1) { return; }
        if (!this.cssColorString.isValid(this.fillColorMinus)) { return; }
        if (!this.cssColorString.isValid(this.fillColorZero)) { return; }
        if (!this.cssColorString.isValid(this.fillColorPlus)) { return; }
        if (this.width === 0) { return; }
        if (this.height === 0) { return; }
        
        // Little debugging
        //
        // console.log('::render - chartType: ' + this.chartType);
        // console.log('::render - barHeights: ' + JSON.stringify(this.barHeights));
        // console.log('::render - minimumBarWidth: ' + this.minimumBarWidth);
        // console.log('::render - barGap: ' + this.barGap);
        // console.log('::render - fillColorMinus: ' + this.fillColorMinus);
        // console.log('::render - fillColorZero: ' + this.fillColorZero);
        // console.log('::render - fillColorPlus: ' + this.fillColorPlus);
        // console.log('::render - width: ' + this.width);
        // console.log('::render - height: ' + this.height);
        
        render(this.template, this.shadowRoot);
    }
}
window.customElements.define('rms-sparkline-bar-chart', RmsSparklineBarChart);
