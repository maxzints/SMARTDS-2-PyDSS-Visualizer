# -*- coding: utf-8 -*-

"""Solvers that could trigger and/or fetch results of other issue solvers in the system."""

from __future__ import annotations

__all__ = ()

import typing
from anaconda_navigator.utils.conda import solvers as conda_solvers
from anaconda_navigator.utils import anaconda_solvers
from . import core


def fetch_conda_errors(context: typing.Any) -> typing.Iterator[core.SolvedError]:  # pylint: disable=unused-argument
    """Route information about solved conda issues."""
    solved_error: conda_solvers.SolvedError
    for solved_error in conda_solvers.POOL.errors():
        yield core.SolvedError(
            caption='Broken Conda configuration',
            message=solved_error.message,
            tags=('proxy', 'proxy_conda'),
        )


core.CONFLICT_POOL.register(fetch_conda_errors, tags='proxy', unique_tags='fetch_conda_errors')
core.CONFIGURATION_POOL.register(fetch_conda_errors, tags='proxy', unique_tags='fetch_conda_errors')


def fetch_anaconda_errors(context: typing.Any) -> typing.Iterator[core.SolvedError]:  # pylint: disable=unused-argument
    """Route information about solved anaconda-client issues."""
    solved_error: anaconda_solvers.SolvedError
    for solved_error in anaconda_solvers.POOL.errors():
        yield core.SolvedError(
            caption='Broken Anaconda configuration',
            message=solved_error.message,
            tags=('proxy', 'proxy_anaconda'),
        )


core.CONFLICT_POOL.register(fetch_anaconda_errors, tags='proxy', unique_tags='fetch_anaconda_errors')
core.CONFIGURATION_POOL.register(fetch_anaconda_errors, tags='proxy', unique_tags='fetch_anaconda_errors')
