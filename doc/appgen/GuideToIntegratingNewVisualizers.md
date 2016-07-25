Framework usage: A guide to integrating new visualizers
=======================================================

Now that the reader is equipped with all the necessary knowledge, we will walk him through the process of creating a brand new *visualizer* to demonstrate the abilities of our framework. The *visualizer* will be visualizing a graph (as understood in the graph theory) represented with the RGML vocabulary (which makes it very similar to the D3.js Chord Visualizer that will be properly described later, including the vocabulary). The purpose of this section is merely to get the reader familiar with the basic integration steps. The presented *visualizer* will simply display number of vertices and edges of the graph and let the user configure the graph label.

Before we start, we would like to make one remark. We will walk the user through the whole process and along the way we will touch parts of the software that were not designed and developed by us but by the authors of LinkedPipes Visualization . We do not want to take credit for those parts. Specifically, those are the parts shared with LinkedPipes Visualization, which means everything related to the LDVM implementation and low-level work with RDF data.

## Guide overview

Let us start with a list of steps to give the reader an overview of what is ahead of us. The first five steps are mandatory in a way that they are necessary to get the *visualizer* up and running. When the first five steps are done, it is possible to generate new applications with this new *visualizer* (this among other things means that the *discovery* is able to utilize the new *visualizer* while looking for pipelines). The other four steps add some actual functionality to the *visualizer*. This functionality includes extracting some RDF data from the *pipeline output*, loading them to the frontend and showing them to the user.

