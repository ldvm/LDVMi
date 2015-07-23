# User guide

If you want to learn, how to use LDVMi, please, follow this document, which describes its features.

## Validators
LDVMi offers some validators for you to be able to learn why your data could not be visualized and or confirm that you followed a vocabulary in a way you were expected to.

To validate a dataset, please follow these instrcutions:
- Open the left menu
- Click `Validators`
- Click a card that represents the desired type of visualisation
- Upload your TTL (Select a file or drop it to the drop zone and press `Upload All`).

When you do that, the application uploads your data into its internal SPARQL Endpoint instance and creates an anonymous LDVM datasource on demand.
It also creates a simple visualisation pipeline, starting with the anonymouse datasource followed by the desired visualiser.
This pipeline is also evaluated on background.
A validator uses its evaluation result in order to query the data and determine whether it is right or not.
If the data you uploaded are OK, you can visualise it with no further obstructions.

### DataCube

List of supported validation features:

- No DSD present
- DSD has no label `<example.com> a qb:DataStructureDefinition .` (could have `rdfs:label` property)
- DSD is a blank node (should be a resource with URI)
- DSD has no components (should have at least one dimension and one measure)
- Component type is unspecified (should be either attribute, dimension or measure).
- Component does not have a label.
- Components are not ordered (could be).

TODO:
- No measures.
- Components linked to non-existing DSD.
- Components of unknown type.
- No datasets.
- No observations.
- Incomplete observation (some dimension/measure not specified).

### SKOS

## Pipelines

### Discovery

On the main page of the application, upload your data in a form of a TTL file.
Alternatively, you can just pass the endpoint URL and URI of the graph, if your data are publicly available.

Pipeline discovery will take place, trying to assemble all meaningful pipelines based on installed LDVM components.
You will be presented with a list of possible visualisation pipelines.

### Upload a custom component

### Creating a pre-defined pipeline

You can define a pipeline using the LDVM vocabulary.
Then, just upload your TTL and the system will create a pipeline based on the description you provided.

### Running a pipeline

When a pipeline is created (either manually by uploading its definition or automatically during pipeline discovery), it means, that the application knows how to process your data.
In order to get a visualisation, you need to execute the pipeline.
You can do that by clicking the Run button on its detail page.

## Embedding

LDVMi is a responsive web application which allows you to embed a visualisation into your website rather easily. The quality and granularity of what's possible depends on the capabilities of a given visualiser.

If you want to embed a visualisation:

1. you need to have a working LDVM pipeline (read more about pipelines in this guide)
2. run the pipeline to have it's results (click the pipeline name in the list of available pipelines and then click run)
3. visualize the results (click Visualize button on the detail of the pipeline)
4. configure the visualization using the user interface of the visualizer
5. if you are happy with what you see, just copy the URL, you can use it as a source of an iframe
