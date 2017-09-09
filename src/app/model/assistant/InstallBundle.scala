package model.assistant

object InstallBundle {
  val ldvmComponents = List(
    "Union Analyzer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/analyzers/ldvm-a-union.ttl",
    "SPARQL Analyzer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/analyzers/ldvm-a-sparql.ttl",
    "Extractor of Towns from RUIAN" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/analyzers/ldvm-a-ruian-obce.ttl",
    "RUIAN Towns geocoder" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/analyzers/ldvm-a-ruian-geocoder.ttl",
    "Institutions of Public Power Analyzer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/analyzers/ldvm-a-ovm.ttl",
    "Cz Government Contracts Chord Analyzer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/analyzers/ldvm-a-gov-cz-smlouvy.ttl",
    "D3.js Chord Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-chord.ttl",
    "Concept Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-concepts.ttl",
    "DataCube visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-dc.ttl",
    "Google Maps Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-gmaps.ttl",
    "OpenLayers Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-openlayers.ttl",
    "SPARQL endpoint data source" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/datasources/ldvm-ds-sparql.ttl",
    "RÚIAN" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/datasources/ldvm-ds-ruian.ttl",
    "linked.opendata.cz" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/datasources/ldvm-ds-ldcz.ttl",
    "internal.opendata.cz" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/datasources/ldvm-ds-int-od-cz.ttl",
    "Time Line Instants Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-timeline-instants.ttl",
    "Time Line Things with Instants Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-timeline-things-instants.ttl",
    "Time Line Things with Things with Instants Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-timeline-things-things-instants.ttl",
    "Time Line Intervals Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-timeline-intervals.ttl",
    "Time Line Things with Intervals Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-timeline-things-intervals.ttl",
    "Time Line Things with Things with Intervals Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-timeline-things-things-intervals.ttl",
    "Google Maps Coordinates Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-googlemaps-coordinates.ttl",
    "Google Maps Places Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-googlemaps-places.ttl",
    "Google Maps Quantified Places Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-googlemaps-quantified-places.ttl",
    "Google Maps Quantified Things Visualizer" -> "https://raw.githubusercontent.com/ldvm/vocabulary/master/rdf/examples/visualizers/ldvm-v-googlemaps-quantified-things.ttl"
  )

  val dataSources = List(
    "Integrated prevention and pollution limitation" -> "https://raw.githubusercontent.com/ldvm/appgen-datasets/master/ippc/ippc.ttl",
    "Airline Routes" -> "https://github.com/ldvm/appgen-datasets/raw/master/airline_routes/airline_routes.ttl",
    "Asylum Seekers 2015" -> "https://github.com/ldvm/appgen-datasets/raw/master/refugees/refugees_2015.ttl",
    "Registry of contracts of the Czech Republic - Contracts" -> "https://github.com/ldvm/appgen-datasets/raw/master/registry_of_contracts/registry_of_contracts.ttl"
  )

  val visualizers = List (
    ("D3.js Chord Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/chord/ChordVisualizerTemplate", "chord", "donut_large"),
    ("Google Maps Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate", "googleMaps", "map"),
    ("Time Line Instants Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/timeline-instants/TimeLineVisualizerTemplate", "timeline-instants", "timeline"),
    ("Time Line Things with Instants Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/timeline-things-instants/TimeLineVisualizerTemplate", "timeline-things-instants", "timeline"),
    ("Time Line Things with Things with Instants Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/timeline-things-things-instants/TimeLineVisualizerTemplate", "timeline-things-things-instants", "timeline"),
    ("Time Line Intervals Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/timeline-intervals/TimeLineVisualizerTemplate", "timeline-intervals", "timeline"),
    ("Time Line Things with Intervals Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/timeline-things-intervals/TimeLineVisualizerTemplate", "timeline-things-intervals", "timeline"),
    ("Time Line Things with Things with Intervals Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/timeline-things-things-intervals/TimeLineVisualizerTemplate", "timeline-things-things-intervals", "timeline"),
    ("Google Maps Coordinates Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/googlemaps-coordinates/GoogleMapsVisualizerTemplate","googleMaps-coordinates", "map"),
    ("Google Maps Places Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/googlemaps-places/GoogleMapsVisualizerTemplate", "googleMaps-places", "map"),
    ("Google Maps Quantified Places Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/googlemaps-quantified-places/GoogleMapsVisualizerTemplate", "googleMaps-quantified-places", "map"),
    ("Google Maps Quantified Things Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/googlemaps-quantified-things/GoogleMapsVisualizerTemplate", "googleMaps-quantified-things", "map")
  )
}
