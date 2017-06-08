import d3 from "d3";
import moment from "moment";
import {getAvailableHorizontalSpace} from "../../../../components/FillInScreen";

const GRAPH_LEVELS = 10;

class TimeLine {
    constructor(classd, callback) {
        this.classd = classd;

        this.circles = function () {
        };
        this.rectangles = function () {
        };

        // === DATE HELPERS ===
        function getDate(d) {
            var date = moment(d);
            date.hour(1);
            date.minute(0);
            date.second(0);
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
                minDate = moment(Math.min.apply(null, dates));
                maxDate = moment(Math.max.apply(null, dates));
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

        // === LEVELS FOR COLLISIONS ===
        this.getLeveledData = function (data, levelCheckerFunc) {
            var leveledData = [];
            for (var d of data) {
                var level = 0;
                while (!levelCheckerFunc(level, leveledData, d)) {
                    if (level < GRAPH_LEVELS) {
                        ++level;
                    }
                    else {
                        level = parseInt(Math.random() * GRAPH_LEVELS);
                        break;
                    }
                }
                leveledData.push({level: level, data: d});
            }
            return leveledData;
        };

        // In intervals
        this.isLevelFreeIntervals = function (level, leveledData, record) {
            for (const d of leveledData) {
                // Level check
                if (level == d.level) {

                    // Intersect at the beginning of record interval
                    if (record.begin <= d.data.begin && record.end >= d.data.begin) return false;

                    // Intersect at the end of record interval
                    if (record.begin <= d.data.end && record.end >= d.data.end) return false;

                    // Value inside the record
                    if (record.begin <= d.data.begin && record.end >= d.data.end) return false;

                    // Record inside the value
                    if (record.begin >= d.data.begin && record.end <= d.data.end) return false;
                }
            }
            return true;
        };

        // In Instants
        this.isLevelFreeInstants = function (level, leveledData, record) {
            for (const d of leveledData) {
                // Level check
                if (level == d.level) {
                    if (Math.abs(record.date - d.data.date) < 10 * 1000) return false;
                }
            }
            return true;
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
                rx: 7,
                ry: 7
            };

            // Check element existence
            var element = document.getElementsByClassName(classd)[0];
            if (!element) return;

            // Axes
            var width = getAvailableHorizontalSpace(element) - 10;
            var height = 300 - margin.top - margin.bottom;

            var x = d3.time.scale().range([0 + margin.right, width - margin.left]),
                y = d3.time.scale().range([margin.top, height - margin.bottom - margin.top]);

            var xFormat = "%m/%d/%y",
                yFormat = "%H:%M";

            x.domain(d3.extent([padding.minDate, padding.maxDate]));
            y.domain(d3.extent([0, GRAPH_LEVELS]));

            var ticks = width > 800 ? 8 : 4;
            var xAxis = d3.svg.axis().scale(x).orient("bottom")
                .ticks(ticks)
                .tickSize(-height, 0)
                .tickFormat(d3.time.format(xFormat));

            var yAxis = d3.svg.axis().scale(y).orient("left")
                .ticks(0)
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
            this.circles = function (data) {
                var leveledData = this.getLeveledData(data, this.isLevelFreeInstants);

                var circles = context.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                circles.selectAll(".circ")
                    .data(leveledData)
                    .enter().append("circle")
                    .attr("class", "circ")
                    .attr("cx", function (d) {
                        return x(getDate(d.data.date));
                    })
                    .attr("cy", function (d, i) {
                        return y(getTime(d.data.date)) + (size.height * 1.5 * d.level);
                    })
                    .attr("r", size.radius)
                    .on("click", (d) => callback(d.data));
            };

            // intervals => rectangles
            this.rectangles = function (data) {

                var leveledData = this.getLeveledData(data, this.isLevelFreeIntervals);

                var rectangles = context.append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

                rectangles.selectAll(".rect")
                    .data(leveledData)
                    .enter().append("rect")
                    .attr("class", "rect")
                    .attr("x", function (d) {
                        return x(getDate(d.data.begin));
                    })
                    .attr("y", function (d, i) {
                        return y(getTime(d.data.begin)) + (size.height * 1.5 * d.level);
                    })
                    .attr("rx", size.rx)
                    .attr("ry", size.ry)
                    .attr("width", function (d) {
                        var e = x(getDate(d.data.end));
                        var b = x(getDate(d.data.begin));
                        return ( e - b );
                    })
                    .attr("height", size.height)
                    .on("click", (d) => callback(d.data));
            };

            drawFunc();
        }
    }

    instants(data) {
        var padding = this.timeRangePad(data.map(d => d.date));
        var drawFunc = () => this.circles(data);

        this.destroy();
        this.render(padding, drawFunc);
    }

    intervals(data) {
        var begins = data.map(d => d.begin);
        var ends = data.map(d => d.end);
        var padding = this.timeRangePad(begins.concat(ends));
        var drawFunc = () => this.rectangles(data);

        this.destroy();
        this.render(padding, drawFunc);
    }

    // SVG destroying
    destroy() {
        var elements = d3.selectAll("." + this.classd).selectAll("svg");
        if (elements != null && elements.length > 0) {
            elements.remove();
        }
    }
}
export default TimeLine;