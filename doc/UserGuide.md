# User guide

If you want to learn, how to use LDVMi, please, follow this document, which describes the features.

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
- DSD has no label `<example.com> a qb:DataStructureDefinition .` (should have `rdfs:label` property)
- DSD is a blank node (should be a resource with URI)
- DSD has no components (should have at least one dimension and one measure)


### SKOS

## Pipelines

### Discovery

### Upload a custom component

### Running a pre-defined pipeline
