package utils

object Profiler {
  val elapsed = scala.collection.mutable.HashMap.empty[String, Long].withDefaultValue(0)
  val invoked = scala.collection.mutable.HashMap.empty[String, Integer].withDefaultValue(0)

  def profile[R](name: String, block: => R): R = {
    // Inspired here http://stackoverflow.com/a/9160068/576997

    val t0 = System.nanoTime()
    val result = block // call-by-name
    val t1 = System.nanoTime()

    elapsed += (name -> (elapsed(name) + (t1 - t0)))
    invoked += (name -> (invoked(name) + 1))

    result
  }

  def reset = {
    elapsed.clear()
    invoked.clear()
  }

  def printResults = {
    elapsed.keys.foreach(key => {
      println(key + ": invoked " + invoked(key) + " times; total " + (elapsed(key) / 1000 / 1000) + "ms " )
    })
    reset
  }
}
