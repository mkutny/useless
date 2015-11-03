/*  Animation tools
 */

InertialValue = $component ({

    $defaults: { duration:  0.2,
                 easing:   'linear' },

    animating: $observableProperty (false),
    target:    $observableProperty (/* scalar or vector */),
    current:   $observableProperty (),

    init: function (cfg) {

        this.easing  = (_.isNumber (this.target) ? Easing.scalar : Easing.vector)[this.easing]

        this.targetChange (function (value) {

            if (this.animating === false) {
                this.start     = this.value
                this.current   = this.target = value
                this.startTime = Date.now ()
                this.step () }

            else {
                this.start      = this.current
                this.startTime  = this.lastTime     } })  },

    step: function () {

        var now    = Date.now ()
        var travel = Math.min (1.0, ((this.lastTime = now) - this.startTime) / (this.duration * 1000.0))
        if (travel < 1.0) {

             var animated  = this.easing (this.start, this.target, travel)
            this.animating = true
            this.current   = animated

            window.requestAnimationFrame (this.step) }

        else {
            this.current   = this.target
            this.animating = false          } } })


/*  Easing functions (1D an 2D)
 */

var Easing = {

    scalar: {

        linear: function (a, b, t) {
            return a + (b - a) * t },

        in: function (a, b, t) {
            return a + (b - a) * Math.pow (t, 2) },

        out: function (a, b, t) {
            return b - (b - a) * Math.pow (1.0 - t, 2) },

        inOut: function (a, b, t) {
            var c = b - a
            if (t < 0.5) {
                return a + (c * (Math.pow (t * 2.0, 2) * 0.5)) }
            else {
                return b - (c * (Math.pow (2.0 - (t * 2.0), 2) * 0.5)) } } },

    vector: {

        linear: function (a, b, t) {
            console.log (t)
            return a.add (b.sub (a).scale (t)) },

        inOut: function (a, b, t) { var c = b.sub (a)
            if (t < 0.5) {
                return a.add (c.scale (Math.pow (t * 2.0, 2) * 0.5)) }
            else {
                return b.sub (c.scale (Math.pow (2.0 - (t * 2.0), 2) * 0.5)) } },

        in: function (a, b, t) {
            return a.add (b.sub (a).scale (Math.pow (t, 2))) },

        out: function (a, b, t) {
            return b.sub (b.sub (a).scale (Math.pow (1.0 - t, 2))) } } }