1.  [LDVM *component*](#ldvm-component)

2.  [Frontend *visualizer* module](#frontend-module)

3.  [*Configurator* user interface](#configurator-user-interface)

4.  [*Application* user interface](#application-user-interface)

5.  [Linking LDVM *component* to the *plugin*](#linking-ldvm-component-to-the-plugin)

6.  [Scala backend](#scala-backend)

7.  [Extracting RDF data from the pipeline evaluation](#extracting-rdf-data-from-the-pipeline-evaluation)

8.  [Making asynchronous requests from the client](#making-asynchronous-requests-from-the-client)

9.  [Saving and loading application configuration](#saving-and-loading-application-configuration)

The guide will be concluded with some [final notes](#final-notes) on the process.

## LDVM component

We start be defining the LDVM *visualizer component* using the `ldvm` vocabulary . As the whole definition would be pretty long, we will walk through it statement by statement and provide necessary explanations. Let us start with couple of prefixes for vocabularies that we are going to use.

```js
@prefix rdfs:  <http://www.w3.org/2000/01/rdf-schema#> .
@prefix dcterms: <http://purl.org/dc/terms/> .
@prefix ldvm: <http://linked.opendata.cz/ontology/ldvm/> .
```

Now let us add prefixes identifying the new *visualizer*. The `v` stands for “visualizer”, the `r` stands for “resource” and `graph` is the short name that we will be using for our *visualizer*.

```js
@prefix v-graph: <http://linked.opendata.cz/ontology/ldvm/visualizer/graph/> .
@prefix v-graph-r: <http://linked.opendata.cz/resource/ldvm/visualizer/graph/> .
```

What follows now is the definition of the main RDF resource representing our *visualizer* that binds everything together.

```js
v-graph-r:GraphVisualizerTemplate a ldvm:VisualizerTemplate ;
    rdfs:label "Graph Visualizer"@en;
    rdfs:comment "Visualizes graph data"@en;
    ldvm:componentConfigurationTemplate v-graph-r:Configuration ;
    ldvm:inputTemplate v-graph-r:Input ;
    ldvm:feature v-graph-r:GraphFeature ;
    .
```

Do not be confused by the word `Template`. In LDVM, even the *pipelines* themselves are represented in RDF. Each *pipeline* consists of *component instances* that are instantiated from *component templates* just like this one.

As you can see, this *component* has a *configuration*, one *input* and one *feature*. There is nothing important now about the *configuration* and also the *input* is pretty straightforward, so we will just drop here the definitions. To avoid any confusion: as we explained, each *visualizer* will allow the user to configure the application before it gets published. This *configuration* could be represented in RDF. The `ldvm` vocabulary clearly supports it. But we prefer a simpler and more straightforward approach which will be explained later in this guide.

```js
v-graph:GraphVisualizerConfiguration a rdfs:Class ;
    rdfs:label "Graph Visualizer Configuration"@en;
    rdfs:subClassOf ldvm:ComponentConfiguration ;
    .
      
v-graph-r:Configuration a v-graph:GraphVisualizerConfiguration ;
    dcterms:title "Default Configuration" ;
    .

v-graph-r:Input a ldvm:InputDataPortTemplate ;
    dcterms:title "Graph data described using RGML vocabulary" ;
    .
```

Let us now define the `GraphFeature`.

```js
v-graph-r:GraphFeature a ldvm:MandatoryFeature ;
    dcterms:title "The actual graph data, i. e. nodes and edges" ;
    ldvm:descriptor v-graph-r:GraphDescriptor ;
    .
```

As you can see, this *feature* is *mandatory* which means that the input data must meet the requirements defined by the *feature descriptor*. So let us have a look at it.

```
v-graph-r:GraphDescriptor a ldvm:Descriptor ;
    dcterms:title "Graph presence check" ;
    ldvm:query """
        PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
        PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>

        ASK {
            ?graph rdf:type rgml:Graph ;
                rgml:directed ?directed .

            ?edge rdf:type rgml:Edge ;
                rgml:source ?source ;
                rgml:target ?target ;
                rgml:weight ?weight .

            ?source rdf:type rgml:Node .
            ?target rdf:type rgml:Node .
        }
    """ ;
    ldvm:appliesTo v-graph-r:Input ;
    .
```

The SPARQL query contained in the *descriptor* is looking for a graph instance and at least one edge between two vertices. This requirement is applied on the input that we have defined before. If we put this all together we get that *the *mandatory feature* requires the data flowing through the only *component input* to contain a non-empty graph*. So we have just specified how the RDF data coming to our *visualizer* should look like.

What we have to do now is put all these lines together into a single \*.ttl file (we have been using the Turtle syntax ) and upload it to the *application generator*. Unfortunately, the user interface for this task is not yet available inside the *application generator* and we need to use LinkedPipes Visualization interface for it. So go to the homepage, open the left side menu, click **Components** and then the green **Add** button. Use the form to upload the definition.

Once this is done, the *discovery* algorithm is able to utilize this new *visualizer component* when discovering pipelines. If you now ran the *discovery* inside LinkedPipes Visualization on a data set containing some graph data, it should find a *pipeline* ending with this *visualizer component*. Now we need to implement the corresponding *visualizer plugin* for our *application generator*.

## Frontend module

As the first thing, we need to choose a unique short name for our *visualizer*. When creating the RDF definition, we used the name `graph` as a RDF prefix. We will stick to this name.

A *visualizer* has its own module in the `javascripts/modules/visualizers` folder. So we start by creating the appropriate module folder called `graph` and putting the file `prefix.js` into it.

```js
import createPrefixer from '../../../misc/createPrefixer'

export const MODULE_PREFIX = 'graph';
export default createPrefixer(MODULE_PREFIX);
```

As explained before, we will use the module name as a prefix for all our Redux *actions* (or rather the prefix and the module name will be used as the *visualizer* name). In this case, the prefix will also become part of the *configurator* URL. Note that this is the actual and the only one *source of truth* for the *visualizer* name. The `MODULE_PREFIX` value will be used when registering the plugin to the *application generator*.

From now on, all paths will be relative to the *visualizer* module (located at `javascripts/modules/visualizers/graph`).

## Configurator user interface

The *configurator* interfaces are part of the main *platform* bundle. That means that while configuring his applications, the user never leaves the *platform* SPA and the transitions between screens are always very smooth as complete page reloads are not necessary.

The integration is implemented through the router. The *configurator* interface of every *visualizer* defines its own routes that are registered to the *platform* routes. Let us start with the main `Configurator` component defined in `pages/Configurator.js`.

```js
import React, { Component, PropTypes } from 'react'

class Configurator extends Component {
  render() {
    return (
      <p>This is the graph visualizer configurator.</p>
    )
  }
}
export default Configurator;
```

Now we create the routes file (`configuratorRoutes.js`) with the following content:

```js
import React from 'react'
import { Route } from 'react-router'
import Configurator from './pages/Configurator'
import { MODULE_PREFIX } from './prefix'

export default function createRoutes(dispatch) {
  return (
    <Route component={Configurator} path={MODULE_PREFIX} />
  );
}
```

Note that we used the `MODULE_PREFIX` as the route path.

In the final step, we register our routes. That is done in `../routes.js` (one level higher, in the parent `visualizers` module). First we have to import the routes in the file header.

```js
import graphRoutes from './graph/configuratorRoutes'
```

Then we need to find the right place in the file and add our routes there. The spot is clearly marked with `***Here*** you register all visualizer configurator routes` and contains a list of currently registered *configurator* routes. We just need to add another line for our `graph` visualizer.

```js
// ***Here*** you register all visualizer configurator routes

routeFactory.register(dataCubeRoutes);
routeFactory.register(googleMapsRoutes);
routeFactory.register(chordRoutes);
routeFactory.register(graphRoutes); // We added this line
```

That is it. The last remaining step is to link the LDVM *visualizer component* to this module but we will do that later. An actual URL pointing to this *configurator* could look like this: `/appgen/app/8/graph`. The number `8` is the application ID that is being configured (e.g. if the user selects this application for configuration, he is redirected to this URL). In case the *visualizer* name in the URL does not correspond to the selected application (for example when the user forces a different value to the URL), the user is automatically redirected to the correct *configurator*.

Before moving to the next step, we will slightly improve the `Configurator` component.

```js
import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application } from '../../../app/models'
import { Visualizer } from '../../../core/models'

class Configurator extends Component {
  static propTypes = {
    application: PropTypes.instanceOf(Application).isRequired,
    visualizer: PropTypes.instanceOf(Visualizer).isRequired
  };

  render() {
    const { application, visualizer } = this.props;
    return (
      <BodyPadding>
        <p>This is the graph visualizer configurator.</p>
        <p>{application.name}</p>
        <p>{visualizer.title}</p>
      </BodyPadding>
    )
  }
}

export default Configurator;
```

The objects representing the selected application and visualizer are for your convenience automatically injected using `props` to the `Configurator` component (but they are available from the *state* at any time). Here we just use them to print their names. We also used the `BodyPadding` component to add the standard padding around the text.

## Application user interface

As explained, the *application* interface of each *visualizer* lives in a standalone JavaScript bundle. The *application* interface that we are about to implement will support embedding. It will run in two different modes. There will be the default *standalone* mode which besides the visualization itself will also display the application name and description. It will be accessible on the default root `/` URL. Then there will be the *embed* mode containing just the visualization. It will be accessible on the `/embed` URL.

We will start similarly to the *configuration* interface by defining the main `Application` component in `components/Application.js`. Note that it is no longer in the `pages` folder.

```js
import React, { Component, PropTypes } from 'react'
import BodyPadding from '../../../../components/BodyPadding'
import { Application as ApplicationModel } from '../../../app/models'
import { Visualizer } from '../../../core/models'

class Application extends Component {
  static propTypes = {
    application: PropTypes.instanceOf(ApplicationModel).isRequired,
    visualizer: PropTypes.instanceOf(Visualizer).isRequired,
    embed: PropTypes.bool
  };

  render() {
    const { application, visualizer, embed } = this.props;
    return (
      <BodyPadding>
        <p>This is the graph visualizer application.</p>
        <p>It runs in {embed ? 'embed' : 'standalone'} mode</p>
        <p>{application.name}</p>
        <p>{visualizer.title}</p>
      </BodyPadding>
    )
  }
}

export default Application;
```

The content is at this moment almost identical to the `Configurator` component. It just displays the current application name and visualizer title. But this time it also shows whether it runs in the *standalone* or *embed* mode.

Now for each mode we will need a different component as each mode lives at a different URL. Let us start with `pages/Embed.js`.

```js
import React from 'react'
import Application from '../components/Application'

export default props => <Application embed {...props} />
```

And now `pages/Standalone.js`.

```js
import React, { PropTypes } from 'react'
import Application from '../components/Application'
import ApplicationHeader from '../../../app/components/ApplicationHeader'

const Standalone = props => (
  <div>
    <ApplicationHeader {...props} />
    <Application {...props} />
  </div>
);

export default Standalone;
```

Note that both times, we re-use the `Application` component but in the *standalone* mode we add a standard header that renders the application name and description. What remains is to tie it all together with routes definition. We put it to `applicationRoutes.js` just next to `configuratorRoutes.js`.

```js
import React from 'react'
import { Route, IndexRoute } from 'react-router'
import ApplicationLoader from '../../app/pages/ApplicationLoader'
import NotFound from '../../platform/pages/NotFound'
import Standalone from './pages/Standalone'
import Embed from './pages/Embed'

export default function createRoutes(dispatch) {
  return (
    <Route component={ApplicationLoader} path='/'>
      <IndexRoute component={Standalone} />
      <Route component={Embed} path='embed' />
      <Route component={NotFound} path='*' />
    </Route>
  );
}
```

Note that the top level path is directly `/`. This routes definition will not be registered to any existing route hierarchy. It contains the complete routing information for this standalone SPA. For this reason, we use the `ApplicationLoader` as the top level component to load the application from the server first. This has been done automatically for us in the case of *configurator* interface.

In the final step, we need to add a new Webpack *entry point*. We create a file `javascripts/entries/graph.js` (this time relative to the `assets` folder) with the following content.

```js
import createRoutes from '../modules/visualizers/graph/applicationRoutes'
import initEntry from '../misc/initEntry'

initEntry(createRoutes);
```

We have to make sure to import the correct routes definition and also that the file name corresponds to the *visualizer* name. Webpack will pick up this new *entry point* automatically (if you are running Webpack in the watch mode, you need to restart it) and generate a new JavaScript bundle of the same name.

## Linking LDVM component to the plugin

In this step, we will link the LDVM *visualizer component* and the *visualizer* plugin together. That is done through the *application generator* user interface (not LinkedPipes Visualization interface this time).

We need to sign in to the *application generator* with an administrator account. We navigate to the **Dashboard**, select **Visualizers** and click the button **Add visualizer**. A dialog window will appear, containing a list of unused available LDVM *visualizer components*. We select **Graph Visualizer** (which is the name we provided in the RDF definition) and click **Add visualizer**. The new *visualizer* should appear in the table. We click its name to open a configuration dialog window. We ignore the first two fields as they are related to LinkedPipes Visualization. The most important field is the name as it determines which bundle to load for the *application* interface and to which *configurator* URL to redirect. We fill in `graph`. It is crucial that this value corresponds to the *visualizer* module name, the prefix and the *entry point* name. We also recommend filling in the *visualizer* icon for better user experience. Currently, Material Icons [6] collection is used. We chose the `device_hub` icon.

This was the last mandatory step. At this moment, the *visualizer* (even though it does not do anything) should be working, i.e., it should be possible to create a new application using this *visualizer* from a data set containing graph data.

## Scala backend

Surprisingly enough, we did not have to touch the Scala backend to register our new *visualizer*. Technically speaking, it is really not necessary but only until the very moment when we need the *visualizer* to actually *do something useful*. That typically involves fetching and extracting the RDF data produced by the *pipeline*. For that we do need the backend.

In this subsection, we will simply prepare the controller that will be handling our client requests.

```js
package controllers.appgen.api.visualizers
import scaldi.Injector

class GraphVisualizerApiController(implicit inj: Injector) extends VisualizerApiController { }
```

The package information clearly says where this class should belong. The `VisualizerApiController` will provide us with some utilities that will come handy later.

## Extracting RDF data from the pipeline evaluation

We said that our *visualizer* would show the number of vertices and edges in the graph. For us that means that we need to access the RDF data produced by the *pipeline*, extract this information from it, send it to the client and then display it on the screen. We start with accessing the RDF data. Note that in this part, we are utilizing the LinkedPipes Visualization API for working with RDF data.

Since it is RDF data, we will use SPARQL queries to fetch the information we need.

```
package model.rdf.sparql.rgml.query
import model.rdf.sparql.query.SparqlQuery

class GraphQuery extends SparqlQuery {

  def get: String =
    """
      | PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
      | PREFIX rgml: <http://purl.org/puninj/2001/05/rgml-schema#>
      |
      | SELECT ?directed ?nodeCount ?edgeCount WHERE {
      |   ?graph
      |     rdf:type rgml:Graph ;
      |     rgml:directed ?directed .
      |
      |   { SELECT (COUNT(*) AS ?nodeCount) WHERE { ?edge rdf:type rgml:Node . } }
      |   { SELECT (COUNT(*) AS ?edgeCount) WHERE { ?edge rdf:type rgml:Edge . } }
      | }
      | LIMIT 1
    """
      .stripMargin
}
```

This is the recommended way of representing SPARQL queries in our Scala code. As you can see, the query counts all the edges and vertices (which are called *nodes* in the RGML vocabulary) and also fetches the information about whether the graph is directed or not.

The result of this query will be represented using a simple Scala case class. For simplicity, we just call it `Graph`.

```js
package model.rdf.sparql.rgml

case class Graph(directed: Boolean, nodeCount: Int, edgeCount: Int)
```

Now we need a tool that will convert the fetched RDF data into this case class. Such a tool is called an *extractor*.

```js
package model.rdf.sparql.rgml.extractor

import model.rdf.extractor.QueryExecutionResultExtractor
import model.rdf.sparql.rgml.Graph
import model.rdf.sparql.rgml.query.GraphQuery
import org.apache.jena.query.QueryExecution


class GraphExtractor extends QueryExecutionResultExtractor[GraphQuery, Graph] {

  def extract(input: QueryExecution): Option[Graph] = {

    try {
      val resultSet = input.execSelect
      val solution = if (resultSet.hasNext) Some(resultSet.next) else None

      solution map { solution => Graph(
        solution.getLiteral("directed").getBoolean,
        solution.getLiteral("nodeCount").getInt,
        solution.getLiteral("edgeCount").getInt)
      }
    } catch {
      case e: org.apache.jena.sparql.engine.http.QueryExceptionHTTP => {
        None
      }
    }
  }
}
```

Apache Jena [7] framework is used internally to work with RDF data. Our SPARQL query is a SELECT query which means that the results will be in a form of tabular data (i.e., a set of rows where each row contains the same columns). We assume that the data set contains only one graph, so we take the first row (if available) and convert it to the `Graph` case class.

Finally, we need something that will execute the query and apply the extractor on the results.

```js
package model.rdf.sparql.rgml
//  ...imports

class RgmlService(implicit val inj: Injector) extends RgmlService with Injectable {
  var sparqlEndpointService = inject[SparqlEndpointService]

  def graph(evaluation: PipelineEvaluation)(implicit session: Session): Option[Graph] = {
    sparqlEndpointService.getResult(
      evaluationToSparqlEndpoint(evaluation),
      new GraphQuery(),
      new GraphExtractor())
  }
```

As you can see, we defined `RgmlService` with the `graph` method. The *pipeline evaluation* does not directly contain the data but rather points where the data are (i.e., it specifies the SPARQL endpoint and concrete named graphs with the data). We use `SparqlEndpointService` to access it and extract our graph from it. The function `evaluationToSparqlEndpoint` is just an utility that we omitted to keep the code short. You might have noticed that we put all the files in the same package `model.rdf.sparql.rgml`. What we are doing is that we are adding support for RGML vocabulary to the LinkedPipes Visualization code base in a way that anyone can use it for their *visualizers*, i.e., it is *visualizer* independent.

For the `RgmlService` to work properly, it has to be registered to the Dependency Injection container in `model.rdf.RdfModule`.

Let us now move from the *Model* layer to the *Controller* layer. We will extend the controller we defined earlier with an action that will use this service to fetch the graph information and send it to the client serialized to JSON.

```js
class GraphVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
  val rgmlService = inject[RgmlService]

  def getGraph(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
    withEvaluation(ApplicationId(id)) { evaluation =>
      val graph = rgmlService.graph(evaluation)
      Future(Ok(SuccessResponse(data = Seq("graph" -> graph))))
    }
  }
}
```

The `getGraph` action is mapped to a URL with a single parameter `id` (the URL mappings are defined in the file `src/conf/routes`, relative to the code base root). The `id` is an application ID. We use the `withEvaluation()` helper to load the appropriate *pipeline evaluation*, then we fetch the graph using our `RgmlService` and send it to the client in a `SuccessReponse`. The API is designed to support `Futures` in case the requests are expected to be computationally heavy and need to be performed asynchronously. This is not our case but we need to follow the API. That is why the response is wrapped by the `Future` call.

In order for the `Graph` case class to be automatically converted to JSON, we need to define an *implicit converter*. We can do it by adding following lines to `controllers.api.JsonImplicits` and import it to the controller:

```js
implicit val graphWrites = Json.writes[Graph]
```

## Making asynchronous requests from the client

Everything is prepared on the server-side. Now comes the client. When the application loads, we will make an synchronous HTTP request to fetch the graph information. Once we receive it, we store it in the *state* and show it on the screen.

We start by creating a JavaScript counterpart for the Scala `Graph` case class. Note that once again, all paths are relative to the *visualizer* module. Also to keep the text shorter, we will just state the file name at the beginning of each snippet.

```js
// models.js

import { Record } from 'immutable';

export const Graph = Record({
  directed: false,
  nodeCount: 0,
  edgeCount: 0
});
```

We create a simple explicit wrapper for the asynchronous HTTP request.

```js
// api.js

import rest from '../../../misc/rest'

export async function getGraph(applicationId) {
  const result = await rest('graphVisualizer/getGraph/' + applicationId, {});
  return result.data.graph;
}
```

The keywords `async/await` are just syntactical sugar around `Promises`. They allow us to write *asynchronous* code in a *synchronous* manner.

Now we will define a new *duck* that will handle and provide API for fetching the graph information (using an *action*), storing it in the *state* (using a *reducer*) and selecting it from the *state* (using a *selector*). Let us start with *actions* (we will always put the currently required `imports` to the top of each code snippet; in the actual file they will all be together at the beginning).

```js
// ducks/graph.js

import createAction from '../../../../misc/createAction'
import withApplicationId from '../../../app/misc/withApplicationId'
import prefix from '../prefix'
import * as api from '../api'

// Actions

export const GET_GRAPH = prefix('GET_GRAPH');
export const GET_GRAPH_START = GET_GRAPH + '_START';
export const GET_GRAPH_ERROR = GET_GRAPH + '_ERROR';
export const GET_GRAPH_SUCCESS = GET_GRAPH + '_SUCCESS';
export const GET_GRAPH_RESET = GET_GRAPH + '_RESET';

export function getGraph() {
  return withApplicationId(id => {
    const promise = api.getGraph(id);
    return createAction(GET_GRAPH, { promise });
  })
}

export function getGraphReset() {
  return createAction(GET_GRAPH_RESET);
}
```

The *action creator* `getGraph()` first uses the `withApplicationId` utility to extract the application ID from the *state* and then calls the API function to make the HTTP request to the server. The request result is represented using a `Promise` which is *dispatched* as an action payload. There is a *redux middleware* running in the background that detects the `Promise`, dispatches `GET_GRAPH_START` and then depending on the result either `GET_GRAPH_ERROR` or `GET_GRAPH_SUCCESS`. We do not actually have to define all the *action* constants but it is good practice (note that we used the module prefixer). The `START`, `ERROR`, `SUCCESS` and `RESET` suffixes are defined by a convention.

In the next step, we will implement the reducer that will store the graph.

```js
// ducks/graph.js

import { GET_APPLICATION_START } from '../../../app/ducks/application'
import { Graph } from '../models'

// Reducer

const initialState = new Graph();

export default function graphReducer(state = initialState, action) {
  switch (action.type) {
    case GET_APPLICATION_START:
    case GET_GRAPH_RESET:
      return initialState;

    case GET_GRAPH_SUCCESS:
      return new Graph(action.payload);
  }

  return state;
};
```

Note that the initial state is a valid (but empty) `Graph` object. That means that we can work with this object safely at any time (it will not be `null`).

Finally, we will create *selectors* that will allow us to easily extract the `Graph` from the state.

```js
// ducks/graph.js

import { createSelector } from 'reselect'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import moduleSelector from '../selector'

// Selectors

export const graphStatusSelector = createPromiseStatusSelector(GET_GRAPH);
export const graphSelector = createSelector([moduleSelector], state => state.graph);
```

The first one selects the HTTP request status, the second one selects the actual graph. Now we need to integrate both the *selectors* and the *reducer* to the *state* hierarchy.

```js
// reducer.js

import { combineReducers } from 'redux';
import graph from './ducks/graph'

const rootReducer = combineReducers({
  graph
});

export default rootReducer;
```

This is the root *reducer* of the *visualizer* module that combines all other reducers in the module together. It has to be registered to the parent reducer in the parent module.

```js
import { combineReducers } from 'redux';
import googleMaps from './googleMaps/reducer'
import chord from './chord/reducer'
import graph from './graph/reducer'

const rootReducer = combineReducers({
  googleMaps,
  chord,
  graph // We added this line
});
export default rootReducer;
```

We have to do the same for the *selectors* as well.

```js
// selector.js

import { createSelector } from 'reselect'
import parentSelector from '../selector'
import { MODULE_PREFIX } from './prefix'

export const moduleSelector = createSelector(
  [parentSelector],
  parentState => parentState[MODULE_PREFIX]
);
export default moduleSelector;
```

You might have noticed that we already used this file in `ducks/graph.js`. What is important here is that the key we use to register the *reducer* is the same as the key we use in the *selector*. They both access the same data in the same *state* object (*reducer* for updating, *selector* for reading).

Now that everything is ready, we create a simple component that will fetch and display the graph information. We start with the component life cycle methods.

```js
// components/GraphLoader.js

import React, { Component, PropTypes } from 'react'
import { getGraph, getGraphReset } from '../ducks/graph'

class GraphLoader extends Component {
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getGraph());
  }
      
  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getGraphReset());
  }
}
```

Once the component appears on the screen, it will initiate the request. When it is about to leave, it will reset the *state* (clean up after itself). We will *connect* the component to Redux and inject the data that we need.

```js
// components/GraphLoader.js

import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { getGraph, getGraphReset, graphSelector, graphStatusSelector } from '../ducks/graph'

const selector = createStructuredSelector({
  graph: graphSelector,
  status: graphStatusSelector
});

export default connect(selector)(GraphLoader);
```

It is always a good practice to explicitly define the `propTypes`.

```js
// components/GraphLoader.js

import { PromiseStatus } from '../../../core/models'
import { Graph } from '../models'

class GraphLoader extends Component {
  static propTypes = {
    dispatch: PropTypes.func.isRequired,
    graph: PropTypes.instanceOf(Graph).isRequired,
    status: PropTypes.instanceOf(PromiseStatus).isRequired
  };
      
  // ...
}
```

Lastly, we implement the `render` method.

```js
// components/GraphLoader.js

import PromiseResult from '../../../core/components/PromiseResult'

class GraphLoader extends Component {
  // ...
      
  render() {
    const { graph, status } = this.props;

    if (!status.done) {
      return <PromiseResult status={status} loadingMessage="Loading base graph info..." />
    }

    return (
      <div>
        <p><strong>Graph info</strong></p>
        <p>Node count: {graph.nodeCount}</p>
        <p>Edge count: {graph.edgeCount}</p>
        <p>Directed: {graph.directed ? 'yes' : 'no'}</p>
      </div>
    )
  }
```

The `status.done` value changes to `true` only if the request successfully finishes (i.e., the *action* `GET_GRAPH_SUCCESS` is *dispatched*). Therefore once the value is `true` we can be sure that the graph information is correctly stored in the *state*. Before this happens, we display the `PromiseResult` component which shows a nice loading bar and if the request fails, it displays an error message.

What remains to be done is to add the `GraphLoader` component to the *configurator* and *application* user interface.

```js
// pages/Configurator.js

import GraphLoader from '../containers/GraphLoader'

class Configurator extends Component {
  // ...

  render() {
    const { application, visualizer } = this.props;
    return (
      <BodyPadding>
        <p>This is the graph visualizer configurator.</p>
        <p>{application.name}</p>
        <p>{visualizer.title}</p>
        <GraphLoader />
      </BodyPadding>
    )
  }
}

// components/Application.js

import GraphLoader from '../containers/GraphLoader'

class Application extends Component {
  // ...

  render() {
    const { application, visualizer, embed } = this.props;
    return (
      <BodyPadding>
        <p>This is the graph visualizer application.</p>
        <p>It runs in {embed ? 'embed' : 'standalone'} mode</p>
        <p>{application.name}</p>
        <p>{visualizer.title}</p>
        <GraphLoader />
      </BodyPadding>
    )
  }
}
```

## Saving and loading application configuration

The framework provides an optional solution for saving and loading the application configuration easily. The idea is very simple yet powerful. The configuration consists of different bits and pieces of the *state*. To save the configuration, we just serialize those bits and pieces into JSON and save it on the server. To load the configuration, we fetch it from the server, unserialize it from JSON and let the *reducers* to update the *state*. What is important is that this approach is very flexible. We can arbitrarily add and remove those bits and pieces to the configuration without updating the backend implementation which therefore can be universal for all *visualizers*.

The configuration contains parts that are *visualizer* specific and parts that are common for all *visualizers* and we have to make sure that they both are saved and loaded properly together.

We starting by creating a `dirty` *duck* with a *reducer* that will simply indicate with a boolean value whether the configuration has changed.

```js
// ducks/dirty.js

import { createSelector } from 'reselect'
import moduleSelector from '../selector'
import { createDirtyReducer } from '../../../app/ducks/dirty'

// Reducer

const actions = [ ];

export default createDirtyReducer(actions);

// Selectors

export const dirtySelector = createSelector([moduleSelector], state => state.dirty);
```

The `actions` constant contains the list of *actions* that change the state. Whenever such an *action* is dispatched, the *dirty* status changes to `true`. The *reducer* has to be properly registered in the module root *reducer*.

The next *duck* will define the *actions* for saving and loading the configuration. They will be created using framework factories that will ensure proper integration.

```js
import prefix from '../prefix'
import moduleSelector from '../selector'
import { createPromiseStatusSelector } from '../../../core/ducks/promises'
import { 
  createGetConfiguration, createGetConfigurationReset, createSaveConfiguration 
} from '../../../app/ducks/configuration'

// Actions

export const SAVE_CONFIGURATION = prefix('SAVE_CONFIGURATION');
export const SAVE_CONFIGURATION_START = SAVE_CONFIGURATION + '_START';
export const SAVE_CONFIGURATION_ERROR = SAVE_CONFIGURATION + '_ERROR';
export const SAVE_CONFIGURATION_SUCCESS = SAVE_CONFIGURATION + '_SUCCESS';

export const GET_CONFIGURATION = prefix('GET_CONFIGURATION');
export const GET_CONFIGURATION_START = GET_CONFIGURATION + '_START';
export const GET_CONFIGURATION_ERROR = GET_CONFIGURATION + '_ERROR';
export const GET_CONFIGURATION_SUCCESS = GET_CONFIGURATION + '_SUCCESS';
export const GET_CONFIGURATION_RESET = GET_CONFIGURATION + '_RESET';

// Selectors

export const saveConfigurationStatusSelector = createPromiseStatusSelector(SAVE_CONFIGURATION);
export const getConfigurationStatusSelector = createPromiseStatusSelector(GET_CONFIGURATION);

export const configurationSelector = createSelector(
  [moduleSelector],
  state => ({  })
);

// Actual actions created using factories
export const saveConfiguration = 
  createSaveConfiguration(SAVE_CONFIGURATION, configurationSelector);
export const getConfiguration = 
  createGetConfiguration(GET_CONFIGURATION);
export const getConfigurationReset = 
  createGetConfigurationReset(GET_CONFIGURATION_RESET);
```

The `configurationSelector` defines what parts of the *state* should get into the configuration. At this moment, the *state* just contains the graph information which is available from the *pipeline evaluation*. There is no point in making that part of the configuration. When the configuration is loaded from the server, the *action* `GET_CONFIGURATION_SUCCESS` is *dispatched* with the configuration in the payload. The *reducers* can simply listen to this action and extract from the payload the information that is relevant to them. As the *action* is prefixed, it will not cause any conflicts.

The next step of integration is the **Save** button. Once again we use a framework factory to create the button component. The button is interactive which means it automatically indicates whether the configuration needs to be saved (using the `dirty` information) or whether the saving is in progress. We will add the button to the `Configurator` component.

```js
import React, { PropTypes } from 'react'
import { saveConfiguration, saveConfigurationStatusSelector } from '../ducks/configuration'
import { dirtySelector } from '../ducks/dirty'

import createSaveButton from '../../../app/containers/createSaveButton'

export default createSaveButton(
  saveConfiguration,
  saveConfigurationStatusSelector,
  dirtySelector);
```

In the final step, we need to load the configuration when the *configurator* (or *application*) initiates.

```js
// pages/Configurator.js

import { getConfiguration, getConfigurationReset } from '../ducks/configuration'

class Configurator extends Component {
  // ...

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(getConfiguration());
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch(getConfigurationReset());
  }
      
  // ...
}
```

Similarly, we would load the configuration in the `Application` component.

As a concrete example, we will let the user to edit graph label. To keep this subsection short, we will utilize one of the available framework utilities, custom label editor. This editor allows the user to specify alternative labels for RDF resources. Each RDF resource is identified with a URI. Unfortunately, we do not have the graph URI but for simplicity, we will just make up one.

```js
// pages/Configurator.js

import EditableLabel from '../../../app/containers/EditableLabel'
import SaveButton from '../containers/SaveButton'

class Configurator extends Component {
  // ...

  render() {
    const { application, visualizer } = this.props;
    return (
      <BodyPadding>
        <h3><EditableLabel uri="http://example.org/graph" label="Unnamed graph" /></h3>
        <p>This is the graph visualizer configurator.</p>
        <p>{application.name}</p>
        <p>{visualizer.title}</p>
        <GraphLoader />
        <SaveButton />
      </BodyPadding>
    )
  }
}
```

That is it. If we now click the **More** button in the upper right corner of the *configurator* interface and then select **Edit labels**, a pencil icon will appear next to the graph name (which will be “Unnamed graph” by default). Clicking that icon will open a dialog where we can define a language dependent values for this resource. By clicking **Save**, we update the *state* and we can immediately see the change on the screen. By clicking **Save changes**, we save the changes to the server (the custom labels are part of the common configuration which means that it is automatically taken care of). We now have to add the `EditableLabel` component to the `Application` component as well to get it working in the *application* interface.

## Final notes

You might have noticed that we have repeated a lot of work for the *application* and *configurator* interface and their components are nearly identical. Firstly, in a more complex *visualizer* those two interfaces would differ significantly more. Secondly, thanks to the React nature it is always very easy to refactor the code, put the shared aspects into a single component and then re-use it. No doubt that some of these features could have been implemented more simply but you should consider this a starting point from which you can start extending and building your *visualizer*.

Also some parts might have seemed excessively verbose. For example, when we defined all the *action type* constants for saving and loading the configuration. To an extent this verbosity is caused by the development stack. In this particular case, it is up to the developer whether he decides to define all *action types* that might occur as part of good practice, or to define just those that he actually needs. We prefer defining all *action types* as it explicitly describes what can happen in the application.
