Data Management Administration Online Dashboard
==
About
-
Data Management Administration Online (DMAOnline) Dashboard is a Single Page Application<sup>[1](#developer)</sup> which consumes data obtained from a back-end data service. Both of these initiatives are part of a Jisc-funded project.

Interface components are populated with JSON data provided by a web service in response to AJAX calls. Summary statistics are visible on the dashboard, with further details available in tabular form via the highly flexible jQuery plugin DataTables, with its advanced interaction controls. 

To illustrate how this data is presented, one of the use cases, which is to find out how many datasets are produced at a given institution with funding from RCUK, is examined. The solution for this is to provide data at three progressively detailed levels. The first of these is a summary statistic, which is a count of the datasets. At the second level, some of the more salient data is shown in a table of dataset records and includes Funder, Lead Department and Project Dates. At the third level, the dataset record can be expanded to reveal all the data such as dataset size in gigabytes and any descriptive notes accompanying the dataset. Further refinements can also be made by filtering and sorting the tabulated data.

```
**Note**
Only the Faculties menu options are currently implemented.
```


System dependencies
-
For development and demonstration purposes, the user interface currently uses some assets from Metronic, a responsive front-end theme powered by the Twitter Bootstrap framework. Although this sibling directory is not part of this repository, the application can still be used without it, unstyled, by including this line
```
var useThirdPartyStyling = false;
```
within the jQuery document ready function in index.html. 



Deployment instructions
-
Initially, clone the repository to a local location:
```
$ git clone --depth=1 <uri for this repository> <target-directory>
```

For subsequent updates to the local repository, within the deploy directory:
```
$ git pull
```



<a name="developer">1</a>: Adrian Albin-Clark, June 2015.