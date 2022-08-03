# -*- coding: utf-8 -*-

"""Core components for solving issues with anaconda config."""

from __future__ import annotations

__all__ = ['SolvedError', 'SolverCollection', 'POOL']

import typing

import binstar_client

from anaconda_navigator.api.client_api import catch_and_notify
from anaconda_navigator.utils import solvers as common_solvers

if typing.TYPE_CHECKING:
    import typing_extensions

    class Solver(typing_extensions.Protocol):  # pylint: disable=too-few-public-methods
        """
        Common interface for issue solvers.

        Each solver should:

        - check if there is an issue
        - perform corresponding actions to fix the issue
        - report what was wrong and what was changed
        """

        def __call__(self, configuration: typing.Any) -> typing.Union[None, SolvedError, typing.Iterable[SolvedError]]:
            """
            Solve an issue if it is detected.

            :param configuration: Anaconda client configuration to check for issues and fix.
            :return: Message(s) about what was fixed.
            """


class SolvedError(typing.NamedTuple):
    """Details on solved issue."""

    message: str


class SolverCollection(common_solvers.SolverCollection['Solver']):
    """Collection of issue solvers."""

    __slots__ = ('__errors',)

    def __init__(self) -> None:
        """Initialize new :class:`~SolverCollection` instance."""
        super().__init__()
        self.__errors: 'typing_extensions.Final[typing.List[SolvedError]]' = []

    def errors(self) -> typing.Iterator[SolvedError]:
        """
        Iterate through errors that were solved by solvers from this pool.

        Each error description is removed as soon as it is retrieved with this method.
        """
        while self.__errors:
            yield self.__errors.pop(0)

    def solve(
            self,
            *,
            tags: typing.Union[None, str, typing.Iterable[str]] = None,
    ) -> typing.Iterator[SolvedError]:
        """
        Detect and solve issues for the `context`.

        :param tags: Limit to issue solvers with specific tags.
        :return: Iterator of details about solved issues.
        """
        with catch_and_notify():
            configuration: typing.Any = binstar_client.utils.get_config()

        solver_record: common_solvers.SolverRecord['Solver']
        for solver_record in self.only(tags=tags):
            result: typing.Union[None, SolvedError, typing.Iterable[SolvedError]] = solver_record.solver(configuration)
            if result is None:
                continue

            if isinstance(result, SolvedError):
                result = (result,)

            solved_error: SolvedError
            for solved_error in result:
                self.__errors.append(solved_error)
                yield solved_error

        with catch_and_notify():
            binstar_client.utils.set_config(configuration)


POOL: 'typing_extensions.Final[SolverCollection]' = SolverCollection()
