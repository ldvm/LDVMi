import d3 from 'd3'
import moment from 'moment'
import {getAvailableVerticalSpace} from "../../../../components/FillInScreen";

class TimeLine {
    constructor(spaced, callback) {
        var classd = spaced.replace(new RegExp(" "), ".");

        // Time helpers
        function lessThanDay(d) {
            return (d === "hours" || d === "minutes" || d === "seconds") ? true : false;
        }

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

// ---------------------------------------------------------------------------------------------
// ------------------------------------- Rendering ---------------------------------------------
// ---------------------------------------------------------------------------------------------

        this.render = function (padding, drawFunc) {
            var margin = {
                top: 10,
                right: 25,
                bottom: 15,
                left: 35
            };

            var width = getAvailableVerticalSpace(document.getElementsByClassName(spaced)[0]);
            var height = (lessThanDay(padding.pad)) ? (100 - margin.top - margin.bottom) : (300 - margin.top - margin.bottom);

            var x = d3.time.scale().range([0 + margin.right, width - margin.left]),
                y = d3.time.scale()
                    .range([margin.top, height - margin.bottom - margin.top]);

            var ticks = width > 800 ? 8 : 4;

            x.domain(d3.extent([padding.minDate, padding.maxDate]));

            var xFormat, yFormat;
            if (lessThanDay(padding.pad)) {
                xFormat = "%H:%M";
                yFormat = "%m/%d/%y";
                y.domain(d3.extent([padding.minDate]));
            } else {
                xFormat = "%m/%d/%y";
                yFormat = "%H:%M";
                var start = new Date(2012, 0, 1, 0, 0, 0, 0).getTime();
                var stop = new Date(2012, 0, 1, 23, 59, 59, 59).getTime();
                y.domain(d3.extent([start, stop]));
            }

            var xAxis = d3.svg.axis().scale(x).orient("bottom")
                .ticks(ticks)
                .tickSize(-height, 0)
                .tickFormat(d3.time.format(xFormat));

            var yAxis = d3.svg.axis().scale(y).orient("left")
                .ticks(5)
                .tickSize(-width + margin.right, margin.left)
                .tickFormat(d3.time.format(yFormat));

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

            drawFunc();

            this.circles = function(data, extract){
                var circles = context.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                circles.selectAll(".circ")
                    .data(data)
                    .enter().append("circle")
                    .attr("class", "circ")
                    .attr("cx", function (d) {
                        var value = extract(d);
                        return (lessThanDay(padding.pad)) ? x(value) : x(getDate(value));
                    })
                    .attr("cy", function (d, i) {
                        var value = extract(d);
                        return (lessThanDay(padding.pad)) ? y(getDate(value)) : y(getTime(value));
                    })
                    .attr("r", 9)
                    .on("click", function (d) {
                        callback(d);
                    });
            };

            //TODO: Check values...
            this.rectangles = function(data, start,end){
                var rectangles = context.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

                rectangles.selectAll(".rect")
                    .data(data)
                    .enter().append("rect")
                    .attr("class", "rect")
                    .attr("x", function (d) {
                        var value = start(d);
                        return (lessThanDay(padding.pad)) ? x(value) : x(getDate(value));
                    })
                    .attr("y", function (d, i) {
                        var value = start(d);
                        return (lessThanDay(padding.pad)) ? y(getDate(value)) : y(getTime(value));
                    })
                    .attr("width", function(d){
                        var value = end(d) - start(d);
                        return (lessThanDay(padding.pad)) ? x(value) : x(getDate(value));
                    })
                    .attr("height", function(d){
                        var value = end(d) - start(d);
                        return (lessThanDay(padding.pad)) ? y(getDate(value) + 18) : y(getTime(value));
                    })
                    .on("click", function (d) {
                        callback(d);
                    });
            }

            this.destroy = function() {
                d3.select("." + classd).removeAll();
            }
        }
    }

    instants(data) {
        var padding = this.timeRangePad(data.map(d=>d.date));
        var drawFunc = this.circles(data,d=>d.date);
        this.render(padding,drawFunc);
    }

    intervals(data) {
        var dates = data.map(d=>d.start).append(data.map(d=>d.end));
        var padding = this.timeRangePad(dates)

        var drawFunc = this.rectangles(data, d=>d.start, d=>d.end);
        this.render(padding,drawFunc);
    }
}
export default TimeLine;