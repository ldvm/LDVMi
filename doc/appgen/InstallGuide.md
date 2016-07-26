Install guide
=============

The following guide will help you to get the Application
Generator up and running. 

## General requirements

The software has been tested to run on Linux and MacOSX. Windows 
*should* work too (no guarantees). The frontend has been tested on 
Google Chrome and Mozilla Firefox (both the latest up-to-date versions).
In general, any modern web browser should work.

To run the Application Generator, you need following software installed:

* [Java JRE](http://www.oracle.com/technetwork/java/javase/overview/index.html)
* [Virtuoso](http://virtuoso.openlinksw.com/)
* [H2 database](http://www.h2database.com/html/main.html)

## Running from binary package

The easiest way to run the Application Generator is to use a compiled
binary package. You can get the latest release [here](https://github.com/tobice/LDVMi/releases/latest).

Download the ZIP package, unpack it and run the executable corresponding
to your system in the `bin` folder, e.g. (for Linux):

```sh
wget https://github.com/tobice/LDVMi/releases/download/v1.0.0/application-generator-1.0.0.zip
unzip application-generator-1.0.0.zip
cd linkedpipes-visualization-1.1.1/bin
chmod +x linkedpipes-visualization
./linkedpipes-visualization -DapplyEvolutions.default=true
```

By default, the Application Generator should be accessible from [http://localhost:9000/appgen/](http://localhost:9000/appgen/).
The `-DapplyEvolutions.default=true` parameter is required only when
the ApplicationGenerator is run for the first time as it tells
the launch script to automatically initialize the database.

You may need to change the connection strings to H2 database or Virtuoso.
In that case, open the configuration file `conf/application.conf` and
update the following values according to your needs:

```conf
# H2
db.default.driver=org.h2.Driver
db.default.url="jdbc:h2:tcp://localhost/~/ldvmi"
db.default.user=sa
db.default.password=""
db.default.logStatements=true

# Virtuoso
ldvmi.triplestore.push="http://localhost:8890/sparql"
```

You need to specifically tell the launch script to use this updated
configuration file:

```sh
./linkedpipes-visualization -Dconfig.file=../conf/application.conf -DapplyEvolutions.default=true
```

## Running from sources

To run the Application Generator from sources, you are going to need a 
couple more tools:

* [Java JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html)
* [sbt](http://www.scala-sbt.org/0.13/docs/Setup.html)
* [node.js](https://nodejs.org/en/) (recommended version at least 4.4)
* [npm](https://www.npmjs.com/) (recommended version at least 2.15)

You can get the latest source codes from this [Git repository](https://github.com/tobice/LDVMi). 
Either download the sources in a ZIP file or clone it:

```sh
git clone https://github.com/tobice/LDVMi.git
```

Enter the `src` folder and once in it, run the following command:

```sh
sbt start
```

In theory, you should be able to use the packed Activator launcher 
instead of `sbt` (i.e., you don't need to install `sbt`):

```sh
java -jar activator-launch-1.2.2.jar start
```

## Development mode

To run the Application Generator in dev mode, use the following command:

```sh
sbt run
```

Note that you also need to separately start the Webpack dev server for
the Application Generator frontend (otherwise you will get a blank screen):

```sh
npm run appgen-dev
```

Whenever you change a file, Scala or JavaScript, the sources will be
automatically re-compiled.

## Using Google Sign-In

The Application Generator allows the users to login with their Google 
accounts. For that the work, you need to get a client ID. The default
one will work only when the generator is run on `localhost`.

To get a new client ID, follow these [instructions](https://developers.google.com/identity/sign-in/web/devconsole-project).

Once you have it, add it to the config file:
 
```conf
google.clientId = "421449098035-d8bj5j92mbemefp6ih2ut0sd7f7k9a9b.apps.googleusercontent.com"
```

## Setting up the Application Generator

Once the Application Generator is up and running, you need to create
an account. The first created account automatically becomes an *admin*
account with elevated privileges.

We also recommend to use the install script that can be activated from
the homepage. It will automatically load some LDVM components and 
data sets so that you can immediately start with generating applications.
