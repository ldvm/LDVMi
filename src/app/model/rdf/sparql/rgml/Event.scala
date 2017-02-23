package model.rdf.sparql.rgml
import org.joda.time.DateTime

case class Event(url:String,name:String,start:DateTime,end:DateTime,info:String)
