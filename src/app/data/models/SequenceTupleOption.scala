package data.models

import shapeless._
import shapeless.ops.hlist.{RightFolder, Tupler}

import scalaz.Scalaz._
import scalaz._

object SequenceTupleOption {

  object applicativeFolder extends Poly2 {
    implicit def caseApplicative[A, B <: HList, F[_]](implicit
      app: Applicative[F]
    ) = at[F[A], F[B]] {
      (a, b) => app.ap(a)(app.map(b)(bb => (_: A) :: bb))
    }
  }

  def sequence[T, EL <: HList, L <: HList, OL <: HList, OT](t: T)(implicit
    gen: Generic.Aux[T, EL],
    eq: EL =:= L,
    folder: RightFolder.Aux[L, Option[HNil], applicativeFolder.type, Option[OL]],
    tupler: Tupler.Aux[OL, OT]
  ): Option[OT] =
    eq(gen.to(t)).foldRight(some(HNil: HNil))(applicativeFolder).map(tupler(_))

}