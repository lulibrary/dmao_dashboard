Data Management Administration Online Dashboard
==
About
-
Data Management Administration Online (DMAOnline) Dashboard is a front-end application<sup>[1](#developer)</sup> to a back-end data service, both of which are part of a Jisc-funded project.

The user interface for DMAOnline uses some assets from Metronic, a responsive front-end theme powered by the Twitter Bootstrap framework. Interface components are populated with JSON data provided by a web service in response to AJAX calls. An AngularJS application manages summary statistics on the dashboard, with further details available in tabular form via the highly flexible jQuery plugin DataTables, with its advanced interaction controls. 

To illustrate how this data is presented, one of the use cases, which is to find out how many datasets are produced at a given institution with funding from RCUK, is examined. The solution for this is to provide data at three progressively detailed levels. The first of these is a summary statistic, which is a count of the datasets. At the second level, some of the more salient data is shown in a table of dataset records and includes Funder, Lead Department and Project Dates. At the third level, the dataset record can be expanded to reveal all the data such as dataset size in gigabytes and any descriptive notes accompanying the dataset. Further refinements can also be made by filtering and sorting the tabulated data.


System dependencies
-
Metronic (assets directory)



Deployment instructions
-
Change to the directory where this repository will be placed, with the Metronic assets directory as
its sibling.

Clone the repository into that directory:
```
$ git clone --depth=1 <uri for this repository> dashboard
```


Configuration
-
TO DO

<a name="developer">1</a>: Adrian Albin-Clark, June 2015.