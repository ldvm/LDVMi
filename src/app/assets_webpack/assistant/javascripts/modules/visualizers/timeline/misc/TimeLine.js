import d3 from 'd3'
import moment from 'moment'
import {getAvailableVerticalSpace} from "../../../../components/FillInScreen";

class TimeLine {
    constructor(classd, callback) {
        this.classd = classd;

        this.circles = function(){};
        this.rectangles = function(){};

        // === HELPERS ===
        function getDate(d) {
            var date = moment(d);
            date.hour(1);
            date.minute(0);
            date.second(0);
            return date.valueOf();
        }

        function getTime(d) {
            var date = moment(d);
            date.date(1);
            date.month(0);
            date.year(2012);
            return date.valueOf();
        }

        function getDatePadding(minDate, maxDate) {
            if (maxDate.diff(minDate, 'years') > 0)
                return 'months';
            else if (maxDate.diff(minDate, 'months') > 0)
                return 'days';
            else if (maxDate.diff(minDate, 'days') > 0)
                return 'days';
            else if (maxDate.diff(minDate, 'hours') > 0)
                return 'hours';
            else if (maxDate.diff(minDate, 'minutes') > 0)
                return 'minutes';
            else
                return 'seconds';
        }

        this.timeRangePad = function (dates) {
            var minDate, maxDate, pad;
            if (dates.length > 1) {
                minDate = moment(Math.min.apply(null,dates));
                maxDate = moment(Math.max.apply(null,dates));
                pad = getDatePadding(minDate, maxDate);
                minDate.subtract(1, pad);
                maxDate.add(1, pad);
            } else {
                minDate = moment(dates[0]).subtract(1, 'hour');
                maxDate = moment(dates[0]).add(1, 'hour');
            }
            return {
                'minDate': minDate,
                'maxDate': maxDate,
                'pad': pad
            };
        };

        // === RENDER ===
        this.render = function (padding, drawFunc) {
            // Constants
            var margin = {
                top: 10,
                right: 25,
                bottom: 15,
                left: 35
            };

            var size = {
                height: 18,
                radius: 9,
                rx:7,
                ry:7
            };

            // Check element existence
            var element = document.getElementsByClassName(classd)[0];
            if (!element) return;

            // Axes
            var width = getAvailableVerticalSpace(element);
            var height = 300 - margin.top - margin.bottom;

            var x = d3.time.scale().range([0 + margin.right, width - margin.left]),
                y = d3.time.scale().range([margin.top, height - margin.bottom - margin.top]);

            var xFormat = "%m/%d/%y",
                yFormat = "%H:%M",
                start = new Date(2012, 0, 1, 0, 0, 0, 0).getTime(),
                stop = new Date(2012, 0, 1, 23, 59, 59, 59).getTime();

            x.domain(d3.extent([padding.minDate, padding.maxDate]));
            y.domain(d3.extent([start, stop]));

            var ticks = width > 800 ? 8 : 4;
            var xAxis = d3.svg.axis().scale(x).orient("bottom")
                .ticks(ticks)
                .tickSize(-height, 0)
                .tickFormat(d3.time.format(xFormat));

            var yAxis = d3.svg.axis().scale(y).orient("left")
                .ticks(5)
                .tickSize(-width + margin.right, margin.left)
                .tickFormat(d3.time.format(yFormat));

            // SVG drawing
            var svg = d3.select("." + classd).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom);

            var context = svg.append("g")
                .attr("class", "context")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            context.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + "," + (margin.top + (height - margin.bottom)) + ")")
                .call(xAxis);

            context.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(yAxis);

            // instants => circles
            this.circles = function(data){
                var circles = context.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                circles.selectAll(".circ")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "circ")
                    .attr("cx", function (d) {
                        return x(getDate(d.date));
                    })
                    .attr("cy", function (d, i) {
                        return y(getTime(d.date));
                    })
                    .attr("r", size.radius)
                    .on("click", function (d) {
                        callback(d);
                    });
            };

            // intervals => rectangles
            this.rectangles = function(data){
                var rectangles = context.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                rectangles.selectAll(".rect")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "rect")
                    .attr("x", function (d) {
                        return x(getDate(d.begin));
                    })
                    .attr("y", function (d, i) {
                        return y(getTime(d.begin));
                    })
                    .attr("rx", size.rx)
                    .attr("ry", size.ry)
                    .attr("width", function(d){
                        var e = x(getDate(d.end));
                        var b = x(getDate(d.begin));
                        return ( e - b ) + 20; // TODO: No data, fixed intervals.
                    })
                    .attr("height", size.height)
                    .on("click", function (d) {
                        callback(d);
                    });
            };

            drawFunc();
        }
    }

    instants(data) {
        this.destroy();

        var padding = this.timeRangePad(data.map(d=>d.date));
        var drawFunc = () => this.circles(data);

        this.render(padding,drawFunc);
    }

    intervals(data) {
        this.destroy();

        var begins = data.map(d=>d.begin);
        var ends = data.map(d=>d.end);
        var padding = this.timeRangePad(begins.concat(ends));
        var drawFunc = () => this.rectangles(data);

        this.render(padding,drawFunc);
    }

    // SVG destroying
    destroy(){
        debugger;
        var elements = d3.selectAll("svg");
        if (elements != null && elements.length > 0){
            elements.remove();
        }
    }
}
export default TimeLine;