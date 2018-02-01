class Spinner {

    constructor(el) {
        this.element = el;
        this.rotation = 0;
        this.panelCount = 0;
        this.totalPanelCount = this.element.children.length;
        this.theta = 0;
        this.isHorizontal = false;
        this.transformProp = 'transform';
    }

    modify() {
        let panel, angle, i;
        this.panelSize = this.element[this.isHorizontal ? 'offsetWidth' : 'offsetHeight'];
        this.rotateFn = this.isHorizontal ? 'rotateY' : 'rotateX';
        this.theta = 360 / this.panelCount;
        this.radius = Math.round((this.panelSize / 2) / Math.tan(Math.PI / this.panelCount));

        for (i = 0; i < this.panelCount; i++) {
            panel = this.element.children[i];
            angle = this.theta * i;
            panel.style.opacity = 1;
            panel.style.backgroundColor = 'hsla(' + angle + ', 100%, 100%, .85)';
            panel.style[this.transformProp] = this.rotateFn + '(' + angle + 'deg) translateZ(' + this.radius + 'px)';
        }

        for (; i < this.totalPanelCount; i++) {
            panel = this.element.children[i];
            panel.style.opacity = 0;
            panel.style[this.transformProp] = 'none';
        }
        this.rotation = Math.round(this.rotation / this.theta) * this.theta;
        this.transform();
    }

    transform() {
        this.element.style[this.transformProp] = 'translateZ(-' + this.radius + 'px) ' + this.rotateFn + '(' + this.rotation + 'deg)';
    }
}

export {Spinner as default}