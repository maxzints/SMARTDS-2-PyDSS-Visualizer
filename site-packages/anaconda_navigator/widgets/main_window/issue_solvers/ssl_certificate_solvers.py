# -*- coding: utf-8 -*-

"""Solvers for invalid ssl_certificate setting."""

from __future__ import annotations

__all__ = ()

import html
import os
import typing
from . import core


@core.CONFIGURATION_POOL.register
def solve_missing_certificate(context: core.ConfigurationContext) -> typing.Optional[core.SolvedError]:
    """Check if `ssl_ceritificate` is missing from file system."""
    ssl_certificate: str = context.config.get('main', 'ssl_certificate')
    if (not ssl_certificate) or os.path.exists(ssl_certificate):
        return None

    context.config.set('main', 'ssl_certificate', '')
    return core.SolvedError(
        caption='Broken Navigator configuration',
        message=f'SSL certificate is no longer available:<br>- {html.escape(ssl_certificate)}',
        tags='ssl_certificate',
    )
