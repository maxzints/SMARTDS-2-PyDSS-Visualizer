# -*- coding: utf-8 -*-

"""Solvers for the invalid SSL certificate paths."""

from __future__ import annotations

__all__ = ()

import html
import os
import typing
from . import core


@core.POOL.register
def solve_ssl_paths(configuration: typing.Any) -> typing.Iterator[core.SolvedError]:
    """Remove invalid paths to SSL certificates."""
    broken_certificates: typing.Set[str] = set()

    key: str
    for key in ('ssl_verify', 'verify_ssl'):
        value: typing.Union[None, bool, str] = configuration.get(key, None)
        if isinstance(value, str) and (not os.path.exists(value)):
            broken_certificates.add(value)
            del configuration[key]

    if broken_certificates:
        message: str = 'SSL certificate(s) are no longer available:'
        for key in broken_certificates:
            message += f'<br>- {html.escape(key)}'

        yield core.SolvedError(message=message)
