# Refugees 2015 data set

This is a sample data set for the D3.js chord visualizer. The data comes from 
[UNHCR website](http://popstats.unhcr.org/en/asylum_seekers_monthly). Unfortunately, they don't
provide direct links to filtered CSV files, so the [exported file](./refugees_2015.csv) 
is (temporarily) stored in this repo.

There is also attached the [ETL pipeline](./etl_pipeline.jsonld) that should download the CSV file
and convert it into RDF which can be then used as source for the visualization.

Also note that the original CSV file had couple more lines in the beginning containing some meta
information. Unfortunately, the pipeline has not been able to properly skip those lines so they
had to be manually removed.
