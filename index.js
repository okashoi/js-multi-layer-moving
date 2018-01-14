var Circle = function (circleRadius, circleRadiusAmplitude, offsetX, offsetY, rotationRadius, phase, mouseSensitivity) {
    this.radius = {
        base: circleRadius,
        amplitude: circleRadiusAmplitude
    };
    this.offset = {
        x: offsetX,
        y: offsetY
    };
    this.rotation = {
        radius: rotationRadius,
        phase: phase,
        x: Math.cos(phase),
        y: Math.sin(phase)
    };
    this.followingMouse = {
        sensitivity: mouseSensitivity,
        x: 0,
        y: 0
    };
    this._element = document.createElement('div');
    this._element.classList.add('centered');
    this._element.style.width = (2 * circleRadius) + 'px';
    this._element.style.height = (2 * circleRadius) + 'px';
    this._element.style.borderRadius = circleRadius + 'px';
};

Circle.prototype.addClassToElement = function (className) {
    this._element.classList.add(className);
};

Circle.prototype.getElement = function () {
    return this._element;
};

Circle.prototype.addEventListener = function (event, callback) {
    this._element.addEventListener(event, callback);
};

Circle.prototype.updatePosition = function () {
    this._element.style.transform = 'translate(' +
        (this.rotation.x + this.followingMouse.x + this.offset.x) + 'px, ' +
        (this.rotation.y + this.followingMouse.y + this.offset.y) + 'px)';
};

Circle.prototype.rotate = function () {
    var theta = (2 * Math.PI * t / T) + this.rotation.phase;
    this.rotation.x = this.rotation.radius * Math.cos(theta);
    this.rotation.y = this.rotation.radius * Math.sin(theta);
    this.updatePosition();
    // TODO: move to separated function
    var radius = this.radius.base + this.radius.amplitude * Math.cos(theta);
    this._element.style.width = (2 * radius) + 'px';
    this._element.style.height = (2 * radius) + 'px';
    this._element.style.borderRadius = radius + 'px';
    this._element.style.filter = 'brightness(' + (radius / this.radius.base * 100) + '%)';
};

Circle.prototype.followMouse = function (mouseX, mouseY) {
    var rect = this._element.getBoundingClientRect();
    this.followingMouse.x = (mouseX - rect.x - this.radius.base) * this.followingMouse.sensitivity;
    this.followingMouse.y = (mouseY - rect.y - this.radius.base) * this.followingMouse.sensitivity;
    this.updatePosition();
};

var CircleRepository = function () {
    this.circles = [];
};

CircleRepository.prototype.push = function (circle) {
    this.circles.push(circle);
};

CircleRepository.prototype.rotate = function () {
    this.circles.map(function (circle) {
        circle.rotate();
    });
};

CircleRepository.prototype.followMouse = function (mouseX, mouseY) {
    this.circles.map(function (circle) {
        circle.followMouse(mouseX, mouseY);
    });
};

var t = 0;
var T = 200;
var interval = 30;
var circles = new CircleRepository();

var circleProperties = [
    // first layer
    {
        circleRadius: 100,
        circleRadiusAmplitude: 0,
        offsetX: 0,
        offsetY: 0,
        rotationRadius: 0,
        phase: 0,
        mouseSensitivity: 0,
        classes: ['darken'],
        eventListeners: []
    },
    {
        circleRadius: 100,
        circleRadiusAmplitude: 0,
        offsetX: -210,
        offsetY: 0,
        rotationRadius: 0,
        phase: 0,
        mouseSensitivity: 0,
        classes: ['darken'],
        eventListeners: []
    },
    {
        circleRadius: 100,
        circleRadiusAmplitude: 0,
        offsetX: 210,
        offsetY: 0,
        rotationRadius: 0,
        phase: 0,
        mouseSensitivity: 0,
        classes: ['darken'],
        eventListeners: []
    },
    // second layer
    {
        circleRadius: 30,
        circleRadiusAmplitude: 0,
        offsetX: -80,
        offsetY: 60,
        rotationRadius: 5,
        phase: 2 / 3 * Math.PI,
        mouseSensitivity: 1 / 180,
        classes: ['regular'],
        eventListeners: []
    },
    {
        circleRadius: 30,
        circleRadiusAmplitude: 0,
        offsetX: -160,
        offsetY: -80,
        rotationRadius: 5,
        phase: 4 / 3 * Math.PI,
        mouseSensitivity: 1 / 180,
        classes: ['regular'],
        eventListeners: []
    },
    {
        circleRadius: 30,
        circleRadiusAmplitude: 0,
        offsetX: 120,
        offsetY: -90,
        rotationRadius: 5,
        phase: 0,
        mouseSensitivity: 1 / 180,
        classes: ['regular'],
        eventListeners: []
    },
    // third layer
    {
        circleRadius: 50,
        circleRadiusAmplitude: 3,
        offsetX: 90,
        offsetY: 100,
        rotationRadius: 8,
        phase: 1 / 6 * Math.PI,
        mouseSensitivity: 1 / 30,
        classes: ['lighten'],
        eventListeners: [
            {event: 'click', callback: function () {alert('clicked');}}
        ]
    },
    {
        circleRadius: 50,
        circleRadiusAmplitude: 3,
        offsetX: -360,
        offsetY: -80,
        rotationRadius: 8,
        phase: 1 / 2 * Math.PI,
        mouseSensitivity: 1 / 30,
        classes: ['lighten'],
        eventListeners: [
            {event: 'click', callback: function () {alert('clicked');}}
        ]
    },
    {
        circleRadius: 50,
        circleRadiusAmplitude: 3,
        offsetX: 380,
        offsetY: -100,
        rotationRadius: 8,
        phase: 5 / 6 * Math.PI,
        mouseSensitivity: 1 / 30,
        classes: ['lighten'],
        eventListeners: [
            {event: 'click', callback: function () {alert('clicked');}}
        ]
    }
];

var nextStep = function () {
    t = (t + 1) % T;
    circles.rotate();
};

window.addEventListener('DOMContentLoaded', function (event) {
    var drawArea = document.getElementsByClassName('draw-area')[0];

    circleProperties.map(function (property) {
        var circle = new Circle(
            property.circleRadius,
            property.circleRadiusAmplitude,
            property.offsetX,
            property.offsetY,
            property.rotationRadius,
            property.phase,
            property.mouseSensitivity
        );
        property.classes.map(function (className) {
            circle.addClassToElement(className);
        });
        property.eventListeners.map(function (listener) {
            circle.addEventListener(listener.event, listener.callback);
        });

        drawArea.appendChild(circle.getElement());
        circles.push(circle);
    });
    setInterval(nextStep, interval);
});

document.addEventListener('mousemove', function (event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    circles.followMouse(mouseX, mouseY);
});
