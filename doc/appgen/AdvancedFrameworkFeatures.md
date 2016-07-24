Advanced framework features
---------------------------

While we were demonstrating how a new *visualizer* can be integrated into our *application generator*, we showed couple of available features that the developer can use to speed up the process. Namely, we described the prepared solution for saving and loading application configuration and we also showed how we can easily extract RDF data from the *pipeline evaluation*. Here we will briefly mention couple more examples.

### Request cache

As some requests might be quite computationally heavy, we implemented a simple caching solution for the server side. For example, this is the controller action that fetches the graph information (Subsection \[sec:implementation:integrating-visualizer:extracting-rdf\]):

    class GraphVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
      val rgmlService = inject[RgmlService]

      def getGraph(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
        withEvaluation(ApplicationId(id)) { evaluation =>
          val graph = rgmlService.graph(evaluation)
          Future(Ok(SuccessResponse(data = Seq("graph" -> graph))))
        }
      }
    }

Making this request cached is very simple:

    class GraphVisualizerApiController(implicit inj: Injector) extends VisualizerApiController {
      val rgmlService = inject[RgmlService]

      def getGraph(id: Long) = RestAsyncAction[EmptyRequest] { implicit request => json =>
        cached {
          withEvaluation(ApplicationId(id)) { evaluation =>
            val graph = rgmlService.graph(evaluation)
            Future(Ok(SuccessResponse(data = Seq("graph" -> graph))))
          }
        }
      }
    }

The solution works on a request level (it uses all available request information, including URL, POST data and the current user to identify the request). What is important is that the requests are cached persistently in the database which means that the cache will survive even application crashes. The solution is very basic and the point is just to demonstrate the capabilities. The default caching solution for the Play Framework is Ehcache [8] but that supports persistent caching only in the paid version.

### Multiple language support

RDF may contain values (typically labels) in multiple languages. If correctly extracted, such a value is represented using the `model.rdf.LocalizedValue` Scala case class which, serialized to JSON, looks like this:

    {
      'variants': {
        'en': 'Czech Republic',
        'cs': 'Česká republika'
      }
    }

The frontend framework offers a simple way how to display these values.

    import React from 'react'
    import LocalizedValue from './LocalizedValue'

    const Country = country => (
        <h3><LocalizedValue localizedValue={country.label} /></h3>
      );

If the `country.label` value is in the format suggested above, the component will automatically choose the value corresponding to the language currently selected by the user (if it is available).

The problem here is to determine what languages are actually available (i.e., what languages the user can select from). As this information is not available anywhere, we use a *brute force* solution to find it. In Redux, every *action* is *dispatched* to every *reducer*. Typically, one *reducer* only responds to couple of related *actions* but to solve our problem, we introduced a special *reducer* that responds to every *action* and searches through the payloads for available languages (it is looking for the object structure suggested above). The *reducer* uses a simple Depth-first search algorithm to recursively search through the whole payload.

For example, whenever we fetch something from the server, the incoming data are *dispatched* as a payload of some `SUCCESS` action. Our special *reducer* searches that payload and if it finds any new languages, it adds them to the *state*. An updated language switch is consequently displayed to the user.

### Label dereferencing

It is pretty common that an RDF resource contains a label which we can display to the user. But sometimes it is not available in frontend, maybe because it was simply not fetched from the server, maybe because it is not present in the data set at all. The frontend framework offers another useful component that attempts to fix this problem.

    import React from 'react'
    import LocalizedValue from './LocalizedValue'

    const Country = country => (
        <h3><Label uri={country.uri} label={country.label} /></h3>
      );

If `country.label` is empty, the component will make a request to the server which will at first try to load the label from the *pipeline evaluation* and if the label is not there, it will use a technique called *dereferencing*. That involves directly accessing the resource URI using the HTTP protocol and trying to extract the label from the response.

Note that the `Label` component wraps the `LocalizedValue` component which means that if the label supports multiple languages, the correct language variant will be displayed. Also note that the component is smart enough so even if you display 100 labels at once, only one request with 100 URIs will be sent to the server.

### Custom labels editor

