LinkedPipes Application Generator
=================================

This generator lets you create interactive data-driven applications 
based on linked RDF data. It is built on top of the 
[LinkedPipes Visualization](http://visualization.linkedpipes.com/)
project showcasing its capabilities.

Author: [Tobiáš Potoček](http://www.tobice.cz) <[tobiaspotocek@gmail.com](mailto:tobiaspotocek@gmail.com)>.

The author developed this software as his master thesis under the 
supervison of [RNDr. Jiří Helmich](http://helmich.cz/). The text
can be found [here](https://github.com/tobice/thesis-text)
([PDF](https://github.com/tobice/thesis-text/releases/latest)).

![Application Generator Screenshot: Google Maps Visualizer configurator](img/06_map_configuration_preview.png)

## Live demo

You can try out a [live demo](http://xrg12.projekty.ms.mff.cuni.cz:58080/appgen/) of this Application Generator.

## LDVMi vs LinkedPipes Visualization vs Application Generator

*LDVMi* is the original project name of *LinkedPipes Visualization* 
which is a visualization tool for Linked Data. You can find out more
at the [project web page](http://visualization.linkedpipes.com/).

The *Application Generator* is an extension of *LinkedPipes Visualization*
that utilizes the underlying LDVM implementation (the *discovery* 
algorithm). Simply put, it is an alternative user interface that
instead of static visualizations produces rich configurable applications.

Both tools exist in the same codebase. The main part of the Application
Generator is the alternative frontend which can be found [here](../../src/app/assets_webpack/appgen).
The Scala backend is implemented in Scala packages `model.appgen` and `model.controllers`.

## YouTube videos

To see the Application Generator in action, check out the following YouTube videos:

* [Platform Walkthrough](https://youtu.be/CZKJwnsOVDU)
* [Google Maps Visualizer](https://youtu.be/hLb3EIg-xfg)
* [D3.js Chord Visualizer](https://youtu.be/dv7bGmsRboY)

## Guides

The following guide will help you to get the Application Generator up 
and running:

* [Installation Guide](./InstallGuide.md)

The Application Generator was designed to be easily extended and works
as a framework for implementing new visualizers. The following guides
(which have been extracted from the thesis text) should provide you
with enough information:

* [Frontend Architecture](./FrontendArchitecture.md)
* [Frontend Development Stack Guide](./FrontendDevstackGuide.md) - introduction to React, Redux, Reselect, React-Router and Immutable.js
* [Frontend Framework Conventions](./FrontendFrameworkConventions.md)
* [A guide to integrating new visualizers](./GuideToIntegratingNewVisualizers.md)
* [Advanced Framework Features](./AdvancedFrameworkFeatures.md)

We recommend referring to the [original text](https://github.com/tobice/thesis-text/releases/latest) 
which includes the necessary context plus information that was lost
during the conversion from Latex to Markdown (links, citations, figures...).

## Issues

If you come across a bug or weird behavior, 
[report an issue](https://github.com/tobice/LDVMi/issues). There 
is a good chance that we are already aware of it.

## Links

* [Live demo](http://xrg12.projekty.ms.mff.cuni.cz:58080/appgen)
* [Original LinkedPipes Visualization repository](https://github.com/ldvm/LDVMi)
* [Application Generator repository](https://github.com/tobice/LDVMi)
* [Issues](https://github.com/tobice/LDVMi/issues)
* [Repository with LDVM vocabulary and sample LDVM component definitions](https://github.com/tobice/vocabulary)
* [Repository with sample data sets for the Application Generator](https://github.com/tobice/appgen-datasets)
* [Master thesis text](https://github.com/tobice/thesis-text) (and [PDF](https://github.com/tobice/thesis-text/releases/latest))
* [LinkedPipes Visualization project page](http://visualization.linkedpipes.com/)
* [Author's homepage](http://tobice.cz/)
