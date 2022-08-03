# -*- coding: utf-8 -*-

"""Solvers for invalid default_env setting."""

from __future__ import annotations

__all__ = ()

import html
import os
import typing
from . import core


@core.CONFIGURATION_POOL.register
def solve_missing_environment(context: core.ConfigurationContext) -> typing.Optional[core.SolvedError]:
    """Check if `default_env` is missing from file system."""
    default_env: str = context.config.get('main', 'default_env')
    if default_env and os.path.isdir(default_env):
        return None

    context.config.set('main', 'default_env', context.api.ROOT_PREFIX)

    if default_env:
        return core.SolvedError(
            caption='Broken Navigator configuration',
            message=f'Environment is no longer available:<br>- {html.escape(default_env)}',
            tags='default_env',
        )

    return None


@core.CONFLICT_POOL.register
def solve_unknown_environment(context: core.ConflictContext) -> typing.Optional[core.SolvedError]:
    """Check if `default_env` is unknown to conda."""
    default_env: str = context.config.get('main', 'default_env')
    if default_env in context.conda_info['processed_info']['__environments']:
        return None

    context.config.set('main', 'default_env', context.api.ROOT_PREFIX)

    if default_env:
        return core.SolvedError(
            caption='Broken Navigator configuration',
            message=f'Environment is no longer available:<br>- {html.escape(default_env)}',
            tags='default_env',
        )

    # Just in case, as it should not trigger under normal circumstances
    return core.SolvedError(
        caption='Broken Navigator configuration',
        message='Default environment is updated',
        tags='default_env',
    )
