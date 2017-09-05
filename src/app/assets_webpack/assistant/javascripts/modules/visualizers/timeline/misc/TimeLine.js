import d3 from 'd3'
import moment from 'moment'
import { getAvailableHorizontalSpace } from '../../../../components/FillInScreen'

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

    // === RENDERING ===
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
      var width = getAvailableHorizontalSpace(element) - 50;
      var height = 350 - margin.top - margin.bottom;

      var x = d3.time.scale().range([0 + margin.right, width - margin.left]),
        y = d3.time.scale().range([margin.top, height - margin.bottom - margin.top]);

      var xFormat = '%m/%d/%y',
        yFormat = '%H:%M';

      x.domain(d3.extent([padding.minDate, padding.maxDate]));
      y.domain(d3.extent([0, GRAPH_LEVELS]));

      var ticks = width > 800 ? 8 : 4;
      var xAxis = d3.svg.axis().scale(x).orient('bottom')
        .ticks(ticks)
        .tickSize(-height, 0)
        .tickFormat(d3.time.format(xFormat));

      var yAxis = d3.svg.axis().scale(y).orient('left')
        .ticks(0)
        .tickSize(-width + margin.right, margin.left)
        .tickFormat(d3.time.format(yFormat));

      // Zooming
      var zoom = d3.behavior.zoom()
        .x(x)
        .scaleExtent([1, 10])
        .on('zoom', function () {
          // Get translation
          var e = d3.event;
          var tx = Math.min(0, Math.max(e.translate[0], width - width * e.scale));

          // Set zooming
          zoom.translate([tx, 1]);

          // Delete all visualized items
          svg.selectAll('.time.records').remove();
          svg.selectAll('.x.axis').remove();

          // Re-visualize axis
          svg.selectAll('.context')
            .append('g')
            .attr('class', 'x axis')
            .attr('transform', 'translate(' + margin.left + ',' + (margin.top + (height - margin.bottom)) + ')')
            .call(xAxis);

          // Redraw records
          drawFunc();
        });

      // SVG drawing
      var svg = d3.select('.' + classd).append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .call(zoom);

      var context = svg.append('g')
        .attr('class', 'context')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

      // X-Axis
      context.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(' + margin.left + ',' + (margin.top + (height - margin.bottom)) + ')')
        .call(xAxis);

      // Y-Axis
      context.append('g')
        .attr('class', 'y axis')
        .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
        .call(yAxis);

      // Circles for instants
      this.circles = function (data) {
        var circles = d3.select('.context').append('g')
          .attr('class', 'time records')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        circles.selectAll('.circ')
          .data(data)
          .enter().append('circle')
          .attr('class', 'circ')
          .attr('cx', function (d) {
            return x(getDate(d.date));
          })
          .attr('cy', function (d, i) {
            return y(d.level);
          })
          .attr('r', size.radius)
          .attr('stroke', function (d) {
            return d.stroke;
          })
          .attr('fill', function (d) {
            return d.fill;
          })
          .on('click', callback);
      };

      // Rectangles for intervals
      this.rectangles = function (data) {
        var rectangles = context.append('g')
          .attr('class', 'time records')
          .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

        rectangles.selectAll('.rect')
          .data(data)
          .enter().append('rect')
          .attr('class', 'rect')
          .attr('x', function (d) {
            return x(getDate(d.begin));
          })
          .attr('y', function (d, i) {
            return y(d.level);
          })
          .attr('rx', size.rx)
          .attr('ry', size.ry)
          .attr('width', function (d) {
            var e = x(getDate(d.end));
            var b = x(getDate(d.begin));
            return ( e - b );
          })
          .attr('height', size.height)
          .attr('stroke', function (d) {
            return d.stroke;
          })
          .attr('fill', function (d) {
            return d.fill;
          })
          .on('click', callback);
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
    var elements = d3.selectAll('.' + this.classd).selectAll('svg');
    if (elements != null && elements.length > 0) {
      elements.remove();
    }
  }
}
export default TimeLine;