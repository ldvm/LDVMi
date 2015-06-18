[![Build Status](https://travis-ci.org/ldvm/LDVMi.svg?branch=master)](https://travis-ci.org/ldvm/LDVMi)

LDVMi
==========

This project is developed as a replacement for visualization parts in Payola project. Its goal is to provide better reliability, scalability and resolve some issues which cannot be easily resolved Payola due to its architecture.

Based on LDVM principles, it enables a user to visualize data in their dataset while it automatically offers list of suitable visualizers.

Live DEMO could be found at http://ldvm.opendata.cz

Right now, it provides those visualization techniques:
- DataCube
- OpenLayers WKT multipolygon
- Treemap
- GoogleMaps

Implemented analyzers:
- RUIAN geocoder
- SPARQL Query
- UNION
- RUIAN Geocoder [CZ]

It also provides a simple JSON API in order to allow creating datasources and visualizations automatically by 3rd party software.

## Running the app
- download Typesafe Activator at https://www.typesafe.com/get-started
- clone the project
- in the `src` folder execute `activator run` (you need to have activator in your PATH)
- if you don't have any SPARQL endpoint running at `http://localhost:8890/sparql`, you may need to change the configuration in order to have everything running smoothly (e.g. pipeline execution, creating a datasource from TTL, ...)

## Authors & License

© Copyright 2014 - 2015

### Project lead

- [Jirka Helmich](https://github.com/jirihelmich)
- [Jakub Klímek](https://github.com/jakubklimek)
- [Martin Nečaský](http://www.ksi.mff.cuni.cz/~necasky)
