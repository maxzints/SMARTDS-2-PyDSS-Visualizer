# -*- coding: utf-8 -*-

"""Common parts of different issue detectors and solvers."""

from __future__ import annotations

__all__ = ['SolverRecord', 'SolverCollection']

import typing

if typing.TYPE_CHECKING:
    import typing_extensions


TInvSolver = typing.TypeVar('TInvSolver')


class SolverRecord(typing.Generic[TInvSolver]):
    """Single registered solver."""

    __slots__ = ('__solver', '__tags')

    def __init__(self, solver: TInvSolver, tags: typing.Iterable[str] = ()) -> None:
        """Initialize new :class:`~SolverRecord` instance."""
        self.__solver: 'typing_extensions.Final[TInvSolver]' = solver
        self.__tags: 'typing_extensions.Final[typing.Set[str]]' = set(tags)

    @property
    def solver(self) -> TInvSolver:  # noqa: D401
        """Solver value."""
        return self.__solver

    @property
    def tags(self) -> typing.AbstractSet[str]:
        """Related tags to this solver."""
        return self.__tags

    def extend(self, *, tags: typing.Iterable[str] = ()) -> None:
        """Extend current record with additional tags."""
        self.__tags.update(tags)


class SolverCollection(typing.Generic[TInvSolver], typing.Iterable[SolverRecord[TInvSolver]], typing.Sized):
    """Collection of issue solvers."""

    __slots__ = ('__content', '__unique_tags')

    def __init__(self) -> None:
        """Initialize new :class:`~SolverCollection` instance."""
        self.__content: 'typing_extensions.Final[typing.List[SolverRecord[TInvSolver]]]' = []
        self.__unique_tags: 'typing_extensions.Final[typing.Dict[str, SolverRecord[TInvSolver]]]' = {}

    def only(
            self,
            *,
            tags: typing.Union[None, str, typing.Iterable[str]] = None,
    ) -> typing.Iterator[SolverRecord[TInvSolver]]:
        """Iterate through filtered subset of solvers."""
        # commentaries are the base to create a place for additional filters

        if tags is None:  # remove block
            yield from self.__content
            return

        if isinstance(tags, str):
            tags = {tags}
        else:  # elif tags is not None
            tags = set(tags)

        solver_record: SolverRecord[TInvSolver]
        for solver_record in self.__content:
            if not tags.intersection(solver_record.tags):  # if (tags is not None) and (...):
                continue

            yield solver_record

    @typing.overload
    def register(
            self,
            solver: TInvSolver,
            *,
            tags: typing.Union[str, typing.Iterable[str]] = (),
            unique_tags: typing.Union[str, typing.Iterable[str]] = (),
    ) -> TInvSolver:
        """Register a new unnamed solver."""

    @typing.overload
    def register(
            self,
            *,
            tags: typing.Union[str, typing.Iterable[str]] = (),
            unique_tags: typing.Union[str, typing.Iterable[str]] = (),
    ) -> typing.Callable[[TInvSolver], TInvSolver]:
        """Register a new named solver."""

    def register(self, solver=None, *, tags=(), unique_tags=()):
        """
        Register new solver.

        This method can be used as a decorator:

        .. code-block:: python

            solvers = SolverCollection()

            @solvers.register
            def unnamed_solver(context):
                ...

            @solvers.register(tags='some_tag', unique_tags=('unique_a', 'unique_b'))
            def named_solver(context):
                ...

        as well as direct function:

        .. code-block:: python

            def custom_solver(context):
                ...

            solvers.register(custom_solver, tags=('other_tag', 'additional_tag'), unique_tags='custom_solver')

        :param solver: Solver that should be registered.
        :param tags: Optional collection of common tags.
        :param unique_tags: Optional collection of tags, that should be unique only for this particular solver.
        """
        if isinstance(unique_tags, str):
            unique_tags = {unique_tags}
        else:
            unique_tags = set(unique_tags)

        if isinstance(tags, str):
            tags = {tags}
        else:
            tags = set(tags)
        tags.update(unique_tags)

        def wrapper(item: TInvSolver) -> TInvSolver:
            solver_record: typing.Optional[SolverRecord[TInvSolver]]
            for solver_record in self.__content:
                if solver_record.solver is item:
                    break
            else:
                solver_record = None

            common_unique_tags: typing.Set[str] = unique_tags.intersection(self.__unique_tags)
            if common_unique_tags:
                message: str = ', '.join(repr(item) for item in common_unique_tags)
                raise ValueError(f'some of the unique tags are already used: {message}')

            if solver_record is None:
                solver_record = SolverRecord(solver=item, tags=tags)
                self.__content.append(solver_record)
            else:
                solver_record.extend(tags=tags)

            tag: str
            for tag in unique_tags:
                self.__unique_tags[tag] = solver_record

            return item

        if solver is None:
            return wrapper
        return wrapper(solver)

    def __iter__(self) -> typing.Iterator[SolverRecord[TInvSolver]]:
        """Iterate through registered issue solvers."""
        return iter(self.__content)

    def __len__(self) -> int:
        """Get total number of registered solvers."""
        return len(self.__content)
