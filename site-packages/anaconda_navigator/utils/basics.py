# -*- coding: utf-8 -*-

"""Collection of basic utilities."""

from __future__ import annotations

__all__ = ['coalesce']

import typing

if typing.TYPE_CHECKING:
    import typing_extensions


TInv = typing.TypeVar('TInv', bound=object)


@typing.overload
def coalesce(*args: typing.Optional[TInv], allow_none: 'typing_extensions.Literal[False]' = False) -> TInv:
    """Find first not-:code:`None` value."""


@typing.overload
def coalesce(*args: typing.Optional[TInv], allow_none: 'typing_extensions.Literal[True]') -> typing.Optional[TInv]:
    """Find first not-:code:`None` value."""


def coalesce(
        *args: typing.Optional[TInv],
        allow_none: 'typing_extensions.Literal[True, False]' = False,
) -> typing.Optional[TInv]:
    """
    Find first not-:code:`None` value.

    :param allow_none: Allow :code:`None` to be the result if all values are :code:`None`.
    """
    arg: typing.Optional[TInv]
    for arg in args:
        if arg is not None:
            return arg
    if allow_none:
        return None
    raise ValueError('not-null not found')