We have already explained how the custom labels editor works in the integration guide (Subsection \[sec:implementation:integrating-visualizer:configuration\]). Using the component `EditableLabel` you can allow the user to provide his own labels for any RDF resource (Figure \[fig:scenario-08-custom-label-editor\]). Here we would just like to say that this component internally uses the aforementioned `Label` component. That means that `EditableLabel` supports multiple languages and also if the label is missing and is not provided by the user, it is fetched from the server.

We believe this nicely shows the strength of our development stack. Each of these three components (`LocalizedValue`, `Label`, `EditableLabel`) has a single purpose and by simple composition we achieve pretty interesting results. Also the developer can drop any of these components wherever he wants and it *just works*. This approach shows a lot of potential for other similar solutions.

### Miscellaneous

The framework also contains a lot of smaller and less important features which, however, can be of great help for the developer in certain situations. Especially because the chosen development stack lacks many features that a well-established monolithic framework would offer. We will just provide a brief list of some of them.

-   **Pagination** – correctly implementing frontend pagination is a challenge. We humbly offer our own solution.

-   **Dialog windows** – complete solution for managing dialog windows using the Redux *state*.

-   **Notifications** – displaying simple on-screen notifications.

-   **Promise integration** – complete solution for asynchronous requests including on-screen feedback and dealing with errors.

-   **Material UI** [9] – integration of this UI library providing components for building rich user interfaces.

Design choices regarding the framework
--------------------------------------

In this final section of this chapter, we will share some ideas that we feel should be mentioned but are not that important to be included to the previous parts of this chapter.

### Integration of new visualizers

In Subsection \[sec:implementation:integrating-visualizer:configurator\] we explained how a new *configurator* can be integrated into the *application generator*. The way the current solution works is that the particular *configurator* that is used to configure an application is part of the *configurator* interface URL. The reader might ask why this is necessary when this information can be derived directly from the application ID. We will try to shortly justify our decisions.

Our main goal was to allow the developer to define his own routes for the *configurator* so that it can be navigated using URLs (in the example from \[sec:implementation:integrating-visualizer:configurator\], the *configurator* uses just a single route but that is only because we wanted to keep the example simple). In React-router, the routes are defined in a hierarchical manner. That is perfect for our cause. The developer can create his own arbitrarily complex hierarchy of routes and simply plug it to the rest of the routes without being afraid of any conflicts.

However, what we need in this case are *dynamic* routes, i.e., depending on the selected application, we would choose the appropriate route definition of the *configurator* demanded by the application. As it turns out, such *dynamic* routes are supported by React-router but we were not aware of that in the early phases when we were designing this mechanism. So instead we chose this solution when the routes definition is registered under the *visualizer* name and we just have to make sure that the user is always redirected to the right URL.

What is important here is that this approach, despite being a bit cumbersome and illogical, does not in any way diminish the comfort of registering new *configurators*. It should be possible to re-implement the mechanism to use the *dynamic* routes (and therefore leave out the *visualizer* name from the URL) without any API changes.

### Integration flexibility

In Section \[sec:implementation:integrating-visualizer\] we thoroughly described the process of integrating a new *visualizer*. What has not been said is that many of those steps, even though recommended, are in fact optional.

As far as the *configurator* interface is concerned, once the `Configurator` component is mounted, the developer is free to do anything he wants inside this component. As React offers API to access the underlying DOM nodes, the user can even step out of React and start using any other framework that he feels would suit his needs. It is even possible to insert an `iframe` and render the *configurator* interface using the Play Framework *View* layer.

The *application* interface is even more flexible. Each interface is a standalone SPA and the developer has the Webpack entry point file under his full control. Therefore if he decides, he does not even have to use our development stack including React and other tools. He can instead from the very beginning use his own solution.

With this said, we have to explicitly state that we do not recommend any of this. We suggest that the developer follows the standard process as defined in Section \[sec:implementation:integrating-visualizer\] because only then he can benefit from all the solutions that we have prepared. On the other hand, the developer might find himself in a situation when our approach is not suitable for his needs. For example, React might not be performant enough for particular visualizations or there might be a complete external solution available that the developer would like to utilize. That is why we feel it is a good thing that the developer is given such freedom even though it means that the API is not as elegant as it could be.