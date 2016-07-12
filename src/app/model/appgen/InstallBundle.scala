package model.appgen

object InstallBundle {
  val ldvmComponents = List(
    "Union Analyzer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/analyzers/ldvm-a-union.ttl",
    "SPARQL Analyzer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/analyzers/ldvm-a-sparql.ttl",
    "Extractor of Towns from RUIAN" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/analyzers/ldvm-a-ruian-obce.ttl",
    "RUIAN Towns geocoder" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/analyzers/ldvm-a-ruian-geocoder.ttl",
    "Institutions of Public Power Analyzer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/analyzers/ldvm-a-ovm.ttl",
    "Cz Government Contracts Chord Analyzer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/analyzers/ldvm-a-gov-cz-smlouvy.ttl",
    "D3.js Chord Visualizer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/visualizers/ldvm-v-chord.ttl",
    "Concept Visualizer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/visualizers/ldvm-v-concepts.ttl",
    "DataCube visualizer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/visualizers/ldvm-v-dc.ttl",
    "Google Maps Visualizer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/visualizers/ldvm-v-gmaps.ttl",
    "OpenLayers Visualizer" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/visualizers/ldvm-v-openlayers.ttl",
    "SPARQL endpoint data source" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/datasources/ldvm-ds-sparql.ttl",
    "RÚIAN" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/datasources/ldvm-ds-ruian.ttl",
    "linked.opendata.cz" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/datasources/ldvm-ds-ldcz.ttl",
    "internal.opendata.cz" -> "https://raw.githubusercontent.com/tobice/vocabulary/master/rdf/examples/datasources/ldvm-ds-int-od-cz.ttl"
  )

  val dataSources = List(
    "Integrated prevention and pollution limitation" -> "https://raw.githubusercontent.com/tobice/appgen-datasets/master/ippc/ippc.ttl",
    "Airline Routes" -> "https://github.com/tobice/appgen-datasets/raw/master/airline_routes/airline_routes.ttl",
    "Asylum Seekers 2015" -> "https://github.com/tobice/appgen-datasets/raw/master/refugees/refugees_2015.ttl"
  )

  val visualizers = List (
    ("D3.js Chord Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/chord/ChordVisualizerTemplate", "chord", "donut_large"),
    ("Google Maps Visualizer", "http://linked.opendata.cz/resource/ldvm/visualizer/gmaps/GoogleMapsVisualizerTemplate", "googleMaps", "map")
  )
}
