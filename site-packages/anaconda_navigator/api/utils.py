# -*- coding: utf-8 -*-

"""Collection of utility components to use by APIs."""

from __future__ import annotations

__all__ = ['normalize_certificate']

import os
import typing


def normalize_certificate(value: typing.Union[None, bool, str]) -> typing.Union[None, bool, str]:
    """Check if certificate value is valid and fix it if required."""
    if isinstance(value, str) and (not os.path.exists(value)):
        return True
    return value